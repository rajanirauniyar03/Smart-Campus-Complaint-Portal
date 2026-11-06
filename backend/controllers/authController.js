const User = require('../models/User');
const Complaint = require('../models/Complaint');
const jwt = require('jsonwebtoken');

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'smart_campus_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a student
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, department, rollNumber, phone, hostelRoom } = req.body;

    if (!name || !email || !password || !department || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, password, department, and roll number',
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email address' });
    }

    // Check if student with roll number exists
    const rollExists = await User.findOne({ rollNumber: rollNumber.toUpperCase() });
    if (rollExists) {
      return res.status(400).json({ success: false, message: 'Roll number is already registered' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'student',
      department,
      rollNumber: rollNumber.toUpperCase(),
      phone: phone || '',
      hostelRoom: hostelRoom || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        phone: user.phone,
        hostelRoom: user.hostelRoom,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user (Student, Admin, or Staff)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact Administrator.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        phone: user.phone,
        hostelRoom: user.hostelRoom,
        specialization: user.specialization,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get list of all staff members (with workload count)
// @route   GET /api/auth/staff
// @access  Private (Admin, Staff)
exports.getStaffList = async (req, res, next) => {
  try {
    const staffMembers = await User.find({ role: 'staff', isActive: true }).select(
      'name email department phone specialization'
    );

    // Compute active workload for each staff
    const staffWithWorkload = await Promise.all(
      staffMembers.map(async (staff) => {
        const activeCount = await Complaint.countDocuments({
          assignedTo: staff._id,
          status: { $in: ['Assigned', 'In Progress'] },
        });
        const resolvedCount = await Complaint.countDocuments({
          assignedTo: staff._id,
          status: 'Resolved',
        });
        return {
          ...staff.toObject(),
          activeComplaintsCount: activeCount,
          resolvedComplaintsCount: resolvedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: staffWithWorkload.length,
      staff: staffWithWorkload,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin creates new staff account
// @route   POST /api/auth/staff
// @access  Private (Admin only)
exports.createStaffAccount = async (req, res, next) => {
  try {
    const { name, email, password, department, phone, specialization } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and department are required',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const staff = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'staff',
      department,
      phone: phone || '',
      specialization: specialization || department,
    });

    res.status(201).json({
      success: true,
      message: 'Staff account successfully created',
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        specialization: staff.specialization,
      },
    });
  } catch (err) {
    next(err);
  }
};
