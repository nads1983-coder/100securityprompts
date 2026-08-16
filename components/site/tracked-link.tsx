"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

declare global {
  interface Window {
    nadineAnalytics?: {
      track: (eventName: string, properties?: Record<string, string | number | boolean>) => void;
    };
  }
}

type TrackedLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  children: ReactNode;
};

export function TrackedLink({
  eventName,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        if (/purchase|access|checkout/i.test(eventName)) {
          window.nadineAnalytics?.track("checkout_started", {
            productId: "100-security-prompts",
            ctaId: "get_access",
            value: 9,
            currency: "GBP"
          });
        } else {
          window.nadineAnalytics?.track("cta_clicked", {
            ctaId: eventName.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 80)
          });
        }
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
