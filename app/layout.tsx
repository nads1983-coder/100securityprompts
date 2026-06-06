import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { product, siteUrl } from "@/lib/site/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Prompts for Security Managers | 100SecurityPrompts.com",
    template: "%s | 100SecurityPrompts.com",
  },
  description:
    "Practical ChatGPT prompts and AI tools for security managers, supervisors and corporate security teams.",
  applicationName: product.brand,
  openGraph: {
    siteName: product.brand,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://plausible.io/js/pa-vqiuir9-us1k7wXEQEuzz.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </body>
    </html>
  );
}
