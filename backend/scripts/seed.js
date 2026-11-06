const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const { connectDB } = require('../config/db');

const seedData = async () => {
  try {
    console.log('Seeding Smart Campus Complaint Portal database...');

    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await Notification.deleteMany({});

    // 1. Create Admin
    const admin = await User.create({
      name: 'Dr. Ramesh Narayan',
      email: 'admin@campus.edu',
      password: 'Admin@123',
      role: 'admin',
      department: 'Dean of Student Affairs',
      rollNumber: 'ADM-001',
      phone: '+91 98765 00001',
    });

    // 2. Create Staff Members
    const staffIT = await User.create({
      name: 'Rajesh Kumar',
      email: 'staff.it@campus.edu',
      password: 'Staff@123',
      role: 'staff',
      department: 'IT & Network Services',
      specialization: 'Campus Wi-Fi, LAN & IT Infrastructure',
      phone: '+91 98765 11001',
    });

    const staffHostel = await User.create({
      name: 'Anita Sharma',
      email: 'staff.hostel@campus.edu',
      password: 'Staff@123',
      role: 'staff',
      department: 'Hostel Administration',
      specialization: 'Hostel Maintenance & Facilities',
      phone: '+91 98765 11002',
    });

    const staffEstate = await User.create({
      name: 'Suresh Patel',
      email: 'staff.estate@campus.edu',
      password: 'Staff@123',
      role: 'staff',
      department: 'Campus Maintenance & Estate',
      specialization: 'Electrical & Sanitation Works',
      phone: '+91 98765 11003',
    });

    // 3. Create Students
    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'student.aarav@campus.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Computer Science & Engineering',
      rollNumber: '2023CS0142',
      phone: '+91 98765 43210',
      hostelRoom: 'Block A - Room 204',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'student.priya@campus.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Electrical Engineering',
      rollNumber: '2023EE0089',
      phone: '+91 98765 43211',
      hostelRoom: 'Girls Hostel 2 - Room 112',
    });

    const student3 = await User.create({
      name: 'Rohit Verma',
      email: 'student.rohit@campus.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Mechanical Engineering',
      rollNumber: '2022ME0033',
      phone: '+91 98765 43212',
      hostelRoom: 'Day Scholar',
    });

    // 4. Create Complaints
    const complaint1 = await Complaint.create({
      complaintId: 'CMP-2026-1011',
      student: student1._id,
      title: 'Campus Wi-Fi router down on 2nd Floor, Academic Block 3',
      category: 'IT & Wi-Fi Network',
      description:
        'The Wi-Fi access point near Computer Lab 4 has been dropping connections every 5 minutes since yesterday morning. Multiple project teams are unable to connect to the campus network.',
      location: {
        building: 'Academic Block 3',
        roomOrArea: 'Floor 2, near Lab 4',
        landmark: 'Near Water Cooler',
      },
      priority: 'High',
      status: 'In Progress',
      assignedTo: staffIT._id,
      assignedBy: admin._id,
      assignedAt: new Date(Date.now() - 36 * 3600 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student1._id,
          updatedByName: student1.name,
          updatedByRole: 'student',
          note: 'Complaint registered by student',
          timestamp: new Date(Date.now() - 48 * 3600 * 1000),
        },
        {
          status: 'Assigned',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          note: `Assigned to ${staffIT.name} (${staffIT.department})`,
          timestamp: new Date(Date.now() - 36 * 3600 * 1000),
        },
        {
          status: 'In Progress',
          updatedBy: staffIT._id,
          updatedByName: staffIT.name,
          updatedByRole: 'staff',
          note: 'Network engineer inspected switch port. Replacing optical transceiver unit.',
          timestamp: new Date(Date.now() - 12 * 3600 * 1000),
        },
      ],
      comments: [
        {
          sender: staffIT._id,
          senderName: staffIT.name,
          senderRole: 'staff',
          message: 'Diagnostics showed packet drops on Switch 2 Port 8. New transceiver ordered and arriving today.',
          createdAt: new Date(Date.now() - 10 * 3600 * 1000),
        },
        {
          sender: student1._id,
          senderName: student1.name,
          senderRole: 'student',
          message: 'Thank you Rajesh sir for looking into it promptly!',
          createdAt: new Date(Date.now() - 8 * 3600 * 1000),
        },
      ],
    });

    const complaint2 = await Complaint.create({
      complaintId: 'CMP-2026-1012',
      student: student1._id,
      title: 'Severe water pipe leakage in Block A washroom',
      category: 'Hostel & Accommodation',
      description:
        'Main water inlet valve under the third washbasin is leaking heavily. Water is flooding into the main hallway and creating an electrical and slip hazard.',
      location: {
        building: 'Hostel Block A',
        roomOrArea: 'Floor 2 Washroom',
        landmark: 'Adjacent to staircase',
      },
      priority: 'Urgent',
      status: 'Assigned',
      assignedTo: staffHostel._id,
      assignedBy: admin._id,
      assignedAt: new Date(Date.now() - 6 * 3600 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student1._id,
          updatedByName: student1.name,
          updatedByRole: 'student',
          note: 'Urgent complaint submitted',
          timestamp: new Date(Date.now() - 8 * 3600 * 1000),
        },
        {
          status: 'Assigned',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          note: `High-priority dispatch to ${staffHostel.name}`,
          timestamp: new Date(Date.now() - 6 * 3600 * 1000),
        },
      ],
    });

    const complaint3 = await Complaint.create({
      complaintId: 'CMP-2026-1013',
      student: student2._id,
      title: 'Seminar Hall B ceiling projector flickering and audio jack faulty',
      category: 'Academic & Classroom',
      description:
        'During guest lectures and student seminars, the ceiling-mounted projector screen blinks black every few minutes. The podium 3.5mm audio jack also produces loud static.',
      location: {
        building: 'Main Administrative Block',
        roomOrArea: 'Seminar Hall B, 1st Floor',
        landmark: 'Opposite Board Room',
      },
      priority: 'Medium',
      status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          updatedBy: student2._id,
          updatedByName: student2.name,
          updatedByRole: 'student',
          note: 'Submitted by student Priya Patel',
          timestamp: new Date(Date.now() - 18 * 3600 * 1000),
        },
      ],
    });

    const complaint4 = await Complaint.create({
      complaintId: 'CMP-2026-1014',
      student: student3._id,
      title: 'Waste collection bins overflowing near Central Canteen courtyard',
      category: 'Sanitation & Hygiene',
      description:
        'Waste bins have not been cleared for over 36 hours. Stray animals are scattering food packaging across the walkway leading to the library.',
      location: {
        building: 'Central Canteen Complex',
        roomOrArea: 'North Courtyard',
        landmark: 'Near outdoor seating zone',
      },
      priority: 'High',
      status: 'Resolved',
      assignedTo: staffEstate._id,
      assignedBy: admin._id,
      assignedAt: new Date(Date.now() - 30 * 3600 * 1000),
      resolvedAt: new Date(Date.now() - 4 * 3600 * 1000),
      resolutionNotes:
        'Sanitation crew thoroughly cleared all accumulated waste, deep cleaned the paved walkway, and installed two additional 240L covered dual-bin units.',
      timeline: [
        {
          status: 'Pending',
          updatedBy: student3._id,
          updatedByName: student3.name,
          updatedByRole: 'student',
          note: 'Lodge sanitation complaint',
          timestamp: new Date(Date.now() - 32 * 3600 * 1000),
        },
        {
          status: 'Assigned',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          note: `Assigned to ${staffEstate.name}`,
          timestamp: new Date(Date.now() - 30 * 3600 * 1000),
        },
        {
          status: 'In Progress',
          updatedBy: staffEstate._id,
          updatedByName: staffEstate.name,
          updatedByRole: 'staff',
          note: 'Estate sanitation team mobilized with waste transport',
          timestamp: new Date(Date.now() - 14 * 3600 * 1000),
        },
        {
          status: 'Resolved',
          updatedBy: staffEstate._id,
          updatedByName: staffEstate.name,
          updatedByRole: 'staff',
          note: 'Sanitation completed and extra bins deployed',
          timestamp: new Date(Date.now() - 4 * 3600 * 1000),
        },
      ],
    });

    const complaint5 = await Complaint.create({
      complaintId: 'CMP-2026-1015',
      student: student2._id,
      title: 'Commercial RO water cooler filter error in Girls Hostel 2 Mess',
      category: 'Mess & Canteen',
      description:
        'The main drinking water cooler is displaying an error code and the water is slightly discolored. Students need urgent filter maintenance or drinking water cans.',
      location: {
        building: 'Girls Hostel 2',
        roomOrArea: 'Dining Hall, Ground Floor',
        landmark: 'Near tray return counter',
      },
      priority: 'Urgent',
      status: 'Pending',
      timeline: [
        {
          status: 'Pending',
          updatedBy: student2._id,
          updatedByName: student2.name,
          updatedByRole: 'student',
          note: 'Reported by Priya Patel',
          timestamp: new Date(Date.now() - 2 * 3600 * 1000),
        },
      ],
    });

    const complaint6 = await Complaint.create({
      complaintId: 'CMP-2026-1016',
      student: student3._id,
      title: 'Solar pathway lights malfunctioning along Library West Walkway',
      category: 'Infrastructure & Electrical',
      description:
        'Three consecutive pole lamps are completely dark after 7:30 PM, making the pathway between the Library and the Mechanical workshops pitch black.',
      location: {
        building: 'Campus Perimeter Walkway',
        roomOrArea: 'West Walkway, Poles #12-14',
        landmark: 'Between Central Library and Workshop 2',
      },
      priority: 'Medium',
      status: 'In Progress',
      assignedTo: staffEstate._id,
      assignedBy: admin._id,
      assignedAt: new Date(Date.now() - 20 * 3600 * 1000),
      timeline: [
        {
          status: 'Pending',
          updatedBy: student3._id,
          updatedByName: student3.name,
          updatedByRole: 'student',
          note: 'Complaint registered',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000),
        },
        {
          status: 'Assigned',
          updatedBy: admin._id,
          updatedByName: admin.name,
          updatedByRole: 'admin',
          note: `Assigned to ${staffEstate.name}`,
          timestamp: new Date(Date.now() - 20 * 3600 * 1000),
        },
        {
          status: 'In Progress',
          updatedBy: staffEstate._id,
          updatedByName: staffEstate.name,
          updatedByRole: 'staff',
          note: 'Electrician checked wiring; solar battery pack replaced. Final night test pending.',
          timestamp: new Date(Date.now() - 5 * 3600 * 1000),
        },
      ],
    });

    // 5. Create Notifications
    await Notification.create([
      {
        recipient: student1._id,
        sender: staffIT._id,
        complaint: complaint1._id,
        complaintIdStr: complaint1.complaintId,
        title: 'Status Update: In Progress',
        message: 'Rajesh Kumar: Network engineer inspected switch port. Replacing optical transceiver unit.',
        type: 'status_change',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000),
      },
      {
        recipient: student1._id,
        sender: admin._id,
        complaint: complaint2._id,
        complaintIdStr: complaint2.complaintId,
        title: 'Complaint Assigned to Staff',
        message: 'Your urgent complaint #CMP-2026-1012 has been assigned to Anita Sharma (Hostel Administration).',
        type: 'complaint_assigned',
        createdAt: new Date(Date.now() - 6 * 3600 * 1000),
      },
      {
        recipient: student3._id,
        sender: staffEstate._id,
        complaint: complaint4._id,
        complaintIdStr: complaint4.complaintId,
        title: 'Complaint #CMP-2026-1014 Resolved!',
        message: 'Sanitation squad completed cleaning and deployed two extra high-capacity bins.',
        type: 'status_change',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000),
      },
      {
        recipient: admin._id,
        sender: student2._id,
        complaint: complaint5._id,
        complaintIdStr: complaint5.complaintId,
        title: 'New Urgent Complaint Lodged',
        message: 'Priya Patel (2023EE0089) reported an Urgent Mess & Canteen issue: Water cooler filter error.',
        type: 'general',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000),
      },
      {
        recipient: staffIT._id,
        sender: admin._id,
        complaint: complaint1._id,
        complaintIdStr: complaint1.complaintId,
        title: 'Complaint Assigned to You',
        message: 'Admin assigned complaint #CMP-2026-1011 to you. Priority: High',
        type: 'complaint_assigned',
        createdAt: new Date(Date.now() - 36 * 3600 * 1000),
      },
    ]);

    console.log('Database seeded successfully with Demo Users, Complaints, and Notifications!');
    return true;
  } catch (err) {
    console.error('Seeding error:', err);
    return false;
  }
};

// If run directly via node scripts/seed.js
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedData();
    process.exit(0);
  })();
}

module.exports = seedData;
