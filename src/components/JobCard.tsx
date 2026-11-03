import React from 'react';
import { Bookmark, MapPin, Building2, ArrowUpRight } from 'lucide-react';
import { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onSelect: (job: Job) => void;
  isSaved: boolean;
  onToggleSave: (jobId: string, e: React.MouseEvent) => void;
  onQuickApply: (job: Job, e: React.MouseEvent) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSelected,
  onSelect,
  isSaved,
  onToggleSave,
  onQuickApply,
}) => {
  const formatSalary = (val: number) => {
    return '$' + (val / 1000).toLocaleString() + 'k';
  };

  return (
    <article
      onClick={() => onSelect(job)}
      className={`group relative p-5 rounded-xl border cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'bg-neutral-50/90 dark:bg-neutral-900 border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-900 dark:ring-neutral-100 shadow-sm'
          : 'bg-white dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-50/50 dark:hover:bg-neutral-900'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5 min-w-0">
          {/* Company Avatar / Logo */}
          <div
            className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center font-bold text-white text-sm shadow-2xs overflow-hidden"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.companyLogoUrl ? (
              <img
                src={job.companyLogoUrl}
                alt={job.company}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to text initials if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span>{job.companyInitials}</span>
            )}
          </div>

          {/* Job Header & Metadata */}
          <div className="min-w-0">
            {/* Clean unboxed 1-line metadata kicker */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                {job.company}
              </span>
              <span aria-hidden="true">·</span>
              <span>{job.department}</span>
              <span aria-hidden="true">·</span>
              <span>{job.postedDate}</span>
            </div>

            {/* Primary Title */}
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-950 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors truncate">
              {job.title}
            </h2>
          </div>
        </div>

        {/* Action Controls: Save Bookmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => onToggleSave(job.id, e)}
            aria-label={isSaved ? 'Remove from saved jobs' : 'Save job'}
            className={`p-2 rounded-lg border transition-colors ${
              isSaved
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 border-neutral-900 dark:border-white'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Description Snippet */}
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Key Terms / Tech Stack: Clean text list with bullet separators */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
        <span className="font-mono text-neutral-400 dark:text-neutral-500">Stack:</span>
        {job.techStack.slice(0, 5).map((tech, idx) => (
          <React.Fragment key={tech}>
            <span className="hover:text-neutral-950 dark:hover:text-white transition-colors">
              {tech}
            </span>
            {idx < Math.min(job.techStack.length, 5) - 1 && (
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">/</span>
            )}
          </React.Fragment>
        ))}
        {job.techStack.length > 5 && (
          <span className="text-neutral-400 font-mono text-xs">+{job.techStack.length - 5}</span>
        )}
      </div>

      {/* Footer Strip: Compensation & Location Metadata */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-none">{job.location}</span>
          </div>
          <span aria-hidden="true">·</span>
          <span>{job.workplaceType}</span>
          <span aria-hidden="true">·</span>
          <span>{job.level}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono font-semibold text-neutral-950 dark:text-white tabular-nums text-sm">
            {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)}
          </span>

          <button
            type="button"
            onClick={(e) => onQuickApply(job, e)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-white hover:underline underline-offset-4"
          >
            <span>Apply</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
