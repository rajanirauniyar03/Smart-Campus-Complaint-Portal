const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get comprehensive analytics & metrics for Admin Dashboard
// @route   GET /api/analytics
// @access  Private (Admin only)
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingCount = await Complaint.countDocuments({ status: 'Pending' });
    const underReviewCount = await Complaint.countDocuments({ status: 'Under Review' });
    const assignedCount = await Complaint.countDocuments({ status: 'Assigned' });
    const inProgressCount = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedCount = await Complaint.countDocuments({ status: 'Resolved' });
    const rejectedCount = await Complaint.countDocuments({ status: 'Rejected' });

    // Priority counts
    const urgentCount = await Complaint.countDocuments({ priority: 'Urgent' });
    const highCount = await Complaint.countDocuments({ priority: 'High' });
    const mediumCount = await Complaint.countDocuments({ priority: 'Medium' });
    const lowCount = await Complaint.countDocuments({ priority: 'Low' });

    // Resolution Rate
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0;

    // Category breakdown
    const categoryAgg = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const categoryBreakdown = categoryAgg.map((item) => ({
      category: item._id,
      count: item.count,
      percentage: totalComplaints > 0 ? Math.round((item.count / totalComplaints) * 100) : 0,
    }));

    // Status breakdown array for charts
    const statusBreakdown = [
      { status: 'Pending', count: pendingCount, color: '#f59e0b' },
      { status: 'Under Review', count: underReviewCount, color: '#6366f1' },
      { status: 'Assigned', count: assignedCount, color: '#3b82f6' },
      { status: 'In Progress', count: inProgressCount, color: '#8b5cf6' },
      { status: 'Resolved', count: resolvedCount, color: '#10b981' },
      { status: 'Rejected', count: rejectedCount, color: '#ef4444' },
    ];

    // Priority breakdown array
    const priorityBreakdown = [
      { priority: 'Urgent', count: urgentCount, color: '#dc2626' },
      { priority: 'High', count: highCount, color: '#f97316' },
      { priority: 'Medium', count: mediumCount, color: '#eab308' },
      { priority: 'Low', count: lowCount, color: '#10b981' },
    ];

    // Department breakdown by student's department
    const departmentAgg = await Complaint.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },
      { $unwind: '$studentInfo' },
      {
        $group: {
          _id: '$studentInfo.department',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    const departmentBreakdown = departmentAgg.map((d) => ({
      department: d._id || 'Unknown',
      count: d.count,
    }));

    // Average resolution time (hours) for resolved complaints
    const resolvedComplaints = await Complaint.find({
      status: 'Resolved',
      resolvedAt: { $ne: null },
    }).select('createdAt resolvedAt');

    let avgResolutionHours = 0;
    if (resolvedComplaints.length > 0) {
      const totalHours = resolvedComplaints.reduce((acc, c) => {
        const diffMs = new Date(c.resolvedAt) - new Date(c.createdAt);
        return acc + diffMs / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = Math.round((totalHours / resolvedComplaints.length) * 10) / 10;
    }

    // Recent 5 complaints for live dashboard table
    const recentComplaints = await Complaint.find()
      .populate('student', 'name rollNumber department')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    // Active staff workload
    const staffMembers = await User.find({ role: 'staff', isActive: true }).select('name department specialization');
    const staffStats = await Promise.all(
      staffMembers.map(async (st) => {
        const active = await Complaint.countDocuments({
          assignedTo: st._id,
          status: { $in: ['Assigned', 'In Progress'] },
        });
        const resolved = await Complaint.countDocuments({
          assignedTo: st._id,
          status: 'Resolved',
        });
        return {
          id: st._id,
          name: st.name,
          department: st.department,
          specialization: st.specialization,
          activeWorkload: active,
          resolvedTotal: resolved,
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        totalComplaints,
        pendingCount,
        underReviewCount,
        assignedCount,
        inProgressCount,
        resolvedCount,
        rejectedCount,
        urgentCount,
        highCount,
        resolutionRate,
        avgResolutionHours,
      },
      statusBreakdown,
      priorityBreakdown,
      categoryBreakdown,
      departmentBreakdown,
      staffStats,
      recentComplaints,
    });
  } catch (err) {
    next(err);
  }
};
