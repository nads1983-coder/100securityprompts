import type { MetadataRoute } from "next";
import { blogPosts, siteUrl } from "@/lib/site/content";
import { promptCollections } from "@/lib/site/prompt-collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-08-16");
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/blog",
    "/prompts",
    "/recommended-security-essentials",
    "/sitemap.html",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: path === "" || path === "/blog" ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updated || post.published),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...promptCollections.map((collection) => ({
      url: `${siteUrl}/prompts/${collection.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.82,
    })),
  ];
}
