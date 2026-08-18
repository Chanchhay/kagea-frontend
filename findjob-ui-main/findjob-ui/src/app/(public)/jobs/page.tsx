// "use client";

// import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
// import { PageContainer } from "@/components/shared/PageContainer";
// import { PublicJobExplorer } from "@/components/public/PublicJobExplorer";
// import { ErrorState } from "@/components/shared/ErrorState";
// import { LoadingState } from "@/components/shared/LoadingState";
// import {
//   useGetPublicJobCategoriesQuery,
//   useGetPublicJobsQuery,
//   useGetPublicSkillsQuery,
// } from "@/services/publicApi";

// export default function PublicJobsPage() {
//   const jobs = useGetPublicJobsQuery({ size: 100 });
//   const categories = useGetPublicJobCategoriesQuery();
//   const skills = useGetPublicSkillsQuery();

//   const content =
//     jobs.isLoading || categories.isLoading || skills.isLoading ? (
//       <LoadingState rows={6} />
//     ) : jobs.isError || categories.isError || skills.isError ? (
//       <ErrorState message="Unable to load published jobs." />
//     ) : (
//       <PublicJobExplorer
//         jobs={jobs.data?.content ?? []}
//         categories={categories.data ?? []}
//         skills={skills.data ?? []}
//       />
//     );

//   return (
//     <PublicShell>
//       <main className="bg-canvas py-10">
//         <PageContainer>
//           {content}
//         </PageContainer>
//       </main>
//       <PublicFooter />
//     </PublicShell>
//   );
// }




// "use client";
// import { motion } from "framer-motion";
// import { Search, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
// import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
// import { PageContainer } from "@/components/shared/PageContainer";
// import { PublicJobExplorer } from "@/components/public/PublicJobExplorer";
// import { ErrorState } from "@/components/shared/ErrorState";
// import { LoadingState } from "@/components/shared/LoadingState";
// import {
//   useGetPublicJobCategoriesQuery,
//   useGetPublicJobsQuery,
//   useGetPublicSkillsQuery,
// } from "@/services/publicApi";
// const fadeUp = {
//   hidden: { opacity: 0, y: 20 },
//   show: (i: number = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: i * 0.1,
//       duration: 0.55,
//       ease: [0.22, 1, 0.36, 1],
//     },
//   }),
// };
// const float = {
//   animate: {
//     y: [0, -10, 0],
//     transition: {
//       duration: 4.2,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   },
// };
// export default function PublicJobsPage() {
//   const jobs = useGetPublicJobsQuery({ size: 100 });
//   const categories = useGetPublicJobCategoriesQuery();
//   const skills = useGetPublicSkillsQuery();
//   const content =
//     jobs.isLoading || categories.isLoading || skills.isLoading ? (
//       <LoadingState rows={6} />
//     ) : jobs.isError || categories.isError || skills.isError ? (
//       <ErrorState message="Unable to load published jobs." />
//     ) : (
//       <PublicJobExplorer
//         jobs={jobs.data?.content ?? []}
//         categories={categories.data ?? []}
//         skills={skills.data ?? []}
//       />
//     );
//   return (
//     <PublicShell>
//       <main className="w-full bg-[#F8FAF5]">
//         <div className="w-full bg-[#F8FAF5]">
//           {/* ───────────────────────────────────────── Hero ───────────────────────────────────────── */}
//           <section className="relative overflow-hidden py-16 lg:py-24">
//             {/* Soft background */}
//             <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#F0FDF4] via-[#F8FAF5] to-[#FFFBEB]" />
//             <div className="relative mx-auto max-w-7xl px-6">
//               <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
//                 {/* ───────────── Left content ───────────── */}
//                 <div className="lg:col-span-6 space-y-7">
//                   {/* Pill badge */}
//                   <motion.div
//                     variants={fadeUp}
//                     initial="hidden"
//                     animate="show"
//                     custom={0}
//                     className="inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-1.5 shadow-sm border border-[#22C55E]/15"
//                   >
//                     <div className="flex h-5 w-9 items-center rounded-full bg-[#22C55E] px-0.5">
//                       <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
//                     </div>
//                     <span className="text-xs font-semibold tracking-wide text-[#1A2E44]">
//                       FIND YOUR DREAM JOB
//                     </span>
//                   </motion.div>
//                   {/* Headline */}
//                   <motion.h1
//                     variants={fadeUp}
//                     initial="hidden"
//                     animate="show"
//                     custom={1}
//                     className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.4rem]"
//                   >
//                     <span className="text-[#22C55E]">Find Freelance</span>
//                     <br />
//                     <span className="text-[#22C55E]">Projects</span>
//                     <br />
//                     <span className="text-[#1A2E44]">That Match Your</span>
//                     <br />
//                     <span className="text-[#22C55E]">Skills</span>
//                   </motion.h1>
//                   <motion.p
//                     variants={fadeUp}
//                     initial="hidden"
//                     animate="show"
//                     custom={2}
//                     className="max-w-md text-base leading-relaxed text-[#1A2E44]/65 sm:text-lg"
//                   >
//                     Browse thousands of freelance opportunities tailored to
//                     your expertise. Connect with the best clients worldwide.
//                   </motion.p>
//                   {/* Bottom social proof */}
//                   <motion.p
//                     variants={fadeUp}
//                     initial="hidden"
//                     animate="show"
//                     custom={3}
//                     className="pt-2 text-sm text-[#1A2E44]/55"
//                   >
//                     Over{" "}
//                     <span className="font-semibold text-[#22C55E]">
//                       12,800+
//                     </span>{" "}
//                     businesses hiring now
//                   </motion.p>
//                 </div>
//                 {/* ───────────── Right illustration ───────────── */}
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.94, y: 24 }}
//                   animate={{ opacity: 1, scale: 1, y: 0 }}
//                   transition={{
//                     duration: 0.65,
//                     delay: 0.15,
//                     ease: [0.22, 1, 0.36, 1],
//                   }}
//                   className="relative flex justify-center lg:col-span-6"
//                 >
//                   <div className="relative">
//                     {/* Soft circle behind the illustration */}
//                     <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#22C55E]/10 sm:h-[400px] sm:w-[400px]" />
//                     {/* Main illustration */}
//                     <div className="relative z-10 flex h-[340px] w-[340px] items-center justify-center sm:h-[400px] sm:w-[400px]">
//                       <img
//                         src="https://cdni.iconscout.com/illustration/premium/thumb/team-working-on-project-5691582-4759508.png"
//                         alt="Team finding freelance projects"
//                         className="h-full w-full object-contain"
//                       />
//                     </div>
//                     {/* Floating “30K+ HIRED EXPERTS” card */}
//                     <motion.div
//                       variants={float}
//                       animate="animate"
//                       className="absolute -right-2 top-10 z-20 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 shadow-xl shadow-[#1A2E44]/10 sm:right-4 sm:top-16"
//                     >
//                       <div className="relative flex h-10 w-10 items-center justify-center">
//                         <div className="absolute -top-1 -right-1 flex gap-0.5">
//                           <span className="text-[10px] text-[#F5B32C]">?</span>
//                           <span className="text-[8px] text-[#22C55E]">?</span>
//                         </div>
//                         <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF7ED]">
//                           <span className="text-lg">📢</span>
//                         </div>
//                       </div>
//                       <div>
//                         <p className="text-base font-bold leading-none text-[#1A2E44]">
//                           30K+
//                         </p>
//                         <p className="mt-0.5 text-[11px] font-medium tracking-wide text-[#1A2E44]/60">
//                           HIRED EXPERTS
//                         </p>
//                       </div>
//                     </motion.div>
//                     {/* Small accent dots */}
//                     <div className="absolute bottom-16 left-6 h-3 w-3 rounded-full bg-[#F5B32C]" />
//                     <div className="absolute bottom-28 right-10 h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </section>
//           {/* ───────────────────────────────────────── Jobs Explorer ───────────────────────────────────────── */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, margin: "-80px" }}
//             transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
//             className="bg-[#F8FAF5] px-4 pb-16 pt-4 md:px-8"
//           >
//             <PageContainer>{content}</PageContainer>
//           </motion.div>
//         </div>
//       </main>
//       <PublicFooter />
//     </PublicShell>
//   );
// }





// "use client";

// import { useState } from "react";
// import { motion } from "framer-motion";
// import {
//   Search,
//   MapPin,
//   Building2,
//   Clock,
//   CheckCircle2,
//   DollarSign,
// } from "lucide-react";
// import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
// import { ErrorState } from "@/components/shared/ErrorState";
// import { LoadingState } from "@/components/shared/LoadingState";
// import {
//   useGetPublicJobCategoriesQuery,
//   useGetPublicJobsQuery,
//   useGetPublicSkillsQuery,
// } from "@/services/publicApi";

// export default function PublicJobsPage() {
//   const jobsQuery = useGetPublicJobsQuery({ size: 100 });
//   const categories = useGetPublicJobCategoriesQuery();
//   const skills = useGetPublicSkillsQuery();

//   // Local state for search & selection
//   const [searchTerm, setSearchTerm] = useState("");
//   const [locationTerm, setLocationTerm] = useState("");
//   const [selectedJobIndex, setSelectedJobIndex] = useState(0);

//   const jobsList = jobsQuery.data?.content ?? [];

//   const filteredJobs = jobsList.filter((job: any) => {
//     const matchesSearch =
//       job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       job.description?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesLocation =
//       locationTerm === "" ||
//       job.location?.toLowerCase().includes(locationTerm.toLowerCase());
//     return matchesSearch && matchesLocation;
//   });

//   const activeJob = filteredJobs[selectedJobIndex] || filteredJobs[0];

//   return (
//     <PublicShell>
//       <main className="w-full bg-[#F8FAF5] min-h-screen text-[#1A2E44]">
//         {/* ───────────────────────────────────────── Header & Search Bar Section ───────────────────────────────────────── */}
//         <section className="bg-white border-b border-gray-200 pt-8 pb-6 px-4 sm:px-8">
//           <div className="max-w-5xl mx-auto space-y-4">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2E44]">
//                 Job Search Hub
//               </h1>
//               <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                 Explore verified freelance and full-time contracts matching your expertise.
//               </p>
//             </div>

//             {/* Compact Green & Yellow Search Bar */}
//             <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-1.5 flex flex-col md:flex-row items-center gap-1.5">
//               {/* Keyword Input */}
//               <div className="flex items-center gap-2.5 px-3 py-2 w-full md:flex-[1.4] border-b md:border-b-0 md:border-r border-gray-200">
//                 <Search className="h-4 w-4 text-[#16A34A] shrink-0" />
//                 <input
//                   type="text"
//                   placeholder="Search by title, skill, or keyword"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full bg-transparent text-sm focus:outline-none text-gray-900 placeholder:text-gray-400 font-medium"
//                 />
//               </div>

//               {/* Location Input */}
//               <div className="flex items-center gap-2.5 px-3 py-2 w-full md:flex-1">
//                 <MapPin className="h-4 w-4 text-[#EAB308] shrink-0" />
//                 <input
//                   type="text"
//                   placeholder="Location or 'Remote'"
//                   value={locationTerm}
//                   onChange={(e) => setLocationTerm(e.target.value)}
//                   className="w-full bg-transparent text-sm focus:outline-none text-gray-900 placeholder:text-gray-400 font-medium"
//                 />
//               </div>

//               {/* Green & Yellow Search Button */}
//               <button className="w-full md:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-6 py-2.5 rounded-lg transition-all text-sm shadow-sm flex items-center justify-center gap-2 border-b-2 border-[#EAB308] active:translate-y-0.5 shrink-0">
//                 <Search className="h-4 w-4 text-[#FEF08A]" />
//                 <span>Search</span>
//               </button>
//             </div>

//             {/* Quick Filter Tags */}
//             <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
//               <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
//                 SUGGESTED:
//               </span>
//               {[
//                 "Remote",
//                 "Full-time",
//                 "Contract",
//                 "React",
//                 "Node.js",
//                 "UI/UX Design",
//               ].map((tag, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() =>
//                     setSearchTerm(
//                       tag === "Remote" ||
//                         tag === "Full-time" ||
//                         tag === "Contract"
//                         ? ""
//                         : tag
//                     )
//                   }
//                   className="text-xs font-semibold px-3 py-1 rounded-full border border-[#16A34A]/30 text-[#15803D] bg-[#F0FDF4] hover:bg-[#FEF08A]/40 hover:border-[#EAB308] transition-colors shrink-0"
//                 >
//                   {tag}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ───────────────────────────────────────── Master-Detail Job View ───────────────────────────────────────── */}
//         <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
//           {jobsQuery.isLoading || categories.isLoading || skills.isLoading ? (
//             <LoadingState rows={6} />
//           ) : jobsQuery.isError || categories.isError || skills.isError ? (
//             <ErrorState message="Unable to load published jobs." />
//           ) : filteredJobs.length === 0 ? (
//             <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
//               <p className="text-lg font-semibold text-gray-800">
//                 No matching jobs found
//               </p>
//               <p className="text-sm text-gray-500 mt-1">
//                 Try adjusting your search terms or location parameters.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
//               {/* Left Column: Job Cards List */}
//               <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
//                 <div className="p-3.5 bg-[#F8FAF5] border-b border-gray-200 flex justify-between items-center">
//                   <span className="text-xs font-bold text-[#1A2E44] uppercase tracking-wider">
//                     Top Opportunities
//                   </span>
//                   <span className="text-xs text-gray-500 font-medium">
//                     {filteredJobs.length} jobs available
//                   </span>
//                 </div>

//                 <div className="max-h-[720px] overflow-y-auto">
//                   {filteredJobs.map((job: any, index: number) => {
//                     const isSelected = selectedJobIndex === index;
//                     return (
//                       <div
//                         key={job.id || index}
//                         onClick={() => setSelectedJobIndex(index)}
//                         className={`p-4 cursor-pointer transition-colors border-l-4 ${
//                           isSelected
//                             ? "bg-[#F0FDF4] border-l-[#16A34A]"
//                             : "bg-white border-l-transparent hover:bg-gray-50"
//                         }`}
//                       >
//                         <div className="flex items-start justify-between gap-2">
//                           <div>
//                             <h3 className="text-sm font-bold text-[#1A2E44] hover:text-[#16A34A]">
//                               {job.title}
//                             </h3>
//                             <p className="text-xs text-gray-600 mt-0.5 font-medium">
//                               {job.companyName || "Verified Enterprise Client"}
//                             </p>
//                             <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
//                               <MapPin className="h-3 w-3 text-gray-400" />{" "}
//                               {job.location || "Remote"}
//                             </p>
//                           </div>
//                           <span className="text-[11px] text-gray-400 shrink-0 font-medium">
//                             {job.postedDate || "2d ago"}
//                           </span>
//                         </div>

//                         <div className="mt-3 flex items-center gap-2">
//                           <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FEF08A]/60 text-[#854D0E]">
//                             <DollarSign className="h-3 w-3" />{" "}
//                             {job.budget || "Competitive"}
//                           </span>
//                           <span className="text-[11px] text-[#16A34A] font-semibold flex items-center gap-1 ml-auto">
//                             Actively hiring <CheckCircle2 className="h-3 w-3" />
//                           </span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Right Column: Detailed Job View */}
//               <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 lg:p-8 sticky top-6 shadow-sm min-h-[580px]">
//                 {activeJob ? (
//                   <div className="space-y-6">
//                     <div className="border-b border-gray-100 pb-6">
//                       <h2 className="text-xl sm:text-2xl font-bold text-[#1A2E44]">
//                         {activeJob.title}
//                       </h2>
//                       <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mt-2">
//                         <span className="flex items-center gap-1 font-semibold text-gray-700">
//                           <Building2 className="h-4 w-4 text-[#16A34A]" />{" "}
//                           {activeJob.companyName || "Global Client Partner"}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <MapPin className="h-4 w-4 text-[#EAB308]" />{" "}
//                           {activeJob.location || "Remote"}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Clock className="h-4 w-4" /> Posted recently
//                         </span>
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="flex items-center gap-3 mt-6">
//                         <button className="bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-2 border-b-2 border-[#EAB308]">
//                           Apply Now
//                         </button>
//                         <button className="border border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4] text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
//                           Save Job
//                         </button>
//                       </div>
//                     </div>

//                     {/* Overview Cards */}
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F8FAF5] p-4 rounded-xl border border-gray-100">
//                       <div>
//                         <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
//                           Level
//                         </span>
//                         <span className="text-sm font-bold text-[#1A2E44]">
//                           Mid-Senior
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
//                           Employment
//                         </span>
//                         <span className="text-sm font-bold text-[#1A2E44]">
//                           Contract / Freelance
//                         </span>
//                       </div>
//                       <div>
//                         <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
//                           Compensation
//                         </span>
//                         <span className="text-sm font-bold text-[#16A34A]">
//                           {activeJob.budget || "Negotiable"}
//                         </span>
//                       </div>
//                     </div>

//                     {/* Job Description */}
//                     <div className="space-y-2">
//                       <h3 className="text-sm font-bold text-[#1A2E44] uppercase tracking-wider">
//                         Job Description
//                       </h3>
//                       <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
//                         {activeJob.description ||
//                           "We are looking for a dedicated professional to join our project team. You will collaborate directly with stakeholders to deliver clean, scalable solutions while meeting deadlines and standard industry guidelines."}
//                       </p>
//                     </div>

//                     {/* Skills */}
//                     {activeJob.skills && activeJob.skills.length > 0 && (
//                       <div className="space-y-2 pt-2">
//                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
//                           Required Skills
//                         </h4>
//                         <div className="flex flex-wrap gap-2">
//                           {activeJob.skills.map((skill: any, sIdx: number) => (
//                             <span
//                               key={sIdx}
//                               className="bg-[#F0FDF4] text-[#15803D] border border-[#16A34A]/20 text-xs font-semibold px-3 py-1 rounded-full"
//                             >
//                               {skill.name || skill}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                     Select a job listing on the left to review details.
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </section>
//       </main>
//       <PublicFooter />
//     </PublicShell>
//   );
// }




"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import {
  useGetPublicJobCategoriesQuery,
  useGetPublicJobsQuery,
  useGetPublicSkillsQuery,
} from "@/services/publicApi";

export default function PublicJobsPage() {
  const jobsQuery = useGetPublicJobsQuery({ size: 100 });
  const categories = useGetPublicJobCategoriesQuery();
  const skills = useGetPublicSkillsQuery();

  // Local state for search & selection
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [selectedJobIndex, setSelectedJobIndex] = useState(0);

  const jobsList = jobsQuery.data?.content ?? [];

  const filteredJobs = jobsList.filter((job: any) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationTerm === "" ||
      job.location?.toLowerCase().includes(locationTerm.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const activeJob = filteredJobs[selectedJobIndex] || filteredJobs[0];

  return (
    <PublicShell>
      {/* Page exit / navigation transition wrapper */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-[#F8FAF5] min-h-screen text-[#1A2E44]"
      >
        {/* ───────────────────────────────────────── Header & Search Bar Section ───────────────────────────────────────── */}
        <motion.section 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-b border-gray-200 pt-8 pb-6 px-4 sm:px-8"
        >
          <div className="max-w-5xl mx-auto space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2E44]">
                Job Search Hub
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Explore verified freelance and full-time contracts matching your expertise.
              </p>
            </div>

            {/* Compact Green & Yellow Search Bar */}
            <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-1.5 flex flex-col md:flex-row items-center gap-1.5">
              {/* Keyword Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full md:flex-[1.4] border-b md:border-b-0 md:border-r border-gray-200">
                <Search className="h-4 w-4 text-[#16A34A] shrink-0" />
                <input
                  type="text"
                  placeholder="Search by title, skill, or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>

              {/* Location Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 w-full md:flex-1">
                <MapPin className="h-4 w-4 text-[#EAB308] shrink-0" />
                <input
                  type="text"
                  placeholder="Location or 'Remote'"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none text-gray-900 placeholder:text-gray-400 font-medium"
                />
              </div>

              {/* Green & Yellow Search Button */}
              <button className="w-full md:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold px-6 py-2.5 rounded-lg transition-all text-sm shadow-sm flex items-center justify-center gap-2 border-b-2 border-[#EAB308] active:translate-y-0.5 shrink-0">
                <Search className="h-4 w-4 text-[#FEF08A]" />
                <span>Search</span>
              </button>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                SUGGESTED:
              </span>
              {[
                "Remote",
                "Full-time",
                "Contract",
                "React",
                "Node.js",
                "UI/UX Design",
              ].map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSearchTerm(
                      tag === "Remote" ||
                        tag === "Full-time" ||
                        tag === "Contract"
                        ? ""
                        : tag
                    )
                  }
                  className="text-xs font-semibold px-3 py-1 rounded-full border border-[#16A34A]/30 text-[#15803D] bg-[#F0FDF4] hover:bg-[#FEF08A]/40 hover:border-[#EAB308] transition-colors shrink-0"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ───────────────────────────────────────── Master-Detail Job View ───────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
          {jobsQuery.isLoading || categories.isLoading || skills.isLoading ? (
            <LoadingState rows={6} />
          ) : jobsQuery.isError || categories.isError || skills.isError ? (
            <ErrorState message="Unable to load published jobs." />
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <p className="text-lg font-semibold text-gray-800">
                No matching jobs found
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search terms or location parameters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Job Cards List */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                <div className="p-3.5 bg-[#F8FAF5] border-b border-gray-200 flex justify-between items-center">
                  <span className="text-xs font-bold text-[#1A2E44] uppercase tracking-wider">
                    Top Opportunities
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {filteredJobs.length} jobs available
                  </span>
                </div>

                <div className="max-h-[720px] overflow-y-auto">
                  {filteredJobs.map((job: any, index: number) => {
                    const isSelected = selectedJobIndex === index;
                    return (
                      <motion.div
                        key={job.id || index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        onClick={() => setSelectedJobIndex(index)}
                        className={`p-4 cursor-pointer transition-colors border-l-4 ${
                          isSelected
                            ? "bg-[#F0FDF4] border-l-[#16A34A]"
                            : "bg-white border-l-transparent hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-bold text-[#1A2E44] hover:text-[#16A34A]">
                              {job.title}
                            </h3>
                            <p className="text-xs text-gray-600 mt-0.5 font-medium">
                              {job.companyName || "Verified Enterprise Client"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-gray-400" />{" "}
                              {job.location || "Remote"}
                            </p>
                          </div>
                          <span className="text-[11px] text-gray-400 shrink-0 font-medium">
                            {job.postedDate || "2d ago"}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded bg-[#FEF08A]/60 text-[#854D0E]">
                            <DollarSign className="h-3 w-3" />{" "}
                            {job.budget || "Competitive"}
                          </span>
                          <span className="text-[11px] text-[#16A34A] font-semibold flex items-center gap-1 ml-auto">
                            Actively hiring <CheckCircle2 className="h-3 w-3" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Job View */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 lg:p-8 sticky top-6 shadow-sm min-h-[580px]">
                <AnimatePresence mode="wait">
                  {activeJob ? (
                    <motion.div
                      key={activeJob.id || selectedJobIndex}
                      initial={{ opacity: 0, x: 12, scale: 0.99 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -12, scale: 0.99 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="space-y-6"
                    >
                      <div className="border-b border-gray-100 pb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#1A2E44]">
                          {activeJob.title}
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1 font-semibold text-gray-700">
                            <Building2 className="h-4 w-4 text-[#16A34A]" />{" "}
                            {activeJob.companyName || "Global Client Partner"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-[#EAB308]" />{" "}
                            {activeJob.location || "Remote"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" /> Posted recently
                          </span>
                        </div>

                        {/* Action Buttons with Animated Link Transitions */}
                        <div className="flex flex-wrap items-center gap-3 mt-6">
                          {/* View Details */}
                          <Link href={`/jobs/${activeJob.id || 1}`}>
                            <motion.button
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-2 border-b-2 border-[#EAB308]"
                            >
                              View details <ArrowRight className="h-4 w-4" />
                            </motion.button>
                          </Link>
                          
                          {/* Apply Jobseeker */}
                          <Link href={`/jobs/${activeJob.id || 1}`}>
                            <motion.button
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-[#EAB308] hover:bg-[#CA8A04] text-[#1A2E44] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                            >
                              Apply jobseeker
                            </motion.button>
                          </Link>

                          {/* Practice AI Interview -> Routes to /job-seeker/interviews/13 */}
                          <Link href={`/job-seeker/interviews/13`}>
                            <motion.button
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className="border border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4] text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Sparkles className="h-4 w-4 text-[#EAB308]" /> Practice AI interview
                            </motion.button>
                          </Link>

                          {/* Sign in to apply */}
                          <Link href={`/jobs/${activeJob.id || 1}`}>
                            <motion.button
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
                            >
                              <UserCheck className="h-4 w-4 text-[#EAB308]" /> Sign in to apply
                            </motion.button>
                          </Link>
                        </div>
                      </div>

                      {/* Overview Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F8FAF5] p-4 rounded-xl border border-gray-100">
                        <div>
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
                            Level
                          </span>
                          <span className="text-sm font-bold text-[#1A2E44]">
                            Mid-Senior
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
                            Employment
                          </span>
                          <span className="text-sm font-bold text-[#1A2E44]">
                            Contract / Freelance
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block">
                            Compensation
                          </span>
                          <span className="text-sm font-bold text-[#16A34A]">
                            {activeJob.budget || "Negotiable"}
                          </span>
                        </div>
                      </div>

                      {/* Job Description */}
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-[#1A2E44] uppercase tracking-wider">
                          Job Description
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {activeJob.description ||
                            "We are looking for a dedicated professional to join our project team. You will collaborate directly with stakeholders to deliver clean, scalable solutions while meeting deadlines and standard industry guidelines."}
                        </p>
                      </div>

                      {/* Skills */}
                      {activeJob.skills && activeJob.skills.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {activeJob.skills.map((skill: any, sIdx: number) => (
                              <span
                                key={sIdx}
                                className="bg-[#F0FDF4] text-[#15803D] border border-[#16A34A]/20 text-xs font-semibold px-3 py-1 rounded-full"
                              >
                                {skill.name || skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Select a job listing on the left to review details.
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </section>
      </motion.main>
      <PublicFooter />
    </PublicShell>
  );
}