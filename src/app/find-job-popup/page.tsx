"use client";

import React, { useState } from "react";
import {
  ArrowLeft, User, Briefcase, Heart, Bell, Bot, Upload, FileText,
  FolderOpen, Settings, LayoutGrid, Search, Bookmark, MapPin, 
  Clock, DollarSign, X, Bold, Italic, Underline, Link2, List, 
  AlignLeft, Globe, Phone, Mail, GraduationCap
} from "lucide-react";

export default function FindJobPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#DDE4F7] p-6 font-sans">
      <div className="flex gap-8">
        {/* --- Sidebar (Kept consistent) --- */}
        <aside className="w-64 flex flex-col gap-8">
           <button className="bg-[#F6B62D] text-white font-bold py-2 px-6 rounded-full w-fit flex items-center gap-2 shadow-sm hover:bg-[#e0a428]">
            <ArrowLeft size={18} /> BACK
          </button>
          <nav className="flex flex-col gap-1 text-gray-600">
             {/* Navigation Items ... same as previous */}
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
             <NavItem icon={<LayoutGrid size={18} />} label="My Portfolio" />
             <NavItem icon={<Settings size={18} />} label="Settings" />
             <NavItem icon={<Search size={18} />} label="Find Job" active />
          </nav>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 bg-white rounded-3xl p-8 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex gap-4">
               <div className="w-16 h-16 bg-gray-300 rounded-full" />
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Senior UX Designer</h1>
                  <div className="flex gap-4 text-sm text-gray-500 mt-2">
                     <span className="flex items-center gap-1"><Globe size={14}/> instagram.com</span>
                     <span className="flex items-center gap-1"><Phone size={14}/> (408) 555-0115</span>
                     <span className="flex items-center gap-1"><Mail size={14}/> career@instagram.com</span>
                  </div>
               </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1A8632] text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Apply Now →
            </button>
          </div>

          {/* Body Layout */}
          <div className="grid grid-cols-3 gap-8">
             <div className="col-span-2 space-y-6">
                <section>
                   <h2 className="font-bold text-lg mb-2">Job Description</h2>
                   <p className="text-gray-600 text-sm leading-relaxed">
                      Integer aliquet gravida consequat. Donec id sapien id leo accumsan pellentesque eget maximus tellus. 
                      Duis et est ac leo rhoncus tincidunt vitae vehicula augue...
                   </p>
                </section>
                <section>
                   <h2 className="font-bold text-lg mb-2">Responsibilities</h2>
                   <ul className="list-disc pl-5 text-gray-600 text-sm space-y-2">
                      <li>Quisque semper gravida...</li>
                      <li>Curabitur blandit, lorem...</li>
                      <li>Morbi mattis, in dignissim...</li>
                   </ul>
                </section>
             </div>

             {/* Right Column */}
             <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                   <h3 className="font-bold">Job Overview</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm"><GraduationCap size={16}/> Graduation</div>
                      <div className="flex items-center gap-2 text-sm"><Briefcase size={16}/> Full Time</div>
                   </div>
                </div>
                
                <div className="text-sm space-y-3 text-gray-600">
                    <p><strong>Founded in:</strong> March 21, 2006</p>
                    <p><strong>Organization type:</strong> Private Company</p>
                    <p><strong>Company size:</strong> 100-500 Employees</p>
                </div>
             </div>
          </div>
        </main>
      </div>

      {/* --- Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              
              <h2 className="text-lg font-bold mb-4">Apply Job: Senior UX Designer</h2>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-sm font-medium text-gray-700">Choose Resume</label>
                    <select className="w-full mt-1 border border-gray-200 rounded-lg p-3 text-sm focus:ring-1 focus:ring-green-600 outline-none">
                       <option>Select...</option>
                    </select>
                 </div>

                 <div>
                    <label className="text-sm font-medium text-gray-700">Cover Letter</label>
                    <textarea 
                      className="w-full mt-1 border border-gray-200 rounded-lg p-3 text-sm h-32 focus:ring-1 focus:ring-green-600 outline-none"
                      placeholder="Write down your biography here..."
                    />
                    {/* Toolbar */}
                    <div className="flex gap-3 text-gray-400 mt-2 border-b pb-2">
                       <Bold size={16} /> <Italic size={16} /> <Underline size={16} /> <Link2 size={16} /> <List size={16} /> <AlignLeft size={16} />
                    </div>
                 </div>

                 <div className="flex gap-3 pt-4">
                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50">Cancel</button>
                    <button className="px-6 py-2 rounded-lg bg-[#1A8632] text-white font-semibold flex-1 hover:bg-green-700">Apply Now →</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${active ? "bg-[#EEF2FE] text-[#1A8632] font-semibold" : "hover:bg-gray-50 text-gray-600"}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}