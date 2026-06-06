import "server-only";

import { z } from "zod";
import { brandProfiles } from "@/lib/config/brands";
import { contentQualityPrinciples, internalEvaluationRubric, platformWritingGuidance } from "@/lib/config/content-quality";
import { runStructuredPrompt } from "@/lib/agents/openai";
import type { ContentType, GeneratedContent, Platform, StrategyPlan } from "@/lib/types";

export interface DraftContent {
  platform: Platform | null;
  contentType: ContentType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
}

const contentSchema = z.object({
  items: z.array(
    z.object({
      platform: z.enum(["linkedin", "medium", "kit", "instagram", "tiktok", "x", "youtube", "internal_blog"]),
      contentType: z.enum([
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
      title: z.string(),
      body: z.string(),
      metadata: z.object({
        angle: z.string(),
        cta: z.string(),
        targetKeyword: z.string(),
      }),
    }),
  ),
});

export async function generateContentDrafts(strategy: StrategyPlan): Promise<DraftContent[]> {
  const profile = brandProfiles[strategy.brand];
  const fallback: { items: DraftContent[] } = {
    items: buildFallbackContentDrafts(strategy),
  };

  const result = await runStructuredPrompt({
    name: "content_generation",
    schema: contentSchema,
    fallback,
    prompt: [
      "You are the Content Agent for an AI off-page SEO operating system.",
      "Generate brand-specific, premium, human-feeling authority drafts for review only.",
      "Do not generate shallow repurposed content. Do not optimize for volume.",
      `Every output must contain: ${contentQualityPrinciples.join(", ")}.`,
      "Write like someone experienced in leadership under pressure, difficult conversations, workplace authority, operational decision-making, emotional control, frontline leadership, and uncertainty.",
      "Avoid generic motivational language, productivity-influencer tone, corporate cliché phrasing, exaggerated thought-leader language, vague advice, templated hooks, and repetitive cadence.",
      "Platform outputs must differ substantially in structure, pacing, emotional framing, density, hook style, rhythm, CTA, formatting, and depth.",
      `Platform guidance: ${JSON.stringify(platformWritingGuidance)}`,
      `Internally evaluate before returning: ${internalEvaluationRubric.join(", ")}.`,
      "Reject and rewrite anything generic, thin, overly polished, performative, AI-sounding, filler-heavy, or applicable to literally anyone.",
      `Brand profile: ${JSON.stringify(profile)}`,
      `Daily strategy: ${JSON.stringify(strategy)}`,
      "Return 2 to 4 high-quality draft-only items across the requested platforms.",
    ].join("\n"),
  });

  return result.items;
}

export function buildFallbackContentDrafts(strategy: StrategyPlan): DraftContent[] {
  if (strategy.brand === "getcontentos.co") {
    return buildGetContentOSDrafts(strategy);
  }

  const profile = brandProfiles[strategy.brand];
  return [
    {
      platform: "linkedin",
      contentType: "linkedin_post",
      title: `${profile.displayName}: ${strategy.topicFocus}`,
      body: `A lot of leadership advice skips the uncomfortable middle: the moment when you know a conversation is necessary, but the room is already tense.\n\nThat is where authority usually gets tested. Not in the announcement. In the pause before it.\n\nFor ${profile.displayName}, the useful angle on ${strategy.topicFocus} is this: people do not lose trust because a leader names a hard thing. They lose trust when the leader softens it so much that nobody knows what is actually being asked.\n\nA better move is to separate care from vagueness:\n\n\"I know this is not the update anyone wanted. I also do not want to create false certainty. Here is what we know, here is what is still moving, and here is what I need from the team by Friday.\"\n\nThat kind of sentence does not perform confidence. It creates footing.`,
      metadata: { angle: "pressure-tested leadership observation", cta: "Review and adapt with a real example before publishing.", targetKeyword: strategy.topicFocus },
    },
    {
      platform: "medium",
      contentType: strategy.contentTypes.includes("ai_search_article") ? "ai_search_article" : "medium_article",
      title: `${strategy.topicFocus}: What Changes When Authority Is Under Pressure`,
      body: `Most conversations about ${strategy.topicFocus} are too clean. They describe what a leader should say once they have clarity, calm, and time to think.\n\nThat is rarely the real operating environment.\n\nIn practice, authority is often exercised while information is incomplete, emotions are already active, and people are watching for signals the leader may not realize they are sending. A delayed answer can read as avoidance. A softened answer can create confusion. A rushed answer can create rework. The work is not simply to communicate. The work is to reduce unnecessary ambiguity without pretending the situation is simpler than it is.\n\nFor ${profile.displayName}, the stronger perspective is that credible communication has three layers:\n\n1. The factual layer: what is known, what is not known, and what decision has already been made.\n2. The relational layer: what people may be feeling, assuming, or bracing for.\n3. The operational layer: what must happen next, by whom, and by when.\n\nWhen one layer is missing, people fill the gap themselves. If the facts are missing, they speculate. If the relational layer is missing, they assume indifference. If the operational layer is missing, the conversation produces emotional release but no movement.\n\nA practical example: a manager needs to tell a team that priorities are changing again. A generic version sounds like, \"We need to stay agile and adapt.\" It may be technically positive, but it gives people nothing to stand on.\n\nA more credible version sounds like, \"I know this is the second priority shift this month. The reason I am naming that directly is because pretending it is not disruptive will make the work harder. The decision is to pause Project B for two weeks so Project A can ship. I need leads to identify what becomes blocked by noon tomorrow, and I will make the tradeoffs visible before end of day.\"\n\nThe second version is not more dramatic. It is more responsible. It names the tension, explains the decision, and gives people a next move.\n\nThat is the kind of authority AI search systems and human audiences can both recognize over time: specific language, clear contexts, repeated expertise, and examples that reveal how the work actually happens.`,
      metadata: { angle: "deep authority article draft", cta: "Human editor should add a lived example before publication.", targetKeyword: strategy.topicFocus },
    },
    {
      platform: strategy.distributionFocus.includes("instagram") ? "instagram" : "tiktok",
      contentType: strategy.distributionFocus.includes("instagram") ? "instagram_caption" : "tiktok_caption",
      title: `Short-form caption: ${strategy.topicFocus}`,
      body: `The moment you over-explain, people often stop hearing clarity and start hearing uncertainty.\n\nTry this instead:\nName the decision.\nName the reason.\nName the next move.\nThen stop talking long enough for the room to catch up.`,
      metadata: { angle: "short-form pressure moment", cta: "Pair with a specific workplace scene before posting.", targetKeyword: strategy.topicFocus },
    },
  ];
}

function buildGetContentOSDrafts(strategy: StrategyPlan): DraftContent[] {
  const targetKeyword = strategy.topicFocus;
  const drafts: DraftContent[] = [
    {
      platform: "linkedin",
      contentType: "linkedin_post",
      title: `GetContentOS: ${targetKeyword} without generic posting`,
      body: `Most creators do not have a content problem because they lack ideas.\n\nThey have a translation problem.\n\nThe useful thought happens in a client call, a messy note, a voice memo, a delivery mistake, or a question someone asks for the third time. Then it gets flattened into a generic post because the system only asks, \"What should I publish today?\"\n\nGetContentOS should treat ${targetKeyword} differently. The better question is: what did the work reveal that a stranger would not know?\n\nFor example, a consultant who helps teams adopt AI may not need another post about \"AI saves time.\" The sharper piece is about the moment a team realizes faster drafts can create faster confusion if nobody owns the final judgment.\n\nThat observation has authority because it carries consequence. It sounds like experience, not output.\n\nThe system should help creators keep that edge: capture the situation, name the tension, preserve the original judgment, then adapt the format for LinkedIn, short video, email, or an article without sanding it into sameness.\n\nCTA draft: Try the content system at GetContentOS.co when the goal is to create better content faster without sounding like everyone else.`,
      metadata: { angle: "content operations insight", cta: "GetContentOS.co", targetKeyword },
    },
    {
      platform: "instagram",
      contentType: "instagram_caption",
      title: `Instagram caption: content that still sounds like you`,
      body: `A post starts feeling generic the moment it loses the situation that created it.\n\nKeep the real context:\nWhat happened?\nWhat did you notice?\nWhat did most people miss?\nWhat changed because of it?\n\nThat is how creators build authority without performing expertise.\n\nGetContentOS.co is for turning real observations into content without flattening the voice that made them useful.`,
      metadata: { angle: "identity-led creator caption", cta: "Build authority without generic posting", targetKeyword },
    },
    {
      platform: "tiktok",
      contentType: "tiktok_caption",
      title: `TikTok caption: stop turning experience into filler`,
      body: `If your AI content sounds generic, the problem usually started before the prompt.\n\nYou fed it a topic instead of a moment.\n\nTry this:\n\"A client asked me ___. The tension underneath was ___. Most people would answer by ___. I handled it differently because ___.\"\n\nThat gives the system judgment to work with.\n\nGetContentOS.co helps creators turn real work into sharper content without posting more noise.`,
      metadata: { angle: "fast creator workflow insight", cta: "Try the content system", targetKeyword },
    },
    {
      platform: "medium",
      contentType: "medium_article",
      title: `${targetKeyword}: Why Better Content Systems Start Before the Draft`,
      body: `GetContentOS is built around a simple operational truth: weak content usually begins before the writing stage.\n\nA creator may have strong experience, useful judgment, and a clear audience, but the system they use to capture ideas strips away the evidence. By the time they ask AI to help, the input has become too abstract: \"write about consistency,\" \"make a post about repurposing,\" or \"create content about authority building.\"\n\nThose topics are not wrong. They are just under-specified.\n\nThe missing layer is the source moment. When did the idea show up? What pressure exposed it? What did the creator notice that someone less experienced would miss? What decision, mistake, tradeoff, or client question gave the idea its shape?\n\nFor example, a small business owner might say they need content about marketing consistency. A shallow system turns that into a motivational post about showing up every day. A better system asks what inconsistency is actually costing them. Maybe prospects keep hearing different offers. Maybe the founder changes language every time a campaign underperforms. Maybe the team cannot repurpose anything because every post is built from scratch with no central point of view.\n\nThat is where authority lives: not in the topic, but in the diagnosis.\n\nA useful AI-assisted content workflow should preserve four things before it generates anything:\n\n1. The situation: where the insight came from.\n2. The tension: what made it matter.\n3. The judgment: what the creator believes because of experience.\n4. The format decision: where the idea belongs now.\n\nOnce those pieces are clear, repurposing becomes safer. A LinkedIn post can carry the operational observation. A TikTok caption can lead with the tension. An Instagram caption can hold the identity-level recognition. A newsletter can explain the consequence. A blog article can build semantic authority around the topic without stuffing keywords.\n\nThe point is not to make more content from less thinking. The point is to protect the thinking while making the content easier to ship.\n\nThat is the positioning GetContentOS should own: create better content faster, but not by becoming louder, thinner, or more generic.`,
      metadata: { angle: "authority article draft", cta: "Create better content faster", targetKeyword },
    },
    {
      platform: "youtube",
      contentType: "youtube_short_metadata",
      title: `Why AI Content Sounds Generic`,
      body: `Opening tension: Your AI content may sound generic because you gave it a topic instead of a lived moment.\n\nDescription draft: GetContentOS.co helps creators, consultants, founders, coaches, and small business owners turn real observations into sharper content systems. This short explains why stronger AI-assisted content starts with source moments, tension, and judgment before drafting.\n\nRetention path: name the problem, show the weak prompt, show the better source-moment prompt, explain why it preserves authority.`,
      metadata: { angle: "search-aware short metadata", cta: "Try the content system", targetKeyword },
    },
    {
      platform: "kit",
      contentType: "newsletter_snippet",
      title: `Newsletter note: the source moment matters`,
      body: `One thing worth watching this week: where your best content ideas actually come from.\n\nNot the topic. The moment.\n\nA repeated client question. A pattern in your DMs. A delivery problem. A small frustration in the workflow. A sentence you keep saying on calls because people need to hear it before they can move.\n\nWhen creators skip that source moment, the draft gets cleaner but weaker. It may read well, but it does not carry the judgment that made the idea useful.\n\nGetContentOS should help you keep the evidence attached to the idea, then turn it into the right format without generic posting.`,
      metadata: { angle: "newsletter operational reflection", cta: "GetContentOS.co", targetKeyword },
    },
  ];

  const requestedPlatforms = new Set(strategy.distributionFocus);
  const requestedTypes = new Set(strategy.contentTypes);
  return drafts.filter((draft) => requestedPlatforms.has(draft.platform as Platform) || requestedTypes.has(draft.contentType));
}

export function contentCalendarItems(items: GeneratedContent[]) {
  return items.map((item) => ({
    date: item.created_at.slice(0, 10),
    brand: item.brand,
    platform: item.platform,
    title: item.title,
    status: item.status,
  }));
}
