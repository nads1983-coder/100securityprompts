"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

export default function GeneratedContentDetailError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-soft px-4 py-8 text-ink sm:px-6 lg:px-8">
      <section className="mx-auto max-w-xl rounded-lg border border-line bg-panel p-5 shadow-line">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-50 text-danger">
          <AlertTriangle size={18} />
        </div>
        <h1 className="mt-4 text-xl font-semibold">Content could not be loaded</h1>
        <p className="mt-2 text-sm leading-6 text-muted">The generated content detail page hit an error while loading.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white">
            <RefreshCw size={16} />
            Try again
          </button>
          <Link className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-semibold" href="/admin/seo-automation#content">
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </section>
    </main>
  );
}
