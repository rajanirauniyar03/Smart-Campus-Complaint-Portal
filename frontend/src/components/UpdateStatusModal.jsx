import React, { useState, useEffect } from 'react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { STATUSES, PRIORITIES } from '../utils/constants';
import { X, RefreshCw, CheckCircle2, AlertTriangle, Upload, Image as ImageIcon } from 'lucide-react';

export default function UpdateStatusModal({ complaint, isOpen, onClose, onUpdated }) {
  const { role } = useAuth();
  const [status, setStatus] = useState(complaint?.status || 'Pending');
  const [priority, setPriority] = useState(complaint?.priority || 'Medium');
  const [note, setNote] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState(complaint?.resolutionNotes || '');
  const [proofImage, setProofImage] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && complaint) {
      setStatus(complaint.status || 'Pending');
      setPriority(complaint.priority || 'Medium');
      setNote('');
      setResolutionNotes(complaint.resolutionNotes || '');
      setProofImage(null);
      setProofPreview(null);
      setError('');
    }
  }, [isOpen, complaint]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      let updatedComplaint;
      if (role === 'admin') {
        const res = await complaintService.updateStatusByAdmin(complaint._id, {
          status,
          priority,
          adminNote: note,
        });
        updatedComplaint = res.complaint;
      } else {
        const formData = new FormData();
        formData.append('status', status);
        formData.append('progressNote', note);
        if (resolutionNotes) formData.append('resolutionNotes', resolutionNotes);
        if (proofImage) formData.append('proofImage', proofImage);

        const res = await complaintService.updateProgressByStaff(complaint._id, formData);
        updatedComplaint = res.complaint;
      }

      if (onUpdated) onUpdated(updatedComplaint);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update docket status in database');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const availableStatuses =
    role === 'staff'
      ? ['In Progress', 'Resolved', 'Under Review', 'Rejected']
      : STATUSES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-slate-800 text-white">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {role === 'staff'
                  ? 'Log Operational Action & Disposal'
                  : 'Update Administrative Docket Status'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lifecycle Stage
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableStatuses.map((st) => (
                <button
                  type="button"
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition ${
                    status === st
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {role === 'admin' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
          )}

          {status === 'Resolved' && (
            <div className="space-y-3 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Statutory Closure & Rectification Report</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Findings & Rectification Report <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="2"
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="State the root cause identified, physical repairs executed, or policy action taken to redress the grievance..."
                  className="w-full text-xs p-2.5 rounded-lg border border-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-700 resize-none bg-white"
                />
              </div>

              {role === 'staff' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Rectification Proof (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-white hover:file:bg-black"
                  />
                  {proofPreview && (
                    <img
                      src={proofPreview}
                      alt="Proof Preview"
                      className="mt-2 h-24 w-full object-cover rounded-lg border border-emerald-300"
                    />
                  )}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {role === 'staff' ? 'Field Action Note / Status Update' : 'Administrative Rationale / Order'}
            </label>
            <textarea
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record explanation for this lifecycle transition (will be appended to the official audit timeline)..."
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
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-lg shadow-xs disabled:opacity-50 transition"
            >
              {submitting ? 'Recording...' : 'Commit Status Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
