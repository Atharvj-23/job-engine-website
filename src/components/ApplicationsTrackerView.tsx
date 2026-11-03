import React, { useState } from 'react';
import { Send, Clock, CheckCircle2, ChevronRight, FileText, ArrowRight, Briefcase } from 'lucide-react';
import { Application, Job } from '../types/job';

interface ApplicationsTrackerViewProps {
  applications: Application[];
  onExploreJobs: () => void;
  onSelectJobById: (jobId: string) => void;
}

export const ApplicationsTrackerView: React.FC<ApplicationsTrackerViewProps> = ({
  applications,
  onExploreJobs,
  onSelectJobById,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          <span>Candidate Pipeline</span>
          <span aria-hidden="true">·</span>
          <span>Private Application Dashboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Submitted Applications & Status
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Monitor your direct applications, interview requests, and hiring stages across all active employers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {['All', 'Under Review', 'Screening Scheduled', 'Technical Round', 'Offer Extended'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              filterStatus === status
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30">
          <Briefcase className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            No Applications Submitted Yet
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
            When you apply directly to roles on Job Engine, your transmission logs, interview stages, and status updates will be tracked here.
          </p>
          <div className="mt-5">
            <button
              onClick={onExploreJobs}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Explore Verified Roles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{app.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>Applied {app.appliedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-neutral-400" />
                    <span className="font-mono text-[11px] truncate max-w-[150px]">{app.resumeFileName}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                  {app.jobTitle}
                </h3>

                {app.coverNote && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 italic line-clamp-1">
                    "{app.coverNote}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{app.status}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    Stage 1 of 4
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectJobById(app.jobId)}
                  className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="View original posting"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
