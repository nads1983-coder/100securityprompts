import "server-only";

import { z } from "zod";
import { brandProfiles } from "@/lib/config/brands";
import { runStructuredPrompt } from "@/lib/agents/openai";
import type { SeoOpportunity, StrategyPlan } from "@/lib/types";

const opportunitySchema = z.object({
  opportunities: z.array(
    z.object({
      opportunity_type: z.enum(["backlink", "brand_mention", "guest_post", "collaboration", "podcast", "entity_seo"]),
      title: z.string(),
      target: z.string(),
      rationale: z.string(),
      priority_score: z.number(),
    }),
  ),
});

export async function generateSeoOpportunities(strategy: StrategyPlan): Promise<Array<Omit<SeoOpportunity, "id" | "created_at" | "status" | "run_id">>> {
  const profile = brandProfiles[strategy.brand];
  const fallback = {
    opportunities: [
      {
        opportunity_type: "backlink" as const,
        title: `${profile.displayName} resource mention for ${strategy.topicFocus}`,
        target: "Relevant industry newsletters, leadership blogs, and roundup posts",
        rationale: "Look for reputable pages already curating expert resources on the topic and pitch a genuinely useful article or framework.",
        priority_score: 82,
      },
      {
        opportunity_type: "podcast" as const,
        title: `${profile.displayName} podcast angle`,
        target: "Founder, leadership, AI strategy, or creator economy podcasts",
        rationale: "Pitch a specific conversation angle tied to lived expertise, not a generic founder story.",
        priority_score: 74,
      },
      {
        opportunity_type: "entity_seo" as const,
        title: `Strengthen entity associations for ${strategy.topicFocus}`,
        target: "Owned profiles, author bios, Medium, LinkedIn, YouTube descriptions",
        rationale: "Use consistent entity language across profiles so AI search systems connect the brand with its authority pillars.",
        priority_score: 88,
      },
    ],
  };

  const result = await runStructuredPrompt({
    name: "seo_opportunities",
    schema: opportunitySchema,
    fallback,
    prompt: [
      "You are the SEO Agent for a safe off-page SEO automation OS.",
      "Generate legitimate authority opportunities only. No scraping private data, cold spam, fake engagement, or black-hat SEO.",
      `Brand profile: ${JSON.stringify(profile)}`,
      `Daily strategy: ${JSON.stringify(strategy)}`,
      "Return backlink, collaboration, podcast, brand mention, guest post, and entity SEO opportunities where relevant.",
    ].join("\n"),
  });

  return result.opportunities.map((opportunity) => ({
  brand: strategy.brand,
  ...opportunity,
}));
}
