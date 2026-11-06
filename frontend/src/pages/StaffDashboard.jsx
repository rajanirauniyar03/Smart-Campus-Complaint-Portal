import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { complaintService } from '../services/complaintService';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { formatDate, timeAgo } from '../utils/formatters';
import {
  Briefcase,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Building,
  User,
  ArrowRight,
  MessageSquare,
  Wrench,
  Check,
  ChevronRight,
  Phone,
  Eye,
} from 'lucide-react';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { institution } = useBrand();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Filters
  const [statusTab, setStatusTab] = useState('All');
  const [search, setSearch] = useState('');

  const loadAssignedComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await complaintService.getComplaints();
      setComplaints(res.complaints || []);
    } catch (err) {
      setError('Failed to retrieve assigned work orders from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignedComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const studentName = c.student?.name || '';
    const studentRoll = c.student?.rollNumber || '';

    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      studentRoll.toLowerCase().includes(search.toLowerCase());

    let matchesTab = true;
    if (statusTab === 'Active') {
      matchesTab = c.status === 'Assigned' || c.status === 'In Progress' || c.status === 'Under Review';
    } else if (statusTab === 'Resolved') {
      matchesTab = c.status === 'Resolved';
    }

    return matchesSearch && matchesTab;
  });

  // Calculate statistics
  const totalAssigned = complaints.length;
  const activeCount = complaints.filter(
    (c) => c.status === 'Assigned' || c.status === 'In Progress' || c.status === 'Under Review'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const urgentCount = complaints.filter(
    (c) => c.priority === 'Urgent' && c.status !== 'Resolved'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Sub-header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Operational Cells</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">
              Work Order & Redressal Desk
            </span>
            <span className="hidden md:inline-block font-mono text-[11px] text-slate-400 border-l border-slate-200 pl-2">
              Officer: {user?.name} • Division: {user?.department}
            </span>
          </div>

          <button
            onClick={loadAssignedComplaints}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Synchronize Queue</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* KPI Cards Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Assigned"
            value={totalAssigned}
            subtitle="Allocated to your cell"
            icon={Briefcase}
          />
          <StatCard
            title="Action Underway"
            value={activeCount}
            subtitle="Pending physical fix"
            icon={RefreshCw}
            variant="highlight"
          />
          <StatCard
            title="Disposed by You"
            value={resolvedCount}
            subtitle="Verified completions"
            icon={CheckCircle2}
          />
          <StatCard
            title="Urgent Dockets"
            value={urgentCount}
            subtitle="High SLA priority"
            icon={AlertTriangle}
            variant={urgentCount > 0 ? 'urgent' : 'default'}
          />
        </div>

        {/* Work Order Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Status Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Assigned Grievance Work Orders
              </h2>
              <p className="text-xs text-slate-500">
                Conduct physical verification, update progress logs, and submit closure remarks with evidence
              </p>
            </div>

            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs font-semibold">
              {['All', 'Active', 'Resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusTab(tab)}
                  className={`px-3 py-1 rounded-md transition ${
                    statusTab === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab === 'Active' ? 'Active Work Orders' : tab === 'Resolved' ? 'Completed' : 'All Dockets'}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by docket ID, student PRN, student name, or keywords..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
              />
            </div>

            {/* List of Assigned Grievances */}
            {loading ? (
              <div className="text-center py-16 text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-600" />
                <p className="text-xs">Loading work order queue...</p>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-60" />
                <h3 className="text-sm font-bold text-slate-800">Queue is Clear</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No pending work orders assigned to your cell under the selected filter.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredComplaints.map((c) => (
                  <div
                    key={c._id}
                    className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
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

                      <h3
                        onClick={() => navigate(`/complaints/${c._id}`)}
                        className="font-bold text-slate-900 text-sm hover:text-blue-900 cursor-pointer transition"
                      >
                        {c.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>

                      {/* Verified Complainant Contact Strip */}
                      <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-700">
                        <span className="font-semibold flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          Student: {c.student?.name} (PRN: {c.student?.rollNumber})
                        </span>
                        <span className="text-slate-500">• {c.student?.department}</span>
                        {c.student?.phone && (
                          <span className="text-slate-700 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {c.student.phone}
                          </span>
                        )}
                        {c.location?.building && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Building className="w-3 h-3 text-slate-400" />
                            {c.location.building}
                            {c.location.roomOrArea && `, ${c.location.roomOrArea}`}
                          </span>
                        )}
                      </div>

                      {c.resolutionNotes && (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                          <span className="font-bold">Official Resolution Report: </span>
                          {c.resolutionNotes}
                        </div>
                      )}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedComplaint(c);
                          setIsUpdateModalOpen(true);
                        }}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-black text-white shadow-xs transition"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Log Action / Resolve
                      </button>

                      <button
                        onClick={() => navigate(`/complaints/${c._id}`)}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Dossier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Dialog */}
      <UpdateStatusModal
        complaint={selectedComplaint}
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedComplaint(null);
        }}
        onUpdated={(updated) => {
          setComplaints(complaints.map((c) => (c._id === updated._id ? updated : c)));
        }}
      />
    </div>
  );
}
