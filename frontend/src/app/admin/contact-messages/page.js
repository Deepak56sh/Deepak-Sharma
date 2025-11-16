// FILE: src/components/admin/ContactMessages.js - FULLY RESPONSIVE VERSION
'use client';
import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, Search, Filter, Reply, CheckCircle, RefreshCw } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

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
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-white text-base sm:text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 p-4 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Contact Messages</h1>
          <p className="text-gray-400 text-xs sm:text-sm">Manage and respond to customer inquiries</p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm sm:text-base"
        >
          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
          Refresh
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-xs sm:text-sm">
          <div className="font-medium">Error: {error}</div>
          <button 
            onClick={fetchMessages}
            className="mt-1.5 sm:mt-2 text-xs sm:text-sm underline hover:text-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
          />
        </div>
        
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
              filterStatus === 'all' 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
              filterStatus === 'unread' 
                ? 'bg-purple-500 text-white' 
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            Unread ({messages.filter(m => m.status === 'unread').length})
          </button>
          <button
            onClick={() => setFilterStatus('replied')}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
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
      <div className="text-gray-400 text-xs sm:text-sm">
        Showing {filteredMessages.length} of {messages.length} messages
      </div>

      <div className="grid lg:grid-cols-1 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {/* Messages List */}
        <div className="xl:col-span-2 space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message._id}
                onClick={() => markAsRead(message)}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border cursor-pointer transition-all ${
                  selectedMessage?._id === message._id
                    ? 'bg-purple-500/20 border-purple-500/50'
                    : message.status === 'unread'
                    ? 'bg-slate-800/80 border-purple-500/30'
                    : 'bg-slate-800/50 border-purple-500/10 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      {message.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-semibold text-sm sm:text-base truncate">{message.name}</div>
                      <div className="text-gray-400 text-xs truncate">{message.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
                    {message.status === 'unread' && (
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></span>
                    )}
                    {message.status === 'replied' && (
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                    )}
                  </div>
                </div>
                
                <div className="text-white font-medium text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">{message.subject}</div>
                <div className="text-gray-400 text-xs line-clamp-2">{message.message}</div>
                <div className="text-gray-500 text-xs mt-1.5 sm:mt-2">
                  {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 sm:py-12 text-gray-400 text-sm sm:text-base">
              {messages.length === 0 ? 'No messages found' : 'No messages match your search'}
            </div>
          )}
        </div>

        {/* Message Detail & Reply Section */}
        <div className="xl:col-span-3">
          {selectedMessage ? (
            <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-4 sm:p-5 lg:p-6">
              <div className="flex items-start justify-between mb-4 sm:mb-5 lg:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg flex-shrink-0">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-white font-bold text-base sm:text-lg lg:text-xl truncate">{selectedMessage.name}</div>
                    <div className="text-gray-400 text-xs sm:text-sm truncate">{selectedMessage.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center flex-shrink-0 ml-2"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
              </div>

              <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-purple-500/10">
                <div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Subject</div>
                <div className="text-white font-semibold text-sm sm:text-base lg:text-lg">{selectedMessage.subject}</div>
              </div>

              <div className="mb-4 sm:mb-5 lg:mb-6">
                <div className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Message</div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap bg-slate-900/30 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Admin Reply Section */}
              {selectedMessage.adminReply ? (
                <div className="mb-4 sm:mb-5 lg:mb-6 p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                      <div className="text-green-400 font-semibold text-sm sm:text-base">Replied</div>
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm sm:ml-auto">
                      {new Date(selectedMessage.adminReply.repliedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-gray-300 whitespace-pre-wrap text-sm sm:text-base">
                    {selectedMessage.adminReply.message}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReply} className="mb-4 sm:mb-5 lg:mb-6">
                  <div className="text-gray-400 text-xs sm:text-sm mb-1.5 sm:mb-2">Your Reply</div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="3"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none text-sm sm:text-base"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isReplying || !replyText.trim()}
                    className="mt-2 sm:mt-3 px-4 sm:px-6 py-1.5 sm:py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-1.5 sm:gap-2 transition-all text-sm sm:text-base"
                  >
                    <Reply className="w-3 h-3 sm:w-4 sm:h-4" />
                    {isReplying ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-400">
                <span>Received: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
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
            <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-6 sm:p-8 lg:p-12 text-center">
              <Mail className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
              <div className="text-gray-400 text-sm sm:text-base">
                {messages.length === 0 ? 'No messages to display' : 'Select a message to view details and reply'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}