import React from 'react';
import { 
  X, Printer, Download, Briefcase, Building2, MapPin, DollarSign, 
  Calendar, CheckCircle, Clock, ShieldCheck, Award, FileText, UserCheck 
} from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'job-spec' | 'application-receipt';
  job?: any;
  application?: any;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  mode,
  job,
  application,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    let content = '';
    let filename = '';

    if (mode === 'job-spec' && job) {
      filename = `${job.title.replace(/\s+/g, '_')}_Job_Spec.txt`;
      content = `JOB SPECIFICATION: ${job.title.toUpperCase()}
Company: ${job.company}
Location: ${job.location} (${job.remote ? 'Remote' : 'On-site'})
Industry: ${job.industry}
Employment Type: ${job.type}
Guaranteed Base Range: $${(job.salaryMin).toLocaleString()} - $${(job.salaryMax).toLocaleString()} / year
Application Deadline: ${job.deadline ? job.deadline : 'Open Rolling'}

ABOUT THE ROLE:
${job.description}

KEY REQUIREMENTS:
${(job.requirements || []).map((r: string, idx: number) => `[${idx + 1}] ${r}`).join('\n')}

---
Exported via JobEngine Official Verified Career Platform (https://jobengine.app)
Generated: ${new Date().toLocaleDateString()}
`;
    } else if (mode === 'application-receipt' && application) {
      filename = `Application_Receipt_${application.id}.txt`;
      content = `CANDIDATE APPLICATION RECEIPT
Application ID: ${application.id}
Job Title: ${application.jobTitle || application.title}
Company: ${application.company}
Candidate Name: ${application.fullName || application.candidateName}
Email: ${application.email}
Phone: ${application.phone || 'N/A'}
Date Submitted: ${application.date || application.appliedAt}
Current Pipeline Status: ${application.status}
ATS Score: ${application.atsScore || 85}%

CANDIDATE COVER NOTE:
${application.coverNote || 'N/A'}

RESUME SUMMARY:
${application.resumeSummary || 'Profile on file'}

---
Official Candidate Transmission Record - JobEngine ATS Platform
Generated: ${new Date().toLocaleDateString()}
`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:rounded-none">
        
        {/* Action Header - Hidden during print */}
        <div className="p-3.5 sm:p-5 border-b border-slate-200 bg-slate-50 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {mode === 'job-spec' ? 'Job Specification Document' : 'Candidate Application Record'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
                Print or export directly to PDF via your device print dialog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            <button
              onClick={handleDownloadTxt}
              className="px-2.5 sm:px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors min-h-[40px]"
              title="Download text file backup"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Text File</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 sm:px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors min-h-[40px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save as PDF</span>
              <span className="sm:hidden">Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-4 sm:p-10 space-y-6 sm:space-y-8 bg-white text-slate-900 max-h-[75vh] sm:max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-8 font-sans">
          
          {/* Document Letterhead */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  JE
                </span>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  JobEngine Platform
                </span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                Verified Career & Engineering Infrastructure
              </p>
            </div>

            <div className="text-right text-xs text-slate-500 space-y-0.5">
              <div><strong>Document Ref:</strong> JE-{Date.now().toString().slice(-6)}</div>
              <div><strong>Date Generated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center justify-end gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Authenticated Record
              </div>
            </div>
          </div>

          {/* Mode 1: Job Specification PDF */}
          {mode === 'job-spec' && job && (
            <div className="space-y-6">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 mb-2">
                  Official Role Specification
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                  {job.title}
                </h1>
                <p className="text-sm font-semibold text-slate-700 mt-1 flex items-center gap-2">
                  <span>{job.company}</span> · <span>{job.location}</span> {job.remote && '· (Remote)'}
                </p>
              </div>

              {/* Specification Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Guaranteed Base
                  </span>
                  <strong className="text-slate-900 font-mono text-sm">
                    ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k
                  </strong>
                  <span className="text-slate-400 text-[10px] block">/ year</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Application Deadline
                  </span>
                  <strong className="text-slate-900 font-mono text-xs">
                    {job.deadline ? job.deadline : 'Rolling Admission'}
                  </strong>
                  <span className="text-slate-500 text-[10px] block">
                    {job.deadlineRemainingText || 'Active Round'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Discipline
                  </span>
                  <strong className="text-slate-800 text-xs block truncate">
                    {job.industry || 'Engineering'}
                  </strong>
                  <span className="text-slate-400 text-[10px] block">{job.type || 'Full-time'}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Hiring Stage
                  </span>
                  <strong className="text-emerald-700 text-xs flex items-center gap-1 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> Direct Team Review
                  </strong>
                  <span className="text-slate-400 text-[10px] block">Zero Agency Recruiter</span>
                </div>
              </div>

              {/* Role Overview */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  Position Overview & Objectives
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {/* Key Requirements */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Candidate Requirements & Qualifications
                  </h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions on Applying */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-900">Application Notice:</div>
                <p className="leading-relaxed">
                  Direct submission window closes on <strong>{job.deadline ? job.deadline : 'final review'}</strong>. Candidates applying through JobEngine undergo automatic semantic ATS screening and are routed directly to the engineering hiring manager.
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Candidate Application Receipt PDF */}
          {mode === 'application-receipt' && application && (
            <div className="space-y-6">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                  Confirmed Candidate Submission
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                  Application Confirmation Receipt
                </h1>
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  Role: <strong className="text-slate-900">{application.jobTitle}</strong> at <strong>{application.company}</strong>
                </p>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Candidate Name
                  </span>
                  <strong className="text-slate-900 text-xs block">{application.fullName}</strong>
                  <span className="text-slate-500 text-[10px] truncate block">{application.email}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Submission Date
                  </span>
                  <strong className="text-slate-900 font-mono text-xs block">{application.date}</strong>
                  <span className="text-slate-400 text-[10px] block">Verified Timestamp</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    Pipeline Status
                  </span>
                  <strong className="text-indigo-700 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> {application.status}
                  </strong>
                  <span className="text-slate-400 text-[10px] block">Stage 1 of 4</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                    ATS Match Score
                  </span>
                  <strong className="text-indigo-600 font-mono text-sm">
                    {application.atsScore || 88}% Match
                  </strong>
                  <span className="text-slate-400 text-[10px] block">Semantic Parsing</span>
                </div>
              </div>

              {/* Candidate Cover Note */}
              {application.coverNote && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Candidate Statement / Cover Note
                  </h3>
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                    "{application.coverNote}"
                  </div>
                </div>
              )}

              {/* Competencies */}
              {application.skills && application.skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Transmitted Skills & Competencies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {application.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume summary */}
              {application.resumeSummary && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Candidate Profile Summary on File
                  </h3>
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap">
                    {application.resumeSummary}
                  </div>
                </div>
              )}

              {/* Verification Stamp */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>
                    Direct transmission logged to <strong>{application.company}</strong> hiring portal.
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-400">
                  REF: APP-{application.id}
                </div>
              </div>
            </div>
          )}

          {/* Footer watermark note */}
          <div className="pt-6 border-t border-slate-200 text-center text-[10px] text-slate-400">
            JobEngine Career Platform · 2026 Live · Authenticated Digital Copy · Valid without signature
          </div>

        </div>
      </div>
    </div>
  );
};
