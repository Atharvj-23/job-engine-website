import { Job, CompanyProfile, SalaryMetric } from '../types/job';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Distributed Systems Engineer',
    company: 'Fintech Global',
    companyLogoUrl: '/src/assets/images/company_fintech_hq_1793592858902.jpg',
    companyInitials: 'FG',
    companyColor: '#2563EB',
    location: 'New York, NY',
    workplaceType: 'Hybrid',
    employmentType: 'Full-time',
    department: 'Engineering',
    level: 'Senior',
    salaryMin: 185000,
    salaryMax: 230000,
    salaryCurrency: 'USD',
    postedDate: '2 hours ago',
    featured: true,
    verified: true,
    industry: 'Financial Technology',
    companySize: '500-1,000 employees',
    fundingStage: 'Series D / Pre-IPO',
    websiteUrl: 'https://fintechglobal.example.com',
    description: 'We are looking for a Senior Distributed Systems Engineer to scale our core matching and settlement engine. You will own throughput optimization, multi-region failover protocols, and low-latency message streaming pipelines handling over $12B in daily transaction flow.',
    responsibilities: [
      'Architect and implement fault-tolerant consensus and ledger synchronization services in Go and Rust.',
      'Optimize multi-region replication latency to under 15ms across North American and European clusters.',
      'Conduct rigorous chaos engineering drills and performance profiling under heavy synthetic load.',
      'Collaborate closely with quantitative risk and financial compliance teams to guarantee atomic settlement.'
    ],
    qualifications: [
      '6+ years of experience in distributed systems, concurrent programming, and low-latency network protocols.',
      'Deep fluency with Go, Rust, or modern C++ in high-concurrency environments.',
      'Demonstrated expertise in Raft/Paxos consensus, Kafka, gRPC, and PostgreSQL partitioning.',
      'Proven track record delivering zero-downtime database migrations in financial systems.'
    ],
    benefits: [
      'Comprehensive medical, dental, and vision with 100% employer-covered premiums',
      '$6,000 annual learning and conference travel stipend',
      'Flexible 2-day in-office hybrid schedule with catered lunches',
      '401(k) with 5% dollar-for-dollar employer match'
    ],
    techStack: ['Go', 'Rust', 'Kafka', 'PostgreSQL', 'Kubernetes', 'gRPC', 'Prometheus']
  },
  {
    id: 'job-2',
    title: 'Staff Autonomous Systems Firmware Engineer',
    company: 'Automata Robotics',
    companyLogoUrl: '/src/assets/images/company_robotics_lab_1793592860062.jpg',
    companyInitials: 'AR',
    companyColor: '#059669',
    location: 'San Francisco, CA',
    workplaceType: 'On-site',
    employmentType: 'Full-time',
    department: 'Engineering',
    level: 'Staff',
    salaryMin: 210000,
    salaryMax: 265000,
    salaryCurrency: 'USD',
    postedDate: '5 hours ago',
    featured: true,
    verified: true,
    industry: 'Robotics & Hardware',
    companySize: '150-300 employees',
    fundingStage: 'Series B ($65M)',
    websiteUrl: 'https://automatarobotics.example.com',
    description: 'Automata builds collaborative industrial robotic arms for high-precision manufacturing. You will lead the embedded software engineering team responsible for real-time motor controller firmware, CAN bus communications, and microsecond-level actuator synchronization.',
    responsibilities: [
      'Design deterministic real-time firmware for ARM Cortex-M and RISC-V industrial microcontrollers.',
      'Develop sensor fusion drivers for multi-axis force-torque sensors and optical encoders.',
      'Lead hardware-in-the-loop (HIL) automation pipelines and safety interlock certifications (ISO 13849).',
      'Mentor senior firmware engineers and establish code review standards for safety-critical systems.'
    ],
    qualifications: [
      '8+ years in embedded C/C++ firmware development for electromechanical or robotic hardware.',
      'Hands-on experience with RTOS (FreeRTOS, Zephyr) and bare-metal microcontroller architectures.',
      'Strong mathematical grasp of kinematics, PID control loops, and field-oriented motor control (FOC).',
      'Familiarity with oscilloscopes, logic analyzers, and rapid board bring-up.'
    ],
    benefits: [
      'Generous equity package with early exercise and 10-year exercise window',
      'On-site hardware workshop and prototype fabrication lab access',
      'Top-tier PPO health coverage and HSA contribution',
      'Commuter transit passes and annual wellness allowance'
    ],
    techStack: ['Embedded C', 'C++', 'FreeRTOS', 'CANopen', 'EtherCAT', 'ARM Cortex', 'Python']
  },
  {
    id: 'job-3',
    title: 'Principal Climate Intelligence Engineer',
    company: 'Aether Climate Lab',
    companyLogoUrl: '/src/assets/images/company_climate_campus_1793592858966.jpg',
    companyInitials: 'AC',
    companyColor: '#10B981',
    location: 'Boulder, CO',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    department: 'AI & Data',
    level: 'Principal',
    salaryMin: 225000,
    salaryMax: 280000,
    salaryCurrency: 'USD',
    postedDate: '1 day ago',
    featured: true,
    verified: true,
    industry: 'Climate Tech & Geospatial',
    companySize: '80-120 employees',
    fundingStage: 'Series A ($38M)',
    websiteUrl: 'https://aetherclimate.example.com',
    description: 'Aether processes petabytes of satellite imagery and atmospheric telemetry to forecast wildfire hazards and renewable grid capacity. We seek a Principal Engineer to spearhead our geospatial machine learning pipelines and scientific computing infrastructure.',
    responsibilities: [
      'Architect distributed training and inference pipelines for multi-spectral Earth observation models.',
      'Scale cloud infrastructure on AWS/GCP to ingest 50TB+ daily raster datasets without pipeline backpressure.',
      'Co-author research publications and open-source foundation models for climate risk estimation.',
      'Partner with power utility operators to integrate sub-hourly predictive models into grid dispatch software.'
    ],
    qualifications: [
      '10+ years designing enterprise data pipelines or machine learning platforms.',
      'Proficiency with PyTorch, Ray, GDAL/Rasterio, and distributed cloud object stores (S3/GCS).',
      'Background in atmospheric physics, hydrology, geospatial data, or equivalent numerical computing discipline.',
      'Demonstrated experience shipping ML models serving mission-critical customer workflows.'
    ],
    benefits: [
      '100% remote flexibility with home office buildout allowance ($3,000)',
      'Quarterly company-wide retreats at research nature reserves',
      'Unlimited paid time off with mandatory 3-week minimum',
      'Carbon offset budget for personal household emissions'
    ],
    techStack: ['Python', 'PyTorch', 'Ray', 'Kubernetes', 'GDAL', 'DuckDB', 'AWS']
  },
  {
    id: 'job-4',
    title: 'Lead Product Designer (Design Systems)',
    company: 'Monolith OS',
    companyInitials: 'MO',
    companyColor: '#6366F1',
    location: 'San Francisco, CA',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    department: 'Product & Design',
    level: 'Lead',
    salaryMin: 175000,
    salaryMax: 215000,
    salaryCurrency: 'USD',
    postedDate: '1 day ago',
    featured: false,
    verified: true,
    industry: 'Developer Tools',
    companySize: '200-400 employees',
    fundingStage: 'Series C',
    websiteUrl: 'https://monolith.example.com',
    description: 'Monolith builds cloud development environments for engineers. As Lead Product Designer, you will curate and evolve our core design system across web, desktop, and terminal interfaces, ensuring typographic rigor, accessibility, and high visual standards.',
    responsibilities: [
      'Evolve our multi-platform component library across Figma, React, and CSS token structures.',
      'Establish strict WCAG AAA guidelines for dark mode contrast and dense keyboard-first workflows.',
      'Partner closely with front-end engineers to ensure sub-pixel rendering accuracy in production code.',
      'Conduct regular user interviews with developers to refine workflow velocity and reduce friction.'
    ],
    qualifications: [
      '7+ years designing enterprise software, developer tools, or intricate technical canvases.',
      'World-class portfolio demonstrating mastery of typographic hierarchy, grid systems, and interaction states.',
      'Deep fluency reading and prototyping in TypeScript, React, and modern Tailwind CSS.',
      'Experience managing comprehensive token pipelines and multi-theme brand architectures.'
    ],
    benefits: [
      'Annual hardware refresh including top-spec developer laptop and ergonomic studio display',
      'Full healthcare coverage including mental wellness therapy stipends',
      'Flexible asynchronous working culture across all timezones',
      'Parental leave: 16 weeks fully paid'
    ],
    techStack: ['Figma', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Storybook', 'Next.js']
  },
  {
    id: 'job-5',
    title: 'Senior Site Reliability & Platform Engineer',
    company: 'CloudStream',
    companyInitials: 'CS',
    companyColor: '#0EA5E9',
    location: 'Austin, TX',
    workplaceType: 'Hybrid',
    employmentType: 'Full-time',
    department: 'DevOps & Cloud',
    level: 'Senior',
    salaryMin: 170000,
    salaryMax: 210000,
    salaryCurrency: 'USD',
    postedDate: '2 days ago',
    featured: false,
    verified: true,
    industry: 'Cloud Infrastructure',
    companySize: '300-600 employees',
    fundingStage: 'Profitable / Bootstrapped',
    websiteUrl: 'https://cloudstream.example.com',
    description: 'CloudStream provides real-time media ingestion and streaming networks. We need a Senior SRE to strengthen Kubernetes fleet resilience, edge CDN traffic routing, and automated infrastructure as code across 14 global data centers.',
    responsibilities: [
      'Manage multi-region Kubernetes clusters running on bare metal and GCP with Terraform and ArgoCD.',
      'Design proactive telemetry and SLO dashboards using OpenTelemetry, Prometheus, and Grafana.',
      'Lead incident post-mortems with blameless engineering culture and measurable action items.',
      'Automate deployment pipelines and edge ingress proxies using Envoy and eBPF.'
    ],
    qualifications: [
      '5+ years in SRE or platform engineering managing production systems with 99.99% SLA.',
      'Advanced knowledge of Linux kernel internals, TCP/IP networking, and eBPF debugging.',
      'Extensive experience with Terraform, Kubernetes operators, and CI/CD pipelines.',
      'Proficiency in Python or Go for infrastructure tooling and automation.'
    ],
    benefits: [
      'Comprehensive 401(k) with 6% immediate matching',
      'Quarterly performance bonuses based on fleet uptime and latency benchmarks',
      'Cell phone and home high-speed fiber internet reimbursement',
      '25 days paid vacation + 10 bank holidays'
    ],
    techStack: ['Kubernetes', 'Terraform', 'Go', 'eBPF', 'Envoy', 'Prometheus', 'ArgoCD']
  },
  {
    id: 'job-6',
    title: 'Senior Full-Stack Product Engineer',
    company: 'Veloce Data',
    companyInitials: 'VD',
    companyColor: '#8B5CF6',
    location: 'Seattle, WA',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    department: 'Engineering',
    level: 'Senior',
    salaryMin: 165000,
    salaryMax: 205000,
    salaryCurrency: 'USD',
    postedDate: '3 days ago',
    featured: false,
    verified: true,
    industry: 'Enterprise Software',
    companySize: '60-100 employees',
    fundingStage: 'Series A',
    websiteUrl: 'https://velocedata.example.com',
    description: 'Veloce Data turns messy enterprise ERP tables into live relational data views. We are seeking a product-minded Full-Stack Engineer who enjoys building snappy, intuitive user experiences backed by robust PostgreSQL schemas.',
    responsibilities: [
      'Build rich, responsive tabular interfaces and data transformations in React and TypeScript.',
      'Implement performant GraphQL and REST APIs in Node.js and Rust with rigorous validation.',
      'Optimize database queries and indexing strategies for tables containing hundreds of millions of records.',
      'Participate actively in customer design sprints and product shaping discussions.'
    ],
    qualifications: [
      '5+ years building full-stack web applications with modern frontend frameworks and relational databases.',
      'Expertise in TypeScript, React, state management, and CSS layout architecture.',
      'Solid experience with PostgreSQL schema design, indexing, and query plan optimization.',
      'Passion for developer ergonomics, end-to-end testing, and automated release cycles.'
    ],
    benefits: [
      'Competitive salary + meaningful equity compensation',
      'Flexible vacation policy with no maximum cap',
      'Annual wellness and co-working space stipend ($400/mo)',
      '100% paid dental, health, and vision plans'
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker']
  },
  {
    id: 'job-7',
    title: 'Founding Infrastructure Security Architect',
    company: 'ShieldGrid',
    companyInitials: 'SG',
    companyColor: '#DC2626',
    location: 'Boston, MA',
    workplaceType: 'Hybrid',
    employmentType: 'Full-time',
    department: 'Security & Systems',
    level: 'Staff',
    salaryMin: 220000,
    salaryMax: 270000,
    salaryCurrency: 'USD',
    postedDate: '3 days ago',
    featured: false,
    verified: true,
    industry: 'Cybersecurity',
    companySize: '40-70 employees',
    fundingStage: 'Series A ($22M)',
    websiteUrl: 'https://shieldgrid.example.com',
    description: 'ShieldGrid is building cryptographic zero-trust gateways for industrial SCADA and cloud workloads. As the founding Security Architect, you will establish threat modeling standards, secret management protocols, and secure enclaves.',
    responsibilities: [
      'Design zero-knowledge attestation flows and mutual TLS architectures for hybrid clusters.',
      'Perform rigorous threat modeling and adversarial penetration testing on network boundaries.',
      'Lead SOC 2 Type II, FedRAMP, and ISO 27001 readiness engineering workstreams.',
      'Establish internal vulnerability disclosure programs and secure SDLC automated scans.'
    ],
    qualifications: [
      '8+ years in cloud and infrastructure security engineering with deep cryptography knowledge.',
      'Familiarity with PKI, HSMs, AWS KMS, HashiCorp Vault, and confidential computing.',
      'Proficiency in Go, Rust, or Python for writing automated security assertions.',
      'Demonstrated experience responding to live security incidents in production environments.'
    ],
    benefits: [
      'Premier health insurance with no employee premium contribution',
      '$5,000 yearly training budget (SANS, DEF CON, Black Hat passes)',
      'Generous parental leave and childcare assistance program',
      'Downtown Boston office with parking garage allowance'
    ],
    techStack: ['Rust', 'Go', 'HashiCorp Vault', 'AWS KMS', 'WireGuard', 'Kubernetes']
  },
  {
    id: 'job-8',
    title: 'Lead AI Systems & Inference Engineer',
    company: 'Nexus Inference',
    companyInitials: 'NI',
    companyColor: '#EC4899',
    location: 'San Jose, CA',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    department: 'AI & Data',
    level: 'Lead',
    salaryMin: 230000,
    salaryMax: 290000,
    salaryCurrency: 'USD',
    postedDate: '4 days ago',
    featured: true,
    verified: true,
    industry: 'Artificial Intelligence',
    companySize: '90-140 employees',
    fundingStage: 'Series B ($80M)',
    websiteUrl: 'https://nexusinference.example.com',
    description: 'Nexus Inference builds ultra-low-latency model serving engines for frontier LLMs and vision models. We are hiring a Lead AI Systems Engineer to maximize tokens-per-second, implement speculative decoding, and optimize GPU memory bandwidth.',
    responsibilities: [
      'Develop custom CUDA and Triton kernels for attention mechanisms and low-bit quantization (FP8, INT4).',
      'Optimize vLLM, TensorRT-LLM, and TGI inference runtimes for H100 and B200 GPU clusters.',
      'Build continuous profiling tools measuring TTFT (Time To First Token) and inter-token latency percentiles.',
      'Architect elastic cluster auto-scaling responsive to bursty customer API traffic.'
    ],
    qualifications: [
      '6+ years in systems programming, with 3+ years specifically in high-performance GPU computing.',
      'Deep mastery of CUDA C++, Triton, PyTorch C++ extensions, and NVLink topology.',
      'Proven understanding of modern transformer architectures, KV cache management, and continuous batching.',
      'Experience running large-scale distributed inference across 100+ GPU nodes.'
    ],
    benefits: [
      'Top-tier salary + significant equity grant in rapid-growth AI leader',
      'Unlimited GPU compute budget for personal experimental research',
      'Comprehensive dental, vision, life, and disability insurance',
      'Annual home ergonomic desk setup and display upgrade'
    ],
    techStack: ['CUDA', 'C++', 'Python', 'Triton', 'vLLM', 'TensorRT', 'PyTorch']
  }
];

export const FEATURED_COMPANIES: CompanyProfile[] = [
  {
    id: 'company-fintech',
    name: 'Fintech Global',
    industry: 'Financial Infrastructure',
    headline: 'High-throughput transactional ledger & real-time settlement rails',
    location: 'New York, NY',
    size: '850+ employees',
    funding: 'Series D ($210M)',
    imageUrl: '/src/assets/images/company_fintech_hq_1793592858902.jpg',
    techStack: ['Go', 'Rust', 'Kafka', 'PostgreSQL', 'Kubernetes'],
    openRolesCount: 4,
    description: 'Fintech Global connects tier-one financial institutions with deterministic atomic settlement systems, processing billions in daily volume with verifiable sub-second finality.'
  },
  {
    id: 'company-robotics',
    name: 'Automata Robotics',
    industry: 'Industrial Automation',
    headline: 'Next-generation collaborative robotic arms and precision actuation',
    location: 'San Francisco, CA',
    size: '220 employees',
    funding: 'Series B ($65M)',
    imageUrl: '/src/assets/images/company_robotics_lab_1793592860062.jpg',
    techStack: ['Embedded C', 'C++', 'FreeRTOS', 'CANopen', 'Python'],
    openRolesCount: 3,
    description: 'Automata builds accessible, software-defined industrial automation systems that allow hardware manufacturers to deploy robotic production lines in hours instead of months.'
  },
  {
    id: 'company-climate',
    name: 'Aether Climate Lab',
    industry: 'Geospatial Climate Science',
    headline: 'Earth observation analytics and renewable energy forecasting',
    location: 'Boulder, CO & Remote',
    size: '110 employees',
    funding: 'Series A ($38M)',
    imageUrl: '/src/assets/images/company_climate_campus_1793592858966.jpg',
    techStack: ['Python', 'PyTorch', 'Ray', 'GDAL', 'AWS'],
    openRolesCount: 5,
    description: 'Aether harnesses constellation satellite radar and physical climate models to provide power grid operators and disaster responders with predictive situational awareness.'
  }
];

export const SALARY_BENCHMARKS: SalaryMetric[] = [
  {
    role: 'Distributed Systems & Backend Engineer',
    department: 'Engineering',
    level: 'Senior',
    p25: 165000,
    median: 195000,
    p75: 230000,
    p90: 260000,
    sampleCount: 1420
  },
  {
    role: 'Distributed Systems & Backend Engineer',
    department: 'Engineering',
    level: 'Staff',
    p25: 210000,
    median: 245000,
    p75: 285000,
    p90: 330000,
    sampleCount: 680
  },
  {
    role: 'AI / Machine Learning Systems Engineer',
    department: 'AI & Data',
    level: 'Senior',
    p25: 180000,
    median: 215000,
    p75: 255000,
    p90: 295000,
    sampleCount: 950
  },
  {
    role: 'AI / Machine Learning Systems Engineer',
    department: 'AI & Data',
    level: 'Lead',
    p25: 225000,
    median: 265000,
    p75: 310000,
    p90: 360000,
    sampleCount: 410
  },
  {
    role: 'Full-Stack Product Engineer',
    department: 'Engineering',
    level: 'Mid',
    p25: 125000,
    median: 145000,
    p75: 170000,
    p90: 190000,
    sampleCount: 2150
  },
  {
    role: 'Full-Stack Product Engineer',
    department: 'Engineering',
    level: 'Senior',
    p25: 155000,
    median: 180000,
    p75: 210000,
    p90: 235000,
    sampleCount: 1890
  },
  {
    role: 'Product Designer (Design Systems & UX)',
    department: 'Product & Design',
    level: 'Senior',
    p25: 145000,
    median: 170000,
    p75: 198000,
    p90: 225000,
    sampleCount: 780
  },
  {
    role: 'Product Designer (Design Systems & UX)',
    department: 'Product & Design',
    level: 'Lead',
    p25: 180000,
    median: 210000,
    p75: 245000,
    p90: 275000,
    sampleCount: 320
  },
  {
    role: 'Site Reliability & Cloud Infrastructure',
    department: 'DevOps & Cloud',
    level: 'Senior',
    p25: 160000,
    median: 188000,
    p75: 220000,
    p90: 245000,
    sampleCount: 1120
  },
  {
    role: 'Site Reliability & Cloud Infrastructure',
    department: 'DevOps & Cloud',
    level: 'Staff',
    p25: 200000,
    median: 235000,
    p75: 275000,
    p90: 315000,
    sampleCount: 510
  }
];
