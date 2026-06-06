import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { navItems, product } from "@/lib/site/content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label={`${product.brand} home`}>
        <span className="brand-mark" aria-hidden="true">
          <ShieldCheck size={21} />
        </span>
        <span>{product.brand}</span>
      </Link>
      <nav aria-label="Main navigation">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <a className="nav-cta" href={product.stripePaymentLink}>
        Get Access
      </a>
    </header>
  );
}
