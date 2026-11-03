import React, { useState } from 'react';
import { X, Bell, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { JobAlert } from '../types/job';

interface JobAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: JobAlert[];
  onAddAlert: (alert: JobAlert) => void;
  onDeleteAlert: (alertId: string) => void;
  onToggleAlert: (alertId: string) => void;
  onTriggerTestNotification: (alert: JobAlert) => void;
}

export const JobAlertsModal: React.FC<JobAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onAddAlert,
  onDeleteAlert,
  onToggleAlert,
  onTriggerTestNotification,
}) => {
  const [email, setEmail] = useState('');
  const [keyword, setKeyword] = useState('Distributed Systems');
  const [department, setDepartment] = useState('Engineering');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [minSalary, setMinSalary] = useState(180000);
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly'>('Daily');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const newAlert: JobAlert = {
      id: 'alert-' + Date.now(),
      email: email.trim(),
      keyword: keyword.trim() || 'Any Role',
      department,
      workplaceType,
      minSalary,
      frequency,
      createdAt: 'Just now',
      active: true,
    };

    onAddAlert(newAlert);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white">
                Industry Job Alerts
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Get notified when matching verified openings appear.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Create Alert Form */}
          <form onSubmit={handleCreate} className="space-y-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-800/40">
            <div className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              New Alert Criteria
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Notification Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Rust, PyTorch"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                >
                  <option value="Any">Any Discipline</option>
                  <option value="Engineering">Engineering</option>
                  <option value="AI & Data">AI & Data</option>
                  <option value="Product & Design">Product & Design</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Min Salary ($)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={minSalary}
                  onChange={(e) => setMinSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Cadence
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as 'Daily' | 'Weekly')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                >
                  <option value="Daily">Daily Summary</option>
                  <option value="Weekly">Weekly Digest</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{addedSuccess ? 'Alert Configured!' : 'Create Job Alert'}</span>
            </button>
          </form>

          {/* Active Subscriptions List */}
          <div>
            <div className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400 mb-3">
              Active Alert Channels ({alerts.length})
            </div>

            {alerts.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No alert feeds active yet.</p>
            ) : (
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-neutral-900 dark:text-white truncate">
                        "{alert.keyword}" in {alert.department}
                      </div>
                      <div className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono tabular-nums">&gt; ${(alert.minSalary / 1000)}k</span>
                        <span aria-hidden="true">·</span>
                        <span>{alert.frequency}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{alert.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onTriggerTestNotification(alert)}
                        className="px-2 py-1 text-[11px] font-medium rounded border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        title="Simulate sample alert delivery"
                      >
                        Test Run
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAlert(alert.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                        aria-label="Delete alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
