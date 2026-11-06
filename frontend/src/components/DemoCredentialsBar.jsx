import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { complaintService } from '../services/complaintService';
import { Shield, Briefcase, GraduationCap, RefreshCw, KeyRound, Check } from 'lucide-react';

export default function DemoCredentialsBar({ onResetSuccess }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loadingRole, setLoadingRole] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const demoAccounts = [
    {
      label: 'Admin (Dean)',
      role: 'admin',
      email: 'admin@campus.edu',
      pass: 'Admin@123',
      icon: Shield,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300',
      redirect: '/admin',
    },
    {
      label: 'Staff (IT - Rajesh)',
      role: 'staff',
      email: 'staff.it@campus.edu',
      pass: 'Staff@123',
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300',
      redirect: '/staff',
    },
    {
      label: 'Staff (Hostel - Anita)',
      role: 'staff',
      email: 'staff.hostel@campus.edu',
      pass: 'Staff@123',
      icon: Briefcase,
      color: 'bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-300',
      redirect: '/staff',
    },
    {
      label: 'Student (Aarav - CSE)',
      role: 'student',
      email: 'student.aarav@campus.edu',
      pass: 'Student@123',
      icon: GraduationCap,
      color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-300',
      redirect: '/student',
    },
    {
      label: 'Student (Priya - EE)',
      role: 'student',
      email: 'student.priya@campus.edu',
      pass: 'Student@123',
      icon: GraduationCap,
      color: 'bg-teal-100 text-teal-700 hover:bg-teal-200 border-teal-300',
      redirect: '/student',
    },
  ];

  const handleQuickLogin = async (acc) => {
    try {
      setLoadingRole(acc.label);
      setStatusMsg('');
      await login(acc.email, acc.pass);
      navigate(acc.redirect);
    } catch (err) {
      setStatusMsg('Failed to log in: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingRole(null);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('Reset database to clean default demo complaints and users?')) return;
    try {
      setResetting(true);
      await complaintService.resetDemoData();
      setStatusMsg('Demo data re-seeded successfully!');
      if (onResetSuccess) onResetSuccess();
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      setStatusMsg('Reset failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium text-slate-300">
          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-white">1-Click Role Switcher:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {demoAccounts.map((acc) => {
            const Icon = acc.icon;
            const isLoading = loadingRole === acc.label;
            return (
              <button
                key={acc.label}
                onClick={() => handleQuickLogin(acc)}
                disabled={!!loadingRole || resetting}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition shadow-xs active:scale-95 disabled:opacity-50 ${acc.color}`}
              >
                {isLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span>{acc.label}</span>
              </button>
            );
          })}

          <button
            onClick={handleResetData}
            disabled={resetting}
            title="Reset to fresh demo dataset"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
          >
            <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo DB</span>
          </button>
        </div>

        {statusMsg && (
          <span className="w-full sm:w-auto text-[11px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
            {statusMsg}
          </span>
        )}
      </div>
    </div>
  );
}
