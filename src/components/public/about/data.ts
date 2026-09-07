export interface ProjectContribution {
  name: string;
  description: string;
  impact?: string;
}

export interface JourneyMilestone {
  period: string;
  title: string;
  detail: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleTitle: string;
  badge: "LEAD" | "SUB LEAD" | "MEMBER" | "MENTOR";
  avatar: string;
  bio: string;
  quote: string;
  education: string;
  roleBreakdown: string[];
  skills: string[];
  stackCategories: {
    category: string;
    items: string[];
  }[];
  projects: ProjectContribution[];
  journey: JourneyMilestone[];
  social: {
    github?: string;
    telegram?: string;
    linkedin?: string;
  };
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  roleTitle?: string;
  badge: "MENTOR";
  avatar: string;
  social: { github?: string; telegram?: string; linkedin?: string };
}

export const mentors: Mentor[] = [
  {
    id: "M2",
    name: "Miss. Mom Raksmey",
    role: "MENTOR",
    roleTitle: "TECHNICAL ADVISOR",
    badge: "MENTOR",
    avatar: "/images/avatar/raksmey.jpg",
    social: {
      github: "https://github.com/Reksmeys",
      telegram: "https://t.me/reksmey_mom",
      linkedin: "https://www.linkedin.com/in/reksmey-mom/",
    },
  },
  {
    id: "M3",
    name: "Mr. Chan Chhaya",
    role: "MENTOR",
    roleTitle: "BACKEND SPECIALIST",
    badge: "MENTOR",
    avatar: "/images/avatar/chhayya.jpg",
    social: {
      github: "https://github.com/it-chhaya",
      telegram: "https://t.me/chhayadevkh",
      linkedin: "https://www.linkedin.com/in/chan-chhaya-222a69178/",
    },
  },
  {
    id: "M1",
    name: "Mr. Kim Chansokpheng",
    role: "MENTOR",
    roleTitle: "CYBERSECURITY SPECIALIST",
    badge: "MENTOR",
    avatar: "/images/avatar/kim_chansopheng.png",
    social: {
      github: "https://github.com/sokpheng001",
      telegram: "https://t.me/sokpheng001",
      linkedin: "https://www.linkedin.com/in/kim-chansokpheng-6b6513267/",
    },
  },
  {
    id: "M4",
    name: "Miss. Eung Lyzhia",
    role: "MENTOR",
    roleTitle: "PRODUCT & QUALITY",
    badge: "MENTOR",
    avatar: "/images/avatar/lyzhia.jpg",
    social: {
      github: "https://github.com/lyzhiaa",
      telegram: "https://t.me/lyzhia",
      linkedin: "https://www.linkedin.com/in/lyzhia-eung-aa66912b9/",
    },
  },
];

export const developmentTeam: TeamMember[] = [
  {
    id: "01",
    name: "Srey ChanChhay",
    role: "LEADER",
    roleTitle: "LEAD FULL-STACK ENGINEER",
    badge: "LEAD",
    avatar: "/images/avatar/chanchhay.jpg",
    bio: "Lead Full-Stack Engineer spearheading project architecture, technical vision, and AI integration for Find Job. Specializes in building distributed systems, Next.js architecture, and orchestrating cross-functional engineering deliverables.",
    quote: "Engineering is about turning complex challenges into clean, intuitive, and impactful digital experiences.",
    education: "Institute of Science and Technology Advanced Development (ISTAD)",
    roleBreakdown: [
      "Frontend and backend core architecture lead",
      "RTK Query API integration and Redux state hierarchy",
      "AI Voice Interview simulator & Vapi SDK integration",
      "Technical code reviews and sprint management",
    ],
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Spring Boot", "Docker", "Redux Toolkit", "Vapi AI"],
    stackCategories: [
      { category: "Frontend Core", items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS v4", "shadcn UI"] },
      { category: "State & API", items: ["Redux Toolkit", "RTK Query", "Axios", "RESTful APIs", "Zod"] },
      { category: "AI & Media", items: ["Vapi AI Voice SDK", "TipTap Editor", "Three.js / Fiber", "Framer Motion"] },
      { category: "Backend & DevOps", items: ["Spring Boot", "Docker", "PostgreSQL", "Git / GitHub Actions"] },
    ],
    projects: [
      {
        name: "Find Job Core Architecture",
        description: "Built the unified Next.js App Router structure with role-based layouts, RTK Query service layer, and design tokens.",
        impact: "Delivered modular multi-role portal for Job Seekers, Recruiters, and Moderators.",
      },
      {
        name: "AI Voice Interview Simulator",
        description: "Integrated Vapi AI web SDK with real-time speech transcription and session outcome evaluations.",
        impact: "Allowed candidates to conduct voice-driven mock interviews with instant performance feedback.",
      },
    ],
    journey: [
      {
        period: "Sprint 1 - 2",
        title: "Project Inception & Architecture",
        detail: "Established core Next.js project setup, Redux store architecture, OpenAPI contracts, and design token system.",
      },
      {
        period: "Sprint 3 - 4",
        title: "Interactive Systems & AI Integration",
        detail: "Engineered the AI interview simulator, 3D interactive hero globe, and dynamic candidate review workflows.",
      },
      {
        period: "Sprint 5 - 6",
        title: "Optimization & Release Polish",
        detail: "Conducted end-to-end optimizations, performance audits, responsive layout refinements, and drawer modals.",
      },
    ],
    social: {
      github: "https://github.com/Chanchhay",
      telegram: "https://t.me/chanchhayy",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "02",
    name: "Khan Kanhchana",
    role: "SUB LEADER",
    roleTitle: "FRONTEND ARCHITECT",
    badge: "SUB LEAD",
    avatar: "/images/avatar/kanhchana.jpg",
    bio: "Frontend Specialist & Sub Leader focusing on UI/UX excellence, state management, and modern component systems. Committed to crafting highly responsive, visually stunning web experiences with Framer Motion.",
    quote: "Design and code must converge effortlessly to evoke delight, clarity, and trust in every user interaction.",
    education: "Institute of Science and Technology Advanced Development (ISTAD)",
    roleBreakdown: [
      "Sub-leadership and frontend component design system",
      "Landing page interactive animations and micro-interactions",
      "Public job exploration and detailed filtering interfaces",
      "Figma visual fidelity alignment and responsive polishing",
    ],
    skills: ["Next.js", "React", "Framer Motion", "Tailwind CSS", "Redux Toolkit", "Figma", "UI/UX Design"],
    stackCategories: [
      { category: "Frontend Design", items: ["React 19", "Next.js", "Tailwind CSS v4", "Framer Motion", "GSAP"] },
      { category: "UI Engineering", items: ["Component Design System", "Lucide Icons", "Radix Primitives", "Responsive Layouts"] },
      { category: "Tooling & Prototyping", items: ["Figma", "Git", "TypeScript", "Redux"] },
    ],
    projects: [
      {
        name: "Interactive Landing & About Us Page",
        description: "Crafted the modern animated landing page, dynamic stats counter, 3D components, and team showcase drawer.",
        impact: "Boosted user engagement and visual brand appeal across desktop and mobile devices.",
      },
      {
        name: "Job Search & Filter Engine",
        description: "Built the reactive client-side job search engine with multi-tag filtering, debounce search, and salary range sliders.",
        impact: "Enabled swift job discovery and seamless navigation for active job seekers.",
      },
    ],
    journey: [
      {
        period: "Sprint 1 - 2",
        title: "Design System & Public UI Foundation",
        detail: "Created shared UI tokens, navigation shell, public landing page components, and typography tokens.",
      },
      {
        period: "Sprint 3 - 4",
        title: "Motion Aesthetics & Role Portals",
        detail: "Implemented fluid Framer Motion animations, interactive job seeker cards, and drawer modals.",
      },
      {
        period: "Sprint 5 - 6",
        title: "Cross-Device Polish & A11y",
        detail: "Polished dark mode transitions, mobile touch gestures, and keyboard navigation.",
      },
    ],
    social: {
      github: "https://github.com/khannkanhchana",
      telegram: "https://t.me/khann_kanhchana",
      linkedin: "https://linkedin.com/in",
    },
  },
  {
    id: "03",
    name: "Lut Lina",
    role: "MEMBER",
    roleTitle: "FULL-STACK SOFTWARE ENGINEER",
    badge: "MEMBER",
    avatar: "/images/avatar/lina.jpg",
    bio: "Full-Stack Developer crafting responsive client-side interfaces and seamless data synchronization layers. Specializes in job seeker profile management, document upload workflows, and form validation with Zod.",
    quote: "Clean, well-structured forms and precise data validation make all the difference in user conversion.",
    education: "Institute of Science and Technology Advanced Development (ISTAD)",
    roleBreakdown: [
      "Job seeker profile management and resume builder",
      "Form validation with React Hook Form and Zod",
      "Dynamic portfolio project showcase components",
      "File upload and asset synchronization pipelines",
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "RTK Query", "Zod", "React Hook Form"],
    stackCategories: [
      { category: "Frontend Core", items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
      { category: "Forms & Validation", items: ["React Hook Form", "Zod Resolvers", "Formik", "Yup"] },
      { category: "State & Data", items: ["RTK Query", "Redux Toolkit", "Local Storage", "File API"] },
    ],
    projects: [
      {
        name: "Interactive Resume Builder",
        description: "Built the multi-step resume creation and editing tool with instant preview and PDF export capabilities.",
        impact: "Allowed job seekers to build and publish standardized resumes in minutes.",
      },
      {
        name: "Portfolio Project Gallery",
        description: "Created the portfolio showcases allowing developers to exhibit project screenshots, live URLs, and tech stacks.",
        impact: "Directly enhanced recruiter talent discovery and candidate visibility.",
      },
    ],
    journey: [
      {
        period: "Sprint 1 - 2",
        title: "Profile & Resume Data Contracts",
        detail: "Implemented TypeScript interfaces and API handlers for candidate profiles and resume records.",
      },
      {
        period: "Sprint 3 - 4",
        title: "Form Validation & Live Previews",
        detail: "Engineered deep form validation and live interactive resume previews with template selection.",
      },
      {
        period: "Sprint 5 - 6",
        title: "Portfolio Sync & Performance",
        detail: "Integrated image optimization and fast file uploads for job seeker media assets.",
      },
    ],
    social: {
      github: "https://github.com/Linaa14567",
      telegram: "https://t.me/Ly_NaNaNaNa",
      linkedin: "https://www.linkedin.com/in/lut-lyna-2a8867434/",
    },
  },
  {
    id: "04",
    name: "Heang BunLong",
    role: "MEMBER",
    roleTitle: "FULL-STACK SOFTWARE ENGINEER",
    badge: "MEMBER",
    avatar: "/images/avatar/bunlong.jpg",
    bio: "Full-Stack Engineer building resilient microservices integrations, authentication workflows, and recruiter company onboarding interfaces with Spring Boot and Next.js.",
    quote: "Simplicity in architecture and speed in execution create software that stands the test of scale.",
    education: "Institute of Science and Technology Advanced Development (ISTAD)",
    roleBreakdown: [
      "Recruiter company profile & verification onboarding",
      "Document upload management for company verification",
      "Job post creation, editing, and publishing workflow",
      "Backend REST API endpoints and database migrations",
    ],
    skills: ["React", "Next.js", "Spring Boot", "PostgreSQL", "Tailwind CSS", "TypeScript", "REST APIs"],
    stackCategories: [
      { category: "Backend & DB", items: ["Spring Boot", "Java", "PostgreSQL", "JPA / Hibernate", "Flyway"] },
      { category: "Frontend Integration", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Axios"] },
      { category: "DevOps & Tools", items: ["Docker", "Postman", "Git", "Maven"] },
    ],
    projects: [
      {
        name: "Recruiter Company Verification Onboarding",
        description: "Implemented multi-step company document upload and verification submission module.",
        impact: "Guaranteed recruiter legitimacy before granting job publishing rights.",
      },
      {
        name: "Job Posting & Lifecycle Management",
        description: "Engineered job posting creation, draft saving, pausing, and applicant count tracking.",
        impact: "Streamlined recruitment campaign management for verified companies.",
      },
    ],
    journey: [
      {
        period: "Sprint 1 - 2",
        title: "Company Schema & API Endpoints",
        detail: "Built the backend domain models and controllers for company profiles and verification files.",
      },
      {
        period: "Sprint 3 - 4",
        title: "Recruiter Portal Implementation",
        detail: "Constructed the recruiter dashboard, company settings, and job creation form.",
      },
      {
        period: "Sprint 5 - 6",
        title: "End-to-End Integration Testing",
        detail: "Conducted end-to-end verification tests connecting Spring Boot APIs with Next.js frontend.",
      },
    ],
    social: {
      github: "https://github.com/heangbunlong-zk",
      telegram: "https://t.me/heangbunlong",
      linkedin: "https://linkedin.com/in/heangbunlong",
    },
  },
  {
    id: "05",
    name: "Man Tolfary",
    role: "MEMBER",
    roleTitle: "FRONTEND SOFTWARE ENGINEER",
    badge: "MEMBER",
    avatar: "/images/avatar/fary.jpg",
    bio: "Frontend Developer focusing on user interactive experiences, modular design patterns, and cross-platform compatibility across the job seeker portal.",
    quote: "Every detail matters — smooth transitions and clear feedback turn good software into great software.",
    education: "Institute of Science and Technology Advanced Development (ISTAD)",
    roleBreakdown: [
      "Job seeker application tracking and status timelines",
      "Application review dialogs and confirmation states",
      "Reusable UI table primitives, modals, and badge components",
      "Dark mode theme consistency across all portal screens",
    ],
    skills: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Redux Toolkit", "Git", "Radix UI"],
    stackCategories: [
      { category: "Frontend Core", items: ["Next.js", "React 19", "TypeScript", "Tailwind CSS v4"] },
      { category: "UI & Componentry", items: ["Radix UI", "Lucide React", "Sonner Toast", "Next Themes"] },
      { category: "State Management", items: ["Redux Toolkit", "RTK Query", "React Hooks"] },
    ],
    projects: [
      {
        name: "Application Tracking Dashboard",
        description: "Constructed the real-time application tracking timeline showing stages from applied to forwarded.",
        impact: "Gave candidates complete transparency into their interview and review progress.",
      },
      {
        name: "Theme & Design System Harmonization",
        description: "Implemented flawless dark/light mode switches and centralized color tokens.",
        impact: "Consistent and eye-friendly visual experience across high and low light conditions.",
      },
    ],
    journey: [
      {
        period: "Sprint 1 - 2",
        title: "Dashboard & Tracking Wireframes",
        detail: "Implemented initial dashboard UI widgets and application status cards.",
      },
      {
        period: "Sprint 3 - 4",
        title: "Timeline & Interactive Dialogs",
        detail: "Added multi-stage application progression bars and withdrawal confirmation dialogs.",
      },
      {
        period: "Sprint 5 - 6",
        title: "Theme Optimization & Accessibility",
        detail: "Fine-tuned contrast ratios, dark mode color balance, and responsive spacing.",
      },
    ],
    social: {
      github: " https://github.com/mantolfary",
      telegram: "https://t.me/tolfary",
      linkedin: "https://www.linkedin.com/in/man-tolfary-390b83368/",
    },
  },
  {
    id: "06",
    name: "Sithon Somrach",
    role: "MEMBER",
    roleTitle: "UI/UX & FRONTEND ENGINEER",
    badge: "MEMBER",
    avatar: "/images/avatar/samrach.jpg",
    bio: "Creative UI Engineer dedicated to crafting polished UI interactions, animation aesthetics, and intuitive candidate search views for recruiters.",
    quote: "A great interface is invisible; users achieve their goals effortlessly and with confidence.",
    education: "Institute of Science and Technology Advanced Development (ISTAD)",
    roleBreakdown: [
      "Recruiter talent discovery and public candidate cards",
      "Micro-animations and interactive hover states",
      "TipTap rich text editor integration for job descriptions",
      "Responsive layout auditing on tablets and mobile devices",
    ],
    skills: ["React", "Next.js", "Tailwind CSS", "UI/UX Design", "TipTap", "JavaScript", "HTML/CSS"],
    stackCategories: [
      { category: "Design & UX", items: ["Figma", "UI/UX Design", "Responsive Layouts", "Typography", "CSS Animations"] },
      { category: "Frontend Stack", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "TipTap Editor"] },
      { category: "Utilities", items: ["clsx", "tailwind-merge", "lucide-react"] },
    ],
    projects: [
      {
        name: "Talent Discovery Showcase",
        description: "Created candidate search cards featuring skill pills, experience badges, and direct contact prompts.",
        impact: "Allowed recruiters to scout top talent quickly and effortlessly.",
      },
      {
        name: "Rich Text Job Editor (TipTap)",
        description: "Integrated TipTap WYSIWYG editor for formatted job descriptions with bolding, lists, and markdown support.",
        impact: "Made job posting creation rich, flexible, and visually formatted.",
      },
    ],
    journey: [
      {
        period: "Sprint 1 - 2",
        title: "Talent UI & Card Prototyping",
        detail: "Designed and coded candidate profile preview cards with interactive hover effects.",
      },
      {
        period: "Sprint 3 - 4",
        title: "TipTap Editor Integration",
        detail: "Embedded TipTap markdown and rich text toolbar into recruiter job creation pages.",
      },
      {
        period: "Sprint 5 - 6",
        title: "Interaction Polish & Animation",
        detail: "Added smooth button click effects, skeleton loaders, and responsive grid layouts.",
      },
    ],
    social: {
      github: "https://github.com/SamrachCR",
      telegram: "https://t.me/Samrach1001",
      linkedin: "https://www.linkedin.com/in/lozy-ize-7a2b86344/",
    },
  },
  {
    id: "07",
    name: "Pech PhakLey",
    role: "MEMBER",
    roleTitle: "FRONTEND SOFTWARE ENGINEER",
    badge: "MEMBER",
    avatar: "/images/avatar/phakley.jpg",
    bio: "Software Engineer enthusiastic about modern web frameworks, component accessibility, and developer productivity tools across the Find Job platform.",
    quote: "Continuous learning and relentless attention to detail drive true engineering craftsmanship.",
    education: "Institute of Science and Technology Advanced Development (ISTAD)",
    roleBreakdown: [
      "Moderator review interfaces and candidate forwarding UI",
      "Authentication redirection logic and session protection",
      "Notification toast integration and error state components",
      "Component accessibility and cross-browser testing",
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "RTK Query", "Framer Motion", "Sonner"],
    stackCategories: [
      { category: "Frontend Stack", items: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS v4"] },
      { category: "State & API", items: ["RTK Query", "Redux Toolkit", "Better Auth", "Keycloak"] },
      { category: "Feedback & Notifications", items: ["Sonner Toasts", "Error Boundaries", "Loading Skeletons"] },
    ],
    projects: [
      {
        name: "Forwarded Candidate Review System",
        description: "Built the recruiter review view for candidates explicitly forwarded by moderators with interview notes.",
        impact: "Maintained data privacy while enabling seamless recruiter decision making.",
      },
      {
        name: "Platform Notification & Feedback Layer",
        description: "Implemented Sonner toast notifications and unified error handling across all API mutations.",
        impact: "Provided instant, clear feedback for user actions and network events.",
      },
    ],
    journey: [
      {
        period: "Sprint 1 - 2",
        title: "Authentication Handoff & Session Shell",
        detail: "Implemented login callback handlers, role-based redirects, and route guarding.",
      },
      {
        period: "Sprint 3 - 4",
        title: "Forwarded Candidate Detail View",
        detail: "Created the comprehensive candidate dossier interface for recruiters.",
      },
      {
        period: "Sprint 5 - 6",
        title: "Drawer Modal & Toast Alerts",
        detail: "Implemented accessible slide-over drawer modal mechanisms and toast feedback alerts.",
      },
    ],
    social: {
      github: "https://github.com/pechphakley",
      telegram: "https://t.me/phakley",
      linkedin: "https://www.linkedin.com/feed/",
    },
  },
];

// For backward compatibility
export const topMembers = developmentTeam.slice(0, 3);
export const bottomMembers = developmentTeam.slice(3);







