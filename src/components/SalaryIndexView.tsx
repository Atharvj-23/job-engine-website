import React, { useState } from 'react';
import { TrendingUp, Layers, DollarSign, Award, Info } from 'lucide-react';
import { SALARY_BENCHMARKS } from '../data/mockJobs';
import { Department, ExperienceLevel, SalaryMetric } from '../types/job';

export const SalaryIndexView: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filteredMetrics = SALARY_BENCHMARKS.filter((m) => {
    const matchDept = selectedDept === 'All' || m.department === selectedDept;
    const matchLevel = selectedLevel === 'All' || m.level === selectedLevel;
    return matchDept && matchLevel;
  });

  const formatK = (n: number) => '$' + (n / 1000).toFixed(0) + 'k';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
          <span>Market Intelligence</span>
          <span aria-hidden="true">·</span>
          <span>Verified 2026 Compensation Bands</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Software & Systems Engineering Salary Index
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
          Aggregated from direct employer job postings and verified verified compensation disclosures across top-tier engineering organizations.
        </p>
      </div>

      {/* Filter Segmented Controls */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 mb-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mr-2">Discipline:</span>
            {['All', 'Engineering', 'AI & Data', 'Product & Design', 'DevOps & Cloud'].map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedDept === dept
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mr-2">Seniority:</span>
            {['All', 'Mid', 'Senior', 'Staff', 'Lead'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedLevel === lvl
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Benchmarks Grid / Rows */}
      <div className="space-y-4">
        {filteredMetrics.map((metric, idx) => {
          // Max scale benchmark is $400k
          const maxVal = 400000;
          const leftPercent = (metric.p25 / maxVal) * 100;
          const medianPercent = (metric.median / maxVal) * 100;
          const widthPercent = ((metric.p90 - metric.p25) / maxVal) * 100;

          return (
            <div
              key={idx}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">{metric.department}</span>
                    <span aria-hidden="true">·</span>
                    <span>{metric.level} Level</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{metric.sampleCount} data points</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                    {metric.role}
                  </h3>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Median Base</div>
                  <div className="font-mono text-xl font-bold text-neutral-950 dark:text-white tabular-nums">
                    {formatK(metric.median)}
                    <span className="text-xs font-sans font-normal text-neutral-500 ml-1">/ yr</span>
                  </div>
                </div>
              </div>

              {/* Visual Horizontal Distribution Bar */}
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="relative h-6 bg-neutral-100 dark:bg-neutral-800 rounded-md overflow-hidden">
                  {/* P25 to P90 Range Fill */}
                  <div
                    className="absolute top-0 bottom-0 bg-neutral-900/15 dark:bg-white/20 rounded"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />

                  {/* Median Marker Line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-neutral-900 dark:bg-white z-10 -ml-0.5"
                    style={{ left: `${medianPercent}%` }}
                    title={`Median: ${formatK(metric.median)}`}
                  />
                </div>

                {/* Percentile Numbers Strip */}
                <div className="flex items-center justify-between text-xs font-mono text-neutral-600 dark:text-neutral-400 mt-2 tabular-nums">
                  <div>
                    <span className="text-[11px] text-neutral-400 block font-sans">25th %ile</span>
                    {formatK(metric.p25)}
                  </div>
                  <div className="text-center font-bold text-neutral-900 dark:text-white">
                    <span className="text-[11px] text-neutral-400 block font-sans">Median (50th)</span>
                    {formatK(metric.median)}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-400 block font-sans">75th %ile</span>
                    {formatK(metric.p75)}
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-neutral-400 block font-sans">90th %ile</span>
                    {formatK(metric.p90)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editorial Methodology Adjacency */}
      <div className="mt-10 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <h4 className="text-sm font-bold text-neutral-950 dark:text-white mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-neutral-500" />
          <span>Salary Transparency Standards</span>
        </h4>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
          Figures reflect confirmed baseline salary offers without equity components or variable bonuses. In top US engineering centers (San Francisco, New York, Seattle), total compensation frequently includes equity options or RSUs representing an additional 25% to 65% of base compensation.
        </p>
      </div>
    </div>
  );
};
