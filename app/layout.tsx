import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import localFont from "next/font/local";
import { product, siteUrl } from "@/lib/site/content";
import "./globals.css";

const bodyFont = localFont({ src: "../public/fonts/dm-sans-regular.ttf", variable: "--font-body", display: "swap" });
const headingFont = localFont({ src: "../public/fonts/space-grotesk-semibold.ttf", variable: "--font-heading", display: "swap", weight: "600" });

const nadineAnalyticsSiteId = process.env.NEXT_PUBLIC_NADINE_ANALYTICS_SITE_ID;
const nadineAnalyticsTrackingKey = process.env.NEXT_PUBLIC_NADINE_ANALYTICS_TRACKING_KEY;
const nadineAnalyticsEndpoint = process.env.NEXT_PUBLIC_NADINE_ANALYTICS_ENDPOINT ?? "https://nadine-analytics.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AI Prompts for Security Managers | 100SecurityPrompts.com",
    template: "%s | 100SecurityPrompts.com",
  },
  description:
    "Download practical ChatGPT prompts and AI tools for security managers, supervisors and corporate security teams.",
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
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        {children}
        {nadineAnalyticsSiteId && nadineAnalyticsTrackingKey ? (
          <Script
            id="nadine-analytics"
            src={`${nadineAnalyticsEndpoint}/tracker.js`}
            data-site-id={nadineAnalyticsSiteId}
            data-tracking-key={nadineAnalyticsTrackingKey}
            data-endpoint={`${nadineAnalyticsEndpoint}/api/events`}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
