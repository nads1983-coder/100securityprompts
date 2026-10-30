import Link from "next/link";
import { product } from "@/lib/site/content";

const footerLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Prompts", "/prompts"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms & Conditions", "/terms-and-conditions"],
  ["Refund Policy", "/refund-policy"],
  ["Blog", "/blog"],
  ["Recommended Essentials", "/recommended-security-essentials"],
  ["Sitemap", "/sitemap.html"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="eyebrow">Part of the PIERNEXA portfolio</p>
        <strong>100 Security Prompts</strong>
        <p>
          Practical AI prompts and security management tools for supervisors,
          managers and operational leaders.
        </p>
      </div>
      <div className="footer-links">
        {footerLinks.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>
      <p className="footer-note">
        Payments are processed by Stripe. Card details are not stored by
        {` ${product.brand}`}. (c) 2026 {product.brand}
      </p>
    </footer>
  );
}
