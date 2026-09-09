"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCreateAiInterviewForApplicationMutation } from "@/services/jobSeekerApi";

type StartApplicationInterviewButtonProps = {
  applicationId: string | number;
};

/** Creates an AI interview tied to an existing application. */
export function StartApplicationInterviewButton({
  applicationId,
}: StartApplicationInterviewButtonProps) {
  const tx = useWorkspaceTranslation();
  const router = useRouter();
  const [createInterview, creation] = useCreateAiInterviewForApplicationMutation();

  const start = async () => {
    try {
      const session = await createInterview(applicationId).unwrap();
      router.push(`/job-seeker/interviews/${session.id}`);
    } catch {
      toast.error(tx("Unable to start an AI interview for this application."));
    }
  };

  return (
    <Button type="button" onClick={start} disabled={creation.isLoading}>
      <Sparkles aria-hidden="true" className="size-4" />
      {creation.isLoading ? tx("Preparing interview…") : tx("Start AI interview")}
    </Button>
  );
}
