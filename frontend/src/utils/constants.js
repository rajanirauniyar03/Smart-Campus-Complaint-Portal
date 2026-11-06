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
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Biomedical Engineering',
  'Instrumentation & Control Engineering',
  'Architecture & Planning',
  'Management Studies (MBA)',
  'Computer Applications (MCA)',
  'Pharmaceutical Sciences',
];

export const GTU_ZONES = [
  'Zone 1 - Ahmedabad Zone',
  'Zone 2 - Gandhinagar Zone',
  'Zone 3 - Vallabh Vidyanagar Zone',
  'Zone 4 - Rajkot Zone',
  'Zone 5 - Surat Zone',
];

export const GTU_INSTITUTES = [
  '017 - Vishwakarma Government Engineering College (VGEC), Chandkheda',
  '028 - L.D. College of Engineering (LDCE), Ahmedabad',
  '013 - Government Engineering College (GEC), Gandhinagar',
  '020 - Government Engineering College (GEC), Rajkot',
  '023 - Government Engineering College (GEC), Surat',
  '042 - Sarvajanik College of Engineering & Technology (SCET), Surat',
  '007 - Birla Vishvakarma Mahavidyalaya (BVM), V.V. Nagar',
  '011 - G.H. Patel College of Engineering & Technology (GCET), V.V. Nagar',
  '067 - SAL Institute of Technology & Engineering Research, Ahmedabad',
  'GTU Graduate School of Engineering & Technology (GSET), Chandkheda Campus',
  'GTU School of Applied Sciences & Technology (SAST), Ahmedabad',
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
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');
