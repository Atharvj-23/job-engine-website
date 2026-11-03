import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Job, Application } from '../types/job';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (application: Application) => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onSubmitApplication,
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !job) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFileName(file.name);
      setErrorMsg('');
    }
  };

  const handleSimulateDefaultResume = () => {
    setResumeFileName('Engineering_Resume_2026.pdf');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim()) {
      setErrorMsg('Please provide your full name and valid email address.');
      return;
    }
    if (!resumeFileName) {
      setErrorMsg('Please attach your CV/Resume (PDF or DOCX).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      const newApp: Application = {
        id: 'app-' + Date.now(),
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        candidateName,
        candidateEmail,
        candidatePhone,
        portfolioUrl,
        resumeFileName,
        coverNote,
        appliedAt: 'Just now',
        status: 'Under Review',
      };

      onSubmitApplication(newApp);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="text-xs font-semibold uppercase text-neutral-500 dark:text-neutral-400">
              Direct Application
            </div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white mt-1">
              Apply to {job.company}
            </h2>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              Role: <span className="font-medium text-neutral-900 dark:text-neutral-100">{job.title}</span> · {job.location}
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                Application Transmitted
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                Your application for <strong className="text-neutral-900 dark:text-neutral-100">{job.title}</strong> has been forwarded directly to the engineering team at {job.company}.
              </p>
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto text-left space-y-1.5 font-mono">
                <div>Candidate: {candidateName}</div>
                <div>Contact: {candidateEmail}</div>
                <div>Attached: {resumeFileName}</div>
                <div>Status: Under Review (Trackable in your dashboard)</div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Primary Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    GitHub / Portfolio / LinkedIn
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>
              </div>

              {/* Resume Upload Area */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Resume / Curriculum Vitae *
                </label>
                <div className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 text-center hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  {resumeFileName ? (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-left">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                        <div>
                          <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate max-w-xs">
                            {resumeFileName}
                          </div>
                          <div className="text-[11px] text-neutral-500 font-mono">Ready to submit</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setResumeFileName('')}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                      <div className="text-xs text-neutral-600 dark:text-neutral-400">
                        <label className="font-semibold text-neutral-900 dark:text-white cursor-pointer hover:underline">
                          Upload PDF / DOCX
                          <input
                            type="file"
                            accept=".pdf,.docx,.doc"
                            className="sr-only"
                            onChange={handleFileUpload}
                          />
                        </label>{' '}
                        or{' '}
                        <button
                          type="button"
                          onClick={handleSimulateDefaultResume}
                          className="font-medium text-neutral-700 dark:text-neutral-300 underline underline-offset-2"
                        >
                          attach sample resume
                        </button>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-1">Up to 10MB</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Note / Pitch */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Brief Note to Hiring Team (Optional)
                </label>
                <textarea
                  rows={3}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Mention relevant systems you've built, latency milestones, or why this technical stack excites you..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Transmit Application</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
