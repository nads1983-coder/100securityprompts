import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function GeneratedContentNotFound() {
  return (
    <main className="min-h-screen bg-soft px-4 py-8 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto max-w-xl rounded-lg border border-line bg-panel p-5 shadow-line">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-soft text-muted">
          <SearchX size={18} />
        </div>
        <h1 className="mt-4 text-xl font-semibold">Content not found</h1>
        <p className="mt-2 text-sm leading-6 text-muted">This generated SEO content item does not exist, or it has not been synced to Supabase yet.</p>
        <Link className="mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white" href="/admin/seo-automation#content">
          <ArrowLeft size={16} />
          Back to content
        </Link>
      </section>
    </main>
  );
}
