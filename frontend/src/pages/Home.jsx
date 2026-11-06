import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import {
  Shield,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Building,
  HelpCircle,
  FileCheck,
  Scale,
  Search,
  Lock,
  PhoneCall,
  Mail,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Sliders,
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, role } = useAuth();
  const { institution } = useBrand();
  const navigate = useNavigate();
  const [docketSearch, setDocketSearch] = useState('');

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/staff';
    return '/student';
  };

  const handleDocketSearch = (e) => {
    e.preventDefault();
    if (!docketSearch.trim()) return;
    if (isAuthenticated) {
      navigate(`/complaints/${docketSearch.trim()}`);
    } else {
      navigate(`/login?redirect=/complaints/${docketSearch.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Official Circulars / Notification Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs text-slate-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[10px] uppercase bg-slate-800 text-white px-2 py-0.5 rounded">
              Official Notice
            </span>
            <span className="truncate">
              In accordance with UGC (Grievance Redressal of Students) Regulations, 2023. Mandatory 7-day turnaround SLA for all campus dockets.
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>AY 2026–2027</span>
            <span>•</span>
            <span>Circular No: NIT/SGRC/2026/04</span>
          </div>
        </div>
      </div>

      {/* Institutional Hero / Masthead Section */}
      <section className="bg-[#0b1f3a] text-white py-12 lg:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Official Declaration */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-slate-200 text-xs font-semibold border border-white/10">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Statutory Grievance Redressal & Academic Governance ERP</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Central Student Grievance Redressal Mechanism
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                The institutional single-window portal for transparent submission, automated cell
                allocation, on-site investigation, and structured resolution of academic, hostel, and campus infrastructure concerns.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                {isAuthenticated ? (
                  <Link
                    to={getDashboardPath()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 shadow-sm transition active:scale-95"
                  >
                    Enter {role === 'admin' ? 'Administrative' : role === 'staff' ? 'Staff' : 'Student'} Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Institutional Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Student Account Enrollment
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-700/60">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  100% Identity-Verified Dockets
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No Anonymous Filings
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Full Lifecycle Audit Trail
                </span>
              </div>
            </div>

            {/* Right Column: Docket Tracking & Quick Portal Card */}
            <div className="lg:col-span-5 bg-white text-slate-900 p-6 rounded-xl border border-slate-200 shadow-xl space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Docket Tracking Desk
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">
                  Check Grievance Status
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your formal complaint reference number (e.g., CMP-2026-1011) to check current stage and assigned cell officer.
                </p>
              </div>

              <form onSubmit={handleDocketSearch} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grievance Docket ID
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={docketSearch}
                      onChange={(e) => setDocketSearch(e.target.value)}
                      placeholder="e.g. CMP-2026-1011"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  Track Docket Status
                </button>
              </form>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Official Helpline:</span>
                  <span className="font-mono">{institution.helpline}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Grievance Cell:</span>
                  <span className="font-mono truncate">{institution.supportEmail}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Ombudsman Escalate:</span>
                  <span>Direct Level 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional KPI Summary Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="px-4 py-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Verified Accountability
              </p>
              <p className="text-[11px] text-slate-400">Zero anonymous submissions</p>
            </div>

            <div className="px-4 py-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">98.2%</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                SLA Compliance Rate
              </p>
              <p className="text-[11px] text-slate-400">Within statutory 7-day limit</p>
            </div>

            <div className="px-4 py-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">3-Tier</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Escalation Hierarchy
              </p>
              <p className="text-[11px] text-slate-400">Cell In-Charge ➔ Dean ➔ Ombudsman</p>
            </div>

            <div className="px-4 py-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">NAAC A++</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                Accredited Governance
              </p>
              <p className="text-[11px] text-slate-400">Digital documentation compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated Institutional Portals */}
      <section className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Institutional Redressal Portals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Three authenticated portals structured according to higher-education institutional governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Portal Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-400 transition shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Tier 1 • Complainant Portal
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Student Grievance Lodging & Tracker
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Enrolled students lodge verified dockets with photo evidence and location specs. Every complaint is automatically bound to the student's institutional PRN/Roll Number.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Category-wise filing with image evidence
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Live chronological timeline tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Direct officer discussion & clarification
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to={isAuthenticated && role === 'student' ? '/student' : '/login'}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-xs transition"
              >
                Access Student Portal
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Admin Directorate Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-400 transition shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Tier 2 • Central Administration
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Dean Directorate & Ombudsman
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Institutional oversight terminal for Deans, Registrar, and SGRC committee. Review pending dockets, verify complainant credentials, and allocate to specialized cells.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Master complaint log with student identification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Cell officer allocation & workload balancing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Executive analytics & departmental SLA auditing
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to={isAuthenticated && role === 'admin' ? '/admin' : '/login'}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-xs transition"
              >
                Access Admin Terminal
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Staff Dispatch Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-400 transition shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Tier 3 • Operational Cells
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Maintenance & Facility Cell Desk
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Field work order management for IT & Network Engineers, Hostel Wardens, Estate Officers, and Sanitation Supervisors to inspect on-site and mark resolution with proof.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Dedicated work queue with complainant contact
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Field update logs ("Technician Dispatched")
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Resolution report & proof image documentation
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to={isAuthenticated && role === 'staff' ? '/staff' : '/login'}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-xs transition"
              >
                Access Staff Workbench
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Operating Procedure / Workflow Flow */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Statutory 4-Stage Redressal Procedure
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Standard operating procedure mandated under Higher Education Grievance Redressal Norms
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Authenticated Filing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Student registers docket specifying issue classification, location, and attaching photographic evidence.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Administrative Scrutiny</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                SGRC Secretariat examines admissibility, sets priority, and allocates task to the designated cell officer.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">On-Site Rectification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cell engineer coordinates with the student, performs physical/systemic repairs, and logs field notes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900">Closure & Audit</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Officer files resolution report and photographic completion proof. Status moves to Resolved with timestamp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <p className="text-sm font-bold text-white">{institution.name}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{institution.subTitle}</p>
              <p className="text-[11px] text-slate-500 mt-1">{institution.address}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <span className="text-slate-400">Helpline: {institution.helpline}</span>
              <span>•</span>
              <span className="text-slate-400">Email: {institution.supportEmail}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} {institution.name} • All Rights Reserved. Student Grievance Redressal System.</p>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">UGC Regulations 2023 Compliant</span>
              <span>•</span>
              <span className="text-slate-400">AICTE Approved Mechanism</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
