import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { blogPosts } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical articles about AI prompts, ChatGPT, incident reports and AI tools for security managers.",
  alternates: {
    canonical: "/insights",
  },
};

export default function InsightsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero">
          <h1>Security Management AI Insights</h1>
          <p>
            Practical guidance for security managers using ChatGPT and AI
            prompts for reporting, handovers, communication and operations.
          </p>
        </section>
        <section className="blog-list">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <time dateTime={post.published}>6 June 2026</time>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <Link href={`/insights/${post.slug}`}>
                Read article <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
