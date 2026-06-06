import "server-only";

import { z } from "zod";
import { brandContentRoutes } from "@/lib/config/brand-routing";
import { brandProfiles, brands } from "@/lib/config/brands";
import { findRecentContent } from "@/lib/db/repository";
import { runStructuredPrompt } from "@/lib/agents/openai";
import type { Brand, ContentType, Platform, StrategyPlan } from "@/lib/types";

const strategySchema = z.object({
  brand: z.enum(brands as [Brand, ...Brand[]]),
  topicFocus: z.string(),
  distributionFocus: z.array(z.enum(["linkedin", "medium", "kit", "instagram", "tiktok", "x", "youtube", "internal_blog"])),
  contentTypes: z.array(
    z.enum([
      "linkedin_post",
      "tiktok_caption",
      "instagram_caption",
      "youtube_short_metadata",
      "medium_article",
      "newsletter_snippet",
      "founder_authority_post",
      "ai_search_article",
      "script_template",
      "seo_opportunity",
    ]),
  ),
  rationale: z.string(),
  antiRepetitionNotes: z.array(z.string()),
});

export async function selectDailyStrategy(enabledBrands: Brand[]): Promise<StrategyPlan> {
  const recent = await findRecentContent(50);
  const recentByBrand = new Map<Brand, number>();
  for (const brand of enabledBrands) recentByBrand.set(brand, 0);
  for (const item of recent) {
    recentByBrand.set(item.brand, (recentByBrand.get(item.brand) ?? 0) + 1);
  }

  const fallbackBrand = [...recentByBrand.entries()].sort((a, b) => a[1] - b[1])[0]?.[0] ?? "leadwithnadine.com";
  const profile = brandProfiles[fallbackBrand];
  const fallback: StrategyPlan = {
    brand: fallbackBrand,
    topicFocus: profile.authorityPillars[new Date().getDay() % profile.authorityPillars.length],
    distributionFocus: brandContentRoutes[fallbackBrand].distributionFocus,
    contentTypes: brandContentRoutes[fallbackBrand].contentTypes,
    rationale: `Rotating toward ${profile.displayName} because it has the lowest recent content volume.`,
    antiRepetitionNotes: recent.slice(0, 8).map((item) => `${item.brand}: avoid repeating ${item.title}`),
  };

  return runStructuredPrompt({
    name: "daily_strategy",
    schema: strategySchema,
    fallback,
    prompt: [
      "You are the Strategy Agent for a private off-page SEO automation OS.",
      "Choose one daily brand focus, one topic focus, platform focus, and content types.",
      "Avoid repetition, spam, fake claims, and generic content.",
      `Enabled brands: ${enabledBrands.join(", ")}`,
      `Brand profiles: ${JSON.stringify(enabledBrands.map((brand) => brandProfiles[brand]))}`,
      `Brand routing: ${JSON.stringify(Object.fromEntries(enabledBrands.map((brand) => [brand, brandContentRoutes[brand]])))}`,
      `Recent content: ${JSON.stringify(recent.slice(0, 20).map((item) => ({ brand: item.brand, title: item.title, type: item.content_type })))}`,
    ].join("\n"),
  }) as Promise<StrategyPlan & { distributionFocus: Platform[]; contentTypes: ContentType[] }>;
}
