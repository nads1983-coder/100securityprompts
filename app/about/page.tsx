import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/site/breadcrumb-json-ld";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { product } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "About 100SecurityPrompts.com and the real-world security management experience behind the AI prompt toolkit.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <SiteHeader />
      <main className="content-page">
        <section className="page-hero">
          <h1>About {product.brand}</h1>
          <p>
            Practical AI resources for security managers, supervisors and
            operational leaders who need clear reporting, better handovers and
            stronger communication.
          </p>
        </section>
        <section className="legal-content">
          <h2>Built from operational experience</h2>
          <p>
            100 Security Prompts was created from real-world experience as a
            former Metropolitan Police Officer with 12+ years policing
            experience, plus Security Supervisor, Security Manager, operational
            leadership and corporate security experience.
          </p>
          <p>
            The goal is simple: help security professionals use AI in a
            practical, responsible way for the written work that already sits
            inside security operations.
          </p>
          <h2>What the product is</h2>
          <p>
            {product.name} is a downloadable PDF containing practical ChatGPT
            prompts for incident reports, investigations, shift handovers, risk
            assessments, leadership communication, client updates and emergency
            response planning.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
