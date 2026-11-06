import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useBrand } from '../context/BrandContext';
import NotificationDropdown from './NotificationDropdown';
import InstitutionalSettingsModal from './InstitutionalSettingsModal';
import {
  Building2,
  Bell,
  LogOut,
  User,
  Plus,
  BarChart3,
  ClipboardList,
  Menu,
  X,
  Shield,
  Briefcase,
  GraduationCap,
  Sliders,
  PhoneCall,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function Navbar({ onOpenLodgeModal }) {
  const { user, role, logout, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const { institution } = useBrand();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-800 text-white border border-slate-700">
            <Shield className="w-3 h-3 text-slate-300" />
            Dean / Administrator
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-900 text-blue-100 border border-blue-800">
            <Briefcase className="w-3 h-3 text-blue-300" />
            Cell Officer / Staff
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-800 border border-slate-300">
            <GraduationCap className="w-3 h-3 text-slate-600" />
            Enrolled Student
          </span>
        );
    }
  };

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/staff';
    return '/student';
  };

  return (
    <>
      {/* Top Statutory Administrative Bar */}
      <div className="bg-[#0b1f3a] text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              {institution.shortName} Central Grievance Redressal Portal
            </span>
            <span className="hidden md:inline-block text-slate-400 border-l border-slate-700 pl-3">
              {institution.accreditation}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400">
              Session: {institution.academicSession}
            </span>
            <a
              href={`tel:${institution.helpline}`}
              className="hover:text-white flex items-center gap-1 transition"
            >
              <PhoneCall className="w-3 h-3 text-slate-400" />
              <span>Helpline: {institution.helpline}</span>
            </a>
            {/* Quick SaaS Branding Customizer trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition"
              title="Configure Institution Branding"
            >
              <Sliders className="w-3 h-3" />
              <span>Branding</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Official Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* University Seal & Name */}
            <div className="flex items-center gap-3">
              <Link
                to={isAuthenticated ? getDashboardPath() : '/'}
                className="flex items-center gap-3 group"
              >
                {/* Official University Seal Crest */}
                <div className="w-11 h-11 rounded-lg bg-[#0b1f3a] border border-slate-800 flex items-center justify-center text-white shadow-xs group-hover:bg-[#122b4d] transition shrink-0">
                  <div className="text-center">
                    <Shield className="w-5 h-5 mx-auto text-amber-400" />
                  </div>
                </div>

                <div className="leading-tight">
                  <span className="block font-bold text-base sm:text-lg text-slate-900 tracking-tight group-hover:text-slate-800">
                    {institution.name}
                  </span>
                  <span className="block text-[11px] font-medium text-slate-500">
                    {institution.subTitle}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <nav className="flex items-center gap-1 mr-2 border-r border-slate-200 pr-3">
                    <Link
                      to={getDashboardPath()}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                        location.pathname === getDashboardPath()
                          ? 'bg-slate-100 text-slate-900 border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                      Dashboard
                    </Link>

                    {role === 'admin' && (
                      <Link
                        to="/admin/analytics"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                          location.pathname === '/admin/analytics'
                            ? 'bg-slate-100 text-slate-900 border border-slate-200'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                        Executive Analytics
                      </Link>
                    )}

                    {role === 'student' && onOpenLodgeModal && (
                      <button
                        onClick={onOpenLodgeModal}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#0b1f3a] hover:bg-[#152e4d] text-white shadow-xs transition active:scale-95 ml-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Lodge Grievance
                      </button>
                    )}
                  </nav>

                  {/* Role Badge */}
                  {getRoleBadge()}

                  {/* Notifications */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="relative p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                      title="Notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                    <NotificationDropdown
                      isOpen={isNotifOpen}
                      onClose={() => setIsNotifOpen(false)}
                    />
                  </div>

                  {/* User Profile Pill */}
                  <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
                    <div className="text-right leading-tight">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {role === 'student' ? user?.rollNumber : user?.department?.split(' ')[0]}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-md bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-300">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    Institutional Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0b1f3a] hover:bg-[#152e4d] rounded-lg shadow-xs transition"
                  >
                    Student Enrollment
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 rounded-md text-slate-600 hover:bg-slate-100 border border-slate-200"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown
                    isOpen={isNotifOpen}
                    onClose={() => setIsNotifOpen(false)}
                  />
                </div>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-700 hover:bg-slate-100 border border-slate-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 px-4 py-4 space-y-3 bg-white">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {role === 'student' ? user?.rollNumber : user?.department}
                    </p>
                  </div>
                  {getRoleBadge()}
                </div>

                <div className="space-y-1">
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <ClipboardList className="w-4 h-4 text-slate-600" />
                    Dashboard
                  </Link>

                  {role === 'admin' && (
                    <Link
                      to="/admin/analytics"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      <BarChart3 className="w-4 h-4 text-slate-600" />
                      Executive Analytics
                    </Link>
                  )}

                  {role === 'student' && onOpenLodgeModal && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenLodgeModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-white bg-[#0b1f3a]"
                    >
                      <Plus className="w-4 h-4" />
                      Lodge Grievance
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100 text-left"
                  >
                    <Sliders className="w-4 h-4 text-slate-600" />
                    Configure Institution
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-rose-700 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 rounded-lg text-slate-700 bg-slate-100 font-semibold text-xs border border-slate-200"
                >
                  Institutional Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 rounded-lg text-white bg-[#0b1f3a] font-semibold text-xs"
                >
                  Student Enrollment
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Institutional Settings Modal */}
      <InstitutionalSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
