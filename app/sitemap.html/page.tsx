import Link from "next/link";
import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { blogPosts } from "@/lib/site/content";
import { promptCollections } from "@/lib/site/prompt-collections";

export const metadata: Metadata = {
  title: "HTML Sitemap",
  description:
    "Browse the main pages, prompt collections and security management articles on 100SecurityPrompts.com.",
  alternates: {
    canonical: "/sitemap.html",
  },
};

const staticLinks = [
  ["Home", "/"],
  ["Prompts", "/prompts"],
  ["Blog", "/blog"],
  ["Recommended Security Essentials", "/recommended-security-essentials"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export default function HtmlSitemapPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "HTML Sitemap", path: "/sitemap.html" },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero">
          <p className="eyebrow">Sitemap</p>
          <h1>HTML Sitemap</h1>
          <p>
            A simple index of the core pages, prompt collections and security management
            articles currently published on 100SecurityPrompts.com.
          </p>
        </section>
        <section className="sitemap-section">
          <h2>Main pages</h2>
          <ul>
            {staticLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="sitemap-section">
          <h2>Prompt collections</h2>
          <ul>
            {promptCollections.map((collection) => (
              <li key={collection.slug}>
                <Link href={`/prompts/${collection.slug}`}>{collection.h1}</Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="sitemap-section">
          <h2>Security management articles</h2>
          <ul>
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
