import React from 'react';
import { Search, MapPin, Briefcase, DollarSign, SlidersHorizontal, BellRing, Sparkles } from 'lucide-react';
import { Department, WorkplaceType } from '../types/job';

interface HeroSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dep: string) => void;
  selectedWorkplace: string;
  onWorkplaceChange: (workplace: string) => void;
  minSalary: number;
  onMinSalaryChange: (sal: number) => void;
  remoteOnly: boolean;
  onToggleRemoteOnly: () => void;
  highSalaryOnly: boolean;
  onToggleHighSalaryOnly: () => void;
  featuredOnly: boolean;
  onToggleFeaturedOnly: () => void;
  onOpenAlertModal: () => void;
  totalJobsCount: number;
  filteredJobsCount: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedWorkplace,
  onWorkplaceChange,
  minSalary,
  onMinSalaryChange,
  remoteOnly,
  onToggleRemoteOnly,
  highSalaryOnly,
  onToggleHighSalaryOnly,
  featuredOnly,
  onToggleFeaturedOnly,
  onOpenAlertModal,
  totalJobsCount,
  filteredJobsCount,
}) => {
  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Top Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span>Engineering & Product Career Exchange</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{totalJobsCount} Verified Postings</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white leading-[1.15] mb-4 text-balance">
              Discover high-signal engineering and systems roles.
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed mb-6">
              Real compensation bands, direct team access, and zero recruiter spam. Filter by architecture, language stack, and remote flexibility.
            </p>

            {/* Quick Proof Metrics Strip */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-white font-mono tabular-nums">100%</span>
                <span>Transparent salary bands</span>
              </div>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-white font-mono tabular-nums">&lt; 48h</span>
                <span>Direct team response benchmark</span>
              </div>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900 dark:text-white font-mono tabular-nums">Zero</span>
                <span>Third-party agency listings</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Focal Carrier */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm aspect-[16/10] bg-neutral-100 dark:bg-neutral-800">
              <img
                src="/src/assets/images/hero_workspace_team_1793592859137.jpg"
                alt="Engineering and product design team collaborating around studio table"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs flex justify-between items-center pointer-events-none">
                <span className="font-medium">Direct hiring teams active today</span>
                <span className="font-mono tabular-nums opacity-90">Avg $192k Base</span>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Search Console */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Keyword Input */}
            <div className="lg:col-span-5 relative">
              <label htmlFor="job-search" className="sr-only">Search roles, tech stack, or companies</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="job-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search title, skills (e.g. Rust, PyTorch, React)..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all"
                />
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="lg:col-span-3">
              <label htmlFor="department-filter" className="sr-only">Filter by Department</label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <select
                  id="department-filter"
                  value={selectedDepartment}
                  onChange={(e) => onDepartmentChange(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Disciplines</option>
                  <option value="Engineering">Engineering</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                  <option value="Security & Systems">Security & Systems</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
              </div>
            </div>

            {/* Workplace / Location Type */}
            <div className="lg:col-span-2">
              <label htmlFor="workplace-filter" className="sr-only">Filter by Workplace Type</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                <select
                  id="workplace-filter"
                  value={selectedWorkplace}
                  onChange={(e) => onWorkplaceChange(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 text-sm rounded-lg bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all appearance-none cursor-pointer"
                >
                  <option value="All">Any Location</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">▼</div>
              </div>
            </div>

            {/* Alert Subscribe Trigger */}
            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenAlertModal}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors whitespace-nowrap"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Job Alerts</span>
              </button>
            </div>
          </div>

          {/* Quick Filter Control Chips (Interactive buttons) */}
          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-neutral-500 dark:text-neutral-400 mr-1 font-medium">Quick Filters:</span>
              
              <button
                type="button"
                onClick={onToggleRemoteOnly}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  remoteOnly
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                Remote Only
              </button>

              <button
                type="button"
                onClick={onToggleHighSalaryOnly}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  highSalaryOnly
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                $200k+ Base
              </button>

              <button
                type="button"
                onClick={onToggleFeaturedOnly}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                  featuredOnly
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                Featured Direct
              </button>

              {(searchQuery || selectedDepartment !== 'All' || selectedWorkplace !== 'All' || remoteOnly || highSalaryOnly || featuredOnly) && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    onDepartmentChange('All');
                    onWorkplaceChange('All');
                    if (remoteOnly) onToggleRemoteOnly();
                    if (highSalaryOnly) onToggleHighSalaryOnly();
                    if (featuredOnly) onToggleFeaturedOnly();
                  }}
                  className="px-2.5 py-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors underline underline-offset-2 ml-1"
                >
                  Clear all filters
                </button>
              )}
            </div>

            <div className="text-neutral-500 dark:text-neutral-400 font-mono text-xs tabular-nums">
              Showing {filteredJobsCount} of {totalJobsCount} roles
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
