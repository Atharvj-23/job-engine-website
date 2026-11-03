import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, Search, MapPin, DollarSign, Filter, Bell, Bookmark, PlusCircle, 
  UserCheck, Building2, Sparkles, Send, CheckCircle, Clock, ShieldCheck, 
  ChevronRight, ArrowRight, Eye, FileText, Settings, X, RefreshCw, Award, 
  TrendingUp, AlertCircle, Play, Pause, Trash2, Mail, ExternalLink, Zap
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
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
    description: 'Lead our core cloud transformation team. Architect resilient Kubernetes clusters, automate multi-region failovers, and maintain high-security infrastructure compliance for enterprise biotech clients.',
    requirements: ['8+ years experience with AWS/GCP', 'Deep expertise in Terraform & Helm', 'Kubernetes CKA certification preferred', 'Experience with HIPAA compliance'],
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
    description: 'Provide clinical pharmacotherapy services for complex oncology patients. Collaborate closely with oncologists, review protocol dosages, and oversee sterile compounding protocols.',
    requirements: ['PharmD degree required', 'Board Certified Oncology Pharmacist (BCOP)', 'Active State License', '2+ years hospital residency experience'],
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
    description: 'Develop deep learning models for molecular structure prediction and drug discovery pipelines. Train transformer models on massive protein structure databases.',
    requirements: ['Ph.D. in Computational Biology, CS, or Machine Learning', 'Strong PyTorch/TensorFlow background', 'Published research in top AI or Bioinformatics journals'],
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
    description: 'Design and prototype precision motor control actuators and sensor suites for autonomous surgical medical devices.',
    requirements: ['BS/MS in Mechanical or Mechatronics Engineering', '5+ years CAD & Embedded Systems design', 'SolidWorks / Altium Designer mastery'],
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
    description: 'Monitor high-acuity intensive care unit patients remotely across multiple partner hospitals. Real-time telemetry monitoring and emergency physician escalation.',
    requirements: ['BSN & Active RN License', '5+ years ICU/CCU bedside experience', 'CCRN certification preferred'],
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
  // --- STATE ---
  const [roleMode, setRoleMode] = useState('seeker'); // 'seeker' | 'employer'
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'alerts' | 'coach' | 'post-job' | 'my-posted-jobs'
  
  // Job & Application Data
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [savedJobIds, setSavedJobIds] = useState(['job-1']);
  const [appliedJobs, setAppliedJobs] = useState(INITIAL_APPLICANTS);
  
  // Employer Applicant Management Filter State
  const [selectedEmployerJobFilter, setSelectedEmployerJobFilter] = useState('All');
  const [applicantSearchQuery, setApplicantSearchQuery] = useState('');
  const [applicantStatusFilter, setApplicantStatusFilter] = useState('All');
  const [inspectingApplicant, setInspectingApplicant] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minSalaryFilter, setMinSalaryFilter] = useState(80000);
  
  // Selected Job for Detail Modal
  const [viewingJob, setViewingJob] = useState(null);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [applyForm, setApplyForm] = useState({ fullName: 'Dr. Alex Mercer', email: 'alex.mercer@bioeng.io', phone: '+1 (555) 234-5678', coverNote: '' });
  
  // Notification Toast State
  const [toast, setToast] = useState(null);
  
  // Employer Post Job Form State
  const [postJobForm, setPostJobForm] = useState({
    title: '',
    company: '',
    industry: 'Engineering',
    location: '',
    remote: false,
    salaryMin: 100000,
    salaryMax: 150000,
    type: 'Full-time',
    description: '',
    requirementsStr: ''
  });

  // AI Career Coach State
  const [resumeText, setResumeText] = useState(`ALEX MERCER, PharmD & Cloud Engineer\nEmail: alex.mercer@bioeng.io | Location: Boston, MA\nSUMMARY:\nDual-trained healthcare and technology professional with 4 years experience in health-tech automation, Python bioinformatics scripting, and clinical pharmacy workflows.\n\nEXPERIENCE:\n- Clinical Pharmacist | Regional Medical Center (2022 - Present)\n  * Managed sterile compounding and oncology dosing algorithms.\n  * Spearheaded EHR system integration for automated drug interaction alerts.\n- Data Analyst & Scripting Intern | MedTech Labs (2021)\n  * Built Python scripts for processing patient genomic datasets.\n\nSKILLS:\nPharmD, Clinical Pharmacy, Python, SQL, AWS Fundamentals, EHR Systems, HIPAA Compliance.`);
  const [targetJobTitle, setTargetJobTitle] = useState('Biomedical AI Research Scientist');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Job Alerts State
  const [jobAlerts, setJobAlerts] = useState([
    { id: 'alt-1', title: 'Oncology & Pharmacy - Senior Roles', industry: 'Pharmacy', remoteOnly: false, minSalary: 120000, emailDelivery: true, pushDelivery: true },
    { id: 'alt-2', title: 'Remote Cloud & AI Engineering', industry: 'Tech & Software', remoteOnly: true, minSalary: 150000, emailDelivery: true, pushDelivery: false }
  ]);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertIndustry, setNewAlertIndustry] = useState('Tech & Software');
  const [newAlertMinSalary, setNewAlertMinSalary] = useState(100000);
  const [previewEmailModal, setPreviewEmailModal] = useState(null);

  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- DERIVED FILTERED JOBS ---
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
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
  }, [jobs, searchQuery, selectedIndustry, selectedLocation, remoteOnly, minSalaryFilter]);

  // --- HANDLERS ---
  const handleApplySubmit = (e) => {
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
      atsScore: Math.floor(Math.random() * (98 - 75 + 1)) + 75,
      coverNote: applyForm.coverNote || 'Excited to apply and submit my credentials for review.',
      resumeSummary: resumeText.substring(0, 180) + '...',
      skills: ['Domain Expertise', 'Problem Solving', 'Team Collaboration']
    };

    setAppliedJobs([newApplication, ...appliedJobs]);
    
    // Increment applicant count on job
    setJobs(jobs.map(j => j.id === applyModalJob.id ? { ...j, applicantsCount: j.applicantsCount + 1 } : j));
    
    showToast(`Application submitted! Employer can now view your candidate profile.`);
    setApplyModalJob(null);
    setApplyForm({ ...applyForm, coverNote: '' });
  };

  const updateApplicantStatus = (applicantId, newStatus) => {
    setAppliedJobs(appliedJobs.map(app => 
      app.id === applicantId ? { ...app, status: newStatus } : app
    ));
    if (inspectingApplicant && inspectingApplicant.id === applicantId) {
      setInspectingApplicant({ ...inspectingApplicant, status: newStatus });
    }
    showToast(`Candidate status updated to "${newStatus}"`);
  };

  // Filter Applicants for Employer Dashboard View
  const filteredApplicants = useMemo(() => {
    return appliedJobs.filter(app => {
      const matchesJob = selectedEmployerJobFilter === 'All' || app.jobId === selectedEmployerJobFilter;
      const matchesStatus = applicantStatusFilter === 'All' || app.status === applicantStatusFilter;
      const matchesSearch = applicantSearchQuery === '' || 
        app.fullName.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
        app.skills.some(s => s.toLowerCase().includes(applicantSearchQuery.toLowerCase()));

      return matchesJob && matchesStatus && matchesSearch;
    });
  }, [appliedJobs, selectedEmployerJobFilter, applicantStatusFilter, applicantSearchQuery]);

  const toggleBookmark = (jobId) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds(savedJobIds.filter(id => id !== jobId));
      showToast('Removed job from bookmarks', 'info');
    } else {
      setSavedJobIds([...savedJobIds, jobId]);
      showToast('Job saved to your bookmarks!');
    }
  };

  const handlePostJob = (e) => {
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
      description: postJobForm.description || 'Exciting opportunity to join our expanding engineering team.',
      requirements: reqArray,
      applicantsCount: 0,
      status: 'Active',
      featured: true
    };

    setJobs([newJob, ...jobs]);
    showToast('Job posting created and published live!');
    
    // Reset Form
    setPostJobForm({
      title: '',
      company: '',
      industry: 'Engineering',
      location: '',
      remote: false,
      salaryMin: 100000,
      salaryMax: 150000,
      type: 'Full-time',
      description: '',
      requirementsStr: ''
    });

    setActiveTab('my-posted-jobs');
  };

  const applyTemplate = (template) => {
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
      requirementsStr: template.requirements.join('\n')
    });
    showToast(`Auto-filled template: ${template.title}`);
  };

  const toggleJobStatus = (jobId) => {
    setJobs(jobs.map(j => {
      if (j.id === jobId) {
        const nextStatus = j.status === 'Active' ? 'Paused' : 'Active';
        showToast(`Job status updated to ${nextStatus}`);
        return { ...j, status: nextStatus };
      }
      return j;
    }));
  };

  // --- GEMINI API ATS RESUME ANALYSIS ---
  const runAiAtsAnalysis = async () => {
    if (!resumeText.trim()) {
      showToast('Please paste or type resume content to analyze', 'error');
      return;
    }

    setAiAnalyzing(true);
    setAiResult(null);

    const prompt = `Act as an expert ATS (Applicant Tracking System) Evaluator and Senior Technical Career Coach in Engineering, Pharmacy, Healthcare, and Tech.
Analyze the following candidate resume for the target position: "${targetJobTitle}".

RESUME TEXT:
"""
${resumeText}
"""

Please return a JSON response with the exact structure:
{
  "atsScore": <number between 40 and 98>,
  "verdict": "<Short string, e.g. Highly Competitive / Moderate Match / Needs Targeted Revisions>",
  "matchingSkills": ["skill1", "skill2", "skill3", "skill4"],
  "skillGaps": ["gap1", "gap2", "gap3"],
  "improvements": ["actionable advice 1", "actionable advice 2", "actionable advice 3"],
  "salaryAdvice": "<Paragraph on expected compensation benchmarks and negotiation tactics for this position>"
}`;

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) {
        throw new Error(`API response error status: ${response.status}`);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawText) {
        const parsed = JSON.parse(rawText);
        setAiResult(parsed);
        showToast('ATS Evaluation Complete!');
      } else {
        throw new Error("Empty candidate result from AI");
      }
    } catch (err) {
      console.warn("Falling back to local intelligent evaluation engine:", err);
      // Deterministic realistic fallback engine
      setTimeout(() => {
        const hasPharm = resumeText.toLowerCase().includes('pharm') || resumeText.toLowerCase().includes('clinical');
        const hasTech = resumeText.toLowerCase().includes('python') || resumeText.toLowerCase().includes('cloud') || resumeText.toLowerCase().includes('aws');
        
        let score = 72;
        if (hasPharm && hasTech) score = 89;

        setAiResult({
          atsScore: score,
          verdict: score > 80 ? 'Strong Interdisciplinary Match' : 'Moderate Technical Alignment',
          matchingSkills: [
            hasPharm ? 'Clinical Pharmacy Workflow' : 'System Automation',
            hasTech ? 'Python & Cloud Fundamentals' : 'Data Integrity',
            'Healthcare HIPAA Compliance',
            'Analytical Problem Solving'
          ],
          skillGaps: [
            'Deep Learning / PyTorch modeling experience',
            'Regulatory ISO/FDA trial documentation standards',
            'Production CI/CD deployment pipelines'
          ],
          improvements: [
            'Quantify clinical and software outcomes with concrete metrics (e.g., "Reduced processing latency by 35%")',
            'Highlight project repositories or clinical study titles explicitly in your summary header',
            'Add explicit certifications relevant to ' + targetJobTitle
          ],
          salaryAdvice: `Based on current market data for ${targetJobTitle}, the average range spans $140,000 to $190,000. Highlight your dual domain mastery in both clinical health frameworks and modern software stack during initial recruiter screens.`
        });
        showToast('ATS Evaluation Completed (Local Engine)');
      }, 1200);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleCreateAlert = (e) => {
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

  const triggerAlertDispatch = (alert) => {
    const matchingCount = jobs.filter(j => 
      (alert.industry === 'All' || j.industry === alert.industry) &&
      j.salaryMax >= alert.minSalary
    ).length;

    setPreviewEmailModal({
      alert,
      matchingCount,
      recipient: 'alex.mercer@bioeng.io',
      sentAt: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 hidden sm:block">
              JobEngine
            </h1>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Role Switcher */}
            <div className="flex p-0.5 bg-slate-100/80 rounded-lg border border-slate-200 shadow-inner">
              <button 
                onClick={() => { setRoleMode('seeker'); setActiveTab('feed'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${roleMode === 'seeker' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Seeker
              </button>
              <button 
                onClick={() => { setRoleMode('employer'); setActiveTab('my-posted-jobs'); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${roleMode === 'employer' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Employer
              </button>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border border-white rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 border border-indigo-700 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
              {roleMode === 'seeker' ? 'AM' : 'HR'}
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="border-b border-slate-200 bg-white shadow-sm z-30 relative">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {roleMode === 'seeker' ? (
            <>
              <button onClick={() => setActiveTab('feed')} className={`py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'feed' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Job Feed</button>
              <button onClick={() => setActiveTab('alerts')} className={`py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'alerts' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Job Alerts</button>
              <button onClick={() => setActiveTab('coach')} className={`py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'coach' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                <Sparkles className="w-4 h-4" /> AI Coach
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setActiveTab('my-posted-jobs')} className={`py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${activeTab === 'my-posted-jobs' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                Dashboard
              </button>
              <button onClick={() => setActiveTab('post-job')} className={`py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'post-job' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Post a Job</button>
            </>
          )}
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        
        {/* TAB 1: JOB FEED (SEEKER) */}
        {activeTab === 'feed' && (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0 space-y-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-sm text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider"><Filter className="w-4 h-4 text-slate-400" /> Filters</h3>
                
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Search Keywords</label>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Title, company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry</label>
                    <select 
                      value={selectedIndustry} 
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                    >
                      <option value="All">All Industries</option>
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
                        placeholder="City, State"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                      <span>Min Salary</span>
                      <span className="text-slate-900 font-bold">${(minSalaryFilter / 1000).toFixed(0)}k</span>
                    </label>
                    <input 
                      type="range" 
                      min="50000" max="250000" step="10000"
                      value={minSalaryFilter}
                      onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                      className="w-full accent-slate-900"
                    />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group pt-2">
                    <input 
                      type="checkbox" 
                      checked={remoteOnly}
                      onChange={(e) => setRemoteOnly(e.target.checked)}
                      className="w-4 h-4 rounded-[4px] border-slate-300 text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Remote Only</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Recommended Roles <span className="text-slate-400 font-normal ml-1">({filteredJobs.length})</span></h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 flex items-center gap-1.5 shadow-sm">
                    <Bookmark className="w-3 h-3 text-slate-400" /> {savedJobIds.length} Saved
                  </span>
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-300 rounded-xl bg-white shadow-sm">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-slate-700">No matching jobs found</h3>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map(job => (
                    <div key={job.id} className={`group bg-white border rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${job.featured ? 'border-indigo-200 hover:border-indigo-300 bg-indigo-50/10' : 'border-slate-200 hover:border-slate-300'}`}>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                            {job.featured && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded text-[10px] uppercase font-bold tracking-wider flex items-center gap-1"><Sparkles className="w-3 h-3" /> Promoted</span>}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                            <span className="flex items-center gap-1 font-medium text-slate-700"><Building2 className="w-4 h-4 text-slate-400" /> {job.company}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-400" /> {job.location} {job.remote && '(Remote)'}</span>
                            <span className="flex items-center gap-1 text-slate-700 font-medium"><DollarSign className="w-4 h-4 text-slate-400" /> ${(job.salaryMin/1000).toFixed(0)}k - ${(job.salaryMax/1000).toFixed(0)}k</span>
                            <span className="flex items-center gap-1 text-slate-500"><Clock className="w-4 h-4 text-slate-400" /> {job.postedDaysAgo === 0 ? 'Today' : `${job.postedDaysAgo}d ago`}</span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(job.id); }}
                            className={`p-2 rounded-lg border transition-colors shadow-sm ${savedJobIds.includes(job.id) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                          >
                            <Bookmark className={`w-4 h-4 ${savedJobIds.includes(job.id) ? 'fill-current' : ''}`} />
                          </button>
                          <button 
                            onClick={() => setViewingJob(job)}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                        <span className="text-xs bg-slate-100 border border-slate-200/60 px-2 py-1 rounded-md text-slate-600 font-medium">{job.industry}</span>
                        <span className="text-xs bg-slate-100 border border-slate-200/60 px-2 py-1 rounded-md text-slate-600 font-medium">{job.type}</span>
                        {appliedJobs.some(a => a.jobId === job.id && a.email === applyForm.email) && (
                          <span className="ml-auto text-xs font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100"><CheckCircle className="w-3.5 h-3.5" /> Applied</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: JOB ALERTS */}
        {activeTab === 'alerts' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-sm">
              <div className="flex-1 space-y-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1 tracking-tight">
                    <Bell className="w-5 h-5 text-slate-400" /> Automated Job Alerts
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Configure custom searches and we will deliver highly-matched roles directly to your inbox.
                  </p>
                </div>
                
                <form onSubmit={handleCreateAlert} className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Alert Name / Keywords</label>
                      <input 
                        required
                        type="text" 
                        value={newAlertTitle}
                        onChange={e => setNewAlertTitle(e.target.value)}
                        placeholder="e.g. Remote Cloud Architect"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Filter</label>
                      <select 
                        value={newAlertIndustry}
                        onChange={e => setNewAlertIndustry(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
                      >
                        <option value="All">All Industries</option>
                        <option value="Tech & Software">Tech & Software</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Pharmacy">Pharmacy</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded-[4px] border-slate-300 text-slate-900 focus:ring-slate-900" />
                        <span className="text-sm font-medium text-slate-700">Email Updates</span>
                      </label>
                    </div>
                    <button type="submit" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all">
                      Create Alert
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">Active Configured Alerts</h3>
              {jobAlerts.length === 0 ? (
                <p className="text-sm text-slate-500">You haven't set up any alerts yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobAlerts.map(alert => (
                    <div key={alert.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between group hover:border-slate-300 hover:shadow-sm transition-all duration-200">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] uppercase font-bold rounded">Active</span>
                        </div>
                        <p className="text-sm text-slate-500">Industry: {alert.industry} • Min Salary: ${(alert.minSalary/1000).toFixed(0)}k</p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                          {alert.emailDelivery && <Mail className="w-4 h-4 text-slate-400" />}
                          Delivery: Daily
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => triggerAlertDispatch(alert)}
                            className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 shadow-sm transition-colors"
                          >
                            Preview Email
                          </button>
                          <button 
                            onClick={() => setJobAlerts(jobAlerts.filter(a => a.id !== alert.id))}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors bg-white border border-slate-200 hover:bg-rose-50 rounded-md shadow-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AI CAREER COACH */}
        {activeTab === 'coach' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="bg-slate-900 rounded-xl p-6 md:p-8 shadow-md relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">AI ATS Evaluator & Coach</h2>
                  </div>
                  <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                    Paste your resume text below and enter a target job title. Our parsing engine will evaluate semantic alignment, identify missing keywords, and provide actionable tips to bypass ATS filters.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Area */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col h-[600px] shadow-sm">
                <div className="mb-5 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Job Title</label>
                  <input 
                    type="text" 
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all shadow-sm"
                    placeholder="e.g. Senior Product Manager"
                  />
                </div>
                <div className="flex-1 flex flex-col space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                    <span>Resume Content</span>
                    <span className="text-slate-400 font-normal">Plain text format</span>
                  </label>
                  <textarea 
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-none shadow-inner"
                    placeholder="Paste your resume here..."
                  ></textarea>
                </div>
                <button 
                  onClick={runAiAtsAnalysis}
                  disabled={aiAnalyzing}
                  className="mt-5 w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                  {aiAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {aiAnalyzing ? 'Analyzing Alignment...' : 'Analyze Document'}
                </button>
              </div>

              {/* Results Area */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 h-[600px] overflow-y-auto shadow-sm">
                {!aiResult && !aiAnalyzing ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 mb-2">
                      <ShieldCheck className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">Awaiting Input</h3>
                    <p className="text-sm text-slate-500">Run the evaluator to generate your ATS score, skill gaps, and custom negotiation advice.</p>
                  </div>
                ) : aiAnalyzing ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                    <h3 className="text-base font-semibold text-slate-900">Processing Document</h3>
                    <p className="text-sm text-slate-500">Extracting semantic entities and comparing against market requirements...</p>
                  </div>
                ) : aiResult ? (
                  <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                    
                    {/* Score Header */}
                    <div className="flex items-center gap-5 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                          <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="213.6" strokeDashoffset={213.6 - (213.6 * aiResult.atsScore) / 100} className={`transition-all duration-1000 ease-out ${aiResult.atsScore >= 80 ? 'text-indigo-600' : aiResult.atsScore >= 60 ? 'text-amber-500' : 'text-slate-400'}`} />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-bold text-slate-900">{aiResult.atsScore}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">{aiResult.verdict}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">Your profile's alignment against standard ATS parsers for <strong>{targetJobTitle}</strong>.</p>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                        <h4 className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-indigo-500" /> Present Keywords</h4>
                        <ul className="space-y-2">
                          {aiResult.matchingSkills.map((skill, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2 font-medium">
                              <span className="text-indigo-400 mt-0.5">•</span> {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                        <h4 className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Missing Keywords</h4>
                        <ul className="space-y-2">
                          {aiResult.skillGaps.map((gap, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2 font-medium">
                              <span className="text-amber-500 mt-0.5">•</span> {gap}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actionable Advice */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-slate-400" /> Improvement Action Plan</h4>
                      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-sm">
                        {aiResult.improvements.map((tip, i) => (
                          <div key={i} className="flex gap-3 text-sm">
                            <span className="flex-shrink-0 w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200">{i+1}</span>
                            <p className="text-slate-700 mt-0.5 leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Salary Insight */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-slate-700 uppercase flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" /> Compensation Insight</h4>
                      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 text-sm text-slate-600 leading-relaxed">
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
            <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
              
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-1 tracking-tight">
                  <PlusCircle className="w-5 h-5 text-slate-400" /> Create Job Listing
                </h2>
                <p className="text-sm text-slate-500">Distribute your open role across our network and attract verified top talent instantly.</p>
              </div>

              {/* Templates */}
              <div className="mb-6 space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Templates</span>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => applyTemplate(INITIAL_JOBS[1])} className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 hover:text-slate-900 text-slate-600 text-xs rounded-lg transition-colors font-medium shadow-sm">Clinical Pharmacist</button>
                  <button onClick={() => applyTemplate(INITIAL_JOBS[0])} className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 hover:text-slate-900 text-slate-600 text-xs rounded-lg transition-colors font-medium shadow-sm">Cloud Architect</button>
                  <button onClick={() => applyTemplate(INITIAL_JOBS[3])} className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-900 hover:text-slate-900 text-slate-600 text-xs rounded-lg transition-colors font-medium shadow-sm">Hardware Engineer</button>
                </div>
              </div>

              <form onSubmit={handlePostJob} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Job Title *</label>
                    <input required type="text" value={postJobForm.title} onChange={e => setPostJobForm({...postJobForm, title: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm" placeholder="e.g. Senior Software Engineer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Company Name *</label>
                    <input required type="text" value={postJobForm.company} onChange={e => setPostJobForm({...postJobForm, company: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm" placeholder="e.g. Acme Corp" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Industry</label>
                    <select value={postJobForm.industry} onChange={e => setPostJobForm({...postJobForm, industry: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm">
                      <option value="Tech & Software">Tech & Software</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Pharmacy">Pharmacy</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Biotech">Biotech</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Location</label>
                    <input type="text" value={postJobForm.location} onChange={e => setPostJobForm({...postJobForm, location: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm" placeholder="e.g. Austin, TX" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Min Salary ($)</label>
                    <input type="number" value={postJobForm.salaryMin} onChange={e => setPostJobForm({...postJobForm, salaryMin: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase">Max Salary ($)</label>
                    <input type="number" value={postJobForm.salaryMax} onChange={e => setPostJobForm({...postJobForm, salaryMax: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm" />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                  <input type="checkbox" checked={postJobForm.remote} onChange={e => setPostJobForm({...postJobForm, remote: e.target.checked})} className="w-4 h-4 rounded-[4px] border-slate-300 text-slate-900 focus:ring-slate-900" />
                  <span className="text-sm font-semibold text-slate-700">This is a fully remote position</span>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Job Description</label>
                  <textarea rows="3" value={postJobForm.description} onChange={e => setPostJobForm({...postJobForm, description: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-y shadow-sm" placeholder="Describe the role..."></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                    <span>Requirements</span>
                    <span className="text-slate-400 font-normal normal-case">One per line</span>
                  </label>
                  <textarea rows="4" value={postJobForm.requirementsStr} onChange={e => setPostJobForm({...postJobForm, requirementsStr: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 text-slate-900 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-y shadow-sm" placeholder="5+ years experience..."></textarea>
                </div>

                <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Publish Job Posting
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: EMPLOYER DASHBOARD & FULL APPLICANT CANDIDATE LIST */}
        {activeTab === 'my-posted-jobs' && roleMode === 'employer' && (
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Employer Metrics Header */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2 tracking-tight">
                  <Building2 className="w-5 h-5 text-slate-400" /> Employer Pipeline
                </h2>
                <p className="text-sm text-slate-500">
                  Manage posted job listings, inspect incoming applicants, and update hiring statuses.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex flex-col items-center md:items-start px-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Total Applicants</span>
                  <strong className="text-slate-900 text-2xl font-bold tracking-tight leading-none">{appliedJobs.length}</strong>
                </div>
                <div className="w-px h-10 bg-slate-200 hidden md:block"></div>
                <div className="flex flex-col items-center md:items-start px-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Active Jobs</span>
                  <strong className="text-slate-900 text-2xl font-bold tracking-tight leading-none">{jobs.filter(j => j.status === 'Active').length}</strong>
                </div>
                <button 
                  onClick={() => setActiveTab('post-job')}
                  className="ml-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-sm transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Post Job
                </button>
              </div>
            </div>

            {/* CANDIDATE APPLICANTS MANAGEMENT SECTION */}
            <div className="bg-white border border-slate-200 rounded-xl p-0 shadow-sm overflow-hidden flex flex-col">
              
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 bg-white">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-400" /> Candidate Submissions
                  </h3>
                </div>

                {/* Filters for Candidate Table */}
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={selectedEmployerJobFilter}
                    onChange={(e) => setSelectedEmployerJobFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
                  >
                    <option value="All">All Jobs ({appliedJobs.length})</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                  </select>

                  <select
                    value={applicantStatusFilter}
                    onChange={(e) => setApplicantStatusFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
                  >
                    <option value="All">All Statuses</option>
                    <option value="New Application">New Application</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search candidate..."
                      value={applicantSearchQuery}
                      onChange={(e) => setApplicantSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* APPLICANT CANDIDATES ROSTER TABLE */}
              {filteredApplicants.length === 0 ? (
                <div className="p-10 text-center space-y-3 bg-slate-50/50">
                  <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm text-slate-500 font-medium">No candidates matched the selected job or status filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold bg-slate-50">
                        <th className="py-3 px-5">Candidate</th>
                        <th className="py-3 px-5">Applied Position</th>
                        <th className="py-3 px-5">ATS Match</th>
                        <th className="py-3 px-5">Applied Date</th>
                        <th className="py-3 px-5">Pipeline Status</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                      {filteredApplicants.map(app => {
                        const targetJob = jobs.find(j => j.id === app.jobId);

                        return (
                          <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                            
                            {/* Candidate Info */}
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs flex-shrink-0">
                                  {app.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm truncate max-w-[140px]">{app.fullName}</p>
                                  <p className="text-xs text-slate-500 truncate max-w-[140px] font-medium">{app.email}</p>
                                </div>
                              </div>
                            </td>

                            {/* Job Title */}
                            <td className="py-3 px-5">
                              <p className="font-medium text-slate-800 line-clamp-1 max-w-[180px]">{targetJob ? targetJob.title : app.jobTitle}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{targetJob ? targetJob.industry : 'Healthcare & Tech'}</p>
                            </td>

                            {/* ATS Score */}
                            <td className="py-3 px-5">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                                app.atsScore >= 90 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                app.atsScore >= 80 ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {app.atsScore}% Score
                              </span>
                            </td>

                            {/* Applied Date */}
                            <td className="py-3 px-5 text-slate-500 font-mono text-xs">
                              {app.date}
                            </td>

                            {/* Application Status Selector */}
                            <td className="py-3 px-5">
                              <select 
                                value={app.status}
                                onChange={(e) => updateApplicantStatus(app.id, e.target.value)}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold border cursor-pointer focus:outline-none w-36 shadow-sm ${
                                  app.status === 'Hired' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  app.status === 'Shortlisted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                  app.status === 'Interviewing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  app.status === 'Rejected' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                  'bg-white text-slate-700 border-slate-300'
                                }`}
                              >
                                <option value="New Application">New Application</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Shortlisted">Shortlisted</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Hired">Hired</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-5 text-right">
                              <button 
                                onClick={() => setInspectingApplicant(app)}
                                className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors shadow-sm"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" /> Inspect
                              </button>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

            {/* MANAGED JOB POSTINGS SECTION */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">Your Active Job Listings</h3>
              {jobs.map(job => (
                <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-slate-900 text-base">{job.title}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border ${
                        job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{job.company} • {job.location} • ${(job.salaryMin/1000).toFixed(0)}k-${(job.salaryMax/1000).toFixed(0)}k/yr</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={() => setSelectedEmployerJobFilter(job.id)}
                      className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      View Applicants ({appliedJobs.filter(a => a.jobId === job.id).length})
                    </button>

                    <button 
                      onClick={() => toggleJobStatus(job.id)}
                      className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      {job.status === 'Active' ? <Pause className="w-3.5 h-3.5 text-slate-500" /> : <Play className="w-3.5 h-3.5 text-slate-500" />}
                      {job.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* --- MODAL DIALOG: DETAILED CANDIDATE INSPECTION --- */}
      {inspectingApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-lg flex items-center justify-center shadow-sm">
                  {inspectingApplicant.fullName.split(' ').map(n => n[0]).join('').substring(0,2)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{inspectingApplicant.fullName}</h3>
                  <p className="text-sm font-medium text-slate-500">{inspectingApplicant.title} • {inspectingApplicant.location}</p>
                </div>
              </div>

              <button onClick={() => setInspectingApplicant(null)} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/50 p-4 rounded-lg border border-slate-200 text-sm">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Email</span>
                <span className="font-medium text-slate-900 truncate block pr-2" title={inspectingApplicant.email}>{inspectingApplicant.email}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Phone</span>
                <span className="font-medium text-slate-900">{inspectingApplicant.phone}</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">ATS Score</span>
                <span className="font-bold text-indigo-600">{inspectingApplicant.atsScore}% Match</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Applied</span>
                <span className="font-mono text-slate-700 font-medium">{inspectingApplicant.date}</span>
              </div>
            </div>

            {/* Applied Cover Note */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Candidate Cover Note</h4>
              <p className="text-sm text-slate-700 bg-white p-4 rounded-lg border border-slate-200 italic leading-relaxed shadow-sm">
                "{inspectingApplicant.coverNote}"
              </p>
            </div>

            {/* Candidate Skills */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Matched Competencies</h4>
              <div className="flex flex-wrap gap-2">
                {inspectingApplicant.skills.map((sk, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-xs font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Resume Summary</h4>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 font-mono leading-relaxed whitespace-pre-wrap shadow-inner">
                {inspectingApplicant.resumeSummary}
              </div>
            </div>

            {/* Pipeline Status Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-5">
              <div className="flex items-center gap-3 text-sm w-full sm:w-auto">
                <span className="text-slate-500 font-medium whitespace-nowrap">Pipeline Status:</span>
                <select 
                  value={inspectingApplicant.status}
                  onChange={(e) => updateApplicantStatus(inspectingApplicant.id, e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 w-full sm:w-auto shadow-sm"
                >
                  <option value="New Application">New Application</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button 
                  onClick={() => { showToast(`Candidate resume exported for ${inspectingApplicant.fullName}`); }}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                >
                  <FileText className="w-4 h-4 text-slate-400" /> Export
                </button>

                <button 
                  onClick={() => setInspectingApplicant(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL DIALOG: VIEW JOB DETAILS --- */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            <div className="p-5 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-slate-400" /> Job Details
              </div>
              <button onClick={() => setViewingJob(null)} className="p-1.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-md transition-colors border border-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{viewingJob.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-800 font-medium"><Building2 className="w-4 h-4 text-slate-400" /> {viewingJob.company}</span>
                  <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4 text-slate-400" /> {viewingJob.location}</span>
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium"><DollarSign className="w-4 h-4 text-slate-400" /> ${(viewingJob.salaryMin/1000).toFixed(0)}k - ${(viewingJob.salaryMax/1000).toFixed(0)}k</span>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold">{viewingJob.type}</span>
                  {viewingJob.remote && <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold">Remote</span>}
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold">{viewingJob.industry}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">About the Role</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{viewingJob.description}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Key Requirements</h3>
                <ul className="space-y-3">
                  {viewingJob.requirements.map((req, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <button 
                onClick={() => { toggleBookmark(viewingJob.id); }}
                className={`p-3 rounded-lg border transition-colors shadow-sm ${savedJobIds.includes(viewingJob.id) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-300 text-slate-500 hover:text-slate-800'}`}
              >
                <Bookmark className={`w-5 h-5 ${savedJobIds.includes(viewingJob.id) ? 'fill-current' : ''}`} />
              </button>
              
              {appliedJobs.some(a => a.jobId === viewingJob.id && a.email === applyForm.email) ? (
                <div className="flex-1 py-3 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg flex items-center justify-center gap-2 font-semibold text-sm shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Application Submitted
                </div>
              ) : (
                <button 
                  onClick={() => { setApplyModalJob(viewingJob); setViewingJob(null); }}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" /> Quick Apply Now
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL DIALOG: QUICK APPLY FORM --- */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-50 border-b border-slate-200 p-5 flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-0.5 tracking-tight">Apply to {applyModalJob.company}</h3>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{applyModalJob.title}</p>
              </div>
              <button onClick={() => setApplyModalJob(null)} className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 p-1.5 rounded-md transition-colors shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="p-6 space-y-4 bg-white">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Full Name</label>
                <input required type="text" value={applyForm.fullName} onChange={e => setApplyForm({...applyForm, fullName: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-slate-900 shadow-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <input required type="email" value={applyForm.email} onChange={e => setApplyForm({...applyForm, email: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-slate-900 shadow-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <input type="tel" value={applyForm.phone} onChange={e => setApplyForm({...applyForm, phone: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-slate-900 shadow-sm" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cover Note (Optional)</label>
                <textarea rows="3" value={applyForm.coverNote} onChange={e => setApplyForm({...applyForm, coverNote: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-slate-900 resize-none shadow-sm" placeholder="Brief message to the hiring manager..."></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3 mb-4 shadow-sm">
                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 font-medium">Your active resume profile will be automatically parsed by the employer's ATS.</p>
                </div>
                <button type="submit" className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" /> Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DIALOG: PREVIEW EMAIL ALERT --- */}
      {previewEmailModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            {/* Email Header Simulation */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 border border-slate-400"></span>
              </div>
              <button onClick={() => setPreviewEmailModal(null)} className="hover:text-slate-800"><X className="w-4 h-4" /></button>
            </div>
            
            <div className="px-5 py-4 border-b border-slate-200 bg-white">
              <p className="text-sm"><span className="text-slate-500 font-medium w-16 inline-block">From:</span> <strong className="font-semibold">JobEngine Alerts</strong> &lt;alerts@jobengine.app&gt;</p>
              <p className="text-sm"><span className="text-slate-500 font-medium w-16 inline-block">To:</span> {previewEmailModal.recipient}</p>
              <p className="text-sm"><span className="text-slate-500 font-medium w-16 inline-block">Date:</span> Today, {previewEmailModal.sentAt}</p>
              <p className="text-sm mt-2"><span className="text-slate-500 font-medium w-16 inline-block">Subject:</span> <strong className="text-slate-900 font-semibold">{previewEmailModal.matchingCount} New Matches for "{previewEmailModal.alert.title}"</strong></p>
            </div>

            <div className="p-6 bg-slate-50 overflow-y-auto max-h-[50vh]">
              <div className="text-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Daily Matches</h2>
                <p className="text-sm text-slate-500 mt-1">We found {previewEmailModal.matchingCount} new roles matching your criteria.</p>
              </div>

              <div className="space-y-3">
                {jobs.filter(j => (previewEmailModal.alert.industry === 'All' || j.industry === previewEmailModal.alert.industry) && j.salaryMax >= previewEmailModal.alert.minSalary).slice(0,3).map(job => (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <h3 className="font-semibold text-slate-900 mb-1">{job.title}</h3>
                    <p className="text-sm font-medium text-slate-700">{job.company}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{job.location} {job.remote && '• Remote'} • ${(job.salaryMin/1000).toFixed(0)}k-${(job.salaryMax/1000).toFixed(0)}k</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors">View All Matches</button>
                <p className="text-xs text-slate-400 mt-4">Manage preferences in your account.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-white border border-slate-200 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3">
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-amber-500" />
            ) : toast.type === 'info' ? (
              <Bookmark className="w-5 h-5 text-slate-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-indigo-500" />
            )}
            <p className="text-sm font-medium text-slate-800 pr-2">{toast.message}</p>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}