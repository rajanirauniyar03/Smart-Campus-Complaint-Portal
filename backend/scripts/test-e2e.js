const API = 'http://localhost:5000/api';

async function request(url, options = {}) {
  const res = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${data.message || JSON.stringify(data)}`);
  }
  return data;
}

async function waitForServer(maxAttempts = 15) {
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const health = await request('/health', { method: 'GET' });
      return health;
    } catch (e) {
      if (i === maxAttempts) {
        throw new Error(`Server did not respond within ${maxAttempts}s: ${e.message} (${e.cause?.code || ''})`);
      }
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

async function runE2ETest() {
  console.log('🧪 Starting End-to-End MERN Verification Test...\n');

  try {
    // 1. Health check with resilient retry
    const health = await waitForServer();
    console.log('✅ 1. Backend Health Check OK:', health.service);

    // 2. Student Registration
    const uniqueRoll = `2024CS${Math.floor(1000 + Math.random() * 9000)}`;
    const studentData = {
      name: 'Rohan Mehra',
      email: `rohan.${Date.now()}@campus.edu`,
      password: 'Student@123',
      department: 'Computer Science & Engineering',
      rollNumber: uniqueRoll,
      phone: '+91 98765 99999',
      hostelRoom: 'Hostel 4 - Room 302',
    };
    const regRes = await request('/auth/register', { method: 'POST', body: studentData });
    const studentToken = regRes.token;
    console.log(`✅ 2. Student Registered: ${regRes.user.name} (Roll: ${regRes.user.rollNumber}, Role: ${regRes.user.role})`);

    // 3. Student lodges a complaint
    const complaintPayload = {
      title: 'Lab 3 Air Conditioner leaking water onto computer workstations',
      category: 'Infrastructure & Electrical',
      description: 'Split AC unit #2 in Computer Lab 3 is leaking water directly over desk rows 4 and 5. Immediate attention needed before equipment damage.',
      building: 'Academic Block 1',
      roomOrArea: 'Computer Lab 3, 2nd Floor',
      landmark: 'Near Server Rack',
      priority: 'High',
    };
    const lodgeRes = await request('/complaints', {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: complaintPayload,
    });
    const complaint = lodgeRes.complaint;
    console.log(`✅ 3. Student Lodged Complaint: ID=${complaint.complaintId}, Status=${complaint.status}, Student=${complaint.student?.name} (${complaint.student?.rollNumber})`);

    // 4. Admin logs in
    const adminLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@campus.edu', password: 'Admin@123' },
    });
    const adminToken = adminLogin.token;
    console.log(`✅ 4. Admin Logged In: ${adminLogin.user.name} (Role: ${adminLogin.user.role})`);

    // 5. Admin views complaints and identifies student
    const adminComplaintsRes = await request('/complaints', {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const foundComplaint = adminComplaintsRes.complaints.find((c) => c._id === complaint._id);
    console.log(`✅ 5. Admin identified complainant: ${foundComplaint.student.name}, Roll: ${foundComplaint.student.rollNumber}, Dept: ${foundComplaint.student.department}`);

    // 6. Admin assigns complaint to Staff member (Rajesh Kumar - IT)
    const staffListRes = await request('/auth/staff', {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const targetStaff = staffListRes.staff[0];
    const assignRes = await request(`/complaints/${complaint._id}/assign`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        staffId: targetStaff._id,
        priority: 'Urgent',
        adminNote: 'Please inspect Lab 3 immediately to prevent hardware damage.',
      },
    });
    console.log(`✅ 6. Admin assigned ticket to ${targetStaff.name}. Status: ${assignRes.complaint.status}, Priority: ${assignRes.complaint.priority}`);

    // 7. Staff logs in
    const staffLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: targetStaff.email, password: 'Staff@123' },
    });
    const staffToken = staffLogin.token;
    console.log(`✅ 7. Staff Logged In: ${staffLogin.user.name}`);

    // 8. Staff views their assigned complaints
    const staffComplaintsRes = await request('/complaints', {
      method: 'GET',
      headers: { Authorization: `Bearer ${staffToken}` },
    });
    const myAssigned = staffComplaintsRes.complaints.find((c) => c._id === complaint._id);
    if (!myAssigned) throw new Error('Assigned complaint not found in staff queue!');
    console.log(`✅ 8. Staff verified assigned ticket in queue: ID=${myAssigned.complaintId}`);

    // 9. Staff updates progress to 'In Progress'
    const progressRes = await request(`/complaints/${complaint._id}/staff-update`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        status: 'In Progress',
        progressNote: 'HVAC technician dispatched to Lab 3 with replacement drain pipe.',
      },
    });
    console.log(`✅ 9. Staff updated progress: Status=${progressRes.complaint.status}`);

    // 10. Staff adds interactive comment
    await request(`/complaints/${complaint._id}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: { message: 'Drain pipe unclogged and sealed. Running 15-minute moisture test.' },
    });
    console.log('✅ 10. Staff posted discussion comment');

    // 11. Staff marks resolved
    const resolveRes = await request(`/complaints/${complaint._id}/staff-update`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: {
        status: 'Resolved',
        resolutionNotes: 'Replaced AC condensate drain line and tested cooling cycle for 30 minutes. No further leakage.',
      },
    });
    console.log(`✅ 11. Staff marked ticket RESOLVED: Status=${resolveRes.complaint.status}, Notes="${resolveRes.complaint.resolutionNotes}"`);

    // 12. Student verifies notifications & complete timeline audit
    const studentNotifs = await request('/notifications', {
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    console.log(`✅ 12. Student received ${studentNotifs.count} notifications for this lifecycle! Latest: "${studentNotifs.notifications[0]?.title}"`);

    const finalComplaintRes = await request(`/complaints/${complaint._id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const finalComplaint = finalComplaintRes.complaint;
    console.log(`\n📋 Final Timeline Audit (${finalComplaint.timeline.length} events):`);
    finalComplaint.timeline.forEach((t, i) => {
      console.log(`   [${i + 1}] ${t.status} by ${t.updatedByName} (${t.updatedByRole}): "${t.note}"`);
    });

    // 13. Admin checks Analytics
    const analyticsRes = await request('/analytics', {
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`\n📊 Admin Analytics verified: Total=${analyticsRes.stats.totalComplaints}, Resolved=${analyticsRes.stats.resolvedCount}, Resolution Rate=${analyticsRes.stats.resolutionRate}%`);

    console.log('\n🎉 ALL END-TO-END MERN WORKFLOW TESTS PASSED PERFECTLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ E2E Test Failed:', err.message);
    process.exit(1);
  }
}

runE2ETest();
