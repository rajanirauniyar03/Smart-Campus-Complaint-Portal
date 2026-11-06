import React, { useState } from 'react';
import { complaintService } from '../services/complaintService';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { CATEGORIES, PRIORITIES } from '../utils/constants';
import {
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Building,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function LodgeComplaintModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth();
  const { institution } = useBrand();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [building, setBuilding] = useState('');
  const [roomOrArea, setRoomOrArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Evidence file size must not exceed 5MB limit');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide both the grievance subject and detailed particulars');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('description', description.trim());
      formData.append('building', building.trim());
      formData.append('roomOrArea', roomOrArea.trim());
      formData.append('landmark', landmark.trim());
      formData.append('priority', priority);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await complaintService.createComplaint(formData);

      // Reset form
      setTitle('');
      setDescription('');
      setBuilding('');
      setRoomOrArea('');
      setLandmark('');
      setImageFile(null);
      setImagePreview(null);

      if (onCreated) onCreated(res.complaint);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit grievance docket to SGRC server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-800 text-white">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Lodge Formal Institutional Grievance
              </h3>
              <p className="text-[11px] text-slate-500">
                Official Redressal Docket • {institution.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Verified Complainant Banner */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">
                Complainant Identity: {user?.name} (PRN: {user?.rollNumber})
              </p>
              <p className="text-[11px] text-slate-500">
                Department: {user?.department} • Legally bound under UGC Regulations 2023.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Classification / Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Grievance Classification <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength="150"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wi-Fi router packet drop in Computer Lab 3"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
            />
          </div>

          {/* Location fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campus Building / Block
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="e.g. Academic Block 1"
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room / Lab / Area
              </label>
              <input
                type="text"
                value={roomOrArea}
                onChange={(e) => setRoomOrArea(e.target.value)}
                placeholder="e.g. Room 204, Floor 2"
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Landmark Reference
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Water Cooler"
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Urgency Level
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

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Statement & Particulars <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the exact nature of the grievance, inception date, physical symptoms, and specific redressal requested..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 resize-none"
            />
          </div>

          {/* Photographic Evidence Attachment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Photographic Evidence (Optional)
            </label>
            {imagePreview ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 flex items-center justify-between">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-16 w-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-3.5 border border-dashed border-slate-300 hover:border-slate-500 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition">
                <Upload className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-xs font-medium text-slate-600">
                  Attach photo evidence (JPEG, PNG, WebP up to 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-lg shadow-xs disabled:opacity-50 transition"
            >
              {submitting ? 'Registering Docket...' : 'Submit Grievance Docket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
