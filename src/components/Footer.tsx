import React from 'react';

interface FooterProps {
  onNavigate: (tab: 'jobs' | 'companies' | 'salaries' | 'saved' | 'applications') => void;
  onOpenPostJob: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPostJob }) => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono text-xs font-semibold">
                JE
              </span>
              <span className="text-base font-bold tracking-tight text-neutral-950 dark:text-white">
                Job Engine
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Curated career infrastructure for high-signal engineering, systems, and product teams.
            </p>
          </div>

          {/* Nav Col 1 */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
              Explore
            </div>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('jobs')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Engineering Postings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('companies')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  Featured Organizations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('salaries')}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors"
                >
                  2026 Salary Index
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
              Employers
            </div>
            <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
              <li>
                <button
                  onClick={onOpenPostJob}
                  className="hover:text-neutral-950 dark:hover:text-white transition-colors text-left"
                >
                  Post an Engineering Role
                </button>
              </li>
              <li>
                <span className="text-neutral-400 dark:text-neutral-500">
                  Direct Candidate Delivery
                </span>
              </li>
              <li>
                <span className="text-neutral-400 dark:text-neutral-500">
                  Compensation Benchmark Tool
                </span>
              </li>
            </ul>
          </div>

          {/* Legal / Standards */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white mb-3">
              Integrity Standards
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Every listing guarantees verified salary ranges, direct hiring manager review, and transparent interview pipelines without third-party recruitment agencies.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div>
            © {new Date().getFullYear()} Job Engine. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span className="hover:text-neutral-900 dark:hover:text-white cursor-pointer">Security Practices</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
