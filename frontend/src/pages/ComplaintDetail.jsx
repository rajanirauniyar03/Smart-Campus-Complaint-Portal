import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { complaintService } from '../services/complaintService';
import GtuEmblem from '../components/GtuEmblem';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import TimelineView from '../components/TimelineView';
import ComplaintComments from '../components/ComplaintComments';
import AssignStaffModal from '../components/AssignStaffModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { formatDate, formatDateTime } from '../utils/formatters';
import { BACKEND_URL } from '../utils/constants';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Briefcase,
  Building,
  Clock,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  UserCheck,
  Shield,
  Settings2,
  Wrench,
  Printer,
  ChevronRight,
  Phone,
  Mail,
  Home,
} from 'lucide-react';

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user, role } = useAuth();
  const { institution } = useBrand();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState(null);

  const loadComplaint = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await complaintService.getComplaintById(id);
      setComplaint(res.complaint);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve grievance docket records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const getBackPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/staff';
    return '/student';
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-600 mb-2" />
        <p className="text-xs">Loading grievance dossier records...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-900">Docket Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">{error || 'Unable to locate the specified grievance docket.'}</p>
        <Link
          to={getBackPath()}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BACKEND_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Sub-header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => navigate(getBackPath())}
              className="hover:text-slate-900 flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-bold text-slate-800">{complaint.complaintId}</span>
            <span className="hidden sm:inline text-slate-400">• Official Redressal Dossier</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Dossier</span>
            </button>

            {role === 'admin' && (
              <>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Allocate Officer</span>
                </button>
                <button
                  onClick={() => setIsStatusModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition"
                >
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Update Status</span>
                </button>
              </>
            )}

            {role === 'staff' && (
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Log Action / Resolve</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Official University Letterhead Banner */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-[#092244] text-white p-5 border-b border-[#06182e] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <GtuEmblem className="w-14 h-14 shrink-0 drop-shadow-md" />
              <div>
                <p className="text-xs text-[#c88a1e] font-semibold tracking-wide">
                  {institution.nativeName || 'ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી'}
                </p>
                <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  GUJARAT TECHNOLOGICAL UNIVERSITY
                </h2>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Central Student Grievance Redressal Committee (SGRC) • Chandkheda Headquarters, Ahmedabad
                </p>
              </div>
            </div>

            <div className="text-left md:text-right text-xs text-slate-300 border-t md:border-t-0 border-slate-700/60 pt-2 md:pt-0">
              <span className="block font-mono text-[11px] text-[#c88a1e] font-bold">
                Docket: {complaint.complaintId}
              </span>
              <span className="text-[11px] text-slate-400">
                UGC Reg. 2023 • Case Ref: GTU/SGRC/2026/{complaint.complaintId.replace('CMP-', '')}
              </span>
              <span className="block text-[10px] text-slate-400">
                Academic Session {institution.academicSession}
              </span>
            </div>
          </div>

          {/* Dossier Subject & Classification Bar */}
          <div className="p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {complaint.complaintId}
                </span>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-100 font-medium text-slate-700 border border-slate-200">
                  {complaint.category}
                </span>
                <PriorityBadge priority={complaint.priority} />
                <StatusBadge status={complaint.status} />
              </div>

              <span className="text-xs text-slate-500 font-mono">
                Statutory Redressal Dossier
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {complaint.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Lodged on {formatDateTime(complaint.createdAt)}
                </span>
                {complaint.location?.building && (
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    Campus Location: {complaint.location.building}
                    {complaint.location.roomOrArea && `, ${complaint.location.roomOrArea}`}
                    {complaint.location.landmark && ` (${complaint.location.landmark})`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 cols): Description, Evidence, Resolution Report, Case Record */}
          <div className="lg:col-span-8 space-y-6">
            {/* Detailed Statement */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Grievance Particulars & Statement
              </h3>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {complaint.description}
              </p>

              {/* Photographic Evidence */}
              {complaint.imageUrl && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-slate-500" /> Attached Photographic Evidence:
                  </p>
                  <div
                    onClick={() => setPreviewImageModal(getFullImageUrl(complaint.imageUrl))}
                    className="cursor-pointer inline-block rounded-lg overflow-hidden border border-slate-200 hover:opacity-90 transition group relative"
                  >
                    <img
                      src={getFullImageUrl(complaint.imageUrl)}
                      alt="Complaint attachment"
                      className="h-44 w-auto object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition">
                      Click to inspect full resolution
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Official Resolution Report (If Resolved) */}
            {complaint.status === 'Resolved' && (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Official Grievance Redressal Certificate</span>
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  {complaint.resolutionNotes || 'Grievance verified, rectified, and marked disposed by the designated cell officer.'}
                </p>
                {complaint.resolvedAt && (
                  <p className="text-[11px] text-emerald-800 font-mono font-medium pt-1">
                    Disposal Timestamp: {formatDateTime(complaint.resolvedAt)}
                  </p>
                )}
                {complaint.resolutionProofImage && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-emerald-900 mb-1">
                      Photographic Completion Verification:
                    </p>
                    <img
                      src={getFullImageUrl(complaint.resolutionProofImage)}
                      alt="Resolution verification"
                      onClick={() =>
                        setPreviewImageModal(getFullImageUrl(complaint.resolutionProofImage))
                      }
                      className="h-32 rounded-lg border border-emerald-300 cursor-pointer object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Official Case Discussion & Inquiry Thread */}
            <ComplaintComments
              complaintId={complaint._id}
              initialComments={complaint.comments || []}
              onCommentAdded={(newComment) => {
                setComplaint({
                  ...complaint,
                  comments: [...(complaint.comments || []), newComment],
                });
              }}
            />
          </div>

          {/* Right Column (4 cols): Complainant Dossier, Allocated Officer, Lifecycle Stepper */}
          <div className="lg:col-span-4 space-y-6">
            {/* Complainant Identity Dossier */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <GraduationCap className="w-4 h-4 text-slate-700" />
                  <span>Complainant Identification</span>
                </div>
                <span className="text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                  Verified
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Full Legal Name</p>
                  <p className="font-bold text-slate-900">{complaint.student?.name}</p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">University Roll / PRN</p>
                  <p className="font-mono font-bold text-slate-800">
                    {complaint.student?.rollNumber}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Academic Department</p>
                  <p className="font-semibold text-slate-800">{complaint.student?.department}</p>
                </div>

                {complaint.student?.email && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Campus Email</p>
                    <p className="text-slate-700 font-mono text-[11px] truncate">
                      {complaint.student?.email}
                    </p>
                  </div>
                )}

                {complaint.student?.phone && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Primary Contact</p>
                    <p className="text-slate-700 font-mono text-xs">{complaint.student?.phone}</p>
                  </div>
                )}

                {complaint.student?.hostelRoom && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Campus Residence</p>
                    <p className="text-slate-700">{complaint.student?.hostelRoom}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Allocated Redressal Officer */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Briefcase className="w-4 h-4 text-slate-700" />
                  <span>Allocated Cell Officer</span>
                </div>
              </div>

              {complaint.assignedTo ? (
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Officer In-Charge</p>
                    <p className="font-bold text-slate-900">{complaint.assignedTo.name}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Designated Cell / Division</p>
                    <p className="font-semibold text-slate-800">{complaint.assignedTo.department}</p>
                  </div>

                  {complaint.assignedTo.specialization && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Domain</p>
                      <p className="text-slate-700">{complaint.assignedTo.specialization}</p>
                    </div>
                  )}

                  {complaint.assignedTo.phone && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Official Contact</p>
                      <p className="text-slate-700 font-mono">{complaint.assignedTo.phone}</p>
                    </div>
                  )}

                  {complaint.assignedAt && (
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Allocation Date</p>
                      <p className="text-slate-600 text-[11px]">
                        {formatDateTime(complaint.assignedAt)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs">
                  <Clock className="w-6 h-6 text-amber-500 mx-auto mb-1 opacity-70" />
                  <p className="font-semibold text-slate-700">Awaiting Cell Allocation</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Dean / SGRC has not yet designated an operational officer.
                  </p>
                </div>
              )}
            </div>

            {/* Statutory Chronological Lifecycle Audit Stepper */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Grievance Lifecycle Audit Stepper
              </h3>
              <TimelineView timeline={complaint.timeline || []} />
            </div>
          </div>
        </div>

        {/* Statutory Committee Sign-off Block (Visible on dossier & print) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 print:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="border-t-2 border-slate-300 pt-3 text-center">
              <p className="font-bold text-xs text-slate-800">{complaint.student?.name}</p>
              <p className="text-[10px] text-slate-500 font-mono">PRN: {complaint.student?.rollNumber}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Signature of Complainant</p>
            </div>
            <div className="border-t-2 border-slate-300 pt-3 text-center">
              <p className="font-bold text-xs text-slate-800">
                {complaint.assignedTo?.name || 'Awaiting Allocation'}
              </p>
              <p className="text-[10px] text-slate-500">
                {complaint.assignedTo?.department || 'GTU Zonal Redressal Cell'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                Designated Cell Redressal Officer
              </p>
            </div>
            <div className="border-t-2 border-slate-300 pt-3 text-center">
              <p className="font-bold text-xs text-slate-800">Member Secretary / Ombudsman</p>
              <p className="text-[10px] text-slate-500">GTU Central SGRC Secretariat</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                Institutional Redressal Seal & Date
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10px] text-slate-400">
            <span>Gujarat Technological University Act No. 20 of 2007 • UGC Grievance Redressal Norms</span>
            <span>Document Ref: GTU/SGRC/DOSSIER/{complaint.complaintId}</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignStaffModal
        complaint={complaint}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssigned={(updated) => setComplaint(updated)}
      />

      <UpdateStatusModal
        complaint={complaint}
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onUpdated={(updated) => setComplaint(updated)}
      />

      {/* Lightbox Modal */}
      {previewImageModal && (
        <div
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-pointer"
        >
          <img
            src={previewImageModal}
            alt="Full size evidence"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
