import type { Metadata } from "next";
import { Download, Mail } from "lucide-react";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { TrackedLink } from "@/components/site/tracked-link";
import { product } from "@/lib/site/content";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Download page for your purchased PDF.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  const downloads = [
    {
      title: "100 AI Prompts for Security Managers",
      detail: "Main product PDF",
      href: "/downloads/100-ai-prompts-for-security-managers.pdf",
      eventName: "Download Main PDF",
    },
    {
      title: "25 Real-World Security Manager AI Use Cases",
      detail: "Bonus PDF",
      href: "/downloads/25-real-world-security-manager-ai-use-cases-bonus.pdf",
      eventName: "Download Bonus PDF",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="content-page download-page">
        <section className="page-hero">
          <h1>Thank you for your purchase.</h1>
          <p>
            Your PDFs are ready to download. Keep this page private and save the
            files somewhere secure.
          </p>
          <div className="download-list">
            {downloads.map((item) => (
              <div className="download-card" key={item.href}>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.detail}</p>
                </div>
                <TrackedLink
                  className="button button-primary"
                  eventName={item.eventName}
                  href={item.href}
                  download
                >
                  <Download size={18} aria-hidden="true" />
                  Download PDF
                </TrackedLink>
              </div>
            ))}
          </div>
        </section>
        <section className="download-support">
          <Mail size={20} aria-hidden="true" />
          <p>
            Trouble accessing the file? Email{" "}
            <a href={`mailto:${product.supportEmail}`}>{product.supportEmail}</a>{" "}
            with your purchase details.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
