// ============================================
// FILE: src/app/admin/contact-messages/page.js
// ============================================
'use client';
import { useState } from 'react';
import { Mail, Trash2, Eye, Search, Filter } from 'lucide-react';

export default function ContactMessages() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Web Development Inquiry',
      message: 'I am interested in building a modern e-commerce website for my business. Can we schedule a call to discuss the requirements?',
      date: '2024-01-15',
      time: '10:30 AM',
      status: 'unread'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Mobile App Development',
      message: 'Looking for someone to develop a cross-platform mobile app for fitness tracking. What is your typical timeline and pricing?',
      date: '2024-01-14',
      time: '2:45 PM',
      status: 'read'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      subject: 'UI/UX Design Services',
      message: 'We need a complete redesign of our existing web application. Do you have availability in the next month?',
      date: '2024-01-13',
      time: '4:20 PM',
      status: 'read'
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    }
  };

  const markAsRead = (message) => {
    setMessages(messages.map(m => 
      m.id === message.id ? { ...m, status: 'read' } : m
    ));
    setSelectedMessage({ ...message, status: 'read' });
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || msg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
              key={message.id}
              onClick={() => markAsRead(message)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedMessage?.id === message.id
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
                  onClick={() => handleDelete(selectedMessage.id)}
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
