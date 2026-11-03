import React from 'react';
import { Building2, MapPin, Users, Globe, ArrowRight } from 'lucide-react';
import { FEATURED_COMPANIES } from '../data/mockJobs';
import { CompanyProfile } from '../types/job';

interface CompaniesViewProps {
  onSelectCompany: (companyName: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({ onSelectCompany }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          <span>Direct Employer Network</span>
          <span aria-hidden="true">·</span>
          <span>Verified Engineering Teams</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Featured Engineering Organizations
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          High-velocity engineering teams building real-world infrastructure, robotics, and climate platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURED_COMPANIES.map((company) => (
          <div
            key={company.id}
            className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group"
          >
            {/* Visual Aspect Ratio 4:3 Image */}
            <div className="relative aspect-[4/3] bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              {company.imageUrl ? (
                <img
                  src={company.imageUrl}
                  alt={`${company.name} headquarters`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <Building2 className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] font-mono tabular-nums font-medium">
                {company.openRolesCount} Open Positions
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>{company.industry}</span>
                  <span aria-hidden="true">·</span>
                  <span>{company.funding}</span>
                </div>

                <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                  {company.name}
                </h3>

                <p className="mt-1 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  {company.headline}
                </p>

                <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                  {company.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {company.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="truncate max-w-[130px]">{company.location}</span>
                </span>

                <button
                  type="button"
                  onClick={() => onSelectCompany(company.name)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-white hover:underline underline-offset-4"
                >
                  <span>Explore Open Roles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
