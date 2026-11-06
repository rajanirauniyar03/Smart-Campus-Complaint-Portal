import React, { useState } from 'react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { timeAgo, formatDateTime } from '../utils/formatters';
import { MessageSquare, Send, Shield, Briefcase, GraduationCap } from 'lucide-react';

export default function ComplaintComments({ complaintId, initialComments = [], onCommentAdded }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      const res = await complaintService.addComment(complaintId, newComment.trim());
      setComments(res.comments);
      setNewComment('');
      if (onCommentAdded) onCommentAdded(res.comment);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to append case record note');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-white">
            <Shield className="w-2.5 h-2.5 text-amber-400" /> Dean / Administrator
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-900 text-blue-100">
            <Briefcase className="w-2.5 h-2.5 text-blue-300" /> Cell Officer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <GraduationCap className="w-2.5 h-2.5 text-slate-500" /> Complainant
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-700" />
          <h3 className="font-bold text-slate-900 text-sm">Case Inquiries & Official Notes</h3>
          <span className="text-[11px] px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-full font-mono font-semibold text-slate-600">
            {comments.length}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">Digitally sealed inquiry record</span>
      </div>

      {/* Messages Feed */}
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            No inquiry notes logged in this docket. Students, officers, and administrators may post clarification remarks below.
          </p>
        ) : (
          comments.map((c, i) => (
            <div
              key={c._id || i}
              className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{c.senderName}</span>
                  {getRoleBadge(c.senderRole)}
                </div>
                <span className="text-[11px] text-slate-400" title={formatDateTime(c.createdAt)}>
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {c.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-slate-100">
        {error && <p className="text-xs text-rose-600">{error}</p>}
        <div className="relative">
          <textarea
            rows="2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Log an official case note, query, or technical update..."
            className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 resize-none bg-white"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="absolute bottom-2.5 right-2.5 px-3 py-1 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-md disabled:opacity-40 transition shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" />
            <span>Post Note</span>
          </button>
        </div>
      </form>
    </div>
  );
}
