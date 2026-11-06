const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintByAdmin,
  updateProgressByStaff,
  addComment,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All complaint routes are protected with JWT
router.use(protect);

router
  .route('/')
  .post(authorize('student'), upload.single('image'), createComplaint)
  .get(getComplaints);

router.route('/:id').get(getComplaintById);

// Admin-only actions
router.put('/:id/assign', authorize('admin'), assignComplaint);
router.put('/:id/status', authorize('admin'), updateComplaintByAdmin);

// Staff-only progress / resolution
router.put('/:id/staff-update', authorize('staff'), upload.single('proofImage'), updateProgressByStaff);

// Interactive comments on complaint
router.post('/:id/comments', addComment);

module.exports = router;
