import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { BrandProvider, useBrand } from './context/BrandContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LodgeComplaintModal from './components/LodgeComplaintModal';
import InstitutionalSandboxModal from './components/InstitutionalSandboxModal';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ComplaintDetail from './pages/ComplaintDetail';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFound from './pages/NotFound';

import { Shield, Server, ExternalLink } from 'lucide-react';

function AppContent() {
  const { role } = useAuth();
  const { institution } = useBrand();
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Official University Header */}
      <Navbar
        onOpenLodgeModal={role === 'student' ? () => setIsLodgeModalOpen(true) : null}
      />

      {/* Main Content Workspace */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Route */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Staff Protected Route */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Complaint Detail View */}
          <Route
            path="/complaints/:id"
            element={
              <ProtectedRoute>
                <ComplaintDetail />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Institutional Enterprise Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-700" />
            <p>
              © {new Date().getFullYear()} {institution.name} • Central Student Grievance Redressal System (C-SGRS)
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Statutory Regulations 2023 Compliant</span>
            <span>•</span>
            {/* Discreet evaluation sandbox button for demonstrations and testing without public banner clutter */}
            <button
              onClick={() => setIsSandboxModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold underline underline-offset-2 transition"
              title="Open evaluation test credentials modal"
            >
              <Server className="w-3 h-3 text-slate-400" />
              <span>Institutional Sandbox Access</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Global Lodge Grievance Modal for Student */}
      {role === 'student' && (
        <LodgeComplaintModal
          isOpen={isLodgeModalOpen}
          onClose={() => setIsLodgeModalOpen(false)}
          onCreated={(newComplaint) => {
            window.location.reload();
          }}
        />
      )}

      {/* Institutional Sandbox Modal for evaluators/buyers */}
      <InstitutionalSandboxModal
        isOpen={isSandboxModalOpen}
        onClose={() => setIsSandboxModalOpen(false)}
        onResetSuccess={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <BrandProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </BrandProvider>
    </Router>
  );
}
