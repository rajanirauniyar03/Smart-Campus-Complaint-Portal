const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Helper to create notifications
const createNotification = async ({ recipient, sender, complaint, complaintIdStr, title, message, type }) => {
  try {
    if (!recipient) return;
    await Notification.create({
      recipient,
      sender: sender || null,
      complaint: complaint || null,
      complaintIdStr: complaintIdStr || '',
      title,
      message,
      type: type || 'general',
    });
  } catch (err) {
    console.error('Failed to dispatch notification:', err.message);
  }
};

// @desc    Submit a new complaint (Student)
// @route   POST /api/complaints
// @access  Private (Student only)
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, category, description, building, roomOrArea, landmark, priority } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Category, and detailed Description',
      });
    }

    // Determine image URL from file upload or body
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // Automatically bind the authenticated student's ID
    const complaint = new Complaint({
      student: req.user._id,
      title,
      category,
      description,
      location: {
        building: building || '',
        roomOrArea: roomOrArea || '',
        landmark: landmark || '',
      },
      imageUrl,
      priority: priority && ['Low', 'Medium', 'High', 'Urgent'].includes(priority) ? priority : 'Medium',
      status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          updatedBy: req.user._id,
          updatedByName: req.user.name,
          updatedByRole: req.user.role,
          note: 'Complaint registered and submitted into campus portal',
          timestamp: new Date(),
        },
      ],
    });

    await complaint.save();

    // Populate student info for response
    await complaint.populate('student', 'name rollNumber department email phone hostelRoom');

    // Notify all admins about new complaint
    const admins = await User.find({ role: 'admin', isActive: true });
    for (const admin of admins) {
      await createNotification({
        recipient: admin._id,
        sender: req.user._id,
        complaint: complaint._id,
        complaintIdStr: complaint.complaintId,
        title: `New Complaint: ${complaint.complaintId}`,
        message: `${req.user.name} (${req.user.rollNumber}, ${req.user.department}) submitted a new complaint under "${category}": ${title}`,
        type: 'general',
      });
    }

    // Confirmation notification to student
    await createNotification({
      recipient: req.user._id,
      complaint: complaint._id,
      complaintIdStr: complaint.complaintId,
      title: 'Complaint Lodged Successfully',
      message: `Your complaint #${complaint.complaintId} has been submitted and is currently pending review.`,
      type: 'general',
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complaints list with role-based scoping
//          - Student: gets own complaints
//          - Admin: gets all complaints
//          - Staff: gets complaints assigned to them
// @route   GET /api/complaints
// @access  Private (Student, Admin, Staff)
exports.getComplaints = async (req, res, next) => {
  try {
    const { status, category, priority, department, search, sort } = req.query;
    let query = {};

    // Role-based scoping
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'staff') {
      query.assignedTo = req.user._id;
    }
    // Admin sees all complaints by default

    // Filters
    if (status && status !== 'All') {
      query.status = status;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search filter across title, description, complaintId
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { complaintId: searchRegex },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'priority') {
      // Custom priority sort can be handled client-side or via aggregate
      sortOption = { createdAt: -1 };
    }

    let complaints = await Complaint.find(query)
      .populate('student', 'name rollNumber department email phone hostelRoom')
      .populate('assignedTo', 'name email department specialization phone')
      .populate('assignedBy', 'name email')
      .sort(sortOption);

    // If department filter is set for student's department in admin view
    if (department && department !== 'All') {
      complaints = complaints.filter(
        (c) => c.student && c.student.department && c.student.department.toLowerCase() === department.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single complaint detail by ID
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name rollNumber department email phone hostelRoom')
      .populate('assignedTo', 'name email department specialization phone')
      .populate('assignedBy', 'name email')
      .populate('timeline.updatedBy', 'name role')
      .populate('comments.sender', 'name role');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Authorization check: students can only view their own complaints
    if (req.user.role === 'student' && complaint.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this complaint' });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign complaint to staff member (Admin only)
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin only)
exports.assignComplaint = async (req, res, next) => {
  try {
    const { staffId, priority, adminNote } = req.body;

    if (!staffId) {
      return res.status(400).json({ success: false, message: 'Please specify staff member to assign' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const staffMember = await User.findOne({ _id: staffId, role: 'staff', isActive: true });
    if (!staffMember) {
      return res.status(400).json({ success: false, message: 'Invalid or inactive staff member selected' });
    }

    complaint.assignedTo = staffMember._id;
    complaint.assignedBy = req.user._id;
    complaint.assignedAt = new Date();
    complaint.status = 'Assigned';

    if (priority && ['Low', 'Medium', 'High', 'Urgent'].includes(priority)) {
      complaint.priority = priority;
    }

    const timelineNote = adminNote
      ? `Assigned to ${staffMember.name} (${staffMember.department}). Note: ${adminNote}`
      : `Assigned to staff officer ${staffMember.name} (${staffMember.department})`;

    complaint.timeline.push({
      status: 'Assigned',
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      updatedByRole: 'admin',
      note: timelineNote,
      timestamp: new Date(),
    });

    await complaint.save();
    await complaint.populate('student', 'name rollNumber department email phone');
    await complaint.populate('assignedTo', 'name email department phone');

    // Notify student
    await createNotification({
      recipient: complaint.student._id,
      sender: req.user._id,
      complaint: complaint._id,
      complaintIdStr: complaint.complaintId,
      title: 'Complaint Assigned to Staff',
      message: `Your complaint #${complaint.complaintId} has been assigned to ${staffMember.name} (${staffMember.department}).`,
      type: 'complaint_assigned',
    });

    // Notify assigned staff member
    await createNotification({
      recipient: staffMember._id,
      sender: req.user._id,
      complaint: complaint._id,
      complaintIdStr: complaint.complaintId,
      title: 'New Complaint Assigned to You',
      message: `Admin assigned complaint #${complaint.complaintId} ("${complaint.title}") to you. Priority: ${complaint.priority}`,
      type: 'complaint_assigned',
    });

    res.status(200).json({
      success: true,
      message: `Complaint successfully assigned to ${staffMember.name}`,
      complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update complaint priority or status (Admin only)
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin only)
exports.updateComplaintByAdmin = async (req, res, next) => {
  try {
    const { status, priority, adminNote } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    let statusChanged = false;
    let priorityChanged = false;

    if (priority && priority !== complaint.priority) {
      complaint.priority = priority;
      priorityChanged = true;
    }

    if (status && status !== complaint.status) {
      complaint.status = status;
      statusChanged = true;

      if (status === 'Resolved') {
        complaint.resolvedAt = new Date();
      }
    }

    let noteText = adminNote || '';
    if (!noteText) {
      if (statusChanged && priorityChanged) {
        noteText = `Status updated to "${status}" and priority changed to "${priority}"`;
      } else if (statusChanged) {
        noteText = `Status updated to "${status}" by Admin`;
      } else if (priorityChanged) {
        noteText = `Priority adjusted to "${priority}" by Admin`;
      }
    }

    complaint.timeline.push({
      status: complaint.status,
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      updatedByRole: 'admin',
      note: noteText,
      timestamp: new Date(),
    });

    await complaint.save();
    await complaint.populate('student', 'name rollNumber department email');
    await complaint.populate('assignedTo', 'name email department');

    // Notify student
    await createNotification({
      recipient: complaint.student._id,
      sender: req.user._id,
      complaint: complaint._id,
      complaintIdStr: complaint.complaintId,
      title: `Complaint #${complaint.complaintId} Updated`,
      message: noteText,
      type: 'status_change',
    });

    // If assigned to staff, notify staff as well
    if (complaint.assignedTo) {
      await createNotification({
        recipient: complaint.assignedTo._id,
        sender: req.user._id,
        complaint: complaint._id,
        complaintIdStr: complaint.complaintId,
        title: `Complaint #${complaint.complaintId} Status Changed by Admin`,
        message: noteText,
        type: 'status_change',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update progress and mark resolved/in-progress (Staff)
// @route   PUT /api/complaints/:id/staff-update
// @access  Private (Staff only)
exports.updateProgressByStaff = async (req, res, next) => {
  try {
    const { status, progressNote, resolutionNotes } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Ensure this complaint is assigned to this staff member (or staff has permission)
    if (complaint.assignedTo && complaint.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'This complaint is assigned to another staff member',
      });
    }

    // Handle optional resolution proof image
    if (req.file) {
      complaint.resolutionProofImage = `/uploads/${req.file.filename}`;
    }

    if (status && ['In Progress', 'Resolved', 'Rejected', 'Under Review'].includes(status)) {
      complaint.status = status;
    }

    if (resolutionNotes) {
      complaint.resolutionNotes = resolutionNotes;
    }

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }

    const note = progressNote || (status === 'Resolved' ? (resolutionNotes || 'Marked as resolved by assigned staff') : `Progress update: ${status}`);

    complaint.timeline.push({
      status: complaint.status,
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      updatedByRole: 'staff',
      note: note,
      timestamp: new Date(),
    });

    await complaint.save();
    await complaint.populate('student', 'name rollNumber department email');
    await complaint.populate('assignedTo', 'name email department');

    // Notify Student
    await createNotification({
      recipient: complaint.student._id,
      sender: req.user._id,
      complaint: complaint._id,
      complaintIdStr: complaint.complaintId,
      title: status === 'Resolved' ? `Complaint #${complaint.complaintId} Resolved!` : `Complaint Update: ${status}`,
      message: `${req.user.name} (${req.user.department}): ${note}`,
      type: status === 'Resolved' ? 'status_change' : 'general',
    });

    // Notify Admin
    if (complaint.assignedBy) {
      await createNotification({
        recipient: complaint.assignedBy,
        sender: req.user._id,
        complaint: complaint._id,
        complaintIdStr: complaint.complaintId,
        title: `Staff Update on #${complaint.complaintId}`,
        message: `${req.user.name} marked complaint #${complaint.complaintId} as "${complaint.status}". Notes: ${note}`,
        type: 'status_change',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Post a comment / activity message in complaint thread
// @route   POST /api/complaints/:id/comments
// @access  Private (Student, Staff, Admin)
exports.addComment = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Role check: students can only comment on their own complaints
    if (req.user.role === 'student' && complaint.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const comment = {
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: message.trim(),
      createdAt: new Date(),
    };

    complaint.comments.push(comment);
    await complaint.save();

    // If sender is student, notify assigned staff & admin
    if (req.user.role === 'student') {
      if (complaint.assignedTo) {
        await createNotification({
          recipient: complaint.assignedTo,
          sender: req.user._id,
          complaint: complaint._id,
          complaintIdStr: complaint.complaintId,
          title: `New Comment on #${complaint.complaintId}`,
          message: `${req.user.name}: "${message.trim().substring(0, 80)}"`,
          type: 'comment_added',
        });
      }
    } else {
      // If sender is staff or admin, notify student
      await createNotification({
        recipient: complaint.student,
        sender: req.user._id,
        complaint: complaint._id,
        complaintIdStr: complaint.complaintId,
        title: `Response on Complaint #${complaint.complaintId}`,
        message: `${req.user.name} (${req.user.role}): "${message.trim().substring(0, 80)}"`,
        type: 'comment_added',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment posted',
      comment,
      comments: complaint.comments,
    });
  } catch (err) {
    next(err);
  }
};
