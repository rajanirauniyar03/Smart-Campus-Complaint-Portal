export const CATEGORIES = [
  'Hostel & Accommodation',
  'Academic & Classroom',
  'IT & Wi-Fi Network',
  'Infrastructure & Electrical',
  'Sanitation & Hygiene',
  'Mess & Canteen',
  'Library & Sports',
  'Transportation & Parking',
  'Other Campus Services',
];

export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Information Technology',
  'Chemical Engineering',
  'Architecture & Planning',
  'Management Studies',
];

export const STATUSES = [
  'Pending',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Rejected',
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
