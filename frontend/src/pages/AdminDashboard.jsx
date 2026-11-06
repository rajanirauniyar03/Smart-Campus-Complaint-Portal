import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import { complaintService } from '../services/complaintService';
import { authService } from '../services/authService';
import GtuEmblem from '../components/GtuEmblem';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import AssignStaffModal from '../components/AssignStaffModal';
import UpdateStatusModal from '../components/UpdateStatusModal';
import { formatDate, timeAgo } from '../utils/formatters';
import { CATEGORIES, STATUSES, PRIORITIES, DEPARTMENTS, GTU_ZONES } from '../utils/constants';
import {
  Shield,
  FileText,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  UserCheck,
  Settings2,
  Users,
  BarChart3,
  Building,
  Eye,
  Plus,
  Sliders,
  Download,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { institution } = useBrand();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('ledger');

  // Modal controls
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCreateStaffOpen, setIsCreateStaffOpen] = useState(false);

  // New staff registration form state
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Campus Maintenance & Estate',
    specialization: '',
    phone: '',
  });
  const [staffSubmitting, setStaffSubmitting] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [zoneFilter, setZoneFilter] = useState('All');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [compRes, staffRes] = await Promise.all([
        complaintService.getComplaints(),
        authService.getStaffList(),
      ]);
      setComplaints(compRes.complaints || []);
      setStaffList(staffRes.staff || []);
    } catch (err) {
      setError('Unable to retrieve grievance administrative records from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      setStaffSubmitting(true);
      await authService.createStaff(newStaff);
      setIsCreateStaffOpen(false);
      setNewStaff({
        name: '',
        email: '',
        password: '',
        department: 'Campus Maintenance & Estate',
        specialization: '',
        phone: '',
      });
      const s = await authService.getStaffList();
      setStaffList(s.staff || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register cell staff officer');
    } finally {
      setStaffSubmitting(false);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const studentName = c.student?.name || '';
    const studentRoll = c.student?.rollNumber || '';
    const studentDept = c.student?.department || '';
    const locationString = (c.location?.building || '') + ' ' + (c.student?.hostelRoom || '');

    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.complaintId.toLowerCase().includes(search.toLowerCase()) ||
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      studentRoll.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesDept =
      departmentFilter === 'All' || studentDept.toLowerCase() === departmentFilter.toLowerCase();

    let matchesZone = true;
    if (zoneFilter !== 'All') {
      const zName = zoneFilter.toLowerCase();
      if (zName.includes('ahmedabad')) {
        matchesZone = locationString.toLowerCase().includes('ahmedabad') || locationString.toLowerCase().includes('vgec') || locationString.toLowerCase().includes('ldce') || locationString.toLowerCase().includes('chandkheda') || !locationString.trim();
      } else if (zName.includes('gandhinagar')) {
        matchesZone = locationString.toLowerCase().includes('gandhinagar');
      } else if (zName.includes('vidyanagar')) {
        matchesZone = locationString.toLowerCase().includes('vidyanagar') || locationString.toLowerCase().includes('bvm') || locationString.toLowerCase().includes('gcet');
      } else if (zName.includes('rajkot')) {
        matchesZone = locationString.toLowerCase().includes('rajkot');
      } else if (zName.includes('surat')) {
        matchesZone = locationString.toLowerCase().includes('surat') || locationString.toLowerCase().includes('scet');
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDept && matchesZone;
  });

  // Calculate executive statistics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Under Review'
  ).length;
  const inProgressCount = complaints.filter(
    (c) => c.status === 'Assigned' || c.status === 'In Progress'
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const urgentCount = complaints.filter((c) => c.priority === 'Urgent').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Sub-header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <GtuEmblem className="w-8 h-8 hidden sm:block shrink-0" />
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">GTU Central SGRC Secretariat</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-[#092244]">Administrative Command Terminal</span>
              </div>
              <p className="text-[11px] text-[#c88a1e] font-semibold mt-0.5">
                ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી • Chandkheda Headquarters, Ahmedabad
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-block font-mono text-[11px] text-slate-500 px-2.5 py-1 rounded bg-slate-100 border border-slate-200">
              Officer: {user?.name} (Ombudsman Secretariat)
            </span>

            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Zonal Analytics</span>
            </Link>

            <button
              onClick={() => setIsCreateStaffOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#092244] hover:bg-[#071933] text-white text-xs font-semibold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5 text-[#c88a1e]" />
              <span>Register Cell Officer</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Executive Metric Ribbon (Acadex ERP Inspired) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            title="Total Dockets"
            value={totalCount}
            subtitle="AY 2026-27 filings"
            icon={FileText}
          />
          <StatCard
            title="Pending Review"
            value={pendingCount}
            subtitle="Needs initial scrutiny"
            icon={Clock}
            variant="highlight"
          />
          <StatCard
            title="Action Underway"
            value={inProgressCount}
            subtitle="Dispatched to cells"
            icon={RefreshCw}
          />
          <StatCard
            title="Disposed / Closed"
            value={resolvedCount}
            subtitle="Redressed cases"
            icon={CheckCircle2}
          />
          <StatCard
            title="Urgent Dockets"
            value={urgentCount}
            subtitle="Priority SLA focus"
            icon={AlertTriangle}
            variant={urgentCount > 0 ? 'urgent' : 'default'}
          />
          <StatCard
            title="Disposal Rate"
            value={`${resolutionRate}%`}
            subtitle="Statutory compliance"
            icon={Shield}
          />
        </div>

        {/* Primary Workspace Panel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Tabs Navigation Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 bg-slate-50/50">
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveTab('ledger')}
                className={`px-3.5 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                  activeTab === 'ledger'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Grievance Master Ledger ({complaints.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`px-3.5 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                  activeTab === 'staff'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Cell Officers & Workload ({staffList.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Synchronize</span>
              </button>
            </div>
          </div>

          {activeTab === 'ledger' && (
            <div className="p-6 space-y-4">
              {/* Enterprise Filter Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                {/* Search Input */}
                <div className="relative lg:col-span-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search PRN, student, docket..."
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
                  />
                </div>

                {/* GTU Zone Dropdown */}
                <div>
                  <select
                    value={zoneFilter}
                    onChange={(e) => setZoneFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
                  >
                    <option value="All">All GTU Zones (1-5)</option>
                    {GTU_ZONES.map((z) => (
                      <option key={z} value={z}>
                        {z}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Dropdown */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
                  >
                    <option value="All">All Statuses</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Dropdown */}
                <div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
                  >
                    <option value="All">All Priorities</option>
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Dropdown */}
                <div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
                  >
                    <option value="All">All Classifications</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department Dropdown */}
                <div>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 bg-white"
                  >
                    <option value="All">All Academic Depts</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Master Ledger Data Table */}
              {loading ? (
                <div className="text-center py-16 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-600" />
                  <p className="text-xs">Synchronizing docket ledger...</p>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                  <p className="text-xs">No grievance dockets match the specified filter criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                        <th className="py-3 px-4">Complainant (GTU Student)</th>
                        <th className="py-3 px-4">Docket Ref & Subject</th>
                        <th className="py-3 px-4">Classification</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Allocated Officer</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredComplaints.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/80 transition">
                          {/* Student Complainant Identity */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{c.student?.name || 'Unknown Complainant'}</div>
                            <div className="font-mono text-[11px] font-semibold text-slate-700">
                              PRN: {c.student?.rollNumber || 'NO-PRN'}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                              {c.student?.department || 'General'}
                            </div>
                            {c.student?.hostelRoom && (
                              <div className="text-[10px] text-[#c88a1e] font-medium truncate max-w-[170px]">
                                {c.student.hostelRoom}
                              </div>
                            )}
                          </td>

                          {/* Docket Ref & Subject */}
                          <td className="py-3 px-4 max-w-xs">
                            <span className="font-mono text-[11px] font-bold text-slate-800">
                              {c.complaintId}
                            </span>
                            <div className="font-semibold text-slate-900 truncate mt-0.5">
                              {c.title}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Filed: {formatDate(c.createdAt)} ({timeAgo(c.createdAt)})
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-[11px] border border-slate-200">
                              {c.category}
                            </span>
                          </td>

                          {/* Priority */}
                          <td className="py-3 px-4">
                            <PriorityBadge priority={c.priority} size="xs" />
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <StatusBadge status={c.status} size="xs" />
                          </td>

                          {/* Allocated Staff */}
                          <td className="py-3 px-4">
                            {c.assignedTo ? (
                              <div>
                                <div className="font-semibold text-slate-800 flex items-center gap-1">
                                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                                  {c.assignedTo.name}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate max-w-[140px]">
                                  {c.assignedTo.department}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Unallocated
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedComplaint(c);
                                  setIsAssignModalOpen(true);
                                }}
                                title="Allocate Staff Officer"
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] border border-slate-200 transition"
                              >
                                Allocate
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedComplaint(c);
                                  setIsStatusModalOpen(true);
                                }}
                                title="Update Status / Priority"
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] border border-slate-200 transition"
                              >
                                Update
                              </button>

                              <button
                                onClick={() => navigate(`/complaints/${c._id}`)}
                                title="View Dossier"
                                className="p-1 rounded bg-slate-900 hover:bg-black text-white transition"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Designated Redressal Cell Officers & Field Staff
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operational roster and active case allocation counters
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateStaffOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Register Officer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {staffList.map((s) => (
                  <div
                    key={s._id}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                        <p className="text-xs text-slate-600 font-medium">{s.department}</p>
                      </div>
                      <span className="w-7 h-7 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                        {s.name.charAt(0)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Scope:</span>{' '}
                      {s.specialization || 'Campus Facilities'}
                    </div>

                    <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{s.email}</span>
                      </div>
                      {s.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Current Workload:</span>
                      <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {s.activeComplaintsCount} active dockets
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Allocation Modal */}
      <AssignStaffModal
        complaint={selectedComplaint}
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedComplaint(null);
        }}
        onAssigned={(updated) => {
          setComplaints(complaints.map((c) => (c._id === updated._id ? updated : c)));
          authService.getStaffList().then((res) => setStaffList(res.staff || []));
        }}
      />

      {/* Status & Priority Update Modal */}
      <UpdateStatusModal
        complaint={selectedComplaint}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setSelectedComplaint(null);
        }}
        onUpdated={(updated) => {
          setComplaints(complaints.map((c) => (c._id === updated._id ? updated : c)));
        }}
      />

      {/* Register Staff Officer Modal */}
      {isCreateStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">
              Register Campus Redressal Officer
            </h3>
            <form onSubmit={handleCreateStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="e.g. Ramesh Verma"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="officer@campus.edu"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assigned Cell / Division
                </label>
                <select
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="IT & Network Services">IT & Network Services</option>
                  <option value="Hostel Administration">Hostel Administration</option>
                  <option value="Campus Maintenance & Estate">Campus Maintenance & Estate</option>
                  <option value="Sanitation & Public Health">Sanitation & Public Health</option>
                  <option value="Security & Transportation">Security & Transportation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Domain Specialization
                </label>
                <input
                  type="text"
                  value={newStaff.specialization}
                  onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                  placeholder="e.g. Electrical grid, Wi-Fi switches, Plumbing"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateStaffOpen(false)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={staffSubmitting}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg shadow-xs"
                >
                  {staffSubmitting ? 'Registering...' : 'Register Officer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
