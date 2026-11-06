import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import {
  Shield,
  Briefcase,
  GraduationCap,
  RefreshCw,
  KeyRound,
  X,
  Server,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function InstitutionalSandboxModal({ isOpen, onClose, onResetSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const demoAccounts = [
    {
      title: 'Dean of Student Affairs / Chief Administrator',
      label: 'Campus Administrator (Dean)',
      role: 'admin',
      email: 'admin@campus.edu',
      pass: 'Admin@123',
      dept: 'Dean of Student Welfare & SGRC Secretariat',
      icon: Shield,
      redirect: '/admin',
      badge: 'Administrative Terminal',
    },
    {
      title: 'Senior Network & Systems Engineer',
      label: 'Staff Officer (IT & Wi-Fi)',
      role: 'staff',
      email: 'staff.it@campus.edu',
      pass: 'Staff@123',
      dept: 'IT & Network Services Division',
      icon: Briefcase,
      redirect: '/staff',
      badge: 'Field Work Orders',
    },
    {
      title: 'Hostel Maintenance Officer / Warden',
      label: 'Staff Officer (Hostel & Facilities)',
      role: 'staff',
      email: 'staff.hostel@campus.edu',
      pass: 'Staff@123',
      dept: 'Hostel Administration & Estate',
      icon: Briefcase,
      redirect: '/staff',
      badge: 'Field Work Orders',
    },
    {
      title: 'Enrolled Student (Aarav Sharma - CSE)',
      label: 'Student (Roll: 2023CS0142)',
      role: 'student',
      email: 'student.aarav@campus.edu',
      pass: 'Student@123',
      dept: 'Computer Science & Engineering',
      icon: GraduationCap,
      redirect: '/student',
      badge: 'Student Portal',
    },
    {
      title: 'Enrolled Student (Priya Patel - EE)',
      label: 'Student (Roll: 2023EE0089)',
      role: 'student',
      email: 'student.priya@campus.edu',
      pass: 'Student@123',
      dept: 'Electrical Engineering',
      icon: GraduationCap,
      redirect: '/student',
      badge: 'Student Portal',
    },
  ];

  const handleQuickLogin = async (acc) => {
    try {
      setLoadingRole(acc.label);
      setStatusMsg('');
      await login(acc.email, acc.pass);
      onClose();
      navigate(acc.redirect);
    } catch (err) {
      setStatusMsg('Authentication error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingRole(null);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset database to official default complaints, accounts, and audit records?')) return;
    try {
      setResetting(true);
      await complaintService.resetDemoData();
      setStatusMsg('Database restored to default institutional seed state.');
      if (onResetSuccess) onResetSuccess();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      setStatusMsg('Reset failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-800 text-white">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Institutional Sandbox & Evaluation Access
              </h3>
              <p className="text-[11px] text-slate-500">
                Evaluation credentials for testing multi-tier academic roles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Select a verified institutional test persona below to instantly authenticate and evaluate
            role-specific interfaces, permissions, and workflow actions.
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              const isLoading = loadingRole === acc.label;
              return (
                <div
                  key={acc.email}
                  className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{acc.label}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{acc.dept}</p>
                      <p className="text-[10px] font-mono text-slate-400">{acc.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickLogin(acc)}
                    disabled={!!loadingRole || resetting}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition shrink-0 disabled:opacity-50"
                  >
                    {isLoading ? 'Accessing...' : 'Switch Role'}
                  </button>
                </div>
              );
            })}
          </div>

          {statusMsg && (
            <div className="p-2.5 rounded-lg text-xs bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Database re-seed button */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 font-medium transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              Restore Default Institutional Seed Data
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
