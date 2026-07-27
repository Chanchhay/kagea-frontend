"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  ArrowLeft,
  User,
  Briefcase,
  Heart,
  Bell,
  Bot,
  Upload,
  FileText,
  FolderOpen,
  Settings,
  ExternalLink,
  Code,
  LayoutGrid
} from "lucide-react";

// --- Mock Data ---
const projects = [
  { id: 1, title: "FinTech Analytics Engine", description: "A high-performance data processing engine...", tags: ["React", "Node.js", "PostgreSQL"], image: "/fintech-project.jpg", status: "live" },
  { id: 2, title: "HealthTrack Mobile App", description: "A comprehensive patient management system...", tags: ["TypeScript", "React Native", "Firebase"], image: "/health-project.jpg", status: "live" },
  { id: 3, title: "CryptoPulse Dashboard", description: "A real-time cryptocurrency monitoring platform...", tags: ["Python", "Next.js", "D3.js"], image: "/crypto-project.jpg", status: "draft", aiRec: true }
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function MyPortfolio() {
  return (
    <div className="flex min-h-screen bg-[#DDE4F7] font-sans p-6">
      {/* --- Sidebar --- */}
      <motion.aside 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 flex flex-col gap-8"
      >
        <button className="bg-[#F6B62D] text-white font-bold py-2 px-6 rounded-full w-fit flex items-center gap-2 shadow-sm hover:bg-[#e0a428] transition-colors">
          <ArrowLeft size={18} /> BACK
        </button>

        <nav className="flex flex-col gap-1 text-gray-600">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Main Menu</p>
          <NavItem icon={<User size={18} />} label="My Profile" />
          <NavItem icon={<Briefcase size={18} />} label="Applied Jobs" />
          <NavItem icon={<Heart size={18} />} label="Favorite Jobs" />
          <NavItem icon={<Bell size={18} />} label="Job Alert" />
          <NavItem icon={<Bot size={18} />} label="AI interview" />
          <div className="h-4" />
          <NavItem icon={<Upload size={18} />} label="Submit CV" />
          <NavItem icon={<FileText size={18} />} label="Resumes" />
          <NavItem icon={<FolderOpen size={18} />} label="Project Submissions" />
          <NavItem icon={<Briefcase size={18} />} label="My Applications" />
          <NavItem icon={<LayoutGrid size={18} />} label="My Portfolio" active />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>
      </motion.aside>

      {/* --- Main Content --- */}
      <main className="flex-1 bg-white rounded-3xl p-8 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">My Portfolio</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                placeholder="Search projects..." 
                className="bg-gray-50 border border-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button className="bg-[#1A8632] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#156d29] transition-colors">
              <Plus size={16} /> Add New Project
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-[#F6B62D] p-6 rounded-2xl text-white shadow-md">
            <p className="text-sm opacity-90 mb-1">PORTFOLIO VISIBILITY</p>
            <h2 className="text-3xl font-bold mb-1">1.2k</h2>
            <p className="text-xs opacity-80">Views this week · <span className="font-bold">+12%</span></p>
          </div>
          <div className="border border-gray-100 p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">AI SKILL MATCH</p>
            <h2 className="text-xl font-bold text-gray-800">High Relevance <span className="text-green-600 font-normal text-sm ml-2">94%</span></h2>
            <p className="text-sm text-gray-400 mt-2">Matched with 48 job listings</p>
          </div>
          <div className="border border-gray-100 p-6 rounded-2xl shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Next Step:</p>
            <h2 className="text-sm font-semibold text-gray-700 leading-snug">Update your “FinTech Analytics” project to match Senior roles.</h2>
          </div>
        </div>

        {/* Projects Grid with Stagger Animation */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-6"
        >
          {projects.map((proj) => (
            <motion.div 
              key={proj.id} 
              variants={cardVariants}
              whileHover={{ y: -5 }} // Subtle lift on hover
              className="border border-gray-100 rounded-2xl p-4 flex flex-col hover:shadow-lg transition-shadow bg-white"
            >
              <div className="h-40 w-full mb-4 relative overflow-hidden rounded-xl bg-gray-100">
                <img src={"/images (10).jpg"} alt={proj.title} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 mb-2">{proj.title}</h3>
                    {proj.aiRec && <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded whitespace-nowrap">AI RECOMMENDATION</span>}
                </div>
                <p className="text-sm text-gray-500 mb-4">{proj.description}</p>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {proj.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-2 py-1 rounded">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between text-xs text-gray-400">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 text-gray-600 font-medium cursor-pointer hover:text-green-600"><ExternalLink size={12}/> Live Demo</span>
                  <span className="flex items-center gap-1 text-gray-600 font-medium cursor-pointer hover:text-green-600"><Code size={12}/> GitHub</span>
                </div>
                <span>{proj.status === 'live' ? 'Updated 2d ago' : 'Draft saved'}</span>
              </div>
            </motion.div>
          ))}

          {/* Ghost Card */}
          <motion.div 
            variants={cardVariants}
            className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Plus size={24} />
            </div>
            <p className="font-semibold text-gray-600">Add New Project</p>
            <p className="text-xs w-40 mt-1">Showcase your latest work to recruiters</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? "bg-[#EEF2FE] text-[#1A8632] font-semibold" : "hover:bg-gray-50"}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}