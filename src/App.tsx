import React, { useState, useMemo, useEffect } from 'react';
import { 
  Briefcase, Search, MapPin, DollarSign, Filter, Bell, Bookmark, PlusCircle, 
  UserCheck, Building2, Sparkles, Send, CheckCircle, Clock, ShieldCheck, 
  ChevronRight, ArrowRight, Eye, FileText, Settings, X, RefreshCw, Award, 
  TrendingUp, AlertCircle, Play, Pause, Trash2, Mail, ExternalLink, Zap,
  LogIn, User, LogOut, Check, SlidersHorizontal, ChevronDown, Smartphone,
  Calendar, Printer, Download
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs 
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from './lib/firebase';
import { PdfExportModal } from './components/PdfExportModal';

// --- DEADLINE COMPUTATION HELPER ---
export function getDeadlineInfo(deadlineStr?: string) {
  if (!deadlineStr) {
    return { text: 'Rolling Round', daysLeft: null, isUrgent: false, isExpired: false, formattedDate: '' };
  }
  const parts = deadlineStr.split('-');
  let targetDate: Date;
  if (parts.length === 3) {
    targetDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    targetDate = new Date(deadlineStr);
  }

  if (isNaN(targetDate.getTime())) {
    return { text: deadlineStr, daysLeft: null, isUrgent: false, isExpired: false, formattedDate: '' };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const shortDate = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (diffDays < 0) {
    return { text: `Closed · ${shortDate}`, daysLeft: diffDays, isUrgent: false, isExpired: true, formattedDate };
  } else if (diffDays === 0) {
    return { text: `Closes Today · ${shortDate}`, daysLeft: 0, isUrgent: true, isExpired: false, formattedDate };
  } else if (diffDays === 1) {
    return { text: `1 day left · Closes ${shortDate}`, daysLeft: 1, isUrgent: true, isExpired: false, formattedDate };
  } else if (diffDays <= 3) {
    return { text: `${diffDays} days left · Closes ${shortDate}`, daysLeft: diffDays, isUrgent: true, isExpired: false, formattedDate };
  } else {
    return { text: `${diffDays} days left · Closes ${shortDate}`, daysLeft: diffDays, isUrgent: false, isExpired: false, formattedDate };
  }
}

// --- INITIAL DATA ---
const INITIAL_JOBS = [
  {
    id: 'job-1',
    title: 'Senior Cloud Infrastructure Architect',
    company: 'Apex Cloud Solutions',
    industry: 'Tech & Software',
    location: 'San Francisco, CA',
    remote: true,
    salaryMin: 165000,
    salaryMax: 210000,
    type: 'Full-time',
    postedDaysAgo: 1,
    deadline: '2026-11-15',
    description: 'Lead our core cloud transformation team. Architect resilient Kubernetes clusters, automate multi-region failovers, and maintain high-security infrastructure compliance for enterprise biotech clients.',
    requirements: [
      '8+ years experience with AWS/GCP architecture',
      'Deep expertise in Terraform & Helm orchestration',
      'Kubernetes CKA certification preferred',
      'Experience with HIPAA and SOC2 compliance'
    ],
    applicantsCount: 3,
    status: 'Active',
    featured: true
  },
  {
    id: 'job-2',
    title: 'Clinical Oncology Pharmacist',
    company: 'BioShield Health System',
    industry: 'Pharmacy',
    location: 'Boston, MA',
    remote: false,
    salaryMin: 135000,
    salaryMax: 160000,
    type: 'Full-time',
    postedDaysAgo: 2,
    deadline: '2026-11-04',
    description: 'Provide clinical pharmacotherapy services for complex oncology patients. Collaborate closely with oncologists, review protocol dosages, and oversee sterile compounding protocols.',
    requirements: [
      'PharmD degree from an accredited institution',
      'Board Certified Oncology Pharmacist (BCOP)',
      'Active State Pharmacist License in good standing',
      '2+ years inpatient hospital residency experience'
    ],
    applicantsCount: 2,
    status: 'Active',
    featured: true
  },
  {
    id: 'job-3',
    title: 'Biomedical AI Research Scientist',
    company: 'NeuraPharma AI',
    industry: 'Biotech',
    location: 'Cambridge, MA',
    remote: true,
    salaryMin: 180000,
    salaryMax: 240000,
    type: 'Full-time',
    postedDaysAgo: 4,
    deadline: '2026-11-20',
    description: 'Develop deep learning models for molecular structure prediction and drug discovery pipelines. Train transformer models on massive protein structure databases.',
    requirements: [
      'Ph.D. in Computational Biology, Computer Science, or ML',
      'Strong PyTorch/TensorFlow development background',
      'Published research in top AI or Bioinformatics journals',
      'Hands-on experience with AlphaFold or ESM models'
    ],
    applicantsCount: 1,
    status: 'Active',
    featured: false
  },
  {
    id: 'job-4',
    title: 'Senior Robotics Hardware Engineer',
    company: 'Vanguard Dynamics',
    industry: 'Engineering',
    location: 'Austin, TX',
    remote: false,
    salaryMin: 140000,
    salaryMax: 175000,
    type: 'Full-time',
    postedDaysAgo: 3,
    deadline: '2026-11-05',
    description: 'Design and prototype precision motor control actuators and sensor suites for autonomous surgical medical devices.',
    requirements: [
      'BS/MS in Mechanical or Mechatronics Engineering',
      '5+ years CAD & Embedded Systems design',
      'SolidWorks / Altium Designer mastery',
      'Experience with ISO 13485 medical device standards'
    ],
    applicantsCount: 11,
    status: 'Active',
    featured: false
  },
  {
    id: 'job-5',
    title: 'Tele-ICU Critical Care Nurse Specialist',
    company: 'OmniHealth Network',
    industry: 'Healthcare',
    location: 'Chicago, IL',
    remote: true,
    salaryMin: 98000,
    salaryMax: 125000,
    type: 'Full-time',
    postedDaysAgo: 5,
    deadline: '2026-11-28',
    description: 'Monitor high-acuity intensive care unit patients remotely across multiple partner hospitals. Real-time telemetry monitoring and emergency physician escalation.',
    requirements: [
      'BSN & Active Multi-state RN License',
      '5+ years ICU/CCU bedside experience',
      'CCRN certification preferred',
      'Proficiency in Epic EHR telemetry systems'
    ],
    applicantsCount: 19,
    status: 'Active',
    featured: false
  }
];

const INITIAL_APPLICANTS = [
  {
    id: 'app-101',
    jobId: 'job-1',
    fullName: 'Dr. Sarah Jenkins',
    title: 'Principal Cloud Systems Architect',
    email: 'sarah.j@cloudnode.io',
    phone: '+1 (555) 345-6789',
    location: 'San Jose, CA',
    date: '2026-11-01',
    status: 'Shortlisted',
    atsScore: 92,
    coverNote: 'Over 9 years experience running multi-cluster EKS deployments and HIPAA compliant AWS pipelines.',
    resumeSummary: 'Principal Cloud Engineer with 9+ years experience in AWS, GCP, Terraform automation, and HIPAA security compliance for health tech ecosystems.',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'HIPAA Security']
  },
  {
    id: 'app-102',
    jobId: 'job-1',
    fullName: 'Marcus Vance',
    title: 'Senior DevOps Specialist',
    email: 'mvance@techcore.dev',
    phone: '+1 (555) 987-1234',
    location: 'San Francisco, CA',
    date: '2026-11-02',
    status: 'Under Review',
    atsScore: 84,
    coverNote: 'Excited about scaling infrastructure at Apex Cloud. Built automated failover systems for high traffic platforms.',
    resumeSummary: 'DevOps Leader with 6 years experience specializing in Helm, Docker containers, multi-cloud monitoring, and site reliability engineering.',
    skills: ['Kubernetes', 'Docker', 'Prometheus', 'Python', 'AWS']
  },
  {
    id: 'app-103',
    jobId: 'job-2',
    fullName: 'Dr. Elena Rostova',
    title: 'Board Certified Clinical Pharmacist',
    email: 'elena.rostova@healthmed.org',
    phone: '+1 (555) 432-8765',
    location: 'Boston, MA',
    date: '2026-11-01',
    status: 'Interviewing',
    atsScore: 95,
    coverNote: 'PharmD with 5 years clinical hospital experience managing complex oncology dosing and sterile compounding.',
    resumeSummary: 'BCOP certified Clinical Pharmacist specializing in inpatient oncology, protocol validation, and collaborative physician rounds.',
    skills: ['PharmD', 'BCOP', 'Sterile Compounding', 'Epic EHR', 'Oncology Protocol']
  }
];

export default function App() {
  // --- AUTHENTICATION STATE ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('je_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      isLoggedIn: true,
      role: 'seeker', // 'seeker' | 'employer'
      name: 'Dr. Alex Mercer',
      email: 'alex.mercer@bioeng.io',
      title: 'PharmD & Cloud Systems Specialist',
      initials: 'AM',
      company: 'BioEng Labs'
    };
  });

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    role: 'seeker' as 'seeker' | 'employer',
    name: ''
  });

  // --- ROLE & TAB STATE ---
  const [roleMode, setRoleMode] = useState<'seeker' | 'employer'>(currentUser?.role || 'seeker');
  const [activeTab, setActiveTab] = useState<'feed' | 'alerts' | 'coach' | 'post-job' | 'my-posted-jobs' | 'saved'>('feed');

  // Sync roleMode when user switches
  useEffect(() => {
    if (currentUser?.role && currentUser.role !== roleMode) {
      setRoleMode(currentUser.role);
    }
  }, [currentUser]);

  // Jobs Data - Live synced with Firestore
  const [jobs, setJobs] = useState<any[]>(() => {
    const saved = localStorage.getItem('je_jobs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_JOBS;
  });

  // Applications Data - Live synced with Firestore
  const [appliedJobs, setAppliedJobs] = useState<any[]>(() => {
    const saved = localStorage.getItem('je_applicants');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_APPLICANTS;
  });

  // Real-time Firestore sync for Jobs
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'jobs'), (snapshot) => {
      if (snapshot.empty) {
        // Automatically seed with default jobs so mobile app and web both have initial jobs
        INITIAL_JOBS.forEach((job) => {
          setDoc(doc(db, 'jobs', job.id), {
            ...job,
            createdAt: new Date().toISOString()
          }).catch(err => console.error("Initial job seed error:", err));
        });
      } else {
        const remoteJobs: any[] = [];
        snapshot.forEach(docSnap => {
          remoteJobs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setJobs(remoteJobs);
        localStorage.setItem('je_jobs', JSON.stringify(remoteJobs));
      }
    }, (error) => {
      console.warn("Firestore jobs listener error:", error);
      handleFirestoreError(error, OperationType.LIST, 'jobs');
    });
    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Applications
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'applications'), (snapshot) => {
      if (snapshot.empty) {
        INITIAL_APPLICANTS.forEach((app) => {
          setDoc(doc(db, 'applications', app.id), {
            ...app,
            createdAt: new Date().toISOString()
          }).catch(err => console.error("Initial application seed error:", err));
        });
      } else {
        const remoteApps: any[] = [];
        snapshot.forEach(docSnap => {
          remoteApps.push({ id: docSnap.id, ...docSnap.data() });
        });
        setAppliedJobs(remoteApps);
        localStorage.setItem('je_applicants', JSON.stringify(remoteApps));
      }
    }, (error) => {
      console.warn("Firestore applications listener error:", error);
      handleFirestoreError(error, OperationType.LIST, 'applications');
    });
    return () => unsubscribe();
  }, []);

  // Auth state listener: sync with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u = {
          isLoggedIn: true,
          role: currentUser?.role || 'seeker',
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email || '',
          title: currentUser?.title || 'Verified Member',
          initials: (firebaseUser.displayName || firebaseUser.email || 'GU').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
          company: currentUser?.company || 'JobEngine'
        };
        setCurrentUser(u);
        localStorage.setItem('je_user', JSON.stringify(u));

        // Sync user profile to Firestore
        setDoc(doc(db, 'user_profiles', firebaseUser.uid), {
          email: u.email,
          fullName: u.name,
          role: u.role,
          title: u.title,
          company: u.company,
          initials: u.initials,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(err => {
          console.error("Error updating user profile in Firestore:", err);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('je_saved');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return ['job-1', 'job-3'];
  });

  useEffect(() => {
    localStorage.setItem('je_saved', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // Employer Applicant Management Filter State
  const [selectedEmployerJobFilter, setSelectedEmployerJobFilter] = useState('All');
  const [applicantSearchQuery, setApplicantSearchQuery] = useState('');
  const [applicantStatusFilter, setApplicantStatusFilter] = useState('All');
  const [inspectingApplicant, setInspectingApplicant] = useState<any>(null);

  // Seeker Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minSalaryFilter, setMinSalaryFilter] = useState(80000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Selected Job for Detail Modal
  const [viewingJob, setViewingJob] = useState<any>(null);
  const [applyModalJob, setApplyModalJob] = useState<any>(null);
  const [applyForm, setApplyForm] = useState({
    fullName: currentUser?.name || 'Dr. Alex Mercer',
    email: currentUser?.email || 'alex.mercer@bioeng.io',
    phone: '+1 (555) 234-5678',
    coverNote: ''
  });

  // Keep apply form synced with user
  useEffect(() => {
    if (currentUser) {
      setApplyForm(prev => ({
        ...prev,
        fullName: currentUser.name || prev.fullName,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Employer Post Job Form State
  const [postJobForm, setPostJobForm] = useState({
    title: '',
    company: currentUser?.company || 'Apex Cloud Solutions',
    industry: 'Engineering',
    location: '',
    remote: false,
    salaryMin: 100000,
    salaryMax: 150000,
    type: 'Full-time',
    description: '',
    requirementsStr: '',
    deadline: '2026-11-16'
  });

  // PDF Document Export Modal State
  const [pdfModal, setPdfModal] = useState<{
    isOpen: boolean;
    mode: 'job-spec' | 'application-receipt';
    job?: any;
    application?: any;
  }>({
    isOpen: false,
    mode: 'job-spec'
  });

  // AI Career Coach State
  const [resumeText, setResumeText] = useState(`ALEX MERCER, PharmD & Cloud Engineer
Email: alex.mercer@bioeng.io | Location: Boston, MA
SUMMARY:
Dual-trained healthcare and technology professional with 4 years experience in health-tech automation, Python bioinformatics scripting, and clinical pharmacy workflows.

EXPERIENCE:
- Clinical Pharmacist | Regional Medical Center (2022 - Present)
  * Managed sterile compounding and oncology dosing algorithms.
  * Spearheaded EHR system integration for automated drug interaction alerts.
- Data Analyst & Scripting Intern | MedTech Labs (2021)
  * Built Python scripts for processing patient genomic datasets.

SKILLS:
PharmD, Clinical Pharmacy, Python, SQL, AWS Fundamentals, EHR Systems, HIPAA Compliance.`);
  const [targetJobTitle, setTargetJobTitle] = useState('Biomedical AI Research Scientist');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Job Alerts State
  const [jobAlerts, setJobAlerts] = useState([
    { id: 'alt-1', title: 'Oncology & Pharmacy - Senior Roles', industry: 'Pharmacy', remoteOnly: false, minSalary: 120000, emailDelivery: true, pushDelivery: true },
    { id: 'alt-2', title: 'Remote Cloud & AI Engineering', industry: 'Tech & Software', remoteOnly: true, minSalary: 150000, emailDelivery: true, pushDelivery: false }
  ]);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertIndustry, setNewAlertIndustry] = useState('Tech & Software');
  const [newAlertMinSalary, setNewAlertMinSalary] = useState(100000);
  const [previewEmailModal, setPreviewEmailModal] = useState<any>(null);

  // Derived Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) => {
      if (activeTab === 'saved' && !savedJobIds.includes(job.id)) {
        return false;
      }
      const matchSearch = searchQuery === '' || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchIndustry = selectedIndustry === 'All' || job.industry === selectedIndustry;
      const matchLocation = selectedLocation === '' || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchRemote = !remoteOnly || job.remote === true;
      const matchSalary = job.salaryMax >= minSalaryFilter;
      const isActive = job.status === 'Active';

      return matchSearch && matchIndustry && matchLocation && matchRemote && matchSalary && isActive;
    });
  }, [jobs, searchQuery, selectedIndustry, selectedLocation, remoteOnly, minSalaryFilter, activeTab, savedJobIds]);

  // Derived Filtered Applicants for Employer
  const filteredApplicants = useMemo(() => {
    return appliedJobs.filter((app: any) => {
      const matchesJob = selectedEmployerJobFilter === 'All' || app.jobId === selectedEmployerJobFilter;
      const matchesStatus = applicantStatusFilter === 'All' || app.status === applicantStatusFilter;
      const matchesSearch = applicantSearchQuery === '' || 
        app.fullName.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
        app.skills?.some((s: string) => s.toLowerCase().includes(applicantSearchQuery.toLowerCase()));

      return matchesJob && matchesStatus && matchesSearch;
    });
  }, [appliedJobs, selectedEmployerJobFilter, applicantStatusFilter, applicantSearchQuery]);


  // Handlers - Syncing to Firestore backend
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob) return;

    const newApplication = {
      id: `app-${Date.now()}`,
      jobId: applyModalJob.id,
      jobTitle: applyModalJob.title,
      company: applyModalJob.company,
      fullName: applyForm.fullName,
      title: 'Applicant / Specialist',
      email: applyForm.email,
      phone: applyForm.phone || '+1 (555) 000-0000',
      location: applyModalJob.location || 'Remote',
      date: new Date().toISOString().split('T')[0],
      status: 'New Application',
      atsScore: Math.floor(Math.random() * (98 - 78 + 1)) + 78,
      coverNote: applyForm.coverNote || 'Excited to apply and submit my credentials for review.',
      resumeSummary: resumeText.substring(0, 180) + '...',
      skills: ['Domain Expertise', 'Problem Solving', 'Team Collaboration'],
      createdAt: new Date().toISOString()
    };

    // Optimistic local update
    setAppliedJobs([newApplication, ...appliedJobs]);
    setJobs(jobs.map((j: any) => j.id === applyModalJob.id ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j));
    showToast(`Application transmitted to ${applyModalJob.company}! Viewable in Employer dashboard.`);
    setApplyModalJob(null);
    setApplyForm({ ...applyForm, coverNote: '' });

    // Shared Firestore persistence
    try {
      await setDoc(doc(db, 'applications', newApplication.id), newApplication);
      await updateDoc(doc(db, 'jobs', applyModalJob.id), {
        applicantsCount: (applyModalJob.applicantsCount || 0) + 1
      });
    } catch (err) {
      console.warn("Firestore application write error:", err);
    }
  };

  const updateApplicantStatus = async (applicantId: string, newStatus: string) => {
    setAppliedJobs(appliedJobs.map((app: any) => 
      app.id === applicantId ? { ...app, status: newStatus } : app
    ));
    if (inspectingApplicant && inspectingApplicant.id === applicantId) {
      setInspectingApplicant({ ...inspectingApplicant, status: newStatus });
    }
    showToast(`Candidate status updated to "${newStatus}"`);

    // Shared Firestore persistence
    try {
      await updateDoc(doc(db, 'applications', applicantId), { status: newStatus });
    } catch (err) {
      console.warn("Firestore applicant status write error:", err);
    }
  };

  const toggleBookmark = (jobId: string) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter(id => id !== jobId));
      showToast('Removed job from bookmarks', 'info');
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      showToast('Job saved to your bookmarks!');
    }
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postJobForm.title || !postJobForm.company) {
      showToast('Please fill in all required job fields', 'error');
      return;
    }

    const reqArray = postJobForm.requirementsStr
      ? postJobForm.requirementsStr.split('\n').filter(r => r.trim() !== '')
      : ['Bachelor degree or equivalent experience', 'Strong team collaboration abilities'];

    const newJob = {
      id: `job-${Date.now()}`,
      title: postJobForm.title,
      company: postJobForm.company,
      industry: postJobForm.industry,
      location: postJobForm.location || 'Remote / Hybrid',
      remote: postJobForm.remote,
      salaryMin: Number(postJobForm.salaryMin),
      salaryMax: Number(postJobForm.salaryMax),
      type: postJobForm.type,
      postedDaysAgo: 0,
      deadline: postJobForm.deadline || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      description: postJobForm.description || 'Exciting opportunity to join our expanding team.',
      requirements: reqArray,
      applicantsCount: 0,
      status: 'Active',
      featured: true,
      employerEmail: currentUser?.email || 'recruiting@apexcloud.com',
      employerName: currentUser?.name || 'Hiring Lead',
      createdAt: new Date().toISOString()
    };

    // Optimistic local update
    setJobs([newJob, ...jobs]);
    showToast('Job listing published and live across JobEngine!');
    setPostJobForm({
      title: '',
      company: currentUser?.company || 'Apex Cloud Solutions',
      industry: 'Engineering',
      location: '',
      remote: false,
      salaryMin: 100000,
      salaryMax: 150000,
      type: 'Full-time',
      description: '',
      requirementsStr: '',
      deadline: '2026-11-16'
    });
    setActiveTab('my-posted-jobs');

    // Shared Firestore persistence
    try {
      await setDoc(doc(db, 'jobs', newJob.id), newJob);
    } catch (err) {
      console.warn("Firestore post job write error:", err);
    }
  };

  const applyTemplate = (template: any) => {
    setPostJobForm({
      title: template.title,
      company: template.company,
      industry: template.industry,
      location: template.location,
      remote: template.remote,
      salaryMin: template.salaryMin,
      salaryMax: template.salaryMax,
      type: 'Full-time',
      description: template.description,
      requirementsStr: template.requirements.join('\n'),
      deadline: template.deadline || '2026-11-20'
    });
    showToast(`Autofilled template: ${template.title}`);
  };

  const toggleJobStatus = async (jobId: string) => {
    const targetJob = jobs.find((j: any) => j.id === jobId);
    if (!targetJob) return;
    const nextStatus = targetJob.status === 'Active' ? 'Paused' : 'Active';

    setJobs(jobs.map((j: any) => {
      if (j.id === jobId) {
        showToast(`Job status updated to ${nextStatus}`);
        return { ...j, status: nextStatus };
      }
      return j;
    }));

    // Shared Firestore persistence
    try {
      await updateDoc(doc(db, 'jobs', jobId), { status: nextStatus });
    } catch (err) {
      console.warn("Firestore status toggle write error:", err);
    }
  };

  // AI Resume ATS Analysis using Gemini SDK with robust local fallback
  const runAiAtsAnalysis = async () => {
    if (!resumeText.trim()) {
      showToast('Please paste or type resume content to analyze', 'error');
      return;
    }

    setAiAnalyzing(true);
    setAiResult(null);

    const prompt = `Act as an expert ATS (Applicant Tracking System) Evaluator and Technical Career Coach in Engineering, Pharmacy, Healthcare, and Tech.
Analyze the following candidate resume for the target position: "${targetJobTitle}".

RESUME TEXT:
"""
${resumeText}
"""

Return valid JSON with this exact structure:
{
  "atsScore": 88,
  "verdict": "Strong Interdisciplinary Match",
  "matchingSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "skillGaps": ["Gap 1", "Gap 2", "Gap 3"],
  "improvements": ["Advice 1", "Advice 2", "Advice 3"],
  "salaryAdvice": "Salary benchmark description..."
}`;

    try {
      // Check for Gemini API key
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });
        if (response.text) {
          const parsed = JSON.parse(response.text);
          setAiResult(parsed);
          showToast('ATS Evaluation Complete (Gemini AI)!');
          setAiAnalyzing(false);
          return;
        }
      }
      throw new Error('API key not present or empty response');
    } catch (err) {
      // Intelligent deterministic evaluation
      setTimeout(() => {
        const hasPharm = resumeText.toLowerCase().includes('pharm') || resumeText.toLowerCase().includes('clinical');
        const hasTech = resumeText.toLowerCase().includes('python') || resumeText.toLowerCase().includes('cloud') || resumeText.toLowerCase().includes('aws');
        let score = 75;
        if (hasPharm && hasTech) score = 91;
        else if (hasPharm || hasTech) score = 84;

        setAiResult({
          atsScore: score,
          verdict: score >= 90 ? 'Highly Competitive Match' : score >= 80 ? 'Strong Technical Alignment' : 'Moderate Match with Gaps',
          matchingSkills: [
            hasPharm ? 'Clinical Pharmacy Workflow & Protocols' : 'Process Automation',
            hasTech ? 'Python & Cloud Fundamentals' : 'Data Integrity & Analysis',
            'Healthcare HIPAA Compliance Standards',
            'Analytical Systems Problem Solving'
          ],
          skillGaps: [
            'Deep Learning & PyTorch / Model Training frameworks',
            'FDA/ISO regulatory clinical trial validation documentation',
            'Continuous Integration & Deployment (CI/CD) pipelines'
          ],
          improvements: [
            'Quantify clinical and technical outcomes with concrete percentages (e.g., "Reduced manual dosing validation lag by 40%")',
            'Add explicit certifications and github repositories in your header contact strip',
            `Align keyword density with specific terminology from ${targetJobTitle}`
          ],
          salaryAdvice: `Based on current verified compensation bands for ${targetJobTitle}, standard median compensation spans $145,000 to $195,000. Highlight your dual expertise in clinical healthcare workflows and cloud automation during initial recruiter screens to anchor at the 75th percentile.`
        });
        showToast('ATS Evaluation Complete!');
        setAiAnalyzing(false);
      }, 1000);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertTitle) return;

    const newAlert = {
      id: `alt-${Date.now()}`,
      title: newAlertTitle,
      industry: newAlertIndustry,
      remoteOnly: true,
      minSalary: Number(newAlertMinSalary),
      emailDelivery: true,
      pushDelivery: true
    };

    setJobAlerts([...jobAlerts, newAlert]);
    setNewAlertTitle('');
    showToast('New Job Alert created!');
  };

  const triggerAlertDispatch = (alert: any) => {
    const matchingCount = jobs.filter((j: any) => 
      (alert.industry === 'All' || j.industry === alert.industry) &&
      j.salaryMax >= alert.minSalary
    ).length;

    setPreviewEmailModal({
      alert,
      matchingCount,
      recipient: currentUser?.email || 'alex.mercer@bioeng.io',
      sentAt: new Date().toLocaleTimeString()
    });
  };

  // Quick Account Login presets
  const handleQuickLogin = (role: 'seeker' | 'employer') => {
    if (role === 'seeker') {
      const u = {
        isLoggedIn: true,
        role: 'seeker',
        name: 'Dr. Alex Mercer',
        email: 'alex.mercer@bioeng.io',
        title: 'PharmD & Cloud Systems Specialist',
        initials: 'AM',
        company: 'BioEng Labs'
      };
      setCurrentUser(u);
      setRoleMode('seeker');
      setActiveTab('feed');
      localStorage.setItem('je_user', JSON.stringify(u));
      showToast('Logged in as Job Seeker (Dr. Alex Mercer)');
    } else {
      const u = {
        isLoggedIn: true,
        role: 'employer',
        name: 'Jordan Miller (HR Director)',
        email: 'recruiting@apexcloud.com',
        title: 'VP of Talent Acquisition',
        initials: 'JM',
        company: 'Apex Cloud Solutions'
      };
      setCurrentUser(u);
      setRoleMode('employer');
      setActiveTab('my-posted-jobs');
      localStorage.setItem('je_user', JSON.stringify(u));
      showToast('Logged in as Employer (Apex Cloud Recruiting)');
    }
    setLoginModalOpen(false);
  };

  const handleLogout = () => {
    signOut(auth).catch(err => console.warn("Sign out error:", err));
    const u = {
      isLoggedIn: false,
      role: 'seeker',
      name: 'Guest User',
      email: '',
      title: 'Browsing Jobs',
      initials: 'GU',
      company: ''
    };
    setCurrentUser(u);
    localStorage.setItem('je_user', JSON.stringify(u));
    showToast('Logged out successfully', 'info');
    setLoginModalOpen(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      const initials = (user.displayName || user.email || 'GU')
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
      const u = {
        isLoggedIn: true,
        role: roleMode,
        name: user.displayName || 'Google Member',
        email: user.email || '',
        title: roleMode === 'seeker' ? 'Verified Candidate' : 'Hiring Lead',
        initials: initials || 'GU',
        company: roleMode === 'employer' ? 'Apex Cloud Solutions' : 'JobEngine Seeker'
      };
      setCurrentUser(u);
      localStorage.setItem('je_user', JSON.stringify(u));
      showToast(`Signed in with Google as ${user.displayName || user.email}!`);
      setLoginModalOpen(false);

      // Write user profile to shared Firestore
      await setDoc(doc(db, 'user_profiles', user.uid), {
        email: u.email,
        fullName: u.name,
        role: u.role,
        title: u.title,
        company: u.company,
        initials: u.initials,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      showToast(err.message || 'Google Sign-In failed', 'error');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email.trim()) {
      showToast('Please enter your email', 'error');
      return;
    }

    const emailName = loginForm.name.trim() || loginForm.email.split('@')[0];
    const initials = emailName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U';

    const u = {
      isLoggedIn: true,
      role: loginForm.role,
      name: emailName,
      email: loginForm.email.trim(),
      title: loginForm.role === 'seeker' ? 'Candidate Specialist' : 'Hiring Manager',
      initials,
      company: loginForm.role === 'employer' ? 'Apex Cloud Solutions' : 'JobEngine Candidate'
    };

    setCurrentUser(u);
    setRoleMode(loginForm.role);
    localStorage.setItem('je_user', JSON.stringify(u));
    showToast(authMode === 'signup' ? `Account registered for ${u.name}!` : `Signed in as ${u.name}!`);
    setLoginModalOpen(false);

    // Save profile to Firestore
    try {
      const sanitizedId = u.email.replace(/[^a-zA-Z0-9_-]/g, '_');
      await setDoc(doc(db, 'user_profiles', sanitizedId), {
        email: u.email,
        fullName: u.name,
        role: u.role,
        title: u.title,
        company: u.company,
        initials: u.initials,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Profile write error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900 antialiased">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Backend Status Pill */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('feed'); setRoleMode('seeker'); }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs group-hover:bg-indigo-600 transition-colors">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  JobEngine
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  2026 Live
                </span>
              </div>
            </button>

          </div>
          
          {/* Header Controls: Role Switcher, Notification, Login Profile */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Seeker / Employer Segmented Switcher */}
            <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button 
                onClick={() => { setRoleMode('seeker'); setActiveTab('feed'); }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  roleMode === 'seeker' 
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Seeker
              </button>
              <button 
                onClick={() => { setRoleMode('employer'); setActiveTab('my-posted-jobs'); }}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  roleMode === 'employer' 
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/80' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Employer
              </button>
            </div>
            
            {/* Notification Bell */}
            <button 
              onClick={() => {
                if (roleMode === 'seeker') setActiveTab('alerts');
                else setActiveTab('my-posted-jobs');
                showToast(roleMode === 'seeker' ? 'Opening job alert subscriptions' : 'Reviewing applicant notifications');
              }}
              title="Notifications & Alerts"
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            </button>

            {/* LOGIN / USER ACCOUNT BUTTON */}
            <button
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all text-left"
              title="Account & Login Settings"
            >
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold ring-1 ring-slate-200 shrink-0">
                {currentUser?.isLoggedIn ? currentUser.initials : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                  {currentUser?.isLoggedIn ? currentUser.name : 'Sign In'}
                </div>
                <div className="text-[10px] text-slate-400 font-medium capitalize">
                  {currentUser?.isLoggedIn ? currentUser.role : 'Guest'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS BAR */}
      <div className="border-b border-slate-200 bg-white shadow-2xs z-30 sticky top-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 sm:gap-8">
            {roleMode === 'seeker' ? (
              <>
                <button 
                  onClick={() => setActiveTab('feed')} 
                  className={`py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === 'feed' 
                      ? 'border-slate-900 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  <span>Job Feed</span>
                </button>

                <button 
                  onClick={() => setActiveTab('saved')} 
                  className={`py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === 'saved' 
                      ? 'border-slate-900 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  <span>Saved</span>
                  <span className="font-mono text-xs px-1.5 py-0.2 bg-slate-100 rounded-full text-slate-600">
                    {savedJobIds.length}
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab('alerts')} 
                  className={`py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === 'alerts' 
                      ? 'border-slate-900 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span>Job Alerts</span>
                </button>

                <button 
                  onClick={() => setActiveTab('coach')} 
                  className={`py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === 'coach' 
                      ? 'border-slate-900 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>AI Coach & ATS</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setActiveTab('my-posted-jobs')} 
                  className={`py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === 'my-posted-jobs' 
                      ? 'border-slate-900 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>Employer Dashboard</span>
                  <span className="font-mono text-xs px-1.5 py-0.2 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
                    {appliedJobs.length} Applicants
                  </span>
                </button>

                <button 
                  onClick={() => setActiveTab('post-job')} 
                  className={`py-3.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === 'post-job' 
                      ? 'border-slate-900 text-slate-900' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-slate-400" />
                  <span>Post a Job</span>
                </button>
              </>
            )}
          </div>

          {/* Quick Mobile Filter Toggle */}
          {roleMode === 'seeker' && (activeTab === 'feed' || activeTab === 'saved') && (
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 my-2 shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              <span>Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 pb-28 md:pb-12">
        
        {/* TAB 1: JOB FEED & SAVED ROLES (SEEKER) */}
        {(activeTab === 'feed' || activeTab === 'saved') && roleMode === 'seeker' && (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs sticky top-36">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" /> Search & Filters
                  </h3>
                  {(searchQuery || selectedIndustry !== 'All' || selectedLocation || remoteOnly || minSalaryFilter !== 80000) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedIndustry('All');
                        setSelectedLocation('');
                        setRemoteOnly(false);
                        setMinSalaryFilter(80000);
                      }}
                      className="text-[11px] text-indigo-600 hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {/* Search Keywords */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Keywords</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Title, skills, company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry / Domain</label>
                    <select 
                      value={selectedIndustry} 
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                    >
                      <option value="All">All Disciplines</option>
                      <option value="Tech & Software">Tech & Software</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Biotech">Biotech</option>
                    </select>
                  </div>
                  
                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="e.g. Boston, San Francisco"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Min Salary Slider */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider">Min Base Salary</span>
                      <span className="font-mono font-bold text-slate-900">${(minSalaryFilter / 1000).toFixed(0)}k/yr</span>
                    </div>
                    <input 
                      type="range" 
                      min="50000" max="220000" step="10000"
                      value={minSalaryFilter}
                      onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                      className="w-full accent-slate-900 cursor-pointer"
                    />
                  </div>

                  {/* Remote Only */}
                  <label className="flex items-center gap-3 cursor-pointer group pt-2 border-t border-slate-100">
                    <input 
                      type="checkbox" 
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                      className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      100% Remote Only
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Job Listings Column */}
            <div className="flex-1 w-full space-y-3.5 sm:space-y-4">
              
              {/* Mobile Quick Search & Filters Bar */}
              <div className="lg:hidden flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search roles, skills, companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-base sm:text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-2xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className={`px-3 py-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors shrink-0 shadow-2xs min-h-[42px] ${
                    selectedIndustry !== 'All' || selectedLocation || remoteOnly || minSalaryFilter !== 80000
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                  aria-label="Filter Jobs"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                  {(selectedIndustry !== 'All' || selectedLocation || remoteOnly || minSalaryFilter !== 80000) && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  )}
                </button>
              </div>

              {/* Feed Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {activeTab === 'saved' ? 'Bookmarked Roles' : 'Verified Openings'}
                    <span className="text-slate-400 font-normal ml-2 text-xs sm:text-sm font-mono">
                      ({filteredJobs.length})
                    </span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    {activeTab === 'saved' 
                      ? 'Roles saved to your candidate profile for subsequent application.' 
                      : 'Active verified engineering, pharmacy, biotech, and software positions.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 sm:px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-1.5 shadow-2xs">
                    <Bookmark className="w-3 h-3 text-slate-400" /> {savedJobIds.length} Saved
                  </span>
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-300 rounded-xl bg-white shadow-2xs space-y-3">
                  <Search className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">No matching openings found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try loosening your filters, adjusting minimum salary, or switching to "All Disciplines".
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIndustry('All');
                      setSelectedLocation('');
                      setRemoteOnly(false);
                      setMinSalaryFilter(50000);
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredJobs.map((job: any) => {
                    const isSaved = savedJobIds.includes(job.id);
                    const hasApplied = appliedJobs.some((a: any) => a.jobId === job.id && a.email === (currentUser?.email || applyForm.email));
                    const deadlineInfo = getDeadlineInfo(job.deadline);

                    return (
                      <div 
                        key={job.id} 
                        className={`group bg-white border rounded-xl p-5 transition-all duration-200 hover:shadow-sm hover:border-slate-300 ${
                          job.featured ? 'border-indigo-200/80 bg-indigo-50/15' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 
                                onClick={() => setViewingJob(job)}
                                className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer truncate"
                              >
                                {job.title}
                              </h3>
                              {job.featured && (
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 shrink-0">
                                  <Sparkles className="w-3 h-3" /> Promoted
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600">
                              <span className="flex items-center gap-1 font-semibold text-slate-800">
                                <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location} {job.remote && '· Remote'}
                              </span>
                              <span className="flex items-center gap-1 font-mono font-bold text-slate-900 tabular-nums">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                ${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k/yr
                              </span>
                              <span className="flex items-center gap-1 text-slate-400">
                                <Clock className="w-3.5 h-3.5" /> {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}
                              </span>
                              <span className={`flex items-center gap-1 font-mono text-[11px] ${
                                deadlineInfo.isUrgent 
                                  ? 'text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded font-semibold border border-amber-300 shadow-2xs' 
                                  : deadlineInfo.isExpired 
                                  ? 'text-slate-400 line-through' 
                                  : 'text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60'
                              }`}>
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span>{deadlineInfo.text}</span>
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pt-1">
                              {job.description}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-1 sm:pt-0">
                            <button 
                              onClick={() => toggleBookmark(job.id)}
                              aria-label={isSaved ? 'Remove from saved' : 'Save job'}
                              className={`p-2.5 rounded-lg border transition-colors shadow-2xs min-h-[44px] min-w-[44px] flex items-center justify-center ${
                                isSaved 
                                  ? 'bg-slate-900 border-slate-900 text-white' 
                                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              onClick={() => setViewingJob(job)}
                              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-all shadow-2xs whitespace-nowrap min-h-[44px] flex items-center justify-center"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600">
                              {job.industry}
                            </span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-600">
                              {job.type}
                            </span>
                          </div>

                          {hasApplied ? (
                            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200 min-h-[36px]">
                              <CheckCircle className="w-3.5 h-3.5" /> Applied
                            </span>
                          ) : (
                            <button
                              onClick={() => setApplyModalJob(job)}
                              className="text-xs font-bold text-slate-900 hover:text-indigo-600 flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-slate-100 min-h-[36px]"
                            >
                              <span>Quick Apply</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: AUTOMATED JOB ALERTS */}
        {activeTab === 'alerts' && roleMode === 'seeker' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <div className="space-y-1 mb-5">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
                  <Bell className="w-5 h-5 text-indigo-500" /> Automated Industry Alerts
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm">
                  Subscribe to tailored candidate searches. When verified openings hit our matching threshold, digests deliver straight to your inbox.
                </p>
              </div>
              
              <form onSubmit={handleCreateAlert} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Alert Name / Focus Keywords *</label>
                    <input 
                      required
                      type="text" 
                      value={newAlertTitle}
                      onChange={e => setNewAlertTitle(e.target.value)}
                      placeholder="e.g. Remote Cloud Architect"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Target Discipline</label>
                    <select 
                      value={newAlertIndustry}
                      onChange={e => setNewAlertIndustry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                    >
                      <option value="All">All Disciplines</option>
                      <option value="Tech & Software">Tech & Software</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Biotech">Biotech</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900" />
                      <span>Daily Email Updates</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900" />
                      <span>Remote Preference</span>
                    </label>
                  </div>
                  <button type="submit" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-all">
                    Create Alert Subscription
                  </button>
                </div>
              </form>
            </div>

            {/* Active Alerts List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
                Active Configured Channels ({jobAlerts.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jobAlerts.map(alert => (
                  <div key={alert.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all">
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{alert.title}</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-bold rounded">
                          Active
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Discipline: <strong className="text-slate-700">{alert.industry}</strong> · Min: <strong className="text-slate-700 font-mono">${(alert.minSalary/1000).toFixed(0)}k</strong>
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>Daily Digest</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => triggerAlertDispatch(alert)}
                          className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs transition-colors"
                        >
                          Preview Email
                        </button>
                        <button 
                          onClick={() => setJobAlerts(jobAlerts.filter(a => a.id !== alert.id))}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors bg-white border border-slate-200 hover:bg-rose-50 rounded-md"
                          title="Delete alert"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AI CAREER COACH & ATS EVALUATOR */}
        {activeTab === 'coach' && roleMode === 'seeker' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-slate-800">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold tracking-tight">AI ATS Evaluator & Career Engine</h2>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                    Paste your resume and specify your target role. Our parsing engine evaluates ATS semantic compatibility, identifies critical missing keywords, and outlines salary benchmarks.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Workspace */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col h-[580px] shadow-xs">
                <div className="mb-4 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Job Title *</label>
                  <input 
                    type="text" 
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                    placeholder="e.g. Biomedical AI Research Scientist"
                  />
                </div>
                <div className="flex-1 flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                    <span>Candidate Resume Text</span>
                    <span className="text-slate-400 font-normal">Plain text format</span>
                  </label>
                  <textarea 
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="flex-1 w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none shadow-inner"
                    placeholder="Paste resume text..."
                  />
                </div>
                <button 
                  onClick={runAiAtsAnalysis}
                  disabled={aiAnalyzing}
                  className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {aiAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  <span>{aiAnalyzing ? 'Evaluating ATS Semantic Match...' : 'Run ATS Evaluation'}</span>
                </button>
              </div>

              {/* Results Workspace */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 h-[580px] overflow-y-auto shadow-xs">
                {!aiResult && !aiAnalyzing ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200">
                      <ShieldCheck className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Awaiting Evaluation</h3>
                    <p className="text-xs text-slate-500 max-w-xs">
                      Run the evaluator to calculate your ATS match score, extract keyword gaps, and receive personalized salary negotiation advice.
                    </p>
                  </div>
                ) : aiAnalyzing ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                    <h3 className="text-base font-bold text-slate-900">Analyzing Document</h3>
                    <p className="text-xs text-slate-500">Checking keywords against industry benchmarks...</p>
                  </div>
                ) : aiResult ? (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    
                    {/* Score Card */}
                    <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200" />
                          <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="163.3" strokeDashoffset={163.3 - (163.3 * aiResult.atsScore) / 100} className={`transition-all duration-1000 ease-out ${aiResult.atsScore >= 80 ? 'text-indigo-600' : 'text-amber-500'}`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-lg font-bold text-slate-900 font-mono">{aiResult.atsScore}%</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">{aiResult.verdict}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Semantic compatibility for <strong>{targetJobTitle}</strong>.</p>
                      </div>
                    </div>

                    {/* Keywords Matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-600" /> Matched Keywords
                        </h4>
                        <ul className="space-y-1.5">
                          {aiResult.matchingSkills.map((skill: string, i: number) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 font-medium">
                              <span className="text-indigo-500 mt-0.5">•</span> {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
                        <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Missing Keywords
                        </h4>
                        <ul className="space-y-1.5">
                          {aiResult.skillGaps.map((gap: string, i: number) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 font-medium">
                              <span className="text-amber-500 mt-0.5">•</span> {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Plan */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-slate-500" /> Actionable Improvements
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                        {aiResult.improvements.map((tip: string, i: number) => (
                          <div key={i} className="flex gap-2.5 text-xs">
                            <span className="shrink-0 w-5 h-5 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-bold font-mono text-[11px] border border-slate-200">
                              {i+1}
                            </span>
                            <p className="text-slate-700 leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Salary Insight */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Compensation Insight
                      </h4>
                      <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 leading-relaxed">
                        {aiResult.salaryAdvice}
                      </div>
                    </div>

                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: POST A JOB (EMPLOYER) */}
        {activeTab === 'post-job' && roleMode === 'employer' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
              
              <div className="mb-6 pb-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1 tracking-tight">
                  <PlusCircle className="w-5 h-5 text-indigo-500" /> Publish a Job Listing
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Publish openings directly into the verified seeker feed and review incoming applicants.
                </p>
              </div>

              {/* Quick Template Autofills */}
              <div className="mb-6 space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sample Role Templates:</span>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    onClick={() => applyTemplate(INITIAL_JOBS[0])} 
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 text-slate-700 text-xs rounded-lg transition-colors font-medium shadow-2xs"
                  >
                    Cloud Architect
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate(INITIAL_JOBS[1])} 
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 text-slate-700 text-xs rounded-lg transition-colors font-medium shadow-2xs"
                  >
                    Clinical Pharmacist
                  </button>
                  <button 
                    type="button"
                    onClick={() => applyTemplate(INITIAL_JOBS[3])} 
                    className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 text-slate-700 text-xs rounded-lg transition-colors font-medium shadow-2xs"
                  >
                    Hardware Robotics
                  </button>
                </div>
              </div>

              <form onSubmit={handlePostJob} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Position Title *</label>
                    <input 
                      required 
                      type="text" 
                      value={postJobForm.title} 
                      onChange={e => setPostJobForm({...postJobForm, title: e.target.value})} 
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" 
                      placeholder="e.g. Senior Software Engineer" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Company Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={postJobForm.company} 
                      onChange={e => setPostJobForm({...postJobForm, company: e.target.value})} 
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" 
                      placeholder="e.g. Apex Cloud Solutions" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Discipline / Industry</label>
                    <select 
                      value={postJobForm.industry} 
                      onChange={e => setPostJobForm({...postJobForm, industry: e.target.value})} 
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs"
                    >
                      <option value="Tech & Software">Tech & Software</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Biotech">Biotech</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Location</label>
                    <input 
                      type="text" 
                      value={postJobForm.location} 
                      onChange={e => setPostJobForm({...postJobForm, location: e.target.value})} 
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs" 
                      placeholder="e.g. Austin, TX (or Remote)" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Min Salary ($)</label>
                    <input 
                      type="number" 
                      step="5000"
                      value={postJobForm.salaryMin} 
                      onChange={e => setPostJobForm({...postJobForm, salaryMin: Number(e.target.value)})} 
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono tabular-nums shadow-2xs" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Max Salary ($)</label>
                    <input 
                      type="number" 
                      step="5000"
                      value={postJobForm.salaryMax} 
                      onChange={e => setPostJobForm({...postJobForm, salaryMax: Number(e.target.value)})} 
                      className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono tabular-nums shadow-2xs" 
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs">
                  <input 
                    type="checkbox" 
                    checked={postJobForm.remote} 
                    onChange={e => setPostJobForm({...postJobForm, remote: e.target.checked})} 
                    className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900" 
                  />
                  <span className="text-xs font-semibold text-slate-700">This role is 100% Remote Eligible</span>
                </label>

                {/* Application Deadline with quick presets */}
                <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Application Deadline *</span>
                    </label>
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-slate-400 mr-1">Presets:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 7);
                          setPostJobForm({ ...postJobForm, deadline: d.toISOString().split('T')[0] });
                        }}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 font-medium"
                      >
                        +7 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 14);
                          setPostJobForm({ ...postJobForm, deadline: d.toISOString().split('T')[0] });
                        }}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 font-medium"
                      >
                        +14 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 30);
                          setPostJobForm({ ...postJobForm, deadline: d.toISOString().split('T')[0] });
                        }}
                        className="px-2 py-0.5 bg-white border border-slate-200 rounded hover:bg-slate-100 font-medium"
                      >
                        +30 Days
                      </button>
                    </div>
                  </div>
                  <input 
                    required
                    type="date" 
                    value={postJobForm.deadline} 
                    onChange={e => setPostJobForm({...postJobForm, deadline: e.target.value})} 
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-mono text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs" 
                  />
                  <p className="text-[11px] text-slate-500">
                    Candidates will see live countdown indicators on the job card and detailed view as this deadline approaches.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Job Description *</label>
                  <textarea 
                    rows={3} 
                    required
                    value={postJobForm.description} 
                    onChange={e => setPostJobForm({...postJobForm, description: e.target.value})} 
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs resize-none" 
                    placeholder="Describe role responsibilities, tech stack, and impact..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase flex justify-between">
                    <span>Key Requirements</span>
                    <span className="text-slate-400 font-normal">One bullet per line</span>
                  </label>
                  <textarea 
                    rows={3} 
                    value={postJobForm.requirementsStr} 
                    onChange={e => setPostJobForm({...postJobForm, requirementsStr: e.target.value})} 
                    className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-2xs resize-none font-sans" 
                    placeholder="5+ years experience in distributed systems&#10;Fluency with Kubernetes..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Job Posting Live</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: EMPLOYER DASHBOARD & CANDIDATE PIPELINE */}
        {activeTab === 'my-posted-jobs' && roleMode === 'employer' && (
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Header KPI Strip */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2 tracking-tight">
                  <Building2 className="w-5 h-5 text-indigo-500" /> Employer Talent Dashboard
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Inspect incoming candidate applications, update candidate hiring stages, and manage open positions.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Total Applicants</span>
                  <strong className="text-slate-900 text-2xl font-bold font-mono tabular-nums leading-none mt-1">
                    {appliedJobs.length}
                  </strong>
                </div>
                <div className="w-px h-8 bg-slate-200 hidden md:block" />
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Openings</span>
                  <strong className="text-slate-900 text-2xl font-bold font-mono tabular-nums leading-none mt-1">
                    {jobs.filter((j: any) => j.status === 'Active').length}
                  </strong>
                </div>
                <button 
                  onClick={() => setActiveTab('post-job')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post New Role</span>
                </button>
              </div>
            </div>

            {/* CANDIDATE APPLICATIONS ROSTER */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
              
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 bg-white">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-500" /> Candidate Applications
                </h3>

                {/* Candidate Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedEmployerJobFilter}
                    onChange={(e) => setSelectedEmployerJobFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs"
                  >
                    <option value="All">All Roles ({appliedJobs.length})</option>
                    {jobs.map((j: any) => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>

                  <select
                    value={applicantStatusFilter}
                    onChange={(e) => setApplicantStatusFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs"
                  >
                    <option value="All">All Stages</option>
                    <option value="New Application">New Application</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <div className="relative w-full sm:w-44">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search applicant..."
                      value={applicantSearchQuery}
                      onChange={(e) => setApplicantSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Roster Table */}
              {filteredApplicants.length === 0 ? (
                <div className="p-10 text-center space-y-2 bg-slate-50/50">
                  <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500 font-medium">No candidates match the selected filters.</p>
                </div>
              ) : (
                <>
                  {/* Mobile Candidate Card View */}
                  <div className="md:hidden p-3.5 space-y-3 bg-slate-50/70">
                    {filteredApplicants.map((app: any) => {
                      const targetJob = jobs.find((j: any) => j.id === app.jobId);

                      return (
                        <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs">
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                                {app.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 text-xs truncate">{app.fullName}</h4>
                                <p className="text-[11px] text-slate-500 truncate">{app.email}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono border shrink-0 ${
                              app.atsScore >= 90 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              app.atsScore >= 80 ? 'bg-slate-100 text-slate-700 border-slate-200' :
                              'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              {app.atsScore}% ATS
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                            <p className="font-semibold text-slate-800 truncate">{targetJob ? targetJob.title : app.jobTitle}</p>
                            <p className="text-slate-400">{targetJob ? targetJob.company : 'Direct Opening'} · Applied {app.date}</p>
                          </div>

                          <div className="space-y-1 pt-0.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pipeline Stage</label>
                            <select 
                              value={app.status}
                              onChange={(e) => updateApplicantStatus(app.id, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg text-xs font-semibold border bg-white text-slate-800 border-slate-300 shadow-2xs min-h-[42px]"
                            >
                              <option value="New Application">New Application</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interviewing">Interviewing</option>
                              <option value="Hired">Hired</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <button 
                              onClick={() => setInspectingApplicant(app)}
                              className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs min-h-[40px]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect Candidate</span>
                            </button>
                            <button
                              onClick={() => {
                                setPdfModal({
                                  isOpen: true,
                                  mode: 'application-receipt',
                                  application: {
                                    ...app,
                                    jobTitle: targetJob ? targetJob.title : app.jobTitle,
                                    company: targetJob ? targetJob.company : app.company
                                  }
                                });
                              }}
                              className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-2xs min-h-[40px]"
                              title="Export candidate application receipt as PDF"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-500" />
                              <span>PDF</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Roster Table */}
                  <div className="hidden md:block overflow-x-auto w-full">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold bg-slate-50">
                          <th className="py-3 px-4">Applicant</th>
                          <th className="py-3 px-4">Role Applied</th>
                          <th className="py-3 px-4">ATS Match</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Pipeline Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                        {filteredApplicants.map((app: any) => {
                          const targetJob = jobs.find((j: any) => j.id === app.jobId);

                          return (
                            <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                              {/* Candidate info */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                                    {app.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900 text-xs truncate max-w-[140px]">{app.fullName}</p>
                                    <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{app.email}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Job title */}
                              <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800 truncate max-w-[180px]">{targetJob ? targetJob.title : app.jobTitle}</p>
                                <p className="text-[11px] text-slate-400">{targetJob ? targetJob.company : 'Direct Opening'}</p>
                              </td>

                              {/* ATS score */}
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${
                                  app.atsScore >= 90 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                  app.atsScore >= 80 ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                  'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                  {app.atsScore}%
                                </span>
                              </td>

                              {/* Date */}
                              <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                                {app.date}
                              </td>

                              {/* Status selector */}
                              <td className="py-3 px-4">
                                <select 
                                  value={app.status}
                                  onChange={(e) => updateApplicantStatus(app.id, e.target.value)}
                                  className="px-2.5 py-1 rounded text-xs font-semibold border cursor-pointer focus:outline-none bg-white text-slate-800 border-slate-300 shadow-2xs"
                                >
                                  <option value="New Application">New Application</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Shortlisted">Shortlisted</option>
                                  <option value="Interviewing">Interviewing</option>
                                  <option value="Hired">Hired</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </td>

                              {/* Inspect */}
                              <td className="py-3 px-4 text-right">
                                <button 
                                  onClick={() => setInspectingApplicant(app)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded text-xs font-semibold inline-flex items-center gap-1 shadow-2xs"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Inspect</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* MANAGED JOB LISTINGS SECTION */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                Active Organization Listings ({jobs.length})
              </h3>
              {jobs.map((job: any) => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">{job.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                        job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {job.company} · {job.location} · <span className="font-mono font-medium">${(job.salaryMin/1000).toFixed(0)}k–${(job.salaryMax/1000).toFixed(0)}k</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => setSelectedEmployerJobFilter(job.id)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Applicants ({appliedJobs.filter((a: any) => a.jobId === job.id).length})</span>
                    </button>

                    <button 
                      onClick={() => toggleJobStatus(job.id)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs"
                    >
                      {job.status === 'Active' ? <Pause className="w-3.5 h-3.5 text-slate-500" /> : <Play className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{job.status === 'Active' ? 'Pause' : 'Activate'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
              JE
            </div>
            <span className="font-bold text-slate-900">JobEngine Platform</span>
            <span>· Verified Career Infrastructure</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => { setRoleMode('seeker'); setActiveTab('feed'); }}
              className="hover:text-slate-900"
            >
              Seeker Feed
            </button>
            <span aria-hidden="true">·</span>
            <button 
              onClick={() => { setRoleMode('employer'); setActiveTab('my-posted-jobs'); }}
              className="hover:text-slate-900"
            >
              Employer Dashboard
            </button>
            <span aria-hidden="true">·</span>
            <button 
              onClick={() => setLoginModalOpen(true)}
              className="hover:text-slate-900 font-semibold text-slate-800"
            >
              {currentUser?.isLoggedIn ? 'Account Profile' : 'Sign In'}
            </button>
          </div>
        </div>
      </footer>

      {/* --- MODAL DIALOG: LOGIN & USER PROFILE (Directly answers "where is login") --- */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Account Authentication</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {currentUser?.isLoggedIn ? 'User Profile & Switch Role' : 'Sign In to JobEngine'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Access candidate applications, job alerts, and employer pipelines.
                </p>
              </div>
              <button 
                onClick={() => setLoginModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {currentUser?.isLoggedIn ? (
              /* LOGGED IN USER PROFILE VIEW */
              <div className="p-6 space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {currentUser.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-xs text-slate-500">{currentUser.email}</div>
                    </div>
                    <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {currentUser.role}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Saved Jobs</span>
                      <strong className="text-slate-800 font-mono">{savedJobIds.length} Bookmarks</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Applications</span>
                      <strong className="text-slate-800 font-mono">{appliedJobs.length} Submissions</strong>
                    </div>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Switch Active Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const u = { ...currentUser, role: 'seeker' };
                        setCurrentUser(u);
                        setRoleMode('seeker');
                        setActiveTab('feed');
                        localStorage.setItem('je_user', JSON.stringify(u));
                        showToast('Switched to Job Seeker mode');
                      }}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                        currentUser.role === 'seeker'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Job Seeker
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const u = { ...currentUser, role: 'employer' };
                        setCurrentUser(u);
                        setRoleMode('employer');
                        setActiveTab('my-posted-jobs');
                        localStorage.setItem('je_user', JSON.stringify(u));
                        showToast('Switched to Employer mode');
                      }}
                      className={`p-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                        currentUser.role === 'employer'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Employer
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* SIGN IN / CREATE ACCOUNT FORM */
              <div className="p-6 space-y-4">
                {/* Google Sign In via Firebase Auth */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-2xs transition-all hover:border-slate-400 min-h-[44px]"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-slate-400 text-[11px] font-medium uppercase tracking-wider">
                    or continue with email
                  </span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Tab Switcher: Sign In vs Create Account */}
                <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`flex-1 py-2 rounded-md text-center transition-all min-h-[38px] ${
                      authMode === 'signin' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2 rounded-md text-center transition-all min-h-[38px] ${
                      authMode === 'signup' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setLoginForm({ ...loginForm, role: 'seeker' })}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all min-h-[40px] ${
                          loginForm.role === 'seeker'
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Job Seeker
                      </button>
                      <button
                        type="button"
                        onClick={() => setLoginForm({ ...loginForm, role: 'employer' })}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all min-h-[40px] ${
                          loginForm.role === 'employer'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        Employer
                      </button>
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Mercer"
                        value={loginForm.name}
                        onChange={e => setLoginForm({ ...loginForm, name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-xs focus:outline-none focus:border-slate-900 text-slate-900 shadow-2xs"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-xs focus:outline-none focus:border-slate-900 text-slate-900 shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-xs focus:outline-none focus:border-slate-900 text-slate-900 shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-2xs transition-all flex items-center justify-center gap-2 mt-2 min-h-[44px]"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MODAL DIALOG: DETAILED CANDIDATE INSPECTION (EMPLOYER) --- */}
      {inspectingApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-base flex items-center justify-center shadow-xs">
                  {inspectingApplicant.fullName.split(' ').map((n: string) => n[0]).join('').substring(0,2)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">{inspectingApplicant.fullName}</h3>
                  <p className="text-xs font-medium text-slate-500">{inspectingApplicant.title} · {inspectingApplicant.location}</p>
                </div>
              </div>

              <button onClick={() => setInspectingApplicant(null)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Email</span>
                <span className="font-semibold text-slate-900 truncate block" title={inspectingApplicant.email}>{inspectingApplicant.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Phone</span>
                <span className="font-semibold text-slate-900">{inspectingApplicant.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">ATS Score</span>
                <span className="font-bold text-indigo-600 font-mono">{inspectingApplicant.atsScore}% Match</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Applied</span>
                <span className="font-mono text-slate-700 font-medium">{inspectingApplicant.date}</span>
              </div>
            </div>

            {/* Cover Note */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Candidate Cover Note</h4>
              <p className="text-xs text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 italic leading-relaxed shadow-2xs">
                "{inspectingApplicant.coverNote}"
              </p>
            </div>

            {/* Candidate Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Matched Competencies</h4>
              <div className="flex flex-wrap gap-1.5">
                {inspectingApplicant.skills?.map((sk: string, idx: number) => (
                  <span key={idx} className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded text-xs font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Resume Summary</h4>
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap shadow-inner">
                {inspectingApplicant.resumeSummary}
              </div>
            </div>

            {/* Status Change & Done */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                <span className="text-slate-500 font-medium">Pipeline Status:</span>
                <select 
                  value={inspectingApplicant.status}
                  onChange={(e) => updateApplicantStatus(inspectingApplicant.id, e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-900 shadow-2xs"
                >
                  <option value="New Application">New Application</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button 
                  onClick={() => {
                    const targetJob = jobs.find((j: any) => j.id === inspectingApplicant.jobId);
                    setPdfModal({
                      isOpen: true,
                      mode: 'application-receipt',
                      application: {
                        ...inspectingApplicant,
                        jobTitle: targetJob ? targetJob.title : inspectingApplicant.jobTitle,
                        company: targetJob ? targetJob.company : inspectingApplicant.company
                      }
                    });
                  }}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  title="Export candidate application receipt as PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export PDF Receipt</span>
                </button>

                <button 
                  onClick={() => setInspectingApplicant(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL DIALOG: VIEW JOB DETAILS (SEEKER) --- */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-slate-400" /> Job Details
              </div>
              <button 
                onClick={() => setViewingJob(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  {viewingJob.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-semibold text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {viewingJob.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {viewingJob.location}
                  </span>
                  <span className="flex items-center gap-1 font-mono font-bold text-slate-900">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" /> ${(viewingJob.salaryMin/1000).toFixed(0)}k – ${(viewingJob.salaryMax/1000).toFixed(0)}k/yr
                  </span>
                  {(() => {
                    const dInfo = getDeadlineInfo(viewingJob.deadline);
                    return (
                      <span className={`flex items-center gap-1 font-mono ${
                        dInfo.isUrgent 
                          ? 'text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded font-bold border border-amber-300' 
                          : dInfo.isExpired
                          ? 'text-slate-400 line-through'
                          : 'text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200'
                      }`}>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Deadline: {dInfo.text}</span>
                      </span>
                    );
                  })()}
                </div>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-semibold">
                    {viewingJob.type}
                  </span>
                  {viewingJob.remote && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-semibold">
                      Remote
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-semibold">
                    {viewingJob.industry}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  About the Role
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {viewingJob.description}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
                  Key Requirements
                </h3>
                <ul className="space-y-2">
                  {viewingJob.requirements?.map((req: string, i: number) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2.5">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2 sticky bottom-0 z-10 shadow-xs">
              <button 
                onClick={() => toggleBookmark(viewingJob.id)}
                title={savedJobIds.includes(viewingJob.id) ? 'Remove bookmark' : 'Bookmark job'}
                className={`p-2.5 rounded-lg border transition-colors shadow-2xs min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  savedJobIds.includes(viewingJob.id) 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : 'bg-white border-slate-300 text-slate-500 hover:text-slate-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${savedJobIds.includes(viewingJob.id) ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const dInfo = getDeadlineInfo(viewingJob.deadline);
                  setPdfModal({
                    isOpen: true,
                    mode: 'job-spec',
                    job: { ...viewingJob, deadlineRemainingText: dInfo.text }
                  });
                }}
                className="px-3 sm:px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors min-h-[44px]"
                title="Export this job specification as an official PDF document"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Export PDF</span>
              </button>
              
              {appliedJobs.some((a: any) => a.jobId === viewingJob.id && a.email === (currentUser?.email || applyForm.email)) ? (
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 py-2.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg flex items-center justify-center gap-1.5 font-semibold text-xs shadow-2xs min-h-[44px]">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Applied</span>
                  </div>
                  <button
                    onClick={() => {
                      const app = appliedJobs.find((a: any) => a.jobId === viewingJob.id && a.email === (currentUser?.email || applyForm.email));
                      if (app) {
                        setPdfModal({
                          isOpen: true,
                          mode: 'application-receipt',
                          application: { ...app, jobTitle: viewingJob.title, company: viewingJob.company }
                        });
                      }
                    }}
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs min-h-[44px]"
                    title="Export candidate application receipt as PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Receipt PDF</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => { setApplyModalJob(viewingJob); setViewingJob(null); }}
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 text-xs min-h-[44px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Quick Apply Now</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL DIALOG: QUICK APPLY FORM --- */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            
            <div className="bg-slate-50 border-b border-slate-200 p-4 sm:p-5 flex justify-between items-start shrink-0">
              <div className="min-w-0 pr-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-0.5 tracking-tight truncate">Apply to {applyModalJob.company}</h3>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider truncate">{applyModalJob.title}</p>
              </div>
              <button 
                onClick={() => setApplyModalJob(null)} 
                className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-2 rounded-lg transition-colors shadow-2xs min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                aria-label="Close apply dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-4 sm:p-6 space-y-3.5 bg-white overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate Full Name *</label>
                <input 
                  required 
                  type="text" 
                  value={applyForm.fullName} 
                  onChange={e => setApplyForm({...applyForm, fullName: e.target.value})} 
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-xs focus:outline-none focus:border-slate-900 text-slate-900 shadow-2xs" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address *</label>
                <input 
                  required 
                  type="email" 
                  value={applyForm.email} 
                  onChange={e => setApplyForm({...applyForm, email: e.target.value})} 
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-xs focus:outline-none focus:border-slate-900 text-slate-900 shadow-2xs" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</label>
                <input 
                  type="tel" 
                  value={applyForm.phone} 
                  onChange={e => setApplyForm({...applyForm, phone: e.target.value})} 
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-xs focus:outline-none focus:border-slate-900 text-slate-900 shadow-2xs" 
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidate Cover Note</label>
                <textarea 
                  rows={2} 
                  value={applyForm.coverNote} 
                  onChange={e => setApplyForm({...applyForm, coverNote: e.target.value})} 
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-base sm:text-xs focus:outline-none focus:border-slate-900 text-slate-900 resize-none shadow-2xs" 
                  placeholder="Note on why your background matches this role..."
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 mb-3 shadow-2xs">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-600 font-medium">Your active profile credentials will be automatically evaluated by the employer's ATS parser.</p>
                </div>
                <button 
                  type="submit" 
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 text-xs sm:text-sm min-h-[44px]"
                >
                  <CheckCircle className="w-4 h-4" /> 
                  <span>Submit Direct Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DIALOG: PREVIEW EMAIL ALERT --- */}
      {previewEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              </div>
              <button onClick={() => setPreviewEmailModal(null)} className="hover:text-slate-800"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="px-5 py-3 border-b border-slate-200 bg-white text-xs">
              <p><span className="text-slate-400 font-medium w-16 inline-block">From:</span> <strong>JobEngine Alerts</strong> &lt;alerts@jobengine.app&gt;</p>
              <p><span className="text-slate-400 font-medium w-16 inline-block">To:</span> {previewEmailModal.recipient}</p>
              <p><span className="text-slate-400 font-medium w-16 inline-block">Date:</span> Today, {previewEmailModal.sentAt}</p>
              <p className="mt-1.5"><span className="text-slate-400 font-medium w-16 inline-block">Subject:</span> <strong className="text-slate-900 font-semibold">{previewEmailModal.matchingCount} New Matches for "{previewEmailModal.alert.title}"</strong></p>
            </div>

            <div className="p-5 bg-slate-50 overflow-y-auto max-h-[50vh] space-y-3">
              <div className="text-center mb-3">
                <h3 className="text-base font-bold text-slate-900">Your Daily JobEngine Matches</h3>
                <p className="text-xs text-slate-500">We identified {previewEmailModal.matchingCount} positions matching your criteria.</p>
              </div>

              {jobs
                .filter((j: any) => (previewEmailModal.alert.industry === 'All' || j.industry === previewEmailModal.alert.industry) && j.salaryMax >= previewEmailModal.alert.minSalary)
                .slice(0, 3)
                .map((job: any) => (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-2xs">
                    <h4 className="font-bold text-slate-900">{job.title}</h4>
                    <p className="text-slate-600 font-medium">{job.company}</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono">{job.location} {job.remote && '· Remote'} · ${(job.salaryMin/1000).toFixed(0)}k–${(job.salaryMax/1000).toFixed(0)}k</p>
                  </div>
                ))}

              <div className="pt-2 text-center">
                <button 
                  onClick={() => setPreviewEmailModal(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-white border border-slate-200 shadow-xl rounded-xl px-4 py-3 flex items-center gap-3">
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500" />
            ) : toast.type === 'info' ? (
              <Bookmark className="w-4 h-4 text-slate-500" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            )}
            <p className="text-xs font-bold text-slate-800 pr-2">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-700 p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* --- MOBILE FILTER DRAWER BOTTOM SHEET --- */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end lg:hidden animate-in fade-in duration-200">
          <div 
            className="fixed inset-0"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative bg-white rounded-t-2xl max-h-[85vh] flex flex-col shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-250 z-10">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-600" />
                <h3 className="font-bold text-sm text-slate-900">Search & Filters</h3>
              </div>
              <div className="flex items-center gap-2">
                {(searchQuery || selectedIndustry !== 'All' || selectedLocation || remoteOnly || minSalaryFilter !== 80000) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIndustry('All');
                      setSelectedLocation('');
                      setRemoteOnly(false);
                      setMinSalaryFilter(80000);
                    }}
                    className="text-xs text-indigo-600 font-semibold px-2 py-1 rounded hover:bg-indigo-50"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Form Controls */}
            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Keywords</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Title, skills, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry / Domain</label>
                <select 
                  value={selectedIndustry} 
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-sm text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
                >
                  <option value="All">All Disciplines</option>
                  <option value="Tech & Software">Tech & Software</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Biotech">Biotech</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="e.g. Boston, San Francisco"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider">Min Base Salary</span>
                  <span className="font-mono font-bold text-slate-900">${(minSalaryFilter / 1000).toFixed(0)}k/yr</span>
                </div>
                <input 
                  type="range" 
                  min="50000" max="220000" step="10000"
                  value={minSalaryFilter}
                  onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                  className="w-full accent-slate-900 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="w-4 h-4 rounded-sm border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span className="text-sm font-medium text-slate-800">
                  100% Remote Eligible Only
                </span>
              </label>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center min-h-[44px]"
              >
                Show {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 flex items-center justify-around">
        {roleMode === 'seeker' ? (
          <>
            <button
              type="button"
              onClick={() => { setActiveTab('feed'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
                activeTab === 'feed' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Briefcase className={`w-5 h-5 ${activeTab === 'feed' ? 'stroke-[2.5px] text-slate-900' : ''}`} />
              <span className="text-[10px] mt-0.5">Jobs</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('saved'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg relative transition-colors ${
                activeTab === 'saved' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${activeTab === 'saved' ? 'stroke-[2.5px] text-slate-900' : ''}`} />
              <span className="text-[10px] mt-0.5">Saved</span>
              {savedJobIds.length > 0 && (
                <span className="absolute top-1 right-2 min-w-[16px] h-4 px-1 rounded-full bg-slate-900 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                  {savedJobIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('alerts'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
                activeTab === 'alerts' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Bell className={`w-5 h-5 ${activeTab === 'alerts' ? 'stroke-[2.5px] text-slate-900' : ''}`} />
              <span className="text-[10px] mt-0.5">Alerts</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('coach'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
                activeTab === 'coach' ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Sparkles className={`w-5 h-5 ${activeTab === 'coach' ? 'stroke-[2.5px] text-indigo-600' : ''}`} />
              <span className="text-[10px] mt-0.5">AI ATS</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser?.isLoggedIn ? currentUser.initials : <User className="w-3 h-3" />}
              </div>
              <span className="text-[10px] mt-0.5">{currentUser?.isLoggedIn ? 'Account' : 'Sign In'}</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => { setActiveTab('my-posted-jobs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg relative transition-colors ${
                activeTab === 'my-posted-jobs' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Building2 className={`w-5 h-5 ${activeTab === 'my-posted-jobs' ? 'stroke-[2.5px] text-slate-900' : ''}`} />
              <span className="text-[10px] mt-0.5">Applicants</span>
              {appliedJobs.length > 0 && (
                <span className="absolute top-1 right-2 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-mono flex items-center justify-center font-bold">
                  {appliedJobs.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('post-job'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
                activeTab === 'post-job' ? 'text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <PlusCircle className={`w-5 h-5 ${activeTab === 'post-job' ? 'stroke-[2.5px] text-slate-900' : ''}`} />
              <span className="text-[10px] mt-0.5">Post Job</span>
            </button>

            <button
              type="button"
              onClick={() => { setRoleMode('seeker'); setActiveTab('feed'); }}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">Seeker Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">
                {currentUser?.isLoggedIn ? currentUser.initials : <User className="w-3 h-3" />}
              </div>
              <span className="text-[10px] mt-0.5">{currentUser?.isLoggedIn ? 'Account' : 'Sign In'}</span>
            </button>
          </>
        )}
      </nav>

    </div>
  );
}
