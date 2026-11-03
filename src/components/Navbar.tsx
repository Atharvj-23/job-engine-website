import React from 'react';
import { Sun, Moon, Plus } from 'lucide-react';

interface NavbarProps {
  currentTab: 'jobs' | 'companies' | 'salaries' | 'saved' | 'applications';
  onNavigate: (tab: 'jobs' | 'companies' | 'salaries' | 'saved' | 'applications') => void;
  savedCount: number;
  applicationCount: number;
  onOpenPostJob: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  savedCount,
  applicationCount,
  onOpenPostJob,
  darkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single line text element) */}
        <button
          onClick={() => onNavigate('jobs')}
          className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity flex items-center gap-2 text-left"
          aria-label="Job Engine home"
        >
          <span className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono text-sm font-semibold shadow-xs">
            JE
          </span>
          <span>Job Engine</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => onNavigate('jobs')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-neutral-950 dark:hover:text-white ${
              currentTab === 'jobs'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            Explore Jobs
          </button>
          <button
            onClick={() => onNavigate('companies')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-neutral-950 dark:hover:text-white ${
              currentTab === 'companies'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            Companies
          </button>
          <button
            onClick={() => onNavigate('salaries')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-neutral-950 dark:hover:text-white ${
              currentTab === 'salaries'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            Salary Index
          </button>
          <button
            onClick={() => onNavigate('saved')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-neutral-950 dark:hover:text-white flex items-center gap-1.5 ${
              currentTab === 'saved'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                ({savedCount})
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigate('applications')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-neutral-950 dark:hover:text-white flex items-center gap-1.5 ${
              currentTab === 'applications'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : ''
            }`}
          >
            <span>Tracked</span>
            {applicationCount > 0 && (
              <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                ({applicationCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action (+ subtle theme toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenPostJob}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post a Job</span>
          </button>
        </div>
      </div>
    </header>
  );
};
