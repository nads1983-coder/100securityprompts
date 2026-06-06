import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { product } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Refund policy for the 100 AI Prompts for Security Managers downloadable PDF.",
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Refund Policy", path: "/refund-policy" },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero">
          <h1>Refund Policy</h1>
          <p>A clear and fair policy for a downloadable digital product.</p>
        </section>
        <section className="legal-content">
          <p>Last updated: 6 June 2026</p>
          <h2>Digital product access</h2>
          <p>
            Because {product.name} is a downloadable digital product, refunds
            are generally not available once the PDF has been accessed or
            downloaded.
          </p>
          <h2>When we will help</h2>
          <p>
            If you purchased by mistake, were charged incorrectly, or cannot
            access the download, contact support as soon as possible. We will
            review the issue fairly and help resolve technical access problems.
          </p>
          <h2>Contact</h2>
          <p>
            Email{" "}
            <a href={`mailto:${product.supportEmail}`}>{product.supportEmail}</a>{" "}
            with the email used at checkout and your purchase date.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
