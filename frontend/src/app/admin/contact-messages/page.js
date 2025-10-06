'use client';
import { useState, useEffect } from 'react';
import { Mail, Trash2, Eye, Search, Filter } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${API_URL}/contact-messages`);
      const data = await res.json();
      
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const res = await fetch(`${API_URL}/contact-messages/${id}`, {
        method: 'DELETE'
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
    try {
      const res = await fetch(`${API_URL}/contact-messages/${message._id}`, {
        method: 'PATCH'
      });

      const data = await res.json();

      if (data.success) {
        setMessages(messages.map(m => 
          m._id === message._id ? data.data : m
        ));
        setSelectedMessage(data.data);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || msg.status === filterStatus;
    return matchesSearch && matchesFilter;
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Contact Messages</h1>
        <p className="text-gray-400">Manage and respond to customer inquiries</p>
      </div>

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
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredMessages.map((message) => (
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
              </div>
              
              <div className="text-white font-medium text-sm mb-1">{message.subject}</div>
              <div className="text-gray-400 text-xs line-clamp-2">{message.message}</div>
              <div className="text-gray-500 text-xs mt-2">{message.date} at {message.time}</div>
            </div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No messages found
            </div>
          )}
        </div>

        {/* Message Detail */}
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
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</div>
              </div>

              <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                <span>Received: {selectedMessage.date} at {selectedMessage.time}</span>
                <span className={`px-3 py-1 rounded-full ${
                  selectedMessage.status === 'unread' 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : 'bg-slate-700 text-gray-400'
                }`}>
                  {selectedMessage.status}
                </span>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 p-12 text-center">
              <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <div className="text-gray-400">Select a message to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}