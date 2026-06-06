import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { product } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for purchasing the 100 AI Prompts for Security Managers digital PDF.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms-and-conditions" },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero">
          <h1>Terms & Conditions</h1>
          <p>Starter purchase terms for this digital product.</p>
        </section>
        <section className="legal-content">
          <p>Last updated: 6 June 2026</p>
          <h2>Digital product</h2>
          <p>
            {product.name} is sold as a downloadable PDF. After successful
            payment, you receive access to the download page.
          </p>
          <h2>Payment terms</h2>
          <p>
            The launch price is {product.price} as a one-time payment processed
            through Stripe Checkout. There are no subscriptions, memberships,
            accounts or dashboards.
          </p>
          <h2>Permitted use</h2>
          <p>
            The product is provided for personal professional use by the
            purchaser. You may use the prompts in your own security management
            work. You may not resell, republish, distribute or claim ownership of
            the PDF or its contents.
          </p>
          <h2>Intellectual property</h2>
          <p>
            The PDF, website copy and related materials remain the intellectual
            property of the creator unless otherwise stated.
          </p>
          <h2>Download rights</h2>
          <p>
            Download access is provided after purchase. If you experience a
            technical issue, contact support with your purchase details.
          </p>
          <h2>Limitation of liability</h2>
          <p>
            The product is educational and operational support material. It does
            not replace professional judgement, company policy, legal advice or
            site-specific procedures.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
