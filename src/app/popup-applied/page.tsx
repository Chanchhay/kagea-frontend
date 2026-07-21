"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Bookmark, MapPin, Calendar, Globe, Users, Heart, GraduationCap, Languages, Phone, Link as LinkIcon, Briefcase } from "lucide-react";

interface ModalProps {
  onClose: () => void;
  onSendMail: () => void;
}

export default function CandidateDetailModal({ onClose, onSendMail }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl text-slate-900"
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full" />
            <div>
              <h2 className="text-xl font-bold">Full-stack</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Phnom Penh, Cam • 3 Years Experience
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Bookmark className="w-5 h-5" /></button>
            <button onClick={onSendMail} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
              <Mail className="w-4 h-4" /> Send Mail
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 p-8">
          {/* Main Content */}
          <div className="col-span-8 space-y-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded">FULL-TIME</span>
                <p className="font-semibold mt-1">$70,000 - $90,000 / YR</p>
              </div>
              <div className="flex gap-4 text-xs text-slate-600">
                <span>✓ NY</span> <span>✓ 3V</span> <span>✓ Available</span>
              </div>
            </div>

            <section>
              <h3 className="font-bold text-sm uppercase text-slate-400 mb-3">Job Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed">A highly motivated and results-oriented Marketing Officer with 3 years of experience in digital marketing, SEO, and content strategy...</p>
            </section>

            <section>
              <h3 className="font-bold text-sm uppercase text-slate-400 mb-3">Key Responsibilities</h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4">
                <li>Develop and execute comprehensive digital marketing strategies.</li>
                <li>Manage and optimize company website and social media presence.</li>
              </ul>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="col-span-4 space-y-6">
            <div className="border rounded-xl p-5 space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-emerald-700"><Users className="w-4 h-4"/> PERSONAL DETAILS</h4>
              {[
                { label: "Date of Birth", value: "12 Feb, 1992", icon: Calendar },
                { label: "Nationality", value: "American", icon: Globe },
                { label: "Gender", value: "Male", icon: Users },
                { label: "Marital Status", value: "Single", icon: Heart },
                { label: "Education", value: "Bachelor Degree", icon: GraduationCap },
                { label: "Languages", value: "English, Spanish", icon: Languages },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <item.icon className="w-4 h-4 text-slate-400" />
                  <div><p className="text-xs text-slate-400">{item.label}</p><p>{item.value}</p></div>
                </div>
              ))}
            </div>

            <div className="border rounded-xl p-5 space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-emerald-700"><Briefcase className="w-4 h-4"/> CONTACT INFORMATION</h4>
              {[
                { label: "Email", value: "codyfisher@email.com", icon: Mail },
                { label: "Phone", value: "+1-202-555-0178", icon: Phone },
                { label: "Location", value: "New York, USA", icon: MapPin },
                { label: "LinkedIn", value: "linkedin.com/in/codyfisher", icon: LinkIcon },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <item.icon className="w-4 h-4 text-slate-400" />
                  <div><p className="text-xs text-slate-400">{item.label}</p><p>{item.value}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}