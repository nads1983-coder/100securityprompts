import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  audiences,
  faqs,
  includedItems,
  product,
  samplePrompts,
  siteUrl,
} from "@/lib/site/content";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { TrackedLink } from "@/components/site/tracked-link";

export const metadata: Metadata = {
  title: "AI Prompts for Security Managers | 100SecurityPrompts.com",
  description:
    "100 practical ChatGPT prompts for security managers and supervisors. Save time on reports, handovers, risk assessments, client updates and security operations.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Prompts for Security Managers",
    description:
      "100 practical ChatGPT prompts for security managers and supervisors, plus 25 real-world AI use cases.",
    url: siteUrl,
    type: "website",
    images: ["/images/security-prompts-concept.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompts for Security Managers",
    description:
      "100 practical ChatGPT prompts for security managers and supervisors.",
    images: ["/images/security-prompts-concept.png"],
  },
};

const benefits = [
  "Turn rough shift notes into professional reports faster.",
  "Improve consistency across handovers, briefings and client updates.",
  "Strengthen leadership communication without starting from a blank page.",
  "Create clearer action lists after incidents, investigations and reviews.",
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      "A downloadable PDF of 100 practical ChatGPT prompts for security managers and supervisors, plus 25 real-world AI use cases.",
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: "19",
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      url: siteUrl,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: product.brand,
    url: siteUrl,
    contactPoint: {
      "@type": "ContactPoint",
      email: product.supportEmail,
      contactType: "customer support",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Nadine Pierre",
    jobTitle: "Security management practitioner",
    description:
      "Former Metropolitan Police Officer with 12+ years policing experience, plus security supervisor and security manager experience.",
  },
];

export default function HomePage() {
  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SiteHeader />
      <main>
        <section className="hero section-shell">
          <div className="hero-copy">
            <h1>{product.headline}</h1>
            <p className="hero-subheadline">{product.subheadline}</p>
            <div className="hero-actions">
              <TrackedLink
                className="button button-primary"
                eventName="Purchase CTA Click"
                href={product.stripePaymentLink}
              >
                Get Instant Access - {product.price}
                <ArrowRight size={18} aria-hidden="true" />
              </TrackedLink>
              <TrackedLink
                className="button button-secondary"
                eventName="View Sample Prompts"
                href="#samples"
              >
                View Sample Prompts
              </TrackedLink>
            </div>
            <div className="trust-strip" aria-label="Purchase details">
              <span>
                <LockKeyhole size={16} aria-hidden="true" />
                Stripe secure checkout
              </span>
              <span>No subscriptions</span>
              <span>Instant PDF download</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Product preview">
            <Image
              src="/images/security-prompts-concept.png"
              alt="Premium black and gold preview of 100 AI Prompts for Security Managers"
              width={900}
              height={900}
              priority
            />
          </div>
        </section>

        <section className="problem-band">
          <div className="section-shell split-section">
            <div>
              <h2>Security managers are expected to write clearly under pressure.</h2>
            </div>
            <div className="prose-block">
              <p>
                Reports, handovers, investigations, client updates and risk
                reviews all need calm structure and professional language. The
                problem is not a lack of knowledge. It is the time lost turning
                operational notes into clear communication.
              </p>
              <p>
                This toolkit gives security professionals copy-and-paste AI
                prompts for the work they already do every week.
              </p>
            </div>
          </div>
        </section>

        <section id="included" className="section-shell">
          <div className="section-heading">
            <h2>What&apos;s included</h2>
            <p>
              A focused security manager toolkit for incident reporting,
              investigations, handovers, leadership and operations.
            </p>
          </div>
          <div className="included-grid">
            {includedItems.map((item) => (
              <div className="included-item" key={item}>
                <CheckCircle2 size={19} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="samples" className="sample-section">
          <div className="section-shell">
            <div className="section-heading">
              <h2>Sample prompt previews</h2>
              <p>
                The full PDF includes prompts written for practical security
                management tasks, not generic office productivity.
              </p>
            </div>
            <div className="sample-grid">
              {samplePrompts.map((sample) => (
                <article className="prompt-card" key={sample.title}>
                  <FileText size={22} aria-hidden="true" />
                  <h3>{sample.title}</h3>
                  <p>{sample.prompt}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell audience-section">
          <div className="section-heading">
            <h2>Who it&apos;s for</h2>
            <p>
              Built for the people responsible for frontline standards,
              reporting quality, client confidence and operational continuity.
            </p>
          </div>
          <div className="audience-list">
            {audiences.map((audience) => (
              <span key={audience}>{audience}</span>
            ))}
          </div>
        </section>

        <section className="benefits-band">
          <div className="section-shell benefit-layout">
            <div>
              <h2>Use AI without losing operational judgement.</h2>
              <p>
                The prompts help you structure work faster while keeping the
                security manager in control of facts, decisions and final
                approval.
              </p>
            </div>
            <div className="benefit-list">
              {benefits.map((benefit) => (
                <div key={benefit}>
                  <ClipboardCheck size={20} aria-hidden="true" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell about-strip">
          <div className="creator-card">
            <ShieldCheck size={34} aria-hidden="true" />
            <div>
              <h2>Created from real-world security and policing experience.</h2>
              <p>
                Built by a former Metropolitan Police Officer with 12+ years
                policing experience, plus Security Supervisor, Security Manager,
                operational leadership and corporate security experience.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing-band">
          <div className="pricing-panel">
            <div>
              <h2>{product.name}</h2>
              <p>
                Includes {product.bonus}. One payment. No subscriptions. No
                accounts. No dashboard.
              </p>
            </div>
            <div className="price-stack">
              <strong>{product.price}</strong>
              <TrackedLink
                className="button button-primary"
                eventName="Purchase CTA Click"
                href={product.stripePaymentLink}
              >
                Get Instant Access - {product.price}
                <ArrowRight size={18} aria-hidden="true" />
              </TrackedLink>
              <span>Secure payment via Stripe Checkout</span>
            </div>
          </div>
        </section>

        <section className="section-shell faq-section">
          <div className="section-heading">
            <h2>FAQ</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <Sparkles size={30} aria-hidden="true" />
          <h2>Start using AI for security management work today.</h2>
          <p>
            Get the launch PDF and use the prompts for reports, handovers,
            risk assessments, team communication and client updates.
          </p>
          <TrackedLink
            className="button button-primary"
            eventName="Purchase CTA Click"
            href={product.stripePaymentLink}
          >
            Get Instant Access - {product.price}
            <ArrowRight size={18} aria-hidden="true" />
          </TrackedLink>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
