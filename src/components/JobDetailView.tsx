import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Bookmark, 
  Send, 
  Briefcase, 
  Layers, 
  Globe, 
  Users, 
  TrendingUp,
  X
} from 'lucide-react';
import { Job } from '../types/job';

interface JobDetailViewProps {
  job: Job | null;
  onClose?: () => void;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onApply: (job: Job) => void;
  hasApplied: boolean;
}

export const JobDetailView: React.FC<JobDetailViewProps> = ({
  job,
  onClose,
  isSaved,
  onToggleSave,
  onApply,
  hasApplied,
}) => {
  const [copied, setCopied] = useState(false);

  if (!job) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30">
        <Briefcase className="w-10 h-10 text-neutral-400 mb-3" />
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
          Select a role to view details
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">
          Browse verified positions on the left to inspect architectural responsibilities, requirements, and full salary breakdown.
        </p>
      </div>
    );
  }

  const formatSalary = (val: number) => {
    return '$' + val.toLocaleString();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 lg:p-8 relative">
      {/* Top Header Row with Close on Mobile */}
      <div className="flex items-start justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="w-14 h-14 rounded-xl shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-xs overflow-hidden"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.companyLogoUrl ? (
              <img
                src={job.companyLogoUrl}
                alt={job.company}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{job.companyInitials}</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">{job.company}</span>
              <span aria-hidden="true">·</span>
              <span>{job.department}</span>
              <span aria-hidden="true">·</span>
              <span>Posted {job.postedDate}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 dark:text-white leading-tight">
              {job.title}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {job.location} ({job.workplaceType})
              </span>
              <span aria-hidden="true">·</span>
              <span>{job.employmentType}</span>
              <span aria-hidden="true">·</span>
              <span>{job.level} Level</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Salary & Action Strip */}
      <div className="py-5 border-b border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Guaranteed Base Range</div>
          <div className="font-mono text-2xl font-bold text-neutral-950 dark:text-white tabular-nums mt-0.5">
            {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
            <span className="text-xs font-normal text-neutral-500 ml-1.5 font-sans">/ year</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleSave(job.id)}
            className={`px-3.5 py-2.5 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 border-neutral-900 dark:border-white'
                : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={() => onApply(job)}
            disabled={hasApplied}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-colors ${
              hasApplied
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100'
            }`}
          >
            {hasApplied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Application Submitted</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Apply for this Role</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="py-6 space-y-8">
        {/* Role Overview */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-neutral-950 dark:text-white uppercase mb-3">
            About the Role
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {job.description}
          </p>
        </section>

        {/* Tech Stack Matrix */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-neutral-950 dark:text-white uppercase mb-3">
            Primary Technology Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-md text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Core Responsibilities */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-neutral-950 dark:text-white uppercase mb-3">
            Core Responsibilities
          </h2>
          <ul className="space-y-2.5 text-sm text-neutral-700 dark:text-neutral-300">
            {job.responsibilities.map((resp, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{resp}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Qualifications */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-neutral-950 dark:text-white uppercase mb-3">
            Candidate Qualifications
          </h2>
          <ul className="space-y-2.5 text-sm text-neutral-700 dark:text-neutral-300">
            {job.qualifications.map((qual, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{qual}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Benefits & Perks */}
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-neutral-950 dark:text-white uppercase mb-3">
            Compensation & Culture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {job.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Company Quick Profile */}
        <section className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
                About {job.company}
              </h3>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {job.industry || 'Technology & Engineering'}
              </div>
            </div>

            {job.websiteUrl && (
              <a
                href={job.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Visit website</span>
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-neutral-600 dark:text-neutral-400 pt-3 border-t border-neutral-200 dark:border-neutral-700/60">
            <div>
              <span className="text-neutral-400 block font-mono text-[11px]">TEAM SIZE</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">{job.companySize || '100-500 people'}</span>
            </div>
            <div>
              <span className="text-neutral-400 block font-mono text-[11px]">STAGE</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">{job.fundingStage || 'Growth Stage'}</span>
            </div>
            <div>
              <span className="text-neutral-400 block font-mono text-[11px]">LOCATION</span>
              <span className="font-medium text-neutral-800 dark:text-neutral-200">{job.location}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Sticky Action on mobile */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          ID: <span className="font-mono">{job.id}</span> · Direct Application
        </span>
        <button
          onClick={() => onApply(job)}
          disabled={hasApplied}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            hasApplied
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100'
          }`}
        >
          {hasApplied ? 'Submitted' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
};
