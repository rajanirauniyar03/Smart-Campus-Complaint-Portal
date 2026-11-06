import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import GtuEmblem from '../components/GtuEmblem';
import {
  Shield,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Building,
  Search,
  Lock,
  PhoneCall,
  Mail,
  ExternalLink,
  ChevronRight,
  Building2,
  Award,
  Layers,
  MapPin,
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Official University Circulars / Notifications Banner */}
      <div className="bg-[#06182e] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="font-bold text-[10px] uppercase bg-[#c88a1e] text-slate-950 px-2 py-0.5 rounded font-mono shrink-0">
              GTU Notification
            </span>
            <p className="truncate text-slate-200 text-xs">
              UGC Regulations 2023 Compliance: All 400+ affiliated colleges in Gujarat must process dockets within the statutory 7-day turnaround SLA.
            </p>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[11px] shrink-0">
            <span>Circular No: GTU/SGRC/2026/04</span>
            <span>•</span>
            <a
              href="https://www.gtu.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              gtu.ac.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* GTU Hero & Statutory Masthead Section */}
      <section className="bg-gradient-to-b from-[#092244] via-[#0b2850] to-[#071c38] text-white py-12 lg:py-16 border-b border-slate-800 relative overflow-hidden">
        {/* Subtle geometric watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-center">
          <GtuEmblem className="w-96 h-96" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Official Declaration */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-amber-300 text-xs font-semibold border border-amber-400/20">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>NAAC Grade A+ • State Technical University • Government of Gujarat</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Gujarat Technological University
                </h1>
                <p className="text-base sm:text-lg text-amber-400 font-semibold mt-1">
                  ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી — સમાધાન પોર્ટલ
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Central Student Grievance Redressal System (C-SGRS)
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl pt-1">
                The official institutional portal for students across all 400+ GTU-affiliated engineering,
                polytechnic, pharmacy, and management colleges to submit grievances with verified GTU enrollment credentials,
                track physical cell allocation, and receive transparent time-bound redressal.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                {isAuthenticated ? (
                  <Link
                    to={getDashboardPath()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c88a1e] hover:bg-[#d99726] text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
                  >
                    Enter {role === 'admin' ? 'University SGRC' : role === 'staff' ? 'Zonal Cell' : 'Student'} Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c88a1e] hover:bg-[#d99726] text-slate-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      GTU Single Sign-On (SSO)
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                    >
                      <GraduationCap className="w-4 h-4 text-amber-300" />
                      Student Account Enrollment
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-700/60">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  12-Digit GTU PRN Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Zero Anonymous Filings
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  UGC Regulations 2023 Compliant
                </span>
              </div>
            </div>

            {/* Right Column: Docket Reference Search & Helpline Box */}
            <div className="lg:col-span-5 bg-white text-slate-900 p-6 rounded-xl border border-slate-200 shadow-2xl space-y-5">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
                    GTU Redressal Desk
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Active AY 2026–27
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-1">
                  Track GTU Grievance Docket
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your formal complaint reference ID (e.g., CMP-2026-1011) to inspect current status and assigned zonal officer.
                </p>
              </div>

              <form onSubmit={handleDocketSearch} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    GTU Grievance Reference ID
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={docketSearch}
                      onChange={(e) => setDocketSearch(e.target.value)}
                      placeholder="e.g. CMP-2026-1011"
                      className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244] font-mono font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg bg-[#092244] hover:bg-[#0e3259] text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Search className="w-3.5 h-3.5 text-amber-400" />
                  Track Docket Status
                </button>
              </form>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Chandkheda Helpline:</span>
                  <span className="font-mono">{institution.helpline}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Central SGRC Email:</span>
                  <span className="font-mono truncate">{institution.supportEmail}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700">Ombudsman Escalation:</span>
                  <span className="text-slate-800 font-medium">GTU Head Office, Level 4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GTU Academic Reach & Statutory Indicators */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="px-4 py-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#092244]">400+</p>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Affiliated Colleges
              </p>
              <p className="text-[11px] text-slate-400">Engineering, Pharmacy & MBA</p>
            </div>

            <div className="px-4 py-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#092244]">4,50,000+</p>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Enrolled Students
              </p>
              <p className="text-[11px] text-slate-400">Across Gujarat State</p>
            </div>

            <div className="px-4 py-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#092244]">5 Zones</p>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Zonal Redressal Cells
              </p>
              <p className="text-[11px] text-slate-400">Ahmedabad to Surat Regions</p>
            </div>

            <div className="px-4 py-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#092244]">98.6%</p>
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Resolution Rate
              </p>
              <p className="text-[11px] text-slate-400">Strict 7-Day SLA Compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated GTU Redressal Portals */}
      <section className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-[#c88a1e]" />
            <span>Three-Tier Institutional Hierarchy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            GTU Grievance Governance Terminals
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Designed to meet statutory requirements of Gujarat Technological University and UGC norms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Portal Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-400 transition shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#092244] text-[#c88a1e] flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Student Complainant Portal
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  Student Grievance Filing Desk
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  GTU enrolled students lodge verified dockets specifying affiliated college, department,
                  and attaching photographic evidence. Authenticated with 12-digit GTU enrollment number.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Examination, hostel, academic & lab categories
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Live chronological audit trail
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Interactive clarification with designated officer
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to={isAuthenticated && role === 'student' ? '/student' : '/login'}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#092244] hover:bg-[#0e3259] text-white font-semibold text-xs transition"
              >
                Access Student Portal
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Admin Directorate Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-400 transition shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#092244] text-[#c88a1e] flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-800 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Central University Administration
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  GTU Central SGRC & Ombudsman
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Executive command terminal for Dean of Student Affairs and GTU SGRC Secretariat at Chandkheda.
                  Scrutinize dockets across all 5 zones, verify student roll records, and designate cell officers.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Master complaint log with student identification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Zonal cell allocation & workload monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Statutory SLA analytics & annual audit reporting
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to={isAuthenticated && role === 'admin' ? '/admin' : '/login'}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#092244] hover:bg-[#0e3259] text-white font-semibold text-xs transition"
              >
                Access Admin Terminal
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Staff Dispatch Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-400 transition shadow-xs">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-[#092244] text-[#c88a1e] flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Zonal Operations & Field Engineers
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">
                  GTU Zonal Cell & Estate Desk
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Field work order dispatch for university maintenance engineers, IT network specialists,
                  hostel wardens, and examination cell officers to inspect on-site and file verified completion certificates.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Dedicated work queue with student contact
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Field action logging ("Technician Dispatched")
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  Resolution report with photographic proof
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to={isAuthenticated && role === 'staff' ? '/staff' : '/login'}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#092244] hover:bg-[#0e3259] text-white font-semibold text-xs transition"
              >
                Access Zonal Cell Workbench
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GTU 4-Stage Redressal Procedure */}
      <section className="bg-white border-y border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              GTU 4-Stage Redressal & Escalation Procedure
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Standard Operating Procedure prescribed under Gujarat Technological University Act & UGC Norms
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-full bg-[#092244] text-[#c88a1e] font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">Enrollment Filing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Student registers docket with 12-digit GTU enrollment number, selecting category and uploading photo evidence.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-full bg-[#092244] text-[#c88a1e] font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-sm text-slate-900">Central SGRC Scrutiny</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                GTU Secretariat verifies admissibility, determines priority, and allocates task to the designated zonal officer.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-full bg-[#092244] text-[#c88a1e] font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">Zonal Cell Rectification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field engineer visits campus/lab/hostel, coordinates with complainant, executes physical repair, and logs progress notes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="w-7 h-7 rounded-full bg-[#092244] text-[#c88a1e] font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-sm text-slate-900">Resolution & Closure</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Officer files completion report and photographic verification. Redressal certificate is digitally stamped and issued.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official GTU Chandkheda Footer */}
      <footer className="bg-[#06182e] text-slate-400 text-xs py-10 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <GtuEmblem className="w-12 h-12" />
              <div>
                <p className="text-sm font-bold text-white">Gujarat Technological University</p>
                <p className="text-xs text-amber-400 font-medium">ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Nr. Visat Three Roads, Chandkheda, Ahmedabad – 382424, Gujarat, India
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Grievance Desk Helpline:</span>
                <span className="text-white font-mono">{institution.helpline}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Central SGRC Email:</span>
                <span className="text-white font-mono">{institution.supportEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Official University Portal:</span>
                <a
                  href="https://www.gtu.ac.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-white flex items-center gap-1 font-semibold"
                >
                  www.gtu.ac.in <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Gujarat Technological University (GTU) • All Rights Reserved. Student Grievance Redressal System.</p>
            <div className="flex items-center gap-4">
              <span>UGC (Grievance Redressal) Regulations 2023</span>
              <span>•</span>
              <span>AICTE SGRC Compliance</span>
              <span>•</span>
              <a href="https://www.gtu.ac.in/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                GTU Official Portal
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
