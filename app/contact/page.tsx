import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { product } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact 100SecurityPrompts.com for support with the AI prompts for security managers PDF.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero">
          <h1>Contact</h1>
          <p>
            Need help with checkout, downloading the PDF or permissions for team
            use? Use the support email below.
          </p>
        </section>
        <section className="legal-content">
          <h2>Support</h2>
          <p>
            Email:{" "}
            <a href={`mailto:${product.supportEmail}`}>{product.supportEmail}</a>
          </p>
          <p>
            If your message relates to a purchase, include the email address
            used at Stripe Checkout and the approximate purchase date.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
