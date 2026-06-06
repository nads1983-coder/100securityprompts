import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, FileText, Globe2, ShieldCheck, Target } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/auth";
import { getGeneratedContentById } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GeneratedContentDetailPage({ params }: Props) {
  const authenticated = await isAdminAuthenticated();
  const { id } = await params;

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-soft px-4 py-8 text-ink sm:px-6 lg:px-8">
        <section className="mx-auto max-w-xl rounded-lg border border-line bg-panel p-5 shadow-line">
          <h1 className="text-xl font-semibold">Admin access required</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Unlock the SEO automation dashboard before viewing generated content details.</p>
          <Link className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white" href="/admin/seo-automation#content">
            <ArrowLeft size={16} />
            Back to dashboard
          </Link>
        </section>
      </main>
    );
  }

  const item = await getGeneratedContentById(decodeURIComponent(id));
  if (!item) notFound();

  const targetKeyword =
    typeof item.metadata?.targetKeyword === "string"
      ? item.metadata.targetKeyword
      : typeof item.metadata?.target_keyword === "string"
        ? item.metadata.target_keyword
        : "Not specified";

  return (
    <main className="min-h-screen bg-soft px-4 py-6 text-ink sm:px-6 lg:px-8">
      <article className="mx-auto max-w-5xl">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink" href="/admin/seo-automation#content">
          <ArrowLeft size={16} />
          Back to content
        </Link>

        <header className="mt-5 rounded-lg border border-line bg-panel p-5 shadow-line">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium uppercase text-muted">
            <span className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1">
              <Globe2 size={14} />
              {item.brand}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1">
              <ShieldCheck size={14} />
              {item.status}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1">
              <CalendarDays size={14} />
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">{item.title}</h1>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <DetailMeta icon={<Target size={16} />} label="Target keyword" value={targetKeyword} />
            <DetailMeta icon={<Globe2 size={16} />} label="Site / domain" value={item.brand} />
            <DetailMeta icon={<FileText size={16} />} label="Content type" value={item.content_type} />
            <DetailMeta icon={<ShieldCheck size={16} />} label="Safety" value={`${item.safety_status} / ${item.quality_score}`} />
          </dl>
        </header>

        <section className="mt-5 rounded-lg border border-line bg-panel p-5 shadow-line">
          <h2 className="text-sm font-semibold uppercase tracking-normal">Full Content</h2>
          <div className="mt-4 whitespace-pre-wrap break-words text-base leading-7 text-ink">{item.body}</div>
        </section>
      </article>
    </main>
  );
}

function DetailMeta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-line px-3 py-3">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase text-muted">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 break-words font-medium text-ink">{value}</dd>
    </div>
  );
}
