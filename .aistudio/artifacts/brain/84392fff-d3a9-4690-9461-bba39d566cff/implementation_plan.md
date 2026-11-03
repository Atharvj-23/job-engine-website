# Application Deadline Tracking & PDF Document Export

Enhance JobEngine by adding application deadline tracking with live countdowns across job cards and detail views, plus an executive PDF export engine for job descriptions and candidate application receipts.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your preferences, we are implementing:
> 1. **Relative Countdown & Date**: Displaying smart countdowns (e.g., `5 days left · Closes Nov 15`) with subtle urgency indicators when roles expire in $\le 3$ days.
> 2. **Executive PDF Export Engine**: Offering an in-app formatted printable document generator with dedicated clean print stylesheet (`@media print`) and interactive preview modal that allows direct 1-click printing or PDF saving.
> 3. **Comprehensive Application Summary**: Exporting full submission receipts including role specs, applicant credentials, submission timestamp, pipeline status, and ATS score insights.

---

## 1. Overview & Core Concept

- **What It Does**: 
  - Allows employers to set an explicit application closing date when posting jobs.
  - Provides job seekers with real-time countdowns (`3 days left`, `Closes Today`, `Closes Dec 01`) so they know when to apply before positions close.
  - Enables job seekers and candidates to export any verified job description or submitted application receipt as a cleanly styled, executive PDF document ready for printing, offline review, or expense/application records.
- **Target Audience**: Job seekers tracking application milestones, and employers managing time-sensitive hiring rounds.
- **Key Value**: Eliminates guesswork around hiring cycles, creates urgency for open positions, and gives candidates tangible documentation of their application records.

---

## 2. User Experience & Visual Design

### A. Key User Flows
1. **Posting a Role with a Deadline**:
   - In the "Post a Job" form, employers select an Application Deadline using a calendar picker or quick preset buttons (`+7 Days`, `+14 Days`, `+30 Days`, `No Expiry`).
   - The deadline is validated and saved directly into the job record.
2. **Browsing Roles with Live Countdowns**:
   - Each job card in the feed displays a clock badge with the remaining duration:
     - Normal: `Closes in 12 days · Nov 18`
     - Urgent ($\le 3$ days): `Urgent · 2 days left` in amber/rose styling
     - Expired: `Closed` in muted slate
   - In the full Job Detail View, a dedicated deadline badge sits alongside the guaranteed salary strip.
3. **Exporting Job Description as PDF**:
   - In the Job Detail drawer/modal, users click the new **"Export PDF"** button (`Download / FileText` icon).
   - An executive PDF Document Preview modal opens with a clean layout: company letterhead, position overview, salary range, deadline, tech stack, and qualifications.
   - The user clicks **"Print / Save as PDF"** which triggers the browser's high-fidelity print dialogue formatted with crisp typography, zero unnecessary UI clutter, and paper margins.
4. **Exporting Application Receipt as PDF**:
   - In the candidate's Tracked Applications dashboard (and Quick Apply confirmation view), users click **"Export Application Receipt"**.
   - Generates a formal candidate submission receipt showing candidate info, job title, company, submission timestamp, current hiring status, and ATS evaluation summary.

### B. Visual Identity & Styling
- **Typography & Clean Print Styles**: Uses standard display typography on screen, coupled with print-optimized CSS rules:
  - `@media print { header, nav, buttons { display: none !important; } .printable-document { display: block !important; } }`
  - Zero cutoff pages, high-contrast dark-on-white text, crisp border lines, and clean metadata grids.
- **Urgency Signaling**: Muted amber badge for roles closing within 72 hours, standard slate typography for general countdowns.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Native Print-to-PDF vs External Canvas/Blob Generator**
  - *Chosen Approach*: Clean browser print engine with a styled, dedicated printable layout modal (`window.print()` + printable paper CSS).
  - *Why*: Instant generation with 0 kB external bundle overhead, vectors remain razor sharp at 300+ DPI, native support for all mobile browsers (iOS Safari and Android Chrome), and eliminates third-party WASM font rendering issues.
- **Decision 2: Deadline Computation & Expiration State**
  - *Chosen Approach*: Store ISO date string (`YYYY-MM-DD`) and calculate remaining days dynamically relative to current date.
  - *Why*: Guarantees accurate real-time countdown calculations across all timezones without server synchronization lag.

---

## 4. Technical Architecture & Data Strategy

### System & Component Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        JobEngine Web Platform                          │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴────────────────────────┐
           ▼                                                  ▼
┌───────────────────────┐                          ┌─────────────────────┐
│  Job Posting Engine   │                          │  Seeker Feed & View │
│ - Form with Deadline  │                          │ - Live Countdown    │
│ - Preset +14d/+30d    │                          │ - Urgency Badges    │
└──────────┬────────────┘                          └──────────┬──────────┘
           │                                                  │
           ▼                                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Job & Application Data Store                       │
│  - Job: { ...fields, deadline: '2026-11-20', status: 'Active' }        │
│  - App: { ...fields, appliedAt: '2026-11-02', status: 'Under Review' } │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Executive PDF Export Modal & View                    │
│  - Mode: 'job-spec' | 'application-receipt'                            │
│  - Formatted Printable Document Layout                                 │
│  - 1-Click Trigger: window.print() / Download PDF                      │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Enhancements

```typescript
// Extended Job model
interface Job {
  id: string;
  title: string;
  company: string;
  // ... existing fields
  deadline?: string; // ISO date 'YYYY-MM-DD'
}

// Extended Application model
interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  appliedAt: string;
  status: string;
  atsScore?: number;
  coverNote?: string;
  // ... existing fields
}
```

---

## Planned Implementation Steps

1. **Data Model & Mock Jobs Update**:
   - Add `deadline` string to `INITIAL_JOBS` (varied deadlines: 3 days left, 14 days left, 28 days left).
2. **Post Job Form**:
   - Add `deadline` input with quick preset buttons (`+7 Days`, `+14 Days`, `+30 Days`).
3. **Card & Detail View Badges**:
   - Create countdown calculation utility (`getDeadlineInfo(deadline)`) calculating days remaining and urgency status.
   - Display countdown on `JobCard` and full deadline date on `JobDetailView`.
4. **PDF Document Generator & Preview Component**:
   - Build a reusable `PdfExportModal` with print-ready styling for:
     - **Job Specification Export**: Clean corporate brief with responsibilities, salary, and contact.
     - **Application Receipt Export**: Official submission proof with candidate notes and hiring stage.
   - Wire "Export PDF" buttons to `JobDetailView`, `ApplicationsTracker`, and application confirmation states.
5. **Verification**:
   - Verify layout responsiveness on desktop and mobile viewports.
   - Validate clean compilation via `compile_applet` and type checks.
