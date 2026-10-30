import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { navItems, product } from "@/lib/site/content";
import { TrackedLink } from "@/components/site/tracked-link";

export function SiteHeader() {
  return (
    <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <header className="site-header">
      <Link className="brand" href="/" aria-label={`${product.brand} home`}>
        <span className="brand-mark" aria-hidden="true">
          <ShieldCheck size={21} />
        </span>
        <span>100 Security Prompts<small>Part of PIERNEXA</small></span>
      </Link>
      <nav aria-label="Main navigation">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <TrackedLink
        className="nav-cta"
        eventName="Purchase CTA Click"
        href={product.stripePaymentLink}
      >
        Get Access
      </TrackedLink>
    </header>
    </>
  );
}
