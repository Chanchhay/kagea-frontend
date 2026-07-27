"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import {
  Search, Filter, ChevronDown, MoreHorizontal, X, MessageSquare, MapPin, 
  CheckCircle2, FileText, User, Briefcase, Heart, Bell, Bot, Upload, 
  FolderOpen, Settings, LogOut, ArrowLeft, ExternalLink, Share2
} from "lucide-react";

// ---------- Updated Mock Data ----------
const applications = [
  { id: 1, title: "Senior Product Designer", company: "TechFlow", location: "San Francisco, CA", status: "Shortlisted", statusColor: "bg-yellow-100 text-yellow-700", date: "Applied 3d ago", match: "92%", resume: "Resume_2934.pdf" },
  { id: 2, title: "Frontend Engineer", company: "AI Core", location: "Remote", status: "Interview Scheduled", statusColor: "bg-orange-100 text-orange-700", date: "Applied 5d ago", match: "82%", resume: "FE_Resume.pdf" },
  { id: 3, title: "UX Researcher", company: "DataSync", location: "New York, NY", status: "Under Review", statusColor: "bg-green-100 text-green-700", date: "Applied 1w ago", match: "78%", resume: "No resume attached" },
];

// ---------- Animation Variants ----------
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// ---------- Components ----------
function Sidebar() {
  return (
    <motion.aside 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-56 bg-[#EEF2FE] p-4 flex flex-col justify-between h-screen sticky top-0"
    >
      <div>
        <button className="bg-[#F5B32C] text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 mb-10 text-sm">
          <ArrowLeft size={16} /> BACK
        </button>
        
        <nav className="space-y-1">
          {[
            { label: "My Profile", icon: User },
            { label: "Applied Jobs", icon: Briefcase },
            { label: "Favorite Jobs", icon: Heart },
            { label: "Job Alert", icon: Bell },
            { label: "AI Interview", icon: Bot },
            { label: "Submit CV", icon: Upload },
            { label: "Resumes", icon: FileText },
            { label: "Project Submissions", icon: FolderOpen },
            { label: "My Applications", icon: Briefcase, active: true },
            { label: "My Portfolio", icon: FolderOpen },
            { label: "Settings", icon: Settings },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button className="w-full bg-[#F5B32C] text-white text-sm font-bold py-3 rounded-lg shadow-md hover:bg-[#e0a025] transition-colors">
        + New Application
      </button>
    </motion.aside>
  );
}

function DetailPanel({ app, onClose }: { app: typeof applications[0], onClose: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl w-[400px] h-[85vh] overflow-hidden flex flex-col border border-gray-100">
      <div className="p-4 flex justify-between items-center border-b">
        <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        <div className="flex gap-3 text-gray-400"><Share2 size={20} /><ExternalLink size={20} /></div>
      </div>
      
      <div className="p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center font-bold text-yellow-600">TF</div>
          <div>
            <h2 className="font-bold text-lg">{app.title}</h2>
            <p className="text-sm text-gray-500">{app.company} • {app.location}</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
          <h3 className="text-green-700 font-semibold flex items-center gap-2 text-sm mb-2">
            <CheckCircle2 size={16} /> AI Application Analysis
          </h3>
          <p className="text-xs text-green-800/80 mb-3 leading-relaxed">
            Your background in high-scale SaaS design perfectly aligns with TechFlow's current expansion phase.
          </p>
          <div className="w-full bg-green-200 h-2 rounded-full"><div className="w-[92%] bg-yellow-400 h-2 rounded-full"></div></div>
        </div>

        <h3 className="font-bold mb-2">Job Description</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">We are looking for a Senior Product Designer to lead the evolution of our core platform...</p>

        <h3 className="font-bold mb-3">Timeline</h3>
        <div className="relative pl-6 border-l-2 border-gray-100 space-y-6 mb-8">
            <div className="relative"><div className="absolute -left-[30px] w-4 h-4 rounded-full bg-green-500 border-4 border-white" /><p className="text-sm font-semibold">Shortlisted for next round</p><p className="text-xs text-gray-400">Oct 26, 2023</p></div>
            <div className="relative"><div className="absolute -left-[30px] w-4 h-4 rounded-full bg-gray-300 border-4 border-white" /><p className="text-sm text-gray-400">Initial interview review</p></div>
        </div>
      </div>

      <div className="p-6 border-t mt-auto">
        <button className="w-full bg-[#F5B32C] text-white font-bold py-3 rounded-lg mb-3">Send Message to Recruiter</button>
        <button className="w-full text-red-600 font-bold py-3 border border-red-100 rounded-lg">Withdraw Application</button>
      </div>
    </div>
  );
}

// ---------- Main Page ----------
export default function MyApplicationsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const selectedApp = applications.find((a) => a.id === selectedId) || null;

  return (
    <div className="flex min-h-screen bg-[#DCE4FA] p-6 font-sans">
      <Sidebar />
      <main className="flex-1 bg-white rounded-3xl ml-6 shadow-sm overflow-hidden flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-[#22C55E] mb-8">My Applications</h1>
          
          <div className="flex gap-4 mb-8 bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
            <span>STATUS: <span className="font-bold">All Statuses</span></span>
            <span>APPLIED: <span className="font-bold">Last 30 days</span></span>
            <span className="ml-auto text-green-600 font-bold">78% Match</span>
            <span>SORT: <span className="font-bold">Most Recent</span></span>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-6"
          >
            {applications.map((app) => (
              <motion.div 
                key={app.id} 
                variants={itemVariants}
                onClick={() => setSelectedId(app.id)}
                whileHover={{ scale: 1.02 }}
                className={`border-2 p-5 rounded-xl cursor-pointer ${selectedId === app.id ? "border-green-500" : "border-gray-200"}`}
              >
                <div className="flex justify-between mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">💼</div>
                  <span className="text-green-500 font-bold text-sm">{app.match}</span>
                </div>
                <h3 className="font-bold text-gray-900">{app.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{app.company}</p>
                <div className="flex gap-2 mb-4">
                  <span className={`text-[10px] px-2 py-1 rounded font-bold ${app.statusColor}`}>{app.status}</span>
                  <span className="text-[10px] px-2 py-1 rounded bg-gray-100 font-bold">{app.date}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2"><FileText size={12}/> {app.resume}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <AnimatePresence>
            {selectedApp && (
            <motion.div 
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="absolute top-6 right-6 z-50"
            >
                <DetailPanel app={selectedApp} onClose={() => setSelectedId(null)} />
            </motion.div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
}