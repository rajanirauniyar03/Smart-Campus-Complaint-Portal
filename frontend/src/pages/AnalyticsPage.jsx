import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../context/BrandContext';
import { analyticsService } from '../services/analyticsService';
import GtuEmblem from '../components/GtuEmblem';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { formatDate } from '../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Building,
  ArrowLeft,
  RefreshCw,
  PieChart,
  Printer,
  ChevronRight,
  Shield,
  MapPin,
  Award,
} from 'lucide-react';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const { institution } = useBrand();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await analyticsService.getAnalytics();
      setData(res);
    } catch (err) {
      setError('Failed to compute institutional analytics aggregations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-600 mb-2" />
        <p className="text-xs">Generating statutory grievance analytics...</p>
      </div>
    );
  }

  const { stats, statusBreakdown, priorityBreakdown, categoryBreakdown, departmentBreakdown, staffStats } =
    data || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Sub-header / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => navigate('/admin')}
              className="hover:text-slate-900 flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Admin Terminal
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">
              Institutional Grievance Intelligence & SGRC Audit
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Committee Report</span>
            </button>

            <button
              onClick={loadAnalytics}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Title Header with GTU Seal */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <GtuEmblem className="w-14 h-14 shrink-0 drop-shadow-xs" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded">
                  Annual Redressal Audit
                </span>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" /> NAAC A+ Certified
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Session: {institution.academicSession}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Grievance Governance & SLA Compliance Intelligence
              </h1>
              <p className="text-xs text-[#c88a1e] font-semibold mt-0.5">
                {institution.nativeName || 'ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી'} • {institution.name} (Central SGRC)
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            <p className="font-semibold text-slate-700">Ombudsman SLA Benchmark:</p>
            <p className="font-mono text-emerald-700 font-bold">7 Working Days Turnaround</p>
            <p className="text-[10px] text-slate-400 mt-0.5">UGC Redressal Norms 2023</p>
          </div>
        </div>

        {/* Primary Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Annual Dockets"
            value={stats?.totalComplaints || 0}
            subtitle="Registered grievances"
            icon={FileText}
          />
          <StatCard
            title="SLA Redressal Rate"
            value={`${stats?.resolutionRate || 0}%`}
            subtitle="Disposed within statutory limit"
            icon={TrendingUp}
            variant="highlight"
          />
          <StatCard
            title="Average Turnaround"
            value={`${stats?.avgResolutionHours || 0} hrs`}
            subtitle="Mean response time"
            icon={Clock}
          />
          <StatCard
            title="Urgent Dockets"
            value={stats?.urgentCount || 0}
            subtitle="Immediate priority queue"
            icon={AlertTriangle}
            variant={stats?.urgentCount > 0 ? 'urgent' : 'default'}
          />
        </div>

        {/* 2-Column Visual Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Classification Breakdown */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-slate-700" />
                Grievance Volume by Classification
              </h3>
              <span className="text-xs text-slate-400">AY 2026-27</span>
            </div>

            <div className="space-y-3 pt-1">
              {categoryBreakdown?.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{cat.category}</span>
                    <span className="font-mono text-slate-500">
                      {cat.count} dockets ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Pipeline Distribution */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PieChart className="w-4 h-4 text-slate-700" />
                Current Status Pipeline
              </h3>
              <span className="text-xs text-slate-400">Active Workflow</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              {statusBreakdown?.map((st) => (
                <div
                  key={st.status}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: st.color }}
                    />
                    <span className="text-xs font-semibold text-slate-700 truncate">{st.status}</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{st.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GTU 5-Zone Administrative Jurisdiction & Redressal Performance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c88a1e]" />
                Gujarat Technological University — 5 Administrative Zones Performance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Statutory jurisdiction across 400+ affiliated colleges and polytechnic institutes
              </p>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-[#092244] text-white self-start sm:self-auto">
              5 Zonal Liaison Cells Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-1">
            {[
              {
                zone: 'Zone 1 - Ahmedabad',
                hq: 'Chandkheda / LDCE / VGEC',
                colleges: '120+ Affiliated Units',
                share: '42%',
                sla: '94% SLA',
                status: 'Optimal',
              },
              {
                zone: 'Zone 2 - Gandhinagar',
                hq: 'GEC Gandhinagar, Sec 28',
                colleges: '75+ Affiliated Units',
                share: '18%',
                sla: '91% SLA',
                status: 'Optimal',
              },
              {
                zone: 'Zone 3 - V.V. Nagar',
                hq: 'BVM / GCET, Anand',
                colleges: '80+ Affiliated Units',
                share: '16%',
                sla: '89% SLA',
                status: 'Normal',
              },
              {
                zone: 'Zone 4 - Rajkot',
                hq: 'GEC Rajkot, Saurashtra',
                colleges: '65+ Affiliated Units',
                share: '13%',
                sla: '88% SLA',
                status: 'Normal',
              },
              {
                zone: 'Zone 5 - Surat',
                hq: 'SCET / GEC Surat, South Guj',
                colleges: '60+ Affiliated Units',
                share: '11%',
                sla: '92% SLA',
                status: 'Optimal',
              },
            ].map((z) => (
              <div
                key={z.zone}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{z.zone}</span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {z.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate">{z.hq}</p>
                <p className="text-[10px] text-slate-400 font-mono">{z.colleges}</p>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Load: {z.share}</span>
                  <span className="font-bold text-slate-900 font-mono">{z.sla}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column: Department Breakdown & Staff Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Volume */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-4 h-4 text-slate-700" />
              Departmental Docket Concentration
            </h3>
            <div className="space-y-3 pt-1">
              {departmentBreakdown?.map((dept) => {
                const maxCount = departmentBreakdown[0]?.count || 1;
                const barWidth = Math.round((dept.count / maxCount) * 100);
                return (
                  <div key={dept.department} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 truncate max-w-xs">
                        {dept.department}
                      </span>
                      <span className="font-mono text-slate-500">{dept.count} cases</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-700 rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Staff Efficiency Ledger */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <Users className="w-4 h-4 text-slate-700" />
              Designated Officers & Redressal Efficiency
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="pb-2">Officer Name</th>
                    <th className="pb-2">Cell Division</th>
                    <th className="pb-2 text-center">Active Load</th>
                    <th className="pb-2 text-right">Disposed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffStats?.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-900">{s.name}</td>
                      <td className="py-2.5 text-slate-500 text-[11px] truncate max-w-[130px]">{s.department}</td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                          {s.activeWorkload}
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-emerald-700">
                        {s.resolvedTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
