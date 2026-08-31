import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { blogPosts, product, siteUrl } from "@/lib/site/content";
import {
  buildPromptCollectionSchema,
  getPromptCollection,
  promptCollections,
  type PromptCollection,
} from "@/lib/site/prompt-collections";

type PromptPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return promptCollections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: PromptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getPromptCollection(slug);

  if (!collection) {
    return {};
  }

  return {
    title: collection.title,
    description: collection.description,
    alternates: {
      canonical: `/prompts/${collection.slug}`,
    },
    openGraph: {
      title: collection.title,
      description: collection.description,
      url: `${siteUrl}/prompts/${collection.slug}`,
      type: "website",
    },
  };
}

export default async function PromptCollectionPage({ params }: PromptPageProps) {
  const { slug } = await params;
  const collection = getPromptCollection(slug);

  if (!collection) {
    notFound();
  }

  const relatedCollections = collection.relatedCollections
    .map((relatedSlug) => getPromptCollection(relatedSlug))
    .filter((related): related is PromptCollection => Boolean(related));
  const relatedPosts = collection.blogLinks
    .map((link) => {
      const post = blogPosts.find((item) => item.slug === link.slug);
      return post ? { ...link, post } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildPromptCollectionSchema(collection)),
        }}
      />
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Prompts", path: "/prompts" },
          { name: collection.h1, path: `/prompts/${collection.slug}` },
        ]}
      />
      <SiteHeader />
      <main className="content-page prompt-page">
        <article className="article-page prompt-detail">
          <Link className="back-link" href="/prompts">
            <ArrowLeft size={16} aria-hidden="true" />
            Prompts
          </Link>
          <p className="eyebrow">{collection.primaryKeyword}</p>
          <h1>{collection.h1}</h1>
          <p className="article-description">{collection.description}</p>
          <p>{collection.intro}</p>

          <section className="prompt-info-grid" aria-label="Audience and use cases">
            <div>
              <h2>Who this helps</h2>
              <ul>
                {collection.audience.map((audience) => (
                  <li key={audience}>{audience}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>Use these prompts for</h2>
              <ul>
                {collection.useCases.map((useCase) => (
                  <li key={useCase}>{useCase}</li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h2>Sample prompts</h2>
            <p>
              These are selected web samples, not the complete paid collection. Adapt them
              to your site procedures, reporting format and authorised AI policy.
            </p>
            <div className="sample-prompt-list">
              {collection.samples.map((sample) => (
                <section className="sample-prompt-card" key={sample.title}>
                  <h3>{sample.title}</h3>
                  <p>{sample.helpsWith}</p>
                  <blockquote>{sample.prompt}</blockquote>
                  <h4>Replace or add</h4>
                  <ul>
                    {sample.variables.map((variable) => (
                      <li key={variable}>{variable}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>

          <section>
            <h2>How to customise them</h2>
            <ul className="checked-list">
              {collection.customisationTips.map((tip) => (
                <li key={tip}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Responsible use</h2>
            <ul className="checked-list">
              {collection.responsibleUse.map((tip) => (
                <li key={tip}>
                  <CheckCircle2 size={18} aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="article-cta prompt-product-cta">
            <p>Complete collection</p>
            <h2>Get all 100 security manager prompts</h2>
            <p>
              The complete {product.name} download includes the full prompt pack and 25
              practical security manager AI use cases. These public samples are intentionally
              limited so the paid resource keeps its value.
            </p>
            <Link href="/#pricing">View the complete prompt pack</Link>
          </section>

          <section>
            <h2>Related prompt collections</h2>
            <div className="related-link-grid">
              {relatedCollections.map((related) => (
                <Link key={related.slug} href={`/prompts/${related.slug}`}>
                  {related.h1}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2>Related guides</h2>
            <div className="related-link-grid">
              {relatedPosts.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`}>
                  {item.label}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
