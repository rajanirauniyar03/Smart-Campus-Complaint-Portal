# University Central Grievance Redressal Mechanism & ERP (C-SGRS)

A multi-tenant, enterprise-grade Higher Education Grievance Redressal System built on the **MERN Stack** (React 19, Node.js, Express, MongoDB) designed in full compliance with the **UGC (Grievance Redressal of Students) Regulations, 2023** and **AICTE Student Grievance Redressal Committee (SGRC)** standards.

---

## 🏛️ Enterprise Design & Institutional SaaS Architecture

This platform has been engineered as a **white-label SaaS product** suitable for national institutes of technology (NITs), state technological universities, autonomous engineering colleges, and central universities.

### 🌟 Key Transformations & Redesign Highlights

| Area | Production Institutional Design |
| :--- | :--- |
| **Color System** | Deep Oxford Navy (`#0b1f3a`), Academic Slate (`#f8fafc`), crisp White, and institutional muted Blue accents. Zero flashy gradients or hackathon-style neon styling. |
| **Public UI** | Public-facing UI is 100% clean and professional. The demo banner has been removed from the public viewport and replaced with a discreet **Institutional Sandbox & Evaluation Modal** accessible in testing mode. |
| **Institutional Homepage** | Authoritative university portal homepage featuring statutory notices, circular tickers, an interactive 4-stage redressal lifecycle diagram, official grievance search by docket reference ID, and committee hierarchy. |
| **SaaS White-Labeling** | Real-time **Institutional Branding Engine** (`BrandContext.jsx`). Switch in 1 click between pre-configured university templates (e.g. *National Institute of Technology*, *Apex Institute of Engineering*, *State Central University*) or configure institution name, seal, academic session, accreditation, address, and support desk numbers on the fly! |
| **Administrative Terminal** | Data-dense, ERP-style dashboard (inspired by Acadex & university management software) with SLA compliance monitoring, pending review cases, departmental workload breakdown, and staff allocation. |
| **Complainant Verification** | **Strictly no anonymous submissions.** Every complaint docket automatically records the student's legal name, permanent registration number (PRN/Roll No), academic department, campus hostel, and verified email. |
| **Staff Work Order Desk** | Actionable field queue displaying complainant contact info, location specifics, work order logs, and photographic completion verification. |

---

## 👥 Three-Tier Governance Model

```
Central Grievance Redressal Mechanism (C-SGRS)
├── Tier 1: Student Complainant Desk (Lodge dockets, attach evidence, track real-time audit trail)
├── Tier 2: Dean & SGRC Administrative Directorate (Scrutinize, allocate cell officers, adjust priority, audit SLA)
└── Tier 3: Operational Cells & Field Staff (On-site inspection, technician progress logs, resolution report)
```

---

## 🔑 Pre-Seeded Institutional Personas (Evaluation Sandbox)

To evaluate all three tiers, open the **"Institutional Sandbox Access"** in the footer or authenticate with:

| Role | Officer / Student Name | Institutional Email | Password | Designation / Department |
| :--- | :--- | :--- | :--- | :--- |
| **Dean / Admin** | Dr. Ramesh Narayan | `admin@campus.edu` | `Admin@123` | Dean of Student Affairs / SGRC Secretariat |
| **Staff (IT)** | Rajesh Kumar | `staff.it@campus.edu` | `Staff@123` | Senior Systems & Network Engineer |
| **Staff (Hostel)** | Anita Sharma | `staff.hostel@campus.edu` | `Staff@123` | Hostel Administration & Estate Officer |
| **Staff (Estate)** | Suresh Patel | `staff.estate@campus.edu` | `Staff@123` | Campus Maintenance & Electrical Works |
| **Student** | Aarav Sharma | `student.aarav@campus.edu` | `Student@123` | Roll: `2023CS0142` (CSE, 3rd Year) |
| **Student** | Priya Patel | `student.priya@campus.edu` | `Student@123` | Roll: `2023EE0089` (EE, 2nd Year) |
| **Student** | Rohit Verma | `student.rohit@campus.edu` | `Student@123` | Roll: `2022ME0033` (ME, 4th Year) |

---

## 🚀 Quick Launch

### Windows One-Click Launch
Double-click `start-all.bat` or run:
```powershell
.\start-all.ps1
```
- **Frontend Portal:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

### Automated E2E Verification Suite
With the backend running, execute:
```bash
cd backend
node scripts/test-e2e.js
```
Verifies all 13 end-to-end institutional workflow checkpoints (registration, authenticated filing, admin scrutiny, cell officer dispatch, progress notes, formal resolution, student notifications, and SLA analytics).
