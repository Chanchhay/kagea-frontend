"use client";
import { useWorkspaceTranslation } from "@/i18n/useWorkspaceTranslation";


import { resolveFileUrl } from "@/lib/file-url";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { ExternalLink, FileCheck2, FileText, ShieldCheck, Trash2, UploadCloud } from "lucide-react";
import { PageIntro } from "@/components/shared/ApiCards";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { CompanyDocumentForm } from "@/components/recruiter/CompanyDocumentForm";
import { Button } from "@/components/ui/button";
import {
  useDeleteCompanyDocumentMutation,
  useGetCompanyDocumentsQuery,
  useGetRecruiterCompanyQuery,
} from "@/services/recruiterApi";

export default function CompanyDocumentsPage() {
  const tx = useWorkspaceTranslation();
  const company = useGetRecruiterCompanyQuery();
  const documents = useGetCompanyDocumentsQuery(company.data?.id ?? "", {
    skip: !company.data,
  });
  const [deleteDocument, deletion] = useDeleteCompanyDocumentMutation();

  if (company.isLoading || documents.isLoading) return <LoadingState rows={5} />;
  if (company.isError || !company.data) {
    return <ErrorState message={tx("Create a company before adding documents.")} />;
  }
  if (documents.isError) {
    return <ErrorState message={tx("Unable to load company documents.")} />;
  }

  const companyId = company.data.id;
  const companyDocuments = documents.data ?? [];

  const onDelete = async (documentId: string) => {
    try {
      await deleteDocument({ companyId, documentId }).unwrap();
      toast.success(tx("Document removed."));
    } catch (error) {
      toast.error(getApiErrorMessage(error, tx("Unable to remove the document.")));
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageIntro
        title={tx("Company documents")}
        description={tx("Supporting documents a moderator reviews when verifying your company.")}
      />
      <section className="overflow-hidden rounded-[28px] border border-ws-line bg-ws-panel shadow-[0_18px_60px_-42px_rgba(15,23,42,.45)]">
        <div className="flex flex-col gap-5 border-b border-ws-line bg-linear-to-r from-primary/8 via-transparent to-transparent px-5 py-6 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><ShieldCheck className="size-5" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{tx("Company verification")}</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-ws-fg">{tx("Verification documents")}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-ws-muted">{tx("Upload official records for ")}{company.data.name}{tx(". Clear documents help moderators review your company faster.")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/8 px-4 py-3">
            <FileCheck2 className="size-5 text-primary" />
            <div><p className="text-lg font-bold leading-none text-ws-fg">{companyDocuments.length}</p><p className="mt-1 text-xs text-ws-muted">{tx("Documents uploaded")}</p></div>
          </div>
        </div>

        <div className="grid gap-7 p-5 sm:p-7 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,.55fr)]">
          <div className="rounded-[22px] border border-ws-line bg-ws-card p-5 sm:p-6">
            <div className="mb-5">
              <h3 className="font-bold text-ws-fg">{tx("Add a document")}</h3>
              <p className="mt-1 text-sm text-ws-muted">{tx("Choose the document category, then select a file to upload.")}</p>
            </div>
            <CompanyDocumentForm companyId={companyId} />
          </div>

          <aside className="rounded-[22px] border border-ws-line bg-ws-panel p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{tx("Before uploading")}</p>
            <h3 className="mt-2 font-bold text-ws-fg">{tx("Help us verify faster")}</h3>
            <ul className="mt-5 space-y-4">
              <GuideItem number="01" text="Use a clear, complete scan with every edge visible." />
              <GuideItem number="02" text="Choose the document type that matches the file." />
              <GuideItem number="03" text="Avoid password-protected or expired documents." />
            </ul>
            <div className="mt-6 rounded-2xl bg-primary/8 p-4 text-sm leading-6 text-ws-muted"><strong className="text-ws-fg">{tx("Accepted:")}</strong> {tx(" PDF, PNG, JPG, WebP and SVG files up to 5 MB.")}</div>
          </aside>
        </div>

        <div className="border-t border-ws-line px-5 py-6 sm:px-7">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{tx("Document library")}</p><h3 className="mt-1 text-lg font-bold text-ws-fg">{tx("Submitted files")}</h3></div>
            {companyDocuments.length ? <span className="text-sm text-ws-muted">{companyDocuments.length} {tx(" total")}</span> : null}
          </div>
        {companyDocuments.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-ws-line bg-ws-card px-6 py-14 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UploadCloud className="size-7" /></span>
            <h3 className="mt-4 font-bold text-ws-fg">{tx("No documents uploaded yet")}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ws-muted">{tx("Your submitted verification files will appear here. Add your first document above to begin.")}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {companyDocuments.map((document) => (
              <article key={document.id} className="group rounded-[20px] border border-ws-line bg-ws-panel p-5 transition hover:border-primary/30 hover:shadow-[0_16px_40px_-30px_rgba(15,23,42,.45)]">
                <div className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h4 className="font-semibold text-ws-fg">{formatDocumentType(document.documentType)}</h4><span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">{tx(document.status)}</span></div>
                    <a
                      href={resolveFileUrl(document.documentUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 flex items-center gap-1.5 truncate text-sm text-ws-muted transition hover:text-primary"
                    >
                      <ExternalLink className="size-3.5 shrink-0" /> {tx(" View uploaded file")}</a>
                  </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label={tx("Remove {0}", { 0: document.documentType })}
                      className="size-10 rounded-xl border-0 bg-ws-card text-ws-muted shadow-none hover:bg-destructive/10 hover:text-destructive"
                      disabled={deletion.isLoading}
                      onClick={() => onDelete(document.id)}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                </div>
              </article>
            ))}
          </div>
        )}
        </div>
      </section>
    </div>
  );
}

function GuideItem({ number, text }: { number: string; text: string }) { return <li className="flex gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-ws-card text-xs font-bold text-primary">{number}</span><p className="pt-1 text-sm leading-6 text-ws-muted">{text}</p></li>; }
function formatDocumentType(value: string) { return value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
