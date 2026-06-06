import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { product } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for 100SecurityPrompts.com covering Stripe payments, cookies, analytics and UK/GDPR considerations.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero">
          <h1>Privacy Policy</h1>
          <p>Starter privacy information for visitors and customers.</p>
        </section>
        <section className="legal-content">
          <p>Last updated: 6 June 2026</p>
          <h2>Information we collect</h2>
          <p>
            We may collect contact information you send to us, purchase-related
            information needed to provide support, and basic website usage data.
          </p>
          <h2>Stripe payment processing</h2>
          <p>
            Payments are processed by Stripe. We do not store card details.
            Stripe may process personal data according to its own privacy policy
            and payment processing terms.
          </p>
          <h2>Cookies and analytics</h2>
          <p>
            This website may use essential cookies and basic analytics to
            understand site performance and improve the product. If analytics
            are added, they should be configured with appropriate privacy
            controls.
          </p>
          <h2>UK/GDPR considerations</h2>
          <p>
            If UK GDPR or GDPR applies, you may have rights to access, correct,
            delete or restrict the processing of your personal data. Contact us
            to make a privacy request.
          </p>
          <h2>Contact</h2>
          <p>
            Privacy questions can be sent to{" "}
            <a href={`mailto:${product.supportEmail}`}>{product.supportEmail}</a>.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
