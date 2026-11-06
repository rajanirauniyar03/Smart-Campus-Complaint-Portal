import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { complaintService } from '../services/complaintService';
import GtuEmblem from '../components/GtuEmblem';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import LodgeComplaintModal from '../components/LodgeComplaintModal';
import { formatDate, timeAgo } from '../utils/formatters';
import { CATEGORIES } from '../utils/constants';
import {
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  ArrowRight,
  UserCheck,
  Building,
  Image as ImageIcon,
  MessageSquare,
  GraduationCap,
  Shield,
  ChevronRight,
  Eye,
  Award,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { institution } = useBrand();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusTab, setStatusTab] = useState('All');

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await complaintService.getComplaints();
      setComplaints(res.complaints || []);
    } catch (err) {
      setError('Unable to load your grievance history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;

    let matchesStatus = true;
    if (statusTab === 'Pending') {
      matchesStatus = c.status === 'Pending' || c.status === 'Under Review';
    } else if (statusTab === 'Active') {
      matchesStatus = c.status === 'Assigned' || c.status === 'In Progress';
    } else if (statusTab === 'Resolved') {
      matchesStatus = c.status === 'Resolved';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Under Review'
  ).length;
  const activeCount = complaints.filter(
    (c) => c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Sub-header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">GTU Student Services</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-[#092244]">
              Central Student Grievance Redressal Dossier
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
              Ref: UGC/GTU-SGRC/{new Date().getFullYear()}
            </span>
            <button
              onClick={() => setIsLodgeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#092244] hover:bg-[#071933] text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5 text-[#c88a1e]" />
              <span>Lodge New Grievance</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Verified Student Identification Dossier Header with GTU Seal */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-[#092244] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full">
                <GtuEmblem className="w-5 h-5" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">{user?.name}</h1>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" />
                  Verified GTU Student Identity
                </span>
                <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
                  PRN: {user?.rollNumber || 'NO-PRN'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                <span>Discipline: <strong className="text-slate-800 font-semibold">{user?.department}</strong></span>
                <span>•</span>
                <span>
                  Affiliated Unit / Campus:{' '}
                  <strong className="text-slate-800 font-semibold">
                    {user?.hostelRoom || 'Chandkheda Campus / Affiliated Engineering College'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto">
            <span className="block text-[11px] text-[#c88a1e] font-semibold">
              {institution.nativeName || 'ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી'}
            </span>
            <span className="font-bold text-slate-800">{institution.shortName} • {institution.accreditation}</span>
            <span className="block text-[10px] text-slate-400 font-mono mt-0.5">AY {institution.academicSession}</span>
          </div>
        </div>

        {/* Institutional Statutory Guarantee Banner */}
        <div className="bg-gradient-to-r from-[#092244]/5 via-[#092244]/10 to-amber-500/5 rounded-xl border border-slate-200/80 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#092244] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">
                Statutory Redressal Governance Under UGC Regulations, 2023
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Every grievance filed is assigned a permanent university docket number, scrutinized by the GTU Central SGRC, and subject to an Ombudsman resolution SLA benchmark of 7 working days.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-[11px] text-slate-600 font-medium">
            <PhoneCall className="w-3.5 h-3.5 text-[#c88a1e]" />
            <span>GTU Redressal Cell: +91 (079) 23267521</span>
          </div>
        </div>

        {/* Metric Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Lodged"
            value={totalCount}
            subtitle="Lifetime dockets"
            icon={FileText}
          />
          <StatCard
            title="Pending Scrutiny"
            value={pendingCount}
            subtitle="Under initial review"
            icon={Clock}
            variant="highlight"
          />
          <StatCard
            title="Action Underway"
            value={activeCount}
            subtitle="Cell officer deployed"
            icon={RefreshCw}
          />
          <StatCard
            title="Redressed & Closed"
            value={resolvedCount}
            subtitle="Satisfactorily resolved"
            icon={CheckCircle2}
          />
        </div>

        {/* Complaints Ledger Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Status Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Grievance History & Audit Record
              </h2>
              <p className="text-xs text-slate-500">
                Track formal allocation, operational notes, and resolution reports
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs font-semibold">
              {['All', 'Pending', 'Active', 'Resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={`px-3 py-1 rounded-md transition ${
                    statusTab === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'All' ? 'All Dockets' : tab === 'Pending' ? 'Pending' : tab === 'Active' ? 'Active' : 'Redressed'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Filter bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Docket Reference (e.g. CMP-2026-1011), subject, or keywords..."
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>

              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
                >
                  <option value="All">All Classifications</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Docket List Cards */}
            {loading ? (
              <div className="text-center py-16 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-600" />
                <p className="text-xs">Loading grievance dockets...</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No grievances on record</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {search || categoryFilter !== 'All' || statusTab !== 'All'
                    ? 'No dockets match the specified filter criteria.'
                    : 'You have not submitted any grievance dockets. Click "Lodge New Grievance" to register an issue.'}
                </p>
                {!search && categoryFilter === 'All' && statusTab === 'All' && (
                  <button
                    onClick={() => setIsLodgeModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white"
                  >
                    <Plus className="w-3.5 h-3.5" /> Lodge First Grievance
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredComplaints.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => navigate(`/complaints/${c._id}`)}
                    className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition cursor-pointer bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                          {c.complaintId}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {c.category}
                        </span>
                        <PriorityBadge priority={c.priority} size="xs" />
                        <StatusBadge status={c.status} size="xs" />
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm hover:text-blue-900 transition">
                        {c.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-1">{c.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span>Lodged: {formatDate(c.createdAt)}</span>
                        {c.location?.building && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3 text-slate-400" />
                            {c.location.building}
                            {c.location.roomOrArea && `, ${c.location.roomOrArea}`}
                          </span>
                        )}
                        {c.imageUrl && (
                          <span className="flex items-center gap-1 text-slate-700 font-medium">
                            <ImageIcon className="w-3 h-3" /> Photographic Evidence Attached
                          </span>
                        )}
                        {c.comments?.length > 0 && (
                          <span className="flex items-center gap-1 text-slate-700 font-medium">
                            <MessageSquare className="w-3 h-3" /> {c.comments.length} Case Notes
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Allocated Officer Pill & Inspection Button */}
                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                      {c.assignedTo ? (
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-400">
                            Allocated Officer
                          </p>
                          <p className="text-xs font-semibold text-slate-800 flex items-center gap-1 justify-end">
                            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                            {c.assignedTo.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {c.assignedTo.department}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-medium">
                          Awaiting Cell Allocation
                        </span>
                      )}

                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white text-slate-500 transition">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lodge Complaint Modal */}
      <LodgeComplaintModal
        isOpen={isLodgeModalOpen}
        onClose={() => setIsLodgeModalOpen(false)}
        onCreated={(newComplaint) => {
          setComplaints([newComplaint, ...complaints]);
        }}
      />
    </div>
  );
}
