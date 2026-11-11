import { ResumeSchema } from '../types/resume';

export const developerResume: ResumeSchema = {
  personalInfo: {
    fullName: "Alex Rivera",
    jobTitle: "Senior Full Stack & Cloud Architect",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexrivera.dev",
    linkedin: "https://linkedin.com/in/alexrivera-tech",
    github: "https://github.com/alexrivera-io"
  },
  summary: "Results-driven Senior Full Stack Engineer with 7+ years of experience architecting high-concurrency microservices, real-time distributed platforms, and cloud infrastructure. Proven track record of scaling consumer web applications to 1.5M+ active monthly users while reducing infrastructure costs by 34%. Passionate about clean code, test-driven development, and engineering mentorship.",
  experience: [
    {
      id: "exp-1",
      company: "Stripe Infrastructure & Core Payments",
      role: "Lead Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected an event-driven payment transaction engine processing $42M+ daily volume with 99.999% uptime.",
        "Refactored legacy Node.js microservices into asynchronous Go & TypeScript pipelines, slashing p99 latency from 420ms to 68ms.",
        "Spearheaded multi-region Kubernetes migration across AWS and GCP, decreasing cloud compute overhead by 28% ($180K annual savings).",
        "Mentored a distributed engineering pod of 8 engineers and introduced automated CI/CD gating, cutting deployment failure rates by 55%."
      ]
    },
    {
      id: "exp-2",
      company: "DataFlow Systems",
      role: "Senior Full Stack Developer",
      location: "Austin, TX (Remote)",
      startDate: "2019",
      endDate: "2022",
      current: false,
      bullets: [
        "Engineered real-time analytics dashboards using React 18, TypeScript, and WebSockets serving 85,000+ simultaneous enterprise users.",
        "Designed and implemented high-throughput RESTful and GraphQL APIs backed by PostgreSQL and Redis cluster caching.",
        "Optimized complex database queries and indexing strategies, improving dashboard report query performance by 62%."
      ]
    },
    {
      id: "exp-3",
      company: "NextGen Software Labs",
      role: "Software Developer",
      location: "San Jose, CA",
      startDate: "2017",
      endDate: "2019",
      current: false,
      bullets: [
        "Developed responsive user interfaces with React, Redux, and Tailwind CSS, increasing visitor conversion rates by 22%.",
        "Integrated third-party payment gateways, OAuth2 authentication, and automated webhook notification workflows."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Electrical Engineering",
      location: "Berkeley, CA",
      startDate: "2013",
      endDate: "2017",
      gpa: "3.88 / 4.0",
      highlights: ["Dean's Honors List (All Semesters)", "President of ACM Student Chapter", "Undergraduate Teaching Assistant for Data Structures"]
    }
  ],
  skills: {
    technical: ["Distributed Systems", "Microservices", "REST & GraphQL", "System Architecture", "CI/CD Automation", "TDD"],
    languages: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "HTML5", "CSS3"],
    frameworks: ["React 18", "Next.js", "Node.js", "Express", "FastAPI", "Tailwind CSS", "Redux Toolkit"],
    tools: ["Docker", "Kubernetes", "AWS (ECS, RDS, S3, CloudFront)", "MongoDB", "PostgreSQL", "Redis", "Kafka", "Git", "Terraform"],
    softSkills: ["Engineering Leadership", "Cross-Functional Collaboration", "Technical Writing", "Agile / Scrum Master", "System Design Mentorship"]
  },
  projects: [
    {
      id: "proj-1",
      name: "HyperScale Event Broker",
      description: "Open-source distributed event mesh capable of streaming 250,000 messages per second with minimal memory footprint.",
      role: "Creator & Maintainer",
      technologies: ["Go", "Redis", "Docker", "Prometheus"],
      github: "https://github.com/alexrivera-io/hyperscale-broker",
      url: "https://hyperscale.dev",
      bullets: [
        "Earned 1,400+ GitHub stars and featured on Hacker News front page.",
        "Implemented zero-copy serialization achieving sub-millisecond dispatch times."
      ]
    },
    {
      id: "proj-2",
      name: "CloudPulse Monitoring Suite",
      description: "Full-stack observability dashboard visualizing Kubernetes cluster health metrics in real-time.",
      role: "Lead Architect",
      technologies: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Tailwind CSS"],
      github: "https://github.com/alexrivera-io/cloudpulse",
      bullets: [
        "Adopted by 12 startup engineering teams for container resource telemetry.",
        "Integrated intelligent anomaly detection alerts via Slack and PagerDuty."
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "https://aws.amazon.com"
    },
    {
      id: "cert-2",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation (CNCF)",
      date: "2022"
    }
  ],
  customSections: [],
  sectionOrder: ["personal", "summary", "experience", "skills", "projects", "education", "certifications"],
  visibleSections: {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    certifications: true
  }
};

export const executiveResume: ResumeSchema = {
  personalInfo: {
    fullName: "Marcus Sterling",
    jobTitle: "Vice President of Engineering",
    email: "marcus.sterling@example.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    website: "https://marcussterling.exec",
    linkedin: "https://linkedin.com/in/marcussterling-vp",
    github: ""
  },
  summary: "Visionary engineering executive with 15+ years of leadership driving product innovation, organizational scaling, and global technology strategy across Fortune 500 and high-growth venture-backed enterprises. Scaled engineering organizations from 25 to 180+ developers while maintaining top-tier delivery velocity and retention. Steered digital transformation resulting in $120M+ incremental enterprise ARR.",
  experience: [
    {
      id: "exp-exec-1",
      company: "Apex Global FinTech Solutions",
      role: "Vice President of Engineering",
      location: "New York, NY",
      startDate: "2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Lead a global engineering organization of 145+ engineers, directors, and architects across US, Europe, and Asia.",
        "Delivered next-generation cloud banking core driving $85M in new annualized contract value within 18 months.",
        "Cultivated an inclusive engineering culture resulting in 94% retention rate and 40% reduction in time-to-hire for key senior roles.",
        "Managed a \$32M annual technology budget spanning talent, infrastructure, and strategic vendor partnerships."
      ]
    },
    {
      id: "exp-exec-2",
      company: "Vanguard Digital Media",
      role: "Director of Software Engineering",
      location: "Boston, MA",
      startDate: "2015",
      endDate: "2020",
      current: false,
      bullets: [
        "Directed 5 engineering pods building high-scale streaming infrastructure serving 12M+ concurrent viewers.",
        "Transitioned monolithic legacy backend to cloud-native microservices, slashing operational outages by 78%."
      ]
    }
  ],
  education: [
    {
      id: "edu-exec-1",
      institution: "Columbia University",
      degree: "Master of Science",
      fieldOfStudy: "Technology Management & Computer Science",
      location: "New York, NY",
      startDate: "2011",
      endDate: "2013",
      gpa: "3.95 / 4.0",
      highlights: ["Executive Scholar Award"]
    },
    {
      id: "edu-exec-2",
      institution: "Cornell University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Engineering",
      location: "Ithaca, NY",
      startDate: "2007",
      endDate: "2011"
    }
  ],
  skills: {
    technical: ["Enterprise Architecture", "Cloud Strategy (AWS / Azure)", "Cybersecurity & SOC2 Compliance", "Data Governance"],
    languages: ["Python", "Java", "TypeScript", "SQL"],
    frameworks: ["React", "Spring Boot", "Microservices", "REST"],
    tools: ["Kubernetes", "Snowflake", "Datadog", "Jira Enterprise", "GitLab CI/CD"],
    softSkills: ["Executive Leadership", "Board Presentations", "Budget Management (\$30M+)", "Mergers & Acquisitions Tech Due Diligence", "Talent Mentorship"]
  },
  projects: [],
  certifications: [
    {
      id: "cert-exec-1",
      name: "Executive Leadership Program",
      issuer: "MIT Sloan School of Management",
      date: "2021"
    }
  ],
  customSections: [],
  sectionOrder: ["personal", "summary", "experience", "education", "skills", "certifications"],
  visibleSections: {
    summary: true,
    experience: true,
    projects: false,
    skills: true,
    education: true,
    certifications: true
  }
};

export const designerResume: ResumeSchema = {
  personalInfo: {
    fullName: "Elena Rostova",
    jobTitle: "Staff Product & UI/UX Designer",
    email: "elena.design@example.com",
    phone: "+1 (555) 345-6789",
    location: "Seattle, WA",
    website: "https://elenarostova.design",
    linkedin: "https://linkedin.com/in/elena-rostova-ux",
    github: "https://dribbble.com/elenarostova"
  },
  summary: "Human-centered Staff Product Designer with 8 years of experience crafting intuitive, accessible, and delight-driven design systems for world-class SaaS platforms. Champion of data-informed UX research, design tokens, and developer collaboration. Led redesign of flagship products that boosted user task completion rate by 41% and customer satisfaction (CSAT) to 4.8/5.",
  experience: [
    {
      id: "exp-des-1",
      company: "Figma Community Ecosystems",
      role: "Staff Product Designer",
      location: "Seattle, WA",
      startDate: "2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Spearheaded comprehensive overhaul of collaboration tooling utilized by 4M+ designers and product teams globally.",
        "Architected multi-brand design system with 600+ components, reducing cross-platform design-to-code drift by 50%.",
        "Conducted 120+ user interviews and usability testing sessions, translating qualitative insights into high-impact roadmap initiatives."
      ]
    },
    {
      id: "exp-des-2",
      company: "Airbnb Guest Experience",
      role: "Senior UX Designer",
      location: "San Francisco, CA",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: [
        "Designed end-to-end mobile checkout flow resulting in an 18% lift in completed international bookings.",
        "Standardized WCAG 2.1 AA accessibility guidelines across core web and mobile consumer surfaces."
      ]
    }
  ],
  education: [
    {
      id: "edu-des-1",
      institution: "Rhode Island School of Design (RISD)",
      degree: "Bachelor of Fine Arts",
      fieldOfStudy: "Graphic & Interaction Design",
      location: "Providence, RI",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.9 / 4.0",
      highlights: ["Excellence in Interactive Media Award"]
    }
  ],
  skills: {
    technical: ["User Research", "Wireframing & Prototyping", "Design Systems", "Design Tokens", "Accessibility (WCAG 2.1)", "Information Architecture"],
    languages: ["HTML5", "CSS3 / Sass", "JavaScript Basics"],
    frameworks: ["Tailwind CSS", "React Component Structure"],
    tools: ["Figma", "Framer", "Adobe Creative Suite", "Miro", "Maze Usability Testing", "Principle"],
    softSkills: ["Design Thinking Facilitation", "Storytelling", "Cross-Functional Alignment", "Mentorship"]
  },
  projects: [
    {
      id: "proj-des-1",
      name: "Pulse Design System",
      description: "Open-source, token-driven accessible design library with 50,000+ Figma community duplicates.",
      technologies: ["Figma", "Design Tokens", "React"],
      url: "https://pulsedesign.org",
      bullets: [
        "Featured in DesignSystems.io annual showcase 2023.",
        "Includes full documentation, motion guidelines, and token exports."
      ]
    }
  ],
  certifications: [
    {
      id: "cert-des-1",
      name: "Nielsen Norman Group UX Master Certified",
      issuer: "NN/g",
      date: "2022"
    }
  ],
  customSections: [],
  sectionOrder: ["personal", "summary", "experience", "projects", "skills", "education", "certifications"],
  visibleSections: {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    certifications: true
  }
};
