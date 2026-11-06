const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is strictly required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: 150,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Hostel & Accommodation',
        'Academic & Classroom',
        'IT & Wi-Fi Network',
        'Infrastructure & Electrical',
        'Sanitation & Hygiene',
        'Mess & Canteen',
        'Library & Sports',
        'Transportation & Parking',
        'Other Campus Services',
      ],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
    },
    location: {
      building: { type: String, default: '' },
      roomOrArea: { type: String, default: '' },
      landmark: { type: String, default: '' },
    },
    imageUrl: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
      index: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
    resolutionProofImage: {
      type: String,
      default: '',
    },
    timeline: [
      {
        status: { type: String, required: true },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        updatedByName: { type: String, default: 'System' },
        updatedByRole: { type: String, default: 'system' },
        note: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        senderName: { type: String, required: true },
        senderRole: { type: String, required: true },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-generate human-friendly complaintId before validation if not present
complaintSchema.pre('validate', async function () {
  if (!this.complaintId) {
    const dateStr = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    this.complaintId = `CMP-${dateStr}-${randomHex}`;
  }
});

module.exports = mongoose.model('Complaint', complaintSchema);
