import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useBrand } from '../context/BrandContext';
import NotificationDropdown from './NotificationDropdown';
import InstitutionalSettingsModal from './InstitutionalSettingsModal';
import GtuEmblem from './GtuEmblem';
import {
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
  Building,
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-[#092244] text-white border border-[#c88a1e]/40 shadow-xs">
            <Shield className="w-3 h-3 text-[#c88a1e]" />
            GTU SGRC Secretariat / Dean
          </span>
        );
      case 'staff':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-blue-900 text-blue-100 border border-blue-700 shadow-xs">
            <Briefcase className="w-3 h-3 text-blue-300" />
            GTU Zonal Officer / Engineer
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-800 border border-slate-300 shadow-xs">
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
      {/* Top Government of Gujarat & Regulatory Strip */}
      <div className="bg-[#06182e] text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Government of Gujarat • Education Department
            </span>
            <span className="hidden lg:inline-block text-slate-400 border-l border-slate-700 pl-3">
              {institution.accreditation}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400">
              Session: {institution.academicSession}
            </span>
            <a
              href="https://www.gtu.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f59e0b] hover:text-amber-200 flex items-center gap-1 font-semibold transition"
              title="Visit official GTU university portal"
            >
              <span>www.gtu.ac.in</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`tel:${institution.helpline.split('/')[0].trim()}`}
              className="hidden md:flex hover:text-white items-center gap-1 transition"
            >
              <PhoneCall className="w-3 h-3 text-slate-400" />
              <span>Helpline: {institution.helpline}</span>
            </a>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-slate-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition"
              title="Configure Institutional Branding"
            >
              <Sliders className="w-3 h-3" />
              <span>Branding</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Official GTU Masthead */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* University Crest & Bilingual Title */}
            <div className="flex items-center gap-3">
              <Link
                to={isAuthenticated ? getDashboardPath() : '/'}
                className="flex items-center gap-3.5 group"
              >
                <GtuEmblem className="w-13 h-13" />

                <div className="leading-tight">
                  <div className="flex items-baseline gap-2">
                    <span className="block font-extrabold text-base sm:text-lg lg:text-xl text-[#092244] tracking-tight group-hover:text-[#0e3259] transition">
                      {institution.name}
                    </span>
                  </div>
                  <span className="block text-xs font-semibold text-[#c88a1e] tracking-wide">
                    {institution.nativeName || 'ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી'}
                  </span>
                  <span className="hidden sm:block text-[11px] text-slate-500 font-medium">
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
                          ? 'bg-[#092244] text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <ClipboardList className="w-3.5 h-3.5" />
                      Dashboard
                    </Link>

                    {role === 'admin' && (
                      <Link
                        to="/admin/analytics"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                          location.pathname === '/admin/analytics'
                            ? 'bg-[#092244] text-white'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      Executive Analytics
                    </Link>
                  )}

                    {role === 'student' && onOpenLodgeModal && (
                      <button
                        onClick={onOpenLodgeModal}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#092244] hover:bg-[#0e3259] text-white border border-[#c88a1e]/40 shadow-xs transition active:scale-95 ml-1"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#c88a1e]" />
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
                        {role === 'student' ? `PRN: ${user?.rollNumber}` : user?.department?.split(' ')[0]}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-md bg-[#092244] text-[#c88a1e] font-bold text-xs flex items-center justify-center border border-slate-700 shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <button
                      onClick={handleLogout}
                      className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                      title="Sign Out of GTU Portal"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 transition"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    GTU Single Sign-On (SSO)
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#092244] hover:bg-[#0e3259] border border-[#c88a1e]/40 rounded-lg shadow-xs transition"
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
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-white bg-[#092244]"
                    >
                      <Plus className="w-4 h-4 text-[#c88a1e]" />
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
                  GTU Single Sign-On (SSO)
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 rounded-lg text-white bg-[#092244] font-semibold text-xs"
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
