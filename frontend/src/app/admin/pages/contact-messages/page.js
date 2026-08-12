'use client';
import { useState, useEffect } from 'react';
import {
  Mail, MailOpen, Reply, Trash2, Send, Loader2, Inbox,
  ChevronLeft, CheckCheck, Clock, User
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-site-backend-0661.onrender.com/api';

const filters = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
  { key: 'replied', label: 'Replied' },
];

const statusStyle = {
  unread: 'bg-blue-100 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  replied: 'bg-green-100 text-green-700',
};

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [replyStatus, setReplyStatus] = useState(null); // { type, message }
  const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null);
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [filter]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/contact/messages${filter !== 'all' ? `?status=${filter}` : ''}`;
      const res = await fetch(url, { headers: authHeaders() });
      const data = await res.json();
      setMessages(data.success ? data.data : []);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/contact/unread-count`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) setUnreadCount(data.data.unreadCount);
    } catch (err) {
      console.error('Fetch unread count error:', err);
    }
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    setReplyText('');
    setReplyStatus(null);
    setShowDetailOnMobile(true);

    if (msg.status === 'unread') {
      try {
        const res = await fetch(`${API_BASE_URL}/contact/messages/${msg._id}/read`, {
          method: 'PATCH',
          headers: authHeaders(),
        });
        const data = await res.json();
        if (data.success) {
          setMessages((prev) => prev.map((m) => (m._id === msg._id ? data.data : m)));
          setSelected(data.data);
          setUnreadCount((c) => Math.max(0, c - 1));
        }
      } catch (err) {
        console.error('Mark as read error:', err);
      }
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    setReplyStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/contact/messages/${selected._id}/reply`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ replyMessage: replyText.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.map((m) => (m._id === selected._id ? data.data : m)));
        setSelected(data.data);
        setReplyText('');
        setReplyStatus({
          type: data.message.includes('failed') ? 'warning' : 'success',
          message: data.message,
        });
      } else {
        setReplyStatus({ type: 'error', message: data.message || 'Failed to send reply' });
      }
    } catch (err) {
      console.error('Send reply error:', err);
      setReplyStatus({ type: 'error', message: 'Network error — reply nahi bhej paya' });
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/contact/messages/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
        if (selected?._id === id) {
          setSelected(null);
          setShowDetailOnMobile(false);
        }
      }
    } catch (err) {
      console.error('Delete message error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-2">
            Contact Messages
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-sm">Messages submitted from your public /contact page.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--pa-border)] overflow-hidden">
        <div className="grid lg:grid-cols-12" style={{ minHeight: '560px' }}>

          {/* MESSAGE LIST */}
          <div className={`lg:col-span-4 border-r border-[var(--pa-border)] flex flex-col ${showDetailOnMobile ? 'hidden lg:flex' : 'flex'}`}>
            <div className="flex items-center gap-1 p-3 border-b border-[var(--pa-border)] overflow-x-auto">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    filter === f.key ? 'text-white' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                  style={filter === f.key ? { backgroundColor: 'var(--pa-primary)' } : undefined}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="overflow-y-auto flex-1" style={{ maxHeight: '560px' }}>
              {loading ? (
                <div className="flex items-center justify-center py-16 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                  <Inbox className="w-10 h-10 text-slate-200 mb-3" />
                  <p className="text-sm text-slate-400">No messages here.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <button
                    key={msg._id}
                    onClick={() => openMessage(msg)}
                    className={`w-full text-left px-4 py-3.5 border-b border-[var(--pa-border)] hover:bg-slate-50 transition-colors ${
                      selected?._id === msg._id ? 'bg-slate-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {msg.status === 'unread' ? (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        ) : (
                          <span className="w-2 h-2 flex-shrink-0" />
                        )}
                        <span className={`text-sm truncate ${msg.status === 'unread' ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                          {msg.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className={`text-sm truncate ${msg.status === 'unread' ? 'text-slate-700' : 'text-slate-500'}`}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{msg.message}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* DETAIL + REPLY */}
          <div className={`lg:col-span-8 flex flex-col ${showDetailOnMobile ? 'flex' : 'hidden lg:flex'}`}>
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <Mail className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-sm text-slate-400">Select a message to view and reply.</p>
              </div>
            ) : (
              <div className="flex flex-col flex-1">
                {/* Header */}
                <div className="p-5 border-b border-[var(--pa-border)]">
                  <button
                    onClick={() => setShowDetailOnMobile(false)}
                    className="lg:hidden flex items-center gap-1 text-sm text-slate-500 mb-3"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-800">{selected.subject}</h2>
                      <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-500">
                        <User className="w-3.5 h-3.5" />
                        <span>{selected.name}</span>
                        <span className="text-slate-300">·</span>
                        <a href={`mailto:${selected.email}`} className="hover:underline" style={{ color: 'var(--pa-primary)' }}>
                          {selected.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(selected.createdAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle[selected.status]}`}>
                        {selected.status}
                      </span>
                      <button
                        onClick={() => deleteMessage(selected._id)}
                        disabled={deletingId === selected._id}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Delete message"
                      >
                        {deletingId === selected._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Body — scrollable */}
                <div className="p-5 space-y-4 overflow-y-auto flex-1">
                  <div className="bg-slate-50 rounded-xl p-4 border border-[var(--pa-border)]">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                  </div>

                  {selected.adminReply?.message && (
                    <div className="rounded-xl p-4 border" style={{ borderColor: 'var(--pa-primary)', backgroundColor: 'color-mix(in srgb, var(--pa-primary) 8%, white)' }}>
                      <div className="flex items-center gap-1.5 text-xs font-semibold mb-2" style={{ color: 'var(--pa-primary)' }}>
                        <CheckCheck className="w-3.5 h-3.5" /> Your reply
                        {selected.adminReply.repliedAt && (
                          <span className="text-slate-400 font-normal ml-1">· {formatDate(selected.adminReply.repliedAt)}</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{selected.adminReply.message}</p>
                    </div>
                  )}
                </div>

                {/* Reply box */}
                <form onSubmit={sendReply} className="p-5 border-t border-[var(--pa-border)] space-y-3">
                  {replyStatus && (
                    <div className={`text-sm px-3 py-2 rounded-lg ${
                      replyStatus.type === 'success' ? 'bg-green-50 text-green-700'
                        : replyStatus.type === 'warning' ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {replyStatus.message}
                    </div>
                  )}
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={selected.adminReply?.message ? 'Send another reply...' : `Reply to ${selected.name}...`}
                    rows={3}
                    className="w-full p-3 bg-slate-50 border border-[var(--pa-border)] rounded-lg text-sm resize-none focus:outline-none focus:border-[var(--pa-primary)]"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="flex items-center gap-2 text-white font-medium px-5 py-2.5 rounded-lg disabled:opacity-50 transition-colors"
                    style={{ backgroundColor: 'var(--pa-primary)' }}
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {sending ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}