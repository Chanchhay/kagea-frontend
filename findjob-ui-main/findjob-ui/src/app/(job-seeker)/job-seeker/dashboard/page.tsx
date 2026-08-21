// "use client";

// import { OverviewWorkspace } from "@/components/job-seeker/workspace/OverviewWorkspace";
// import { ErrorState } from "@/components/shared/ErrorState";
// import { LoadingState } from "@/components/shared/LoadingState";
// import { useGetCurrentUserQuery } from "@/services/authApi";
// import {
//   useGetAiInterviewsQuery,
//   useGetApplicationsQuery,
//   useGetJobSeekerProfileQuery,
//   useGetPortfoliosQuery,
//   useGetResumesQuery,
// } from "@/services/jobSeekerApi";

// export default function JobSeekerOverviewPage() {
//   const userQuery = useGetCurrentUserQuery();
//   const profileQuery = useGetJobSeekerProfileQuery();
//   const resumesQuery = useGetResumesQuery();
//   const portfoliosQuery = useGetPortfoliosQuery();
//   const applicationsQuery = useGetApplicationsQuery();
//   const interviewsQuery = useGetAiInterviewsQuery();

//   const queries = [
//     profileQuery,
//     resumesQuery,
//     portfoliosQuery,
//     applicationsQuery,
//     interviewsQuery,
//   ];

//   if (queries.some((query) => query.isLoading)) return <LoadingState rows={6} />;
//   if (queries.some((query) => query.isError) || !profileQuery.data) {
//     return <ErrorState message="Unable to load your workspace." />;
//   }

//   return (
//     <OverviewWorkspace
//       user={userQuery.data}
//       profile={profileQuery.data}
//       resumes={resumesQuery.data ?? []}
//       portfolios={portfoliosQuery.data ?? []}
//       applications={applicationsQuery.data ?? []}
//       interviews={interviewsQuery.data ?? []}
//     />
//   );
// }




"use client";

import Link from "next/link";
import { OverviewWorkspace } from "@/components/job-seeker/workspace/OverviewWorkspace";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { useGetCurrentUserQuery } from "@/services/authApi";
import {
  useGetAiInterviewsQuery,
  useGetApplicationsQuery,
  useGetJobSeekerProfileQuery,
  useGetPortfoliosQuery,
  useGetResumesQuery,
} from "@/services/jobSeekerApi";
import { 
  FileText, 
  FolderKanban, 
  Briefcase, 
  Bot, 
  UserCircle, 
  ArrowRight, 
  CheckCircle2, 
  MapPin,
  Mail,
  Sparkles
} from "lucide-react";

export default function JobSeekerOverviewPage() {
  const userQuery = useGetCurrentUserQuery();
  const profileQuery = useGetJobSeekerProfileQuery();
  const resumesQuery = useGetResumesQuery();
  const portfoliosQuery = useGetPortfoliosQuery();
  const applicationsQuery = useGetApplicationsQuery();
  const interviewsQuery = useGetAiInterviewsQuery();

  const queries = [
    profileQuery,
    resumesQuery,
    portfoliosQuery,
    applicationsQuery,
    interviewsQuery,
  ];

  if (queries.some((query) => query.isLoading)) return <LoadingState rows={6} />;
  if (queries.some((query) => query.isError) || !profileQuery.data) {
    return <ErrorState message="Unable to load your workspace." />;
  }

  const profile = profileQuery.data;
  const user = userQuery.data;
  const resumesCount = resumesQuery.data?.length ?? 0;
  const portfoliosCount = portfoliosQuery.data?.length ?? 0;
  const applicationsCount = applicationsQuery.data?.length ?? 0;
  const interviewsCount = interviewsQuery.data?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-zinc-900 pb-20">
      
      {/* Top Profile Banner with exact matching green theme */}
      <div className="border-b border-emerald-100 bg-white py-10 px-6 lg:px-12 shadow-sm relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-6">
            {/* Avatar using the exact solid green color #16A34A */}
            <div className="w-24 h-24 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center text-3xl font-black tracking-wider shadow-md shadow-green-600/20 shrink-0">
              {profile?.fullName?.[0] || user?.name?.[0] || "U"}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-zinc-900">
                  {profile?.fullName || user?.name || "Job Seeker"}
                </h1>
                <span className="bg-emerald-50 text-[#16A34A] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" /> Active Profile
                </span>
              </div>
              <p className="text-sm font-semibold text-[#16A34A]">
                {profile?.headline || "Professional Career Seeker Workspace"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-0.5">
                {profile?.location && (
                  <span className="flex items-center gap-1 bg-emerald-50/80 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#16A34A]" /> {profile.location}
                  </span>
                )}
                {user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" /> {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/job-seeker/profile"
              className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-green-600/20 flex items-center gap-2 group"
            >
              <UserCircle className="w-4 h-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
              <span>Edit Profile Data</span>
            </Link>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-10 space-y-10">
        
        {/* Quick Navigation & Directory Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" /> Quick Navigation & Directory
            </h2>
            <span className="text-xs font-medium text-zinc-500">Click any card to open management page</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Resumes Link Card */}
            <Link 
              href="/job-seeker/resumes"
              className="group p-5 rounded-2xl bg-white border border-emerald-100 hover:border-[#16A34A] transition-all shadow-sm hover:shadow-xl hover:shadow-green-600/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  {resumesCount}
                </span>
              </div>
              
              <div>
                <p className="text-sm font-bold text-zinc-900 group-hover:text-[#16A34A] flex items-center justify-between transition-colors">
                  <span>Resumes List</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#16A34A]" />
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">Manage uploaded CVs & templates</p>
              </div>
            </Link>

            {/* Portfolios Link Card */}
            <Link 
              href="/job-seeker/portfolios"
              className="group p-5 rounded-2xl bg-white border border-emerald-100 hover:border-[#16A34A] transition-all shadow-sm hover:shadow-xl hover:shadow-green-600/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  {portfoliosCount}
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-900 group-hover:text-[#16A34A] flex items-center justify-between transition-colors">
                  <span>Portfolios</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#16A34A]" />
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">Showcase your projects & work</p>
              </div>
            </Link>

            {/* Applications Link Card */}
            <Link 
              href="/job-seeker/applications"
              className="group p-5 rounded-2xl bg-white border border-emerald-100 hover:border-[#16A34A] transition-all shadow-sm hover:shadow-xl hover:shadow-green-600/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  {applicationsCount}
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-900 group-hover:text-[#16A34A] flex items-center justify-between transition-colors">
                  <span>Applications Tracker</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#16A34A]" />
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">Track applied job positions</p>
              </div>
            </Link>

            {/* AI Interviews Link Card */}
            <Link 
              href="/job-seeker/interviews"
              className="group p-5 rounded-2xl bg-white border border-emerald-100 hover:border-[#16A34A] transition-all shadow-sm hover:shadow-xl hover:shadow-green-600/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                  {interviewsCount}
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-900 group-hover:text-[#16A34A] flex items-center justify-between transition-colors">
                  <span>AI Interviews</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#16A34A]" />
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">Review diagnostic mock sessions</p>
              </div>
            </Link>

          </div>
        </div>

        {/* Core Overview Workspace Container (Preserving 100% of your initial props and variables) */}
        <div className="bg-white border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-sm">
          <OverviewWorkspace
            user={userQuery.data}
            profile={profileQuery.data}
            resumes={resumesQuery.data ?? []}
            portfolios={portfoliosQuery.data ?? []}
            applications={applicationsQuery.data ?? []}
            interviews={interviewsQuery.data ?? []}
          />
        </div>

      </div>

    </div>
  );
}