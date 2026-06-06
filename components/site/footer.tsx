import Link from "next/link";
import { product } from "@/lib/site/content";

const footerLinks = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms & Conditions", "/terms-and-conditions"],
  ["Refund Policy", "/refund-policy"],
  ["Blog", "/blog"],
] as const;

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{product.brand}</strong>
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
