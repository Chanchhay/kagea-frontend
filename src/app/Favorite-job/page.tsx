"use client";

import React from "react";
import { motion } from "framer-motion"; // Added import
import {
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
  LayoutGrid,
  Search,
  Bookmark,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react";

// --- Mock Data ---
const jobs = [
  { id: 1, title: "Marketing Manager", tags: ["Full Time", "Remote"], location: "Phnom Penh", salary: "$10k-$15k/m", time: "4 Days Remaining", bookmarked: true },
  { id: 2, title: "Project Manager", tags: ["Full Time"], location: "Phnom Penh", salary: "$10k-$15k/m", time: "4 Days Remaining", bookmarked: true },
  { id: 3, title: "UI/UX Designer", tags: ["Full Time"], location: "Phnom Penh", salary: "$10k-$15k/m", time: "4 Days Remaining", bookmarked: true },
  { id: 4, title: "Nations King Engineer", tags: ["Full Time"], location: "Phnom Penh", salary: "$10k-$15k/m", time: "4 Days Remaining", bookmarked: true },
  { id: 5, title: "Product Designer", tags: ["Full Time"], location: "Phnom Penh", salary: "$10k-$15k/m", time: "4 Days Remaining", bookmarked: true },
  { id: 6, title: "Junior Graphic Designer", tags: ["Full Time"], location: "Phnom Penh", salary: "$10k-$15k/m", time: "4 Days Remaining", bookmarked: true, highlight: true },
  { id: 7, title: "Software Engineer", tags: ["Full Time"], location: "Phnom Penh", salary: "$10k-$15k/m", time: "4 Days Remaining", bookmarked: true },
  { id: 8, title: "Front End Developer", tags: ["Full Time"], location: "Phnom Penh", salary: "$10k-$15k/m", time: "4 Days Remaining", bookmarked: true },
];

export default function FavoriteJobsPage() {
  return (
    <div className="min-h-screen bg-[#DDE4F7] p-6 font-sans">
      <div className="flex gap-8">
        {/* --- Sidebar --- */}
        <aside className="w-64 flex flex-col gap-8">
          <button className="bg-[#F6B62D] text-white font-bold py-2 px-6 rounded-full w-fit flex items-center gap-2 shadow-sm hover:bg-[#e0a428] transition-colors">
            <ArrowLeft size={18} /> BACK
          </button>

          <nav className="flex flex-col gap-1 text-gray-600">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">Main Menu</p>
            <NavItem icon={<User size={18} />} label="My Profile" />
            <NavItem icon={<Briefcase size={18} />} label="Applied Jobs" />
            <NavItem icon={<Heart size={18} />} label="Favorite Jobs" active />
            <NavItem icon={<Bell size={18} />} label="Job Alert" />
            <NavItem icon={<Bot size={18} />} label="AI interview" />
            <div className="h-4" />
            <NavItem icon={<Upload size={18} />} label="Submit CV" />
            <NavItem icon={<FileText size={18} />} label="Resumes" />
            <NavItem icon={<FolderOpen size={18} />} label="Project Submissions" />
            <NavItem icon={<Briefcase size={18} />} label="My Applications" />
            <NavItem icon={<LayoutGrid size={18} />} label="My Portfolio" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
          </nav>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 bg-white rounded-3xl p-8 shadow-sm">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              placeholder="Job title, keywords, company" 
              className="w-full bg-gray-50 border border-gray-100 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
            />
          </div>

          {/* Job List with Staggered Animation */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="space-y-4"
          >
            {jobs.map((job) => (
              <motion.div 
                key={job.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.01 }}
                className={`flex items-center justify-between p-4 rounded-xl border ${job.highlight ? "border-green-200 bg-green-50/30" : "border-gray-100"} hover:border-gray-200 transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-800">{job.title}</h3>
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><MapPin size={12}/> {job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign size={12}/> {job.salary}</span>
                      <span className="flex items-center gap-1"><Clock size={12}/> {job.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Bookmark size={20} className="text-gray-400 fill-current cursor-pointer" />
                  <button className={`px-4 py-2 rounded-lg text-xs font-semibold ${job.highlight ? "bg-green-600 text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// --- Helper Component ---
function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${active ? "bg-[#EEF2FE] text-[#1A8632] font-semibold" : "hover:bg-gray-50 text-gray-600"}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}