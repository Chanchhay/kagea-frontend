import { BriefcaseBusiness, Layers3, Sparkles } from "lucide-react";
import type { PublicIndustryResponse, PublicJobCategoryResponse, PublicSkillResponse } from "@/contracts";

export function PublicJobCatalog({ categories, skills, industries }: { categories: PublicJobCategoryResponse[]; skills: PublicSkillResponse[]; industries: PublicIndustryResponse[] }) {
  const groups = [
    { title: "Job categories", icon: Layers3, values: categories.map((item) => item.name) },
    { title: "Skills", icon: Sparkles, values: skills.map((item) => item.name) },
    { title: "Industries", icon: BriefcaseBusiness, values: industries.map((item) => item.name) },
  ];
  return <section className="mt-12"><p className="text-sm font-semibold text-primary">Career catalog</p><h2 className="mt-1 text-2xl font-bold text-heading">Explore the job market</h2><div className="mt-5 grid gap-5 lg:grid-cols-3">{groups.map((group)=><article key={group.title} className="rounded-2xl border border-primary bg-white p-5 dark:bg-slate-900"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><group.icon className="size-5"/></span><h3 className="font-semibold text-heading">{group.title}</h3></div><div className="mt-5 flex max-h-40 flex-wrap content-start gap-2 overflow-y-auto">{group.values.length?group.values.map((value,index)=><span key={`${value}-${index}`} className="rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs text-body">{value}</span>):<p className="text-sm text-body">No data available.</p>}</div></article>)}</div></section>;
}
