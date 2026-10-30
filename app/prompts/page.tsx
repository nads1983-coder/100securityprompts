import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { product, siteUrl } from "@/lib/site/content";
import { promptCollections } from "@/lib/site/prompt-collections";

export const metadata: Metadata = {
  title: "Security Prompt Collections",
  description:
    "Browse practical sample AI prompt collections for security managers, supervisors and corporate security teams.",
  alternates: {
    canonical: "/prompts",
  },
  openGraph: {
    title: "Security Prompt Collections",
    description:
      "Sample prompt collections for incident reports, investigations, risk assessments, handovers, SOPs and security leadership.",
    url: `${siteUrl}/prompts`,
    type: "website",
  },
};

export default function PromptsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Security Prompt Collections",
    description: metadata.description,
    url: `${siteUrl}/prompts`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: promptCollections.map((collection, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: collection.h1,
        url: `${siteUrl}/prompts/${collection.slug}`,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Prompts", path: "/prompts" },
        ]}
      />
      <SiteHeader />
      <main id="main-content" className="content-page prompt-page">
        <section className="page-hero">
          <p className="eyebrow">Prompt library</p>
          <h1>Security Prompt Collections</h1>
          <p>
            Practical sample prompts for security managers and supervisors. Each collection
            gives enough to use immediately while keeping the complete {product.name} pack
            as the paid download.
          </p>
        </section>
        <section className="prompt-collection-grid" aria-label="Security prompt collections">
          {promptCollections.map((collection) => (
            <article className="prompt-collection-card" key={collection.slug}>
              <ShieldCheck size={22} aria-hidden="true" />
              <p>{collection.primaryKeyword}</p>
              <h2>{collection.h1}</h2>
              <p>{collection.description}</p>
              <Link href={`/prompts/${collection.slug}`}>
                View sample prompts <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </section>
        <section className="article-cta prompt-product-cta">
          <p>Complete collection</p>
          <h2>Need the full prompt pack?</h2>
          <p>
            The sample pages show selected examples. The full paid download includes 100
            security-focused prompts plus 25 real-world security manager AI use cases.
          </p>
          <Link href="/#pricing">View the complete prompt pack</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
