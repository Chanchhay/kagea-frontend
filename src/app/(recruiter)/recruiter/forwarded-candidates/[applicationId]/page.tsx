"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, Clock3, Download, ExternalLink, FileText, MapPin, Sparkles, UserRound, Video } from "lucide-react";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { useGetForwardedApplicationQuery } from "@/services/recruiterApi";

export default function ForwardedCandidateDetailPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const query = useGetForwardedApplicationQuery(applicationId);
  if (query.isLoading) return <LoadingState rows={6} />;
  if (query.isError || !query.data) return <ErrorState message="Unable to load this forwarded candidate." />;
  const data = query.data;
  const feedback = data.aiResult?.feedback;
  const session = data.aiResult?.session;

  return <div className="mx-auto max-w-6xl pb-6">
    <Link href="/recruiter/forwarded-candidates" className="inline-flex items-center gap-2 text-sm font-medium text-ws-muted hover:text-primary"><ArrowLeft className="size-4" />Back to candidates</Link>
    <section className="mt-5 rounded-[28px] border border-ws-line bg-ws-card p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserRound className="size-8" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-bold tracking-tight text-ws-fg">{data.candidate.headline || data.candidate.currentPosition || "Candidate profile"}</h2><Pill>{label(data.application.status)}</Pill></div><p className="mt-1 text-sm text-ws-muted">{data.candidate.currentPosition || "Position not provided"}</p><div className="mt-3 flex flex-wrap gap-4 text-xs text-ws-muted">{data.candidate.preferredLocation && <span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{data.candidate.preferredLocation}</span>}<span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />Forwarded {date(data.forwardedAt)}</span></div></div>
        {data.submittedResume?.resumeFileUrl && <Button render={<a href={data.submittedResume.resumeFileUrl} target="_blank" rel="noreferrer" />} className="rounded-full"><Download />Open resume</Button>}
      </div>
    </section>

    <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
      <div className="space-y-6">
        <Card title="Application" icon={BriefcaseBusiness}><Info label="Applied role" value={data.application.jobTitle} /><Info label="Applied on" value={date(data.application.appliedAt)} /><div className="mt-5"><p className="text-xs font-semibold uppercase tracking-wide text-ws-faint">Cover letter</p><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ws-muted">{data.application.coverLetter || "No cover letter provided."}</p></div></Card>
        <Card title="AI interview assessment" icon={Sparkles}>
          {feedback ? <><div className="grid grid-cols-2 gap-3 sm:grid-cols-5"><Score label="Overall" value={feedback.overallScore} featured /><Score label="Technical" value={feedback.technicalScore} /><Score label="Communication" value={feedback.communicationScore} /><Score label="Confidence" value={feedback.confidenceScore} /><Score label="Problem solving" value={feedback.problemSolvingScore} /></div><div className="mt-6 grid gap-5 sm:grid-cols-2"><Feedback label="Strengths" value={feedback.strengths} positive /><Feedback label="Areas to improve" value={feedback.weaknesses} /></div><div className="mt-5 rounded-xl bg-primary/8 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-primary">Recommendation · {label(feedback.result)}</p><p className="mt-2 text-sm leading-6 text-ws-muted">{feedback.recommendation || "No recommendation provided."}</p></div></> : <p className="text-sm text-ws-muted">No AI interview result is available.</p>}
        </Card>
        <Card title="Interview history" icon={Video}>{data.humanInterviews?.length ? <div className="space-y-3">{data.humanInterviews.map((interview) => <div key={interview.id} className="rounded-xl border border-ws-line p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="flex items-center gap-2 text-sm font-semibold text-ws-fg"><Clock3 className="size-4 text-primary" />{dateTime(interview.scheduledAt)}</p><Pill>{label(interview.status)}</Pill></div>{interview.note && <p className="mt-2 text-sm text-ws-muted">{interview.note}</p>}{interview.meetingUrl && <a href={interview.meetingUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">Open meeting <ExternalLink className="size-3.5" /></a>}</div>)}</div> : <p className="text-sm text-ws-muted">No human interviews have been scheduled.</p>}</Card>
      </div>
      <aside className="space-y-6"><Card title="Candidate details" icon={UserRound}><Info label="Current position" value={data.candidate.currentPosition} /><Info label="Preferred location" value={data.candidate.preferredLocation} /><Info label="Availability" value={label(data.candidate.availabilityStatus || "Not specified")} /></Card><Card title="Submitted resume" icon={FileText}><Info label="Resume" value={data.submittedResume?.title} /><Info label="Visibility" value={label(data.submittedResume?.visibility || "Not specified")} />{data.submittedResume?.resumeFileUrl && <a href={data.submittedResume.resumeFileUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><Download className="size-4" />View submitted resume</a>}</Card>{session && <Card title="Interview session" icon={CheckCircle2}><Info label="Result" value={label(session.result)} /><Info label="Questions answered" value={`${session.answeredCount} of ${session.questionCount}`} /><Info label="Completed" value={dateTime(session.endedAt)} /></Card>}</aside>
    </div>
  </div>;
}

function Card({ title, icon: Icon, children }: { title: string; icon: typeof UserRound; children: React.ReactNode }) { return <section className="rounded-2xl border border-ws-line bg-ws-card p-5 sm:p-6"><h3 className="flex items-center gap-2 font-semibold text-ws-fg"><span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4.5" /></span>{title}</h3><div className="mt-5">{children}</div></section>; }
function Info({ label: title, value }: { label: string; value?: string }) { return <div className="mb-4 last:mb-0"><p className="text-xs font-semibold uppercase tracking-wide text-ws-faint">{title}</p><p className="mt-1 text-sm font-medium text-ws-fg">{value || "Not provided"}</p></div>; }
function Score({ label: title, value, featured = false }: { label: string; value: number; featured?: boolean }) { return <div className={`rounded-xl p-3 text-center ${featured ? "bg-primary text-primary-foreground" : "bg-ws-panel"}`}><p className="text-xl font-bold">{value ?? 0}</p><p className={`mt-1 text-[10px] font-medium ${featured ? "text-primary-foreground/75" : "text-ws-muted"}`}>{title}</p></div>; }
function Feedback({ label: title, value, positive = false }: { label: string; value: string; positive?: boolean }) { return <div><p className={`text-xs font-semibold uppercase tracking-wide ${positive ? "text-primary" : "text-ws-faint"}`}>{title}</p><p className="mt-2 text-sm leading-6 text-ws-muted">{value || "Not provided."}</p></div>; }
function Pill({ children }: { children: React.ReactNode }) { return <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{children}</span>; }
function label(value: string) { return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function date(value?: string) { if (!value) return "Not available"; const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? "Not available" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(parsed); }
function dateTime(value?: string) { if (!value) return "Not available"; const parsed = new Date(value); return Number.isNaN(parsed.getTime()) ? "Not available" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(parsed); }
