import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { amazonAffiliateConfig, amazonAffiliateLinkProps } from "@/lib/site/amazon-affiliate";
import { product, siteUrl } from "@/lib/site/content";
import {
  recommendedSecurityEssentialsMetadata,
  recommendedSecurityEssentialsPath,
  restrictedEquipmentNotice,
  securityEssentialsCategories,
} from "@/lib/site/security-essentials";

export const metadata: Metadata = {
  title: recommendedSecurityEssentialsMetadata.title,
  description: recommendedSecurityEssentialsMetadata.description,
  alternates: {
    canonical: recommendedSecurityEssentialsPath,
  },
  openGraph: {
    title: recommendedSecurityEssentialsMetadata.title,
    description: recommendedSecurityEssentialsMetadata.description,
    url: `${siteUrl}${recommendedSecurityEssentialsPath}`,
    type: "website",
  },
};

function getRecommendedSecurityEssentialsJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: recommendedSecurityEssentialsMetadata.title,
    description: recommendedSecurityEssentialsMetadata.description,
    url: `${siteUrl}${recommendedSecurityEssentialsPath}`,
    isPartOf: {
      "@type": "WebSite",
      name: product.brand,
      url: siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: securityEssentialsCategories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: category.title,
        description: category.description,
        url: `${siteUrl}${recommendedSecurityEssentialsPath}#${category.slug}`,
      })),
    },
  };
}

const affiliateLinkProps = amazonAffiliateLinkProps();

export default function RecommendedSecurityEssentialsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getRecommendedSecurityEssentialsJsonLd()),
        }}
      />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          {
            name: "Recommended Security Essentials",
            path: recommendedSecurityEssentialsPath,
          },
        ]}
      />
      <SiteHeader />
      <main className="content-page essentials-page">
        <section className="page-hero">
          <p className="eyebrow">Useful secondary recommendations</p>
          <h1>{recommendedSecurityEssentialsMetadata.title}</h1>
          <p>
            Practical Amazon UK search shortcuts for security officers,
            supervisors and managers choosing work supplies, training materials
            and professional-development tools. The core resource here remains
            {` ${product.name}`} for better reports, handovers and operational
            communication.
          </p>
          <div className="hero-actions essentials-actions">
            <Link className="button button-primary" href="/#buy">
              Get the security prompt pack
            </Link>
            <Link className="button button-secondary" href="/blog">
              Read security management guidance
            </Link>
          </div>
        </section>

        <section className="affiliate-disclosure" aria-label="Affiliate disclosure">
          <ShieldCheck size={22} aria-hidden="true" />
          <p>{amazonAffiliateConfig.disclosure}</p>
        </section>

        <section className="essentials-safety" aria-labelledby="safety-heading">
          <ShieldAlert size={24} aria-hidden="true" />
          <div>
            <h2 id="safety-heading">Safety, suitability and employer approval</h2>
            <p>
              These recommendations are optional and general. Equipment must
              comply with your employer, client-site and assignment instructions.
              Do not buy or carry restricted equipment merely because it appears
              in a recommendation.
            </p>
            <ul>
              {restrictedEquipmentNotice.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="essentials-grid" aria-label="Recommended categories">
          {securityEssentialsCategories.map((category) => (
            <article className="essential-card" id={category.slug} key={category.title}>
              <h2>{category.title}</h2>
              <p>{category.description}</p>
              <a href={category.href} {...affiliateLinkProps}>
                {category.linkText}
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            </article>
          ))}
        </section>

        <section className="article-cta essentials-primary-cta">
          <p>Primary resource</p>
          <h2>Improve the documents you write after the equipment is ready</h2>
          <p>
            The Amazon links are only a practical add-on. For the reporting,
            handover and management work that security teams do every day, use
            the 100 AI prompts pack as your main professional resource.
          </p>
          <Link href="/#buy">Get the prompt pack</Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
