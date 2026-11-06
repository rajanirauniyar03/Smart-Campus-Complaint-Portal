import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Briefcase,
  GraduationCap,
  AlertCircle,
  Building2,
  PhoneCall,
  CheckCircle2,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSandboxHelper, setShowSandboxHelper] = useState(false);

  const { login } = useAuth();
  const { institution } = useBrand();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired');
  const redirectPath = new URLSearchParams(location.search).get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your institutional email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const user = await login(email, password);

      if (redirectPath) {
        navigate(redirectPath);
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Authentication failed. Please verify your institutional credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const autofillPersona = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError('');
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Column: Official Institution Seal & Policy Panel */}
        <div className="md:col-span-5 bg-[#0b1f3a] text-white p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                <Shield className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-white leading-tight">
                  {institution.shortName} ERP
                </h3>
                <span className="text-[11px] text-slate-300">Statutory Redressal</span>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-white leading-tight">
                Institutional Single Sign-On (SSO)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Centralized gateway for university students, administrative deans, and maintenance
                staff officers.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero anonymous reports. Complete verifiable complainant identity.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Statutory compliance with UGC Grievance Redressal Regulations.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Real-time digital audit trail with timestamped logs.</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Institutional Support Desk:</p>
            <p>{institution.helpline}</p>
            <p className="truncate">{institution.supportEmail}</p>
          </div>
        </div>

        {/* Right Column: Secure Authentication Form */}
        <div className="md:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-center">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Secure Academic Gateway
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Sign In to Your Account
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your official campus email and master password to proceed.
            </p>
          </div>

          {isExpired && (
            <div className="p-3 text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Your session has expired. Please authenticate again.</span>
            </div>
          )}

          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rollno@campus.edu or officer@campus.edu"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer">
                  Forgot Password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Discreet Evaluation Accordion (Keeps UI Enterprise, but enables quick 1-click test) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <button
              type="button"
              onClick={() => setShowSandboxHelper(!showSandboxHelper)}
              className="w-full px-3 py-2 text-left text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center justify-between transition"
            >
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                Institution Evaluation Credentials (Quick Autofill)
              </span>
              {showSandboxHelper ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showSandboxHelper && (
              <div className="p-3 bg-white border-t border-slate-200 space-y-2 text-xs">
                <p className="text-[11px] text-slate-500">
                  Click any role below to populate official evaluation login credentials:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => autofillPersona('admin@campus.edu', 'Admin@123')}
                    className="p-2 rounded border border-slate-200 hover:bg-slate-50 text-left transition"
                  >
                    <span className="block font-bold text-slate-800 text-[11px]">Administrator</span>
                    <span className="block text-[10px] text-slate-500">Dr. Ramesh (Dean)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPersona('staff.it@campus.edu', 'Staff@123')}
                    className="p-2 rounded border border-slate-200 hover:bg-slate-50 text-left transition"
                  >
                    <span className="block font-bold text-slate-800 text-[11px]">Staff Officer</span>
                    <span className="block text-[10px] text-slate-500">Rajesh Kumar (IT)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofillPersona('student.aarav@campus.edu', 'Student@123')}
                    className="p-2 rounded border border-slate-200 hover:bg-slate-50 text-left transition"
                  >
                    <span className="block font-bold text-slate-800 text-[11px]">Student</span>
                    <span className="block text-[10px] text-slate-500">Aarav (Roll: 2023CS0142)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>New admitted student?</span>
            <Link
              to="/register"
              className="font-semibold text-slate-900 hover:text-black underline underline-offset-2"
            >
              Enroll Student Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
