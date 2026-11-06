import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { timeAgo } from '../utils/formatters';
import { Bell, CheckCheck, MessageSquare, AlertCircle, CheckCircle2, UserCheck } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    onClose();
    if (notification.complaint) {
      navigate(`/complaints/${notification.complaint}`);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'complaint_assigned':
        return <UserCheck className="w-4 h-4 text-slate-700" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-slate-700" />;
      case 'status_change':
        return <CheckCircle2 className="w-4 h-4 text-emerald-700" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-700" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5 text-slate-700" />
          <h3 className="font-semibold text-xs text-slate-900">
            Institutional Notifications & Alerts
          </h3>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-rose-100 text-rose-800 border border-rose-200">
              {unreadCount} unread
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-900 font-medium transition"
          >
            <CheckCheck className="w-3 h-3" />
            Mark read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-slate-400">
            <Bell className="w-6 h-6 mx-auto mb-1 opacity-30" />
            <p className="text-xs">No pending notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition flex items-start gap-3 ${
                !n.isRead ? 'bg-slate-50/70' : ''
              }`}
            >
              <div className="p-1.5 rounded bg-slate-100 shrink-0 mt-0.5 border border-slate-200">
                {getNotificationIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                {n.complaintIdStr && (
                  <span className="inline-block mt-1 text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {n.complaintIdStr}
                  </span>
                )}
              </div>
              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
