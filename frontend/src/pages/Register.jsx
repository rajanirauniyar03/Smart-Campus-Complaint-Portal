import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBrand } from '../context/BrandContext';
import GtuEmblem from '../components/GtuEmblem';
import { DEPARTMENTS, GTU_INSTITUTES, GTU_ZONES } from '../utils/constants';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Hash,
  Building,
  Phone,
  Home,
  ArrowRight,
  AlertCircle,
  Shield,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: DEPARTMENTS[0],
    phone: '',
    hostelRoom: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { institution } = useBrand();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.rollNumber ||
      !formData.department ||
      !formData.password
    ) {
      setError('Please fill in all mandatory university enrollment fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password entries do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must meet the minimum 6 characters threshold');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({
        name: formData.name,
        email: formData.email,
        rollNumber: formData.rollNumber,
        department: formData.department,
        phone: formData.phone,
        hostelRoom: formData.hostelRoom,
        password: formData.password,
      });
      navigate('/student');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Enrollment verification failed. Ensure email and GTU enrollment number are not already registered.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* GTU Header Strip */}
        <div className="bg-[#092244] text-white p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <GtuEmblem className="w-12 h-12" />
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                GTU Student Portal Enrollment & PRN Verification
              </h2>
              <p className="text-xs text-[#c88a1e] font-medium">
                {institution.nativeName || 'ગુજરાત ટેકનોલોજીકલ યુનિવર્સિટી'} • Central SGRC
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-[#06182e] text-slate-300 border border-slate-700">
            {institution.academicSession}
          </span>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
            <span>
              <strong>GTU Statutory Verification Notice:</strong> In compliance with the Gujarat
              Technological University Act, 2007, every grievance filing requires authenticated student identification.
              Anonymous registration is strictly inadmissible under SGRC rules.
            </span>
          </div>

          {error && (
            <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Student Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Aarav Patel"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GTU Enrollment Number / PRN <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="rollNumber"
                    required
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. 230170116042"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244] uppercase font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Department / Discipline <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244] bg-white"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Campus / Student Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student.enrollment@gtu.ac.in"
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Affiliated Institute / Hostel Block
                </label>
                <div className="relative">
                  <Home className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    name="hostelRoom"
                    value={formData.hostelRoom}
                    onChange={handleChange}
                    placeholder="e.g. VGEC Hostel Block A - Rm 204 or Day Scholar"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Create Master Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#092244]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg bg-[#092244] hover:bg-[#0e3259] text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting Enrollment...' : 'Register GTU Student Account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
            Already registered with an active GTU account?{' '}
            <Link to="/login" className="font-semibold text-slate-900 hover:text-black underline underline-offset-2">
              Sign In to GTU SSO
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
