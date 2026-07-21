"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Search, ChevronRight, ChevronLeft, User, Briefcase, Heart, 
  Bell, MessageSquare, FileText, Folder, Settings, LayoutGrid, ChevronDown 
} from "lucide-react";

// --- Data ---
const menuItems = [
  { icon: User, label: "My Profile" }, { icon: Briefcase, label: "Applied Jobs" },
  { icon: Heart, label: "Favorite Jobs" }, { icon: Bell, label: "Job Alert" },
  { icon: MessageSquare, label: "AI Interview" }, { icon: FileText, label: "Submit CV" },
  { icon: Folder, label: "Resumes" }, { icon: Briefcase, label: "Project Submissions" },
  { icon: FileText, label: "My Applications" }, { icon: Folder, label: "My Portfolio" },
  { icon: Settings, label: "Settings" }, { icon: LayoutGrid, label: "Find Job" },
];

const jobs = [
  { title: "Marketing Officer", type: "Full Time", salary: "$30K-$35K", location: "PhnomPenh", featured: true },
  { title: "Sunior UX Designer.", type: "Full-Time", salary: "$50K-80K/month", location: "SiemReap", featured: true, active: true },
  { title: "Visual Designer", type: "Full Time", salary: "$10K-$15K", location: "PhnomPenh", featured: true },
  { title: "UI/UX Designer", type: "Full Time", salary: "$50K-$70K", location: "Beanteaymeanchey", featured: true },
  { title: "Junior Graphic Designer", type: "Temporary", salary: "$35K-$40K", location: "PhnomPenh" },
  { title: "Senior UX Designer", type: "Internship", salary: "$50K-$60K", location: "PhnomPenh" },
  { title: "Product Designer", type: "Full Time", salary: "$40K-$50K", location: "PhnomPenh" },
  { title: "Techical Support Specialist", type: "Full Time", salary: "$35K-$40K", location: "PhnomPenh" },
  { title: "Networking Engineer", type: "Remote", salary: "$50K-$90K", location: "PhnomPenh" },
  { title: "Front End Developer", type: "Contract Base", salary: "$50K-$80K", location: "PhnomPenh" },
  { title: "Software Engineer", type: "Part Time", salary: "$15K-$20K", location: "PhnomPenh" },
  { title: "Interaction Designer", type: "Full Time", salary: "$20K-$25K", location: "PhnomPenh" },
];

export default function FindJobPage() {
  return (
    <div className="flex min-h-screen bg-[#dce7f5] font-[Inter] p-6">
      {/* Left Sidebar */}
      <aside className="w-64 flex flex-col gap-8">
        <button className="bg-amber-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold w-fit text-sm">
          <ChevronLeft size={16} /> BACK
        </button>
        <div className="space-y-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main Menu</p>
          {menuItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-600 hover:text-green-600 cursor-pointer transition-colors">
              <item.icon size={18} /> <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-3xl p-8 shadow-sm">
        {/* Top Filter Bar */}
        <div className="flex gap-4 mb-6 bg-white border border-gray-100 p-3 rounded-2xl">
          <div className="flex-1 flex items-center gap-2 border-r pr-4 text-sm text-gray-400"><Search size={18} /> Job tittle, Keyword...</div>
          <div className="flex-1 flex items-center gap-2 border-r pr-4 text-sm text-gray-400"><MapPin size={18} /> Location</div>
          <div className="flex-1 flex items-center justify-between text-sm text-gray-600 px-2 cursor-pointer">
            <span className="flex items-center gap-2"><LayoutGrid size={18} /> Select Category</span> 
            <ChevronDown size={16}/>
          </div>
          <button className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-sm">AI Interview</button>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-3.5 text-green-600" size={18} />
          <input className="w-full border border-gray-100 p-3.5 pl-12 rounded-xl outline-none text-sm" placeholder="Job tittle, keyword, company" />
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-3 gap-6">
          {jobs.map((job, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }} 
              className={`p-6 rounded-2xl border-2 bg-white transition-colors ${job.active ? "border-green-500" : "border-gray-100"}`}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-lg mb-4" />
              {job.featured && <span className="text-pink-400 text-[10px] font-bold bg-pink-50 px-2 py-1 rounded">Featured</span>}
              <h3 className="font-bold text-base mt-2">{job.title}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin size={12} /> {job.location}</p>
              <div className="mt-4 text-[11px] font-bold text-gray-500">{job.type} • {job.salary}</div>
            </motion.div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <ChevronLeft className="text-gray-400 cursor-pointer" />
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} className={`w-8 h-8 rounded-full text-sm ${n === 1 ? "bg-green-600 text-white" : "text-gray-500"}`}>0{n}</button>
          ))}
          <ChevronRight className="text-gray-400 cursor-pointer" />
        </div>
      </main>
    </div>
  );
}