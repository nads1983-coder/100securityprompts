import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { blogPosts } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical articles about AI prompts, ChatGPT, incident reports and AI tools for security managers.",
  alternates: {
    canonical: "/blog",
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
      </main>
      <SiteFooter />
    </>
  );
}
