'use client';
import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, Search, Filter, Reply, CheckCircle, RefreshCw } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState('');

  // Get token function
  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken');
    }
    return null;
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, [filterStatus]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = getToken();
      if (!token) {
        setError('Authentication required. Please login again.');
        return;
      }

      let url = `${API_URL}/contact/messages`;
      const params = new URLSearchParams();
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('Fetching messages from:', url); // Debug log

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', res.status); // Debug log

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        setMessages(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/contact/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (data.success) {
        setMessages(messages.filter(m => m._id !== id));
        if (selectedMessage?._id === id) setSelectedMessage(null);
        alert('Message deleted successfully');
      } else {
        alert(data.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const markAsRead = async (message) => {
    if (message.status === 'unread') {
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/contact/messages/${message._id}/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await res.json();

        if (data.success) {
          setMessages(messages.map(m => 
            m._id === message._id ? data.data : m
          ));
        }
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
    setSelectedMessage(message);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsReplying(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/contact/messages/${selectedMessage._id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replyMessage: replyText })
      });

      const data = await res.json();

      if (data.success) {
        setMessages(messages.map(m => 
          m._id === selectedMessage._id ? data.data : m
        ));
        setSelectedMessage(data.data);
        setReplyText('');
        alert('Reply sent successfully!');
      } else {
        alert(data.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
          <p className="text-gray-400">Manage and respond to customer inquiries</p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
          <div className="font-medium">Error: {error}</div>
          <button 
            onClick={fetchMessages}
            className="mt-2 text-sm underline hover:text-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === 'all' 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === 'unread' 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            Unread ({messages.filter(m => m.status === 'unread').length})
          </button>
          <button
            onClick={() => setFilterStatus('replied')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === 'replied' 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            Replied ({messages.filter(m => m.status === 'replied').length})
          </button>
        </div>
      </div>

      {/* Messages Count */}
      <div className="text-gray-400 text-sm">
        Showing {filteredMessages.length} of {messages.length} messages
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message._id}
                onClick={() => markAsRead(message)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedMessage?._id === message._id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : message.status === 'unread'
                    ? 'bg-slate-800/80 border-purple-500/30'
                    : 'bg-slate-800/50 border-purple-500/10 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {message.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{message.name}</div>
                      <div className="text-gray-400 text-xs">{message.email}</div>
                    </div>
                  </div>
                  {message.status === 'unread' && (
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  )}
                  {message.status === 'replied' && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>
                
                <div className="text-white font-medium text-sm mb-1">{message.subject}</div>
                <div className="text-gray-400 text-xs line-clamp-2">{message.message}</div>
                <div className="text-gray-500 text-xs mt-2">
                  {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              {messages.length === 0 ? 'No messages found' : 'No messages match your search'}
            </div>
          )}
        </div>

        {/* Message Detail & Reply Section */}
        <div className="lg:col-span-3">
          {selectedMessage ? (
            <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{selectedMessage.name}</div>
                    <div className="text-gray-400 text-sm">{selectedMessage.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="w-10 h-10 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 pb-4 border-b border-purple-500/10">
                <div className="text-gray-400 text-sm mb-2">Subject</div>
                <div className="text-white font-semibold text-lg">{selectedMessage.subject}</div>
              </div>

              <div className="mb-6">
                <div className="text-gray-400 text-sm mb-2">Message</div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-slate-900/30 p-4 rounded-lg">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Admin Reply Section */}
              {selectedMessage.adminReply ? (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <div className="text-green-400 font-semibold">Replied</div>
                    <div className="text-gray-400 text-sm ml-auto">
                      {new Date(selectedMessage.adminReply.repliedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {selectedMessage.adminReply.message}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReply} className="mb-6">
                  <div className="text-gray-400 text-sm mb-2">Your Reply</div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isReplying || !replyText.trim()}
                    className="mt-3 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
                  >
                    <Reply className="w-4 h-4" />
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>
              )}

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-full ${
                  selectedMessage.status === 'unread' 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : selectedMessage.status === 'replied'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-slate-700 text-gray-400'
                }`}>
                  {selectedMessage.status}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-12 text-center">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <div className="text-gray-400">
                {messages.length === 0 ? 'No messages to display' : 'Select a message to view details and reply'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}