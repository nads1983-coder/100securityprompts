import type { MetadataRoute } from "next";
import { blogPosts, siteUrl } from "@/lib/site/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/refund-policy",
    "/blog",
    "/insights",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date("2026-06-06"),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/insights/${post.slug}`,
      lastModified: new Date(post.published),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
