import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { blogPosts, product, siteUrl } from "@/lib/site/content";

type InsightsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: InsightsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/insights/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/insights/${post.slug}`,
      type: "article",
      publishedTime: post.published,
    },
  };
}

export default async function InsightPostPage({ params }: InsightsPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.published,
    dateModified: post.published,
    author: {
      "@type": "Person",
      name: "Nadine Pierre",
    },
    publisher: {
      "@type": "Organization",
      name: product.brand,
    },
    mainEntityOfPage: `${siteUrl}/insights/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: post.title, path: `/insights/${post.slug}` },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <article className="article-page">
          <Link className="back-link" href="/insights">
            <ArrowLeft size={16} aria-hidden="true" />
            Insights
          </Link>
          <h1>{post.title}</h1>
          <p className="article-description">{post.description}</p>
          <time dateTime={post.published}>Published 6 June 2026</time>
          {post.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
