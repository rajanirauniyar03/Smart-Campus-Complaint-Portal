import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { complaintService } from '../services/complaintService';
import { PRIORITIES } from '../utils/constants';
import { X, UserCheck, Shield, AlertTriangle } from 'lucide-react';

export default function AssignStaffModal({ complaint, isOpen, onClose, onAssigned }) {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [priority, setPriority] = useState(complaint?.priority || 'Medium');
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPriority(complaint?.priority || 'Medium');
      setSelectedStaffId(complaint?.assignedTo?._id || '');
      setAdminNote('');
      setError('');
      loadStaff();
    }
  }, [isOpen, complaint]);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const res = await authService.getStaffList();
      setStaffList(res.staff || []);
    } catch (err) {
      setError('Failed to fetch designated staff officers from directory');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setError('Please designate a cell officer from the roster');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await complaintService.assignComplaint(complaint._id, {
        staffId: selectedStaffId,
        priority,
        adminNote,
      });
      if (onAssigned) onAssigned(res.complaint);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Case allocation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-800 text-white">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Allocate Docket to Redressal Officer
              </h3>
              <p className="text-[11px] font-mono text-slate-500">{complaint?.complaintId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAssign} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Designated Officer In-Charge <span className="text-rose-500">*</span>
            </label>
            {loading ? (
              <p className="text-xs text-slate-400 py-2">Loading staff roster...</p>
            ) : (
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                required
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
              >
                <option value="">-- Select Officer from Directory --</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} — {s.department} ({s.activeComplaintsCount} active dockets)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Urgency Classification
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    priority === p
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Administrative Directives & Instructions
            </label>
            <textarea
              rows="3"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="e.g. Conduct physical inspection by 2 PM; submit technician findings report before close of day..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedStaffId}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-lg shadow-xs disabled:opacity-50 transition"
            >
              {submitting ? 'Allocating...' : 'Confirm Allocation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
