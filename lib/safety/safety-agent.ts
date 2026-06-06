import "server-only";

import { findRecentContent } from "@/lib/db/repository";
import { genericContentSignals, internalEvaluationRubric } from "@/lib/config/content-quality";
import { hashContent, normalizeContent, similarityScore } from "@/lib/utils/hash";
import type { AutomationSettings, Brand, Platform, SafetyResult } from "@/lib/types";

const unsafePatterns = [
  /guarantee(d)?\s+(rank|ranking|traffic|revenue)/i,
  /buy\s+backlinks/i,
  /fake\s+(review|testimonial|engagement|followers)/i,
  /mass\s+(comment|dm|outreach)/i,
  /scrape\s+private/i,
  /black[-\s]?hat/i,
];

export async function validateContent({
  brand,
  platform,
  title,
  body,
  settings,
}: {
  brand: Brand;
  platform: Platform | null;
  title: string;
  body: string;
  settings: AutomationSettings;
}): Promise<SafetyResult & { contentHash: string }> {
  const combined = `${title}\n${body}`;
  const normalized = normalizeContent(combined);
  const contentHash = hashContent(combined);
  const recent = await findRecentContent(80);
  const duplicateRisk = Math.max(0, ...recent.map((item) => similarityScore(combined, `${item.title}\n${item.body}`)));
  const blockedPhrases = settings.blockedPhrases.filter((phrase) => normalized.includes(normalizeContent(phrase)));
  const genericSignals = genericContentSignals.filter((phrase) => normalized.includes(normalizeContent(phrase)));
  const reasons: string[] = [];

  if (blockedPhrases.length > 0) reasons.push(`Blocked phrase detected: ${blockedPhrases.join(", ")}`);
  if (genericSignals.length > 0) reasons.push(`Generic or cliché phrasing detected: ${genericSignals.join(", ")}`);
  if (unsafePatterns.some((pattern) => pattern.test(combined))) reasons.push("Unsafe automation or SEO claim detected.");
  if (duplicateRisk >= 0.62) reasons.push("Duplicate or repetitive wording risk is too high.");
  if (body.length < 220) reasons.push("Content is too thin to approve; it needs more specificity, consequence, or example.");
  if ((body.match(/#/g) ?? []).length > 5) reasons.push("Too many hashtags for premium authority content.");
  if (/\b(three|3|five|5|seven|7)\s+(tips|ways|steps|hacks|secrets)\b/i.test(combined)) {
    reasons.push("Listicle-style hook detected; rewrite with a more observational structure.");
  }
  if (!/\b(for example|a practical example|when|if|because|the risk|the consequence|what happens)\b/i.test(combined)) {
    reasons.push("Content lacks practical realism, consequence, or situational detail.");
  }
  if (!combined.toLowerCase().includes(brand.split(".")[0].replace("get", "")) && platform === "medium") {
    reasons.push("Long-form draft should include clearer brand/entity context.");
  }

  let qualityScore = 88;
  qualityScore -= blockedPhrases.length * 20;
  qualityScore -= genericSignals.length * 10;
  qualityScore -= unsafePatterns.some((pattern) => pattern.test(combined)) ? 35 : 0;
  qualityScore -= Math.round(duplicateRisk * 30);
  qualityScore -= body.length < 220 ? 20 : 0;
  qualityScore -= reasons.some((reason) => reason.includes("practical realism")) ? 15 : 0;
  qualityScore = Math.max(0, Math.min(100, qualityScore));

  const status = reasons.some((reason) => reason.includes("Unsafe") || reason.includes("Blocked phrase") || reason.includes("Duplicate") || reason.includes("Generic"))
    ? "blocked"
    : qualityScore < 75
      ? "needs_review"
      : "approved";

  return {
    status,
    qualityScore,
    reasons:
      reasons.length > 0
        ? reasons
        : [`Passed safety and quality checks: ${internalEvaluationRubric.join(", ")}.`],
    blockedPhrases,
    duplicateRisk,
    contentHash,
  };
}
