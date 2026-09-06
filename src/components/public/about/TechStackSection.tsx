"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu } from "lucide-react";
import {
  SiSpringboot,
  SiNextdotjs,
  SiPostgresql,
  SiGooglegemini,
  SiGooglecloud,
  SiApache,
  SiGithub,
  SiJenkins,
  SiDocker,
  SiTraefikproxy,
  SiFramer,
  SiGreensock,
  SiThreedotjs,
  SiReact,
  SiTailwindcss,
} from "react-icons/si";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { BorderTrail } from "@/components/core/border-trail";

// Custom SVG Icons for specialized libraries
function VapiIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="10" fill="#00F0FF" fillOpacity="0.15" />
      <path
        d="M8 8.5L12 16L16 8.5M12 12V17"
        stroke="#00F0FF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8.5" r="1.5" fill="#00F0FF" />
      <circle cx="16" cy="8.5" r="1.5" fill="#00F0FF" />
      <circle cx="12" cy="16" r="1.5" fill="#00F0FF" />
    </svg>
  );
}

function DreiIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        fill="#00D2D3"
        fillOpacity="0.3"
        stroke="#00D2D3"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17M2 12L12 17L22 12"
        stroke="#00D2D3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KeyframesIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4 12C4 8 8 4 12 4C16 4 20 8 20 12C20 16 16 20 12 20C8 20 4 16 4 12Z"
        stroke="#1fa628"
        strokeWidth="1.5"
        strokeDasharray="2 2"
      />
      <path
        d="M12 8L16 12L12 16L8 12L12 8Z"
        fill="#1fa628"
        fillOpacity="0.25"
        stroke="#1fa628"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function AnimateCssIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        fill="#F97316"
        fillOpacity="0.2"
        stroke="#F97316"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DockerComposeIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Back Tentacles */}
      <path
        d="M62 26 C62 14, 72 8, 80 14 C88 20, 86 32, 76 38 C68 42, 62 46, 58 54"
        stroke="#1E293B"
        strokeWidth="3.5"
        fill="#A6C5DB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M74 54 C88 52, 98 60, 96 72 C94 82, 80 86, 70 78 C62 72, 56 66, 52 60"
        stroke="#1E293B"
        strokeWidth="3.5"
        fill="#A6C5DB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Front / Bottom Tentacles */}
      <path
        d="M26 62 C14 66, 4 76, 6 88 C8 96, 20 96, 30 88 C38 82, 44 72, 42 64"
        stroke="#1E293B"
        strokeWidth="3.5"
        fill="#A6C5DB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 64 C32 76, 38 90, 48 94 C56 97, 66 90, 60 80 C56 72, 52 66, 48 62"
        stroke="#1E293B"
        strokeWidth="3.5"
        fill="#A6C5DB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 48 C6 50, 2 62, 4 74 C6 82, 14 82, 18 76 C22 70, 24 62, 28 56"
        stroke="#1E293B"
        strokeWidth="3.5"
        fill="#A6C5DB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 44 C16 40, 6 42, 4 46 C2 50, 8 56, 14 54 C20 52, 26 48, 30 44"
        stroke="#1E293B"
        strokeWidth="3.5"
        fill="#A6C5DB"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main Octopus Head */}
      <path
        d="M30 48 C22 42, 22 22, 46 16 C70 10, 82 30, 74 48 C68 56, 60 62, 46 62 C34 62, 32 54, 30 48 Z"
        stroke="#1E293B"
        strokeWidth="3.5"
        fill="#B2CEE2"
        strokeLinejoin="round"
      />

      {/* Head Texture Spots */}
      <ellipse cx="42" cy="26" rx="4.5" ry="2.5" fill="#97B8D0" transform="rotate(-15 42 26)" />
      <circle cx="32" cy="36" r="2.5" fill="#97B8D0" />
      <circle cx="38" cy="42" r="2" fill="#97B8D0" />
      <circle cx="48" cy="74" r="2" fill="#97B8D0" />

      {/* Big Eyes */}
      <ellipse cx="43" cy="52" rx="5" ry="6" fill="white" stroke="#1E293B" strokeWidth="2.5" />
      <ellipse cx="53" cy="52" rx="5" ry="6" fill="white" stroke="#1E293B" strokeWidth="2.5" />
      {/* Pupils Looking Up */}
      <circle cx="44" cy="49" r="2.5" fill="#1E293B" />
      <circle cx="54" cy="49" r="2.5" fill="#1E293B" />

      {/* Juggled Container Box 1 (Top Right) */}
      <g transform="translate(60, 4) rotate(12)">
        <polygon points="3,6 17,1 24,5 10,10" fill="#67D0FF" stroke="#1E293B" strokeWidth="2" />
        <polygon points="3,6 10,10 10,18 3,14" fill="#009BF0" stroke="#1E293B" strokeWidth="2" />
        <polygon points="10,10 24,5 24,13 10,18" fill="#0079C2" stroke="#1E293B" strokeWidth="2" />
        {/* Container Ridges */}
        <line x1="13" y1="9" x2="13" y2="16.5" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
        <line x1="17" y1="7.5" x2="17" y2="15" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
        <line x1="21" y1="6" x2="21" y2="13.5" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Juggled Container Box 2 (Left) */}
      <g transform="translate(1, 35) rotate(-6)">
        <polygon points="3,6 16,1 22,5 9,10" fill="#67D0FF" stroke="#1E293B" strokeWidth="2" />
        <polygon points="3,6 9,10 9,17 3,13" fill="#009BF0" stroke="#1E293B" strokeWidth="2" />
        <polygon points="9,10 22,5 22,12 9,17" fill="#0079C2" stroke="#1E293B" strokeWidth="2" />
        <line x1="12" y1="9" x2="12" y2="15.5" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
        <line x1="16" y1="7.5" x2="16" y2="14" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
        <line x1="19.5" y1="6" x2="19.5" y2="12.5" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Juggled Container Box 3 (Right) */}
      <g transform="translate(73, 56) rotate(-8)">
        <polygon points="3,6 17,1 23,5 9,10" fill="#67D0FF" stroke="#1E293B" strokeWidth="2" />
        <polygon points="3,6 9,10 9,17 3,13" fill="#009BF0" stroke="#1E293B" strokeWidth="2" />
        <polygon points="9,10 23,5 23,12 9,17" fill="#0079C2" stroke="#1E293B" strokeWidth="2" />
        <line x1="12.5" y1="9" x2="12.5" y2="15.5" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
        <line x1="16.5" y1="7.5" x2="16.5" y2="14" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
        <line x1="20.5" y1="6" x2="20.5" y2="12.5" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Juggled Container Box 4 (Bottom) */}
      <g transform="translate(50, 80) rotate(16)">
        <polygon points="3,6 17,1 24,5 10,10" fill="#67D0FF" stroke="#1E293B" strokeWidth="2" />
        <polygon points="3,6 10,10 10,17 3,13" fill="#009BF0" stroke="#1E293B" strokeWidth="2" />
        <polygon points="10,10 24,5 24,12 10,17" fill="#0079C2" stroke="#1E293B" strokeWidth="2" />
        <line x1="13.5" y1="9" x2="13.5" y2="15.5" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
        <line x1="17.5" y1="7.5" x2="17.5" y2="14" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
        <line x1="21.5" y1="6" x2="21.5" y2="12.5" stroke="#1E293B" strokeWidth="1" opacity="0.6" />
      </g>
    </svg>
  );
}

export interface TechItem {
  id: string;
  name: string;
  category: "Backend & Cloud" | "Frontend & Animation";
  icon: React.ReactNode;
  brandColor: string;
  borderColor: string;
  bgGlow: string;
  docUrl?: string;
}

// 1. Backend, Cloud, DevOps & AI Core Stack
export const backendCloudStack: TechItem[] = [
  {
    id: "springboot",
    name: "Spring Boot",
    category: "Backend & Cloud",
    icon: <SiSpringboot className="h-6 w-6 text-[#6DB33F]" />,
    brandColor: "#6DB33F",
    borderColor: "hover:border-[#6DB33F]/50",
    bgGlow: "group-hover:bg-[#6DB33F]/10",
    docUrl: "https://spring.io/projects/spring-boot",
  },
  {
    id: "nextjs",
    name: "Next.js",
    category: "Backend & Cloud",
    icon: <SiNextdotjs className="h-6 w-6 text-black dark:text-white" />,
    brandColor: "#000000",
    borderColor: "hover:border-slate-400 dark:hover:border-slate-500",
    bgGlow: "group-hover:bg-slate-500/10",
    docUrl: "https://nextjs.org",
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Backend & Cloud",
    icon: <SiPostgresql className="h-6 w-6 text-[#4169E1]" />,
    brandColor: "#4169E1",
    borderColor: "hover:border-[#4169E1]/50",
    bgGlow: "group-hover:bg-[#4169E1]/10",
    docUrl: "https://www.postgresql.org",
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "Backend & Cloud",
    icon: <SiGooglegemini className="h-6 w-6 text-[#8E75FF]" />,
    brandColor: "#8E75FF",
    borderColor: "hover:border-[#8E75FF]/50",
    bgGlow: "group-hover:bg-[#8E75FF]/10",
    docUrl: "https://deepmind.google/technologies/gemini",
  },
  {
    id: "pdfbox",
    name: "Apache PDFBox",
    category: "Backend & Cloud",
    icon: <SiApache className="h-6 w-6 text-[#D22128]" />,
    brandColor: "#D22128",
    borderColor: "hover:border-[#D22128]/50",
    bgGlow: "group-hover:bg-[#D22128]/10",
    docUrl: "https://pdfbox.apache.org",
  },
  {
    id: "vapi",
    name: "Vapi",
    category: "Backend & Cloud",
    icon: <VapiIcon className="h-6 w-6" />,
    brandColor: "#00F0FF",
    borderColor: "hover:border-[#00F0FF]/50",
    bgGlow: "group-hover:bg-[#00F0FF]/10",
    docUrl: "https://vapi.ai",
  },
  {
    id: "github",
    name: "GitHub",
    category: "Backend & Cloud",
    icon: <SiGithub className="h-6 w-6 text-slate-900 dark:text-slate-100" />,
    brandColor: "#24292e",
    borderColor: "hover:border-slate-400",
    bgGlow: "group-hover:bg-slate-500/10",
    docUrl: "https://github.com",
  },
  {
    id: "jenkins",
    name: "Jenkins",
    category: "Backend & Cloud",
    icon: <SiJenkins className="h-6 w-6 text-[#D24939]" />,
    brandColor: "#D24939",
    borderColor: "hover:border-[#D24939]/50",
    bgGlow: "group-hover:bg-[#D24939]/10",
    docUrl: "https://www.jenkins.io",
  },
  {
    id: "docker",
    name: "Docker",
    category: "Backend & Cloud",
    icon: <SiDocker className="h-6 w-6 text-[#2496ED]" />,
    brandColor: "#2496ED",
    borderColor: "hover:border-[#2496ED]/50",
    bgGlow: "group-hover:bg-[#2496ED]/10",
    docUrl: "https://www.docker.com",
  },
  {
    id: "dockercompose",
    name: "Docker Compose",
    category: "Backend & Cloud",
    icon: <DockerComposeIcon className="h-6 w-6" />,
    brandColor: "#0db7ed",
    borderColor: "hover:border-[#0db7ed]/50",
    bgGlow: "group-hover:bg-[#0db7ed]/10",
    docUrl: "https://docs.docker.com/compose",
  },
  {
    id: "traefik",
    name: "Traefik",
    category: "Backend & Cloud",
    icon: <SiTraefikproxy className="h-6 w-6 text-[#24A1C1]" />,
    brandColor: "#24A1C1",
    borderColor: "hover:border-[#24A1C1]/50",
    bgGlow: "group-hover:bg-[#24A1C1]/10",
    docUrl: "https://traefik.io",
  },
  {
    id: "gcp",
    name: "Google Cloud",
    category: "Backend & Cloud",
    icon: <SiGooglecloud className="h-6 w-6 text-[#4285F4]" />,
    brandColor: "#4285F4",
    borderColor: "hover:border-[#4285F4]/50",
    bgGlow: "group-hover:bg-[#4285F4]/10",
    docUrl: "https://cloud.google.com",
  },
];

// 2. Frontend, 3D & Animation Ecosystem
export const frontendAnimationStack: TechItem[] = [
  {
    id: "framermotion",
    name: "Framer Motion",
    category: "Frontend & Animation",
    icon: <SiFramer className="h-6 w-6 text-[#0055FF]" />,
    brandColor: "#0055FF",
    borderColor: "hover:border-[#0055FF]/50",
    bgGlow: "group-hover:bg-[#0055FF]/10",
    docUrl: "https://www.framer.com/motion",
  },
  {
    id: "gsap",
    name: "GSAP",
    category: "Frontend & Animation",
    icon: <SiGreensock className="h-6 w-6 text-[#88CE02]" />,
    brandColor: "#88CE02",
    borderColor: "hover:border-[#88CE02]/50",
    bgGlow: "group-hover:bg-[#88CE02]/10",
    docUrl: "https://greensock.com/gsap",
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "Frontend & Animation",
    icon: <SiThreedotjs className="h-6 w-6 text-black dark:text-white" />,
    brandColor: "#000000",
    borderColor: "hover:border-slate-400",
    bgGlow: "group-hover:bg-slate-500/10",
    docUrl: "https://threejs.org",
  },
  {
    id: "r3f",
    name: "React Three Fiber",
    category: "Frontend & Animation",
    icon: <SiReact className="h-6 w-6 text-[#61DAFB]" />,
    brandColor: "#61DAFB",
    borderColor: "hover:border-[#61DAFB]/50",
    bgGlow: "group-hover:bg-[#61DAFB]/10",
    docUrl: "https://r3f.docs.pmnd.rs",
  },
  {
    id: "drei",
    name: "React Three Drei",
    category: "Frontend & Animation",
    icon: <DreiIcon className="h-6 w-6" />,
    brandColor: "#00D2D3",
    borderColor: "hover:border-[#00D2D3]/50",
    bgGlow: "group-hover:bg-[#00D2D3]/10",
    docUrl: "https://github.com/pmndrs/drei",
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS Animations",
    category: "Frontend & Animation",
    icon: <SiTailwindcss className="h-6 w-6 text-[#06B6D4]" />,
    brandColor: "#06B6D4",
    borderColor: "hover:border-[#06B6D4]/50",
    bgGlow: "group-hover:bg-[#06B6D4]/10",
    docUrl: "https://tailwindcss.com",
  },
  {
    id: "twanimate",
    name: "tw-animate-css",
    category: "Frontend & Animation",
    icon: <AnimateCssIcon className="h-6 w-6" />,
    brandColor: "#F97316",
    borderColor: "hover:border-[#F97316]/50",
    bgGlow: "group-hover:bg-[#F97316]/10",
    docUrl: "https://animate.style",
  },
  {
    id: "customkeyframes",
    name: "Custom CSS Keyframes",
    category: "Frontend & Animation",
    icon: <KeyframesIcon className="h-6 w-6" />,
    brandColor: "#1fa628",
    borderColor: "hover:border-[#1fa628]/50",
    bgGlow: "group-hover:bg-[#1fa628]/10",
    docUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes",
  },
];

export default function TechStackSection() {
  return (
    <section className="relative space-y-12 overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.4 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1fa628]/40 bg-[#1fa628]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1fa628]">
          <Cpu className="h-3.5 w-3.5" />
          ARCHITECTURE & TECHNOLOGIES
        </div>

        <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl tracking-tight">
          <span className="text-[#1fa628]">Technology</span>{" "}
          <span className="text-[#F3BE00]">Stack</span>
        </h2>

        <p className="max-w-2xl mx-auto text-sm sm:text-base font-medium text-slate-500 dark:text-slate-400">
          Powered by enterprise-grade backend microservices, real-time voice AI, cloud-native DevOps, and high-performance 3D motion engines.
        </p>
      </motion.div>

      {/* Infinite Sliders Display */}
      <div className="space-y-4 relative">
        {/* Left & Right Edge Blur Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-32 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#181B1C] dark:via-[#181B1C]/80 dark:to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-32 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-[#181B1C] dark:via-[#181B1C]/80 dark:to-transparent" />

        {/* Row 1: Backend, Cloud, DevOps & AI (Scrolling Left) */}
        <InfiniteSlider
          gap={16}
          duration={28}
          durationOnHover={0}
          reverse={false}
          className="py-1.5"
        >
          {backendCloudStack.map((tech) => (
            <TechLogoPill key={tech.id} tech={tech} />
          ))}
        </InfiniteSlider>

        {/* Row 2: Frontend, 3D & Animation Ecosystem (Scrolling Right) */}
        <InfiniteSlider
          gap={16}
          duration={24}
          durationOnHover={0}
          reverse={true}
          className="py-1.5"
        >
          {frontendAnimationStack.map((tech) => (
            <TechLogoPill key={tech.id} tech={tech} />
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// Individual Tech Logo Pill (Unified Brand Hover Style)
// -------------------------------------------------------------
function TechLogoPill({ tech }: { tech: TechItem }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      className="group relative cursor-default select-none my-1"
    >
      {/* Main Pill Body */}
      <div className="relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 px-5 py-3.5 backdrop-blur-md transition-all duration-300 group-hover:border-[#1fa628]/60 dark:border-slate-800/90 dark:bg-slate-900/95 dark:group-hover:border-[#1fa628]/60">
        {/* Animated Border Trail on Hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <BorderTrail
            className="bg-linear-to-r from-transparent via-[#1fa628] to-[#F3BE00] shadow-[0_0_10px_rgba(31,166,40,0.8)] dark:via-[#45D45A] dark:to-[#F3BE00] dark:shadow-[0_0_12px_rgba(243,190,0,0.7)]"
            size={70}
            duration={3}
          />
        </div>

        {/* Subtle Light Sheen Sweep on Hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full dark:via-white/10" />

        {/* Official Logo Frame */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:border-[#1fa628]/30 group-hover:bg-[#1fa628]/10 dark:border-slate-800 dark:bg-slate-800 dark:group-hover:border-[#1fa628]/30 dark:group-hover:bg-[#1fa628]/10">
          {tech.icon}
        </div>

        {/* Technology Name */}
        <span className="text-sm font-bold text-slate-800 transition-colors duration-300 group-hover:text-[#1fa628] dark:text-slate-200 dark:group-hover:text-[#22c55e] whitespace-nowrap">
          {tech.name}
        </span>
      </div>
    </motion.div>
  );
}
