import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { blogPosts } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Security Management AI Blog",
  description:
    "Practical articles about ChatGPT prompts, AI tools, incident reports, handovers, SOPs and operational writing for security managers.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Security Management AI Blog",
    description:
      "Guides for security managers using AI prompts for incident reports, handovers, SOPs and operational communication.",
    url: "/blog",
    type: "website",
  },
};

export default function BlogPage() {
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero">
          <h1>Security Management AI Blog</h1>
          <p>
            Practical guidance for security managers using ChatGPT and AI
            prompts for reporting, handovers, communication and operations.
          </p>
        </section>
        <section className="blog-list">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <time dateTime={post.published}>{formatDate(post.published)}</time>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <Link href={`/blog/${post.slug}`}>
                Read article <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </section>
        <section className="article-cta essentials-inline-cta">
          <p>Useful add-on</p>
          <h2>Need practical kit for shifts, study or control-room work?</h2>
          <p>
            Browse optional Amazon UK search recommendations for notebooks,
            torches, PPE, study materials and other security essentials.
          </p>
          <Link href="/recommended-security-essentials">
            View recommended security essentials
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
