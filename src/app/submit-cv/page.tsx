"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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
  X,
  UploadCloud,
  ArrowRight
} from "lucide-react";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function SubmitCVPage() {
  return (
    <div className="min-h-screen bg-[#DDE4F7] p-6 font-sans">
      <div className="flex gap-8">
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
            <NavItem icon={<Upload size={18} />} label="Submit CV" active />
            <NavItem icon={<FileText size={18} />} label="Resumes" />
            <NavItem icon={<FolderOpen size={18} />} label="Project Submissions" />
            <NavItem icon={<Briefcase size={18} />} label="My Applications" />
            <NavItem icon={<LayoutGrid size={18} />} label="My Portfolio" />
            <NavItem icon={<Settings size={18} />} label="Settings" />
            <NavItem icon={<Search size={18} />} label="Find Job" />
          </nav>
        </motion.aside>

        {/* --- Main Content Card --- */}
        <motion.main 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 bg-white rounded-3xl p-8 shadow-sm relative min-h-[600px]"
        >
          {/* Close Icon */}
          <button className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 p-1 rounded-full">
            <X size={20} />
          </button>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl mx-auto mt-12"
          >
            <motion.h1 variants={itemVariants} className="text-xl font-bold text-gray-900 mb-6">
              Add Cv/Resume
            </motion.h1>
            
            {/* Form */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cv/Resume Name</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F6B62D] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload your Cv/Resume</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-[#F6B62D] transition-all">
                  <UploadCloud size={40} className="text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Browse File or drop here</p>
                  <p className="text-xs text-gray-400 mt-1">Only PDF format available . Max file size 12 MB.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button className="px-8 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button className="px-8 py-2.5 rounded-lg bg-[#F6B62D] text-white font-semibold text-sm hover:bg-[#e0a428] transition-colors">
                  Add Cv/Resume
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Sample CV Button */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-8 left-8 bg-[#F6B62D] text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 shadow-lg hover:bg-[#e0a428] transition-colors"
          >
            <ArrowRight size={18} /> Sample CV
          </motion.button>
        </motion.main>
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