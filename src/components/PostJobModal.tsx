import React, { useState } from 'react';
import { X, Plus, Sparkles, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { Job, Department, WorkplaceType, EmploymentType, ExperienceLevel } from '../types/job';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (newJob: Job) => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Remote (US/Global)');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>('Remote');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [level, setLevel] = useState<ExperienceLevel>('Senior');
  const [salaryMin, setSalaryMin] = useState<number>(160000);
  const [salaryMax, setSalaryMax] = useState<number>(210000);
  const [techStackInput, setTechStackInput] = useState('TypeScript, React, Node.js, PostgreSQL');
  const [description, setDescription] = useState('');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState('');
  const [qualificationsInput, setQualificationsInput] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFillTemplate = () => {
    setTitle('Senior Distributed Infrastructure Engineer');
    setCompany('HyperCore Labs');
    setLocation('San Francisco, CA (or Remote)');
    setDepartment('Engineering');
    setWorkplaceType('Remote');
    setEmploymentType('Full-time');
    setLevel('Senior');
    setSalaryMin(175000);
    setSalaryMax(225000);
    setTechStackInput('Rust, Go, Kubernetes, Terraform, gRPC');
    setDescription('HyperCore is architecting next-generation streaming event brokers for financial exchanges. We are seeking an experienced infrastructure engineer to optimize distributed consensus and peer-to-peer data propagation.');
    setResponsibilitiesInput('Architect distributed consensus engines with zero single-point-of-failure.\nProfile kernel network syscalls and achieve sub-millisecond tail latency.\nLead automated chaos engineering testing across multi-cloud regions.');
    setQualificationsInput('5+ years building scalable distributed network services.\nDeep fluency in Rust or Go.\nDemonstrated production experience with Raft, Paxos, or gossip protocols.');
    setBenefitsInput('100% health, dental & vision covered\n$5,000 yearly conference & learning stipend\nUnlimited PTO with 4-week minimum requirement');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !description.trim()) {
      setErrorMsg('Please complete the title, company name, and role description.');
      return;
    }
    if (salaryMin <= 0 || salaryMax <= salaryMin) {
      setErrorMsg('Please enter a valid salary range where maximum is greater than minimum.');
      return;
    }

    const techStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const responsibilities = responsibilitiesInput
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const qualifications = qualificationsInput
      .split('\n')
      .map((q) => q.trim())
      .filter(Boolean);

    const benefits = benefitsInput
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const initials = company
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const colors = ['#2563EB', '#059669', '#7C3AED', '#DC2626', '#D97706', '#0891B2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newJob: Job = {
      id: 'job-' + Date.now(),
      title,
      company,
      companyInitials: initials || 'CO',
      companyColor: randomColor,
      location,
      department,
      workplaceType,
      employmentType,
      level,
      salaryMin,
      salaryMax,
      salaryCurrency: 'USD',
      postedDate: 'Just now',
      featured: true,
      verified: true,
      description,
      responsibilities: responsibilities.length > 0 ? responsibilities : [
        'Lead architectural initiatives for core services and platforms.',
        'Collaborate across cross-functional product and infrastructure teams.',
        'Champion code quality, automated test coverage, and documentation.'
      ],
      qualifications: qualifications.length > 0 ? qualifications : [
        'Relevant industry experience building high-throughput services.',
        'Fluency in modern systems or frontend languages.',
        'Strong problem-solving and communication aptitude.'
      ],
      benefits: benefits.length > 0 ? benefits : [
        'Comprehensive healthcare coverage',
        'Competitive equity compensation',
        'Flexible remote workspace stipend'
      ],
      techStack: techStack.length > 0 ? techStack : ['TypeScript', 'Node.js', 'PostgreSQL'],
      companySize: '50-200 employees',
      fundingStage: 'Growth Stage',
    };

    onAddJob(newJob);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Post an Engineering Role
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Publish directly to verified technical candidates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillTemplate}
              className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white px-2.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
            >
              Autofill Sample
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">
                Job Successfully Published!
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Your role is now visible in the active feed with direct candidate submissions enabled.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Position Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. HyperCore Labs"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>
              </div>

              {/* Department & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="AI & Data">AI & Data</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Security & Systems">Security & Systems</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Workplace Type
                  </label>
                  <select
                    value={workplaceType}
                    onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Seniority Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Staff">Staff</option>
                    <option value="Lead">Lead</option>
                    <option value="Director">Director</option>
                  </select>
                </div>
              </div>

              {/* Location & Salary Range */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Min Base Salary ($)
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    Max Base Salary ($)
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white font-mono tabular-nums"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="e.g. Rust, Go, Kubernetes, Kafka, PostgreSQL"
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Role Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of the mission, architectural challenges, and impact..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white resize-none"
                />
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  rows={2}
                  value={responsibilitiesInput}
                  onChange={(e) => setResponsibilitiesInput(e.target.value)}
                  placeholder="Architect and deploy high-throughput services&#10;Conduct chaos testing..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100 rounded-lg shadow-xs transition-colors"
                >
                  Publish Role Now
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
