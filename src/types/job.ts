export type WorkplaceType = 'Remote' | 'Hybrid' | 'On-site';
export type EmploymentType = 'Full-time' | 'Contract' | 'Part-time';
export type Department = 
  | 'Engineering' 
  | 'AI & Data' 
  | 'Product & Design' 
  | 'DevOps & Cloud' 
  | 'Security & Systems';

export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior' | 'Staff' | 'Lead' | 'Principal' | 'Director';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  companyInitials: string;
  companyColor: string;
  location: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  department: Department;
  level: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  postedDate: string;
  featured: boolean;
  verified: boolean;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  benefits: string[];
  techStack: string[];
  companySize?: string;
  fundingStage?: string;
  industry?: string;
  websiteUrl?: string;
  deadline?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
  coverNote?: string;
  appliedAt: string;
  status: string;
  atsScore?: number;
}

export interface JobAlert {
  id: string;
  email: string;
  keyword: string;
  department: string;
  workplaceType: string;
  minSalary: number;
  frequency: 'Daily' | 'Weekly';
  createdAt: string;
  active: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  headline: string;
  location: string;
  size: string;
  funding: string;
  imageUrl?: string;
  techStack: string[];
  openRolesCount: number;
  description: string;
}

export interface SalaryMetric {
  role: string;
  department: Department;
  level: ExperienceLevel;
  p25: number;
  median: number;
  p75: number;
  p90: number;
  sampleCount: number;
}
