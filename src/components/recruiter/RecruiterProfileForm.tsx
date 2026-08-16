"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BriefcaseBusiness, Camera, Check, ExternalLink, Link as LinkIcon, Loader2, Mail, Pencil, Phone, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type { CurrentUserResponse } from "@/contracts/api/auth";
import type { RecruiterProfileResponse } from "@/contracts/api/recruiter";
import { getApiErrorMessage } from "@/lib/api-error";
import { saveProfileAvatar } from "@/lib/use-profile-avatar";
import { recruiterProfileSchema, type RecruiterProfileFormValues } from "@/lib/validation/recruiter.schema";
import { useUpdateRecruiterProfileMutation } from "@/services/recruiterApi";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/shared/FormFields";

export function RecruiterProfileForm({ currentUser, profile }: { currentUser: CurrentUserResponse; profile: RecruiterProfileResponse }) {
  const [saveProfile, save] = useUpdateRecruiterProfileMutation();
  const [editing, setEditing] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const avatarKey = `recruiter-avatar-${currentUser.userAccountId}`;
  const form = useForm<RecruiterProfileFormValues>({
    resolver: zodResolver(recruiterProfileSchema),
    values: {
      position: profile.position ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
    },
  });

  useEffect(() => {
    const savedAvatar = localStorage.getItem(avatarKey);
    if (savedAvatar) queueMicrotask(() => setAvatar(savedAvatar));
  }, [avatarKey]);

  const position = useWatch({ control: form.control, name: "position" });
  const linkedin = useWatch({ control: form.control, name: "linkedinUrl" });

  async function submit(values: RecruiterProfileFormValues) {
    try {
      await saveProfile({ position: values.position || undefined, linkedinUrl: values.linkedinUrl || undefined }).unwrap();
      setEditing(false);
      toast.success("Your recruiter profile is up to date.");
    } catch (error) { toast.error(getApiErrorMessage(error, "Unable to update the profile.")); }
  }

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) return toast.error("Choose a PNG, JPG, WebP, or SVG image.");
    setUploading(true);
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/uploads", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message ?? "Upload failed.");
      setAvatar(data.url);
      localStorage.setItem(avatarKey, data.url);
      saveProfileAvatar(currentUser.userAccountId, data.url);
      toast.success("Profile photo updated.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Upload failed."); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  }

  function cancel() {
    form.reset({
      position: profile.position ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
    });
    setEditing(false);
  }

  return <div className="overflow-hidden rounded-[28px] border border-ws-line bg-ws-card shadow-sm">
    <div className="px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-end gap-4">
          <div className="relative size-28 shrink-0 rounded-[26px] border-4 border-ws-card bg-primary/15 shadow-lg sm:size-32">
            <div className="flex size-full items-center justify-center rounded-[22px] bg-cover bg-center text-3xl font-bold text-primary" style={avatar ? { backgroundImage: `url(${JSON.stringify(avatar)})` } : undefined}>{!avatar && initials(currentUser.fullName)}</div>
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} aria-label="Upload profile photo" className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full border-4 border-ws-card bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 disabled:opacity-60">{uploading ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}</button>
            <input ref={inputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file); }} />
          </div>
          <div className="min-w-0 pb-1"><h2 className="truncate text-2xl font-bold tracking-tight text-ws-fg">{currentUser.fullName}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-ws-muted"><BriefcaseBusiness className="size-4" /> {position || "Recruiter"}</p><p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"><ShieldCheck className="size-3.5" /> Verified recruiter</p></div>
        </div>
        {!editing && <Button type="button" onClick={() => setEditing(true)} className="h-11 rounded-full px-5"><Pencil /> Edit profile</Button>}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(260px,.75fr)]">
        <section className="rounded-2xl border border-ws-line bg-ws-panel p-5 sm:p-6">
          <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><UserRound className="size-5" /></span><div><h3 className="font-semibold text-ws-fg">Professional details</h3><p className="text-sm text-ws-muted">How candidates see your role</p></div></div>
          {editing ? <Form {...form}><form className="mt-6 space-y-5" onSubmit={form.handleSubmit(submit)}>
            <TextField control={form.control} name="position" label="Position" placeholder="Head of Talent Acquisition" description="Use your current role or recruiting specialty." />
            <TextField control={form.control} name="linkedinUrl" label="LinkedIn profile" placeholder="https://linkedin.com/in/your-name" />
            <div className="flex flex-col-reverse gap-2 border-t border-ws-line pt-5 sm:flex-row sm:justify-end"><Button type="button" variant="ghost" onClick={cancel} className="rounded-full"><X /> Cancel</Button><Button type="submit" disabled={save.isLoading} className="rounded-full px-6">{save.isLoading ? <Loader2 className="animate-spin" /> : <Check />} {save.isLoading ? "Saving…" : "Save changes"}</Button></div>
          </form></Form> : <div className="mt-6 grid gap-4 sm:grid-cols-2"><Detail icon={BriefcaseBusiness} label="Position" value={position || "Not added yet"} /><Detail icon={LinkIcon} label="LinkedIn" value={linkedin || "Not added yet"} href={linkedin || undefined} /></div>}
        </section>
        <aside className="rounded-2xl border border-ws-line bg-ws-panel p-5 sm:p-6">
          <h3 className="font-semibold text-ws-fg">Account details</h3><p className="mt-1 text-sm text-ws-muted">Managed by your sign-in account</p>
          <div className="mt-5 space-y-5"><Account icon={Mail} label="Email" value={currentUser.email} /><Account icon={Phone} label="Phone" value={currentUser.phoneNumber || "Not provided"} /><Account icon={ShieldCheck} label="Access" value={currentUser.roles.map(formatRole).join(", ")} /></div>
          <div className="mt-6 rounded-xl bg-primary/8 p-4 text-sm leading-6 text-ws-muted">Your photo and professional details help candidates recognize who they are connecting with.</div>
        </aside>
      </div>
    </div>
  </div>;
}

type Icon = typeof BriefcaseBusiness;
function Detail({ icon: Icon, label, value, href }: { icon: Icon; label: string; value: string; href?: string }) {
  const content = <><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ws-card text-primary"><Icon className="size-4" /></span><span className="min-w-0"><span className="block text-xs font-medium uppercase tracking-wide text-ws-faint">{label}</span><span className="mt-0.5 block truncate text-sm font-medium text-ws-fg">{value}</span></span>{href && <ExternalLink className="ml-auto size-3.5 shrink-0 text-ws-faint" />}</>;
  return href ? <a href={href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-ws-line p-3 hover:bg-ws-card">{content}</a> : <div className="flex items-center gap-3 rounded-xl border border-ws-line p-3">{content}</div>;
}
function Account({ icon: Icon, label, value }: { icon: Icon; label: string; value: string }) { return <div className="flex gap-3"><Icon className="mt-0.5 size-4 shrink-0 text-primary" /><div className="min-w-0"><p className="text-xs text-ws-faint">{label}</p><p className="mt-0.5 break-words text-sm font-medium text-ws-fg">{value}</p></div></div>; }
function initials(name: string) { return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "R"; }
function formatRole(role: string) { return role.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
