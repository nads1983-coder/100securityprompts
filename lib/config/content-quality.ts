import type { Platform } from "@/lib/types";

export const phaseOneDraftOnly = true;

export const contentQualityPrinciples = [
  "original insight",
  "observational depth",
  "practical, operational, or psychological nuance",
  "real-world leadership under pressure",
  "communication clarity during tension",
  "emotionally controlled authority",
  "specific examples and consequences",
  "high variation between platform outputs",
];

export const genericContentSignals = [
  "unlock your potential",
  "level up",
  "crush your goals",
  "game changer",
  "thought leader",
  "10x",
  "hustle",
  "boss babe",
  "mindset shift",
  "just believe",
  "dream big",
  "take your seat at the table",
  "lean in",
  "empower your team",
  "drive results",
  "move the needle",
  "synergy",
  "best practices",
  "actionable insights",
  "in today's fast-paced world",
  "now more than ever",
  "the key is",
  "at the end of the day",
];

export const platformWritingGuidance: Record<Platform, string> = {
  linkedin:
    "Observational, experience-led, tension-driven, realistic workplace dynamics, emotionally intelligent, no listicle-style cadence.",
  medium:
    "Deep analysis with hierarchy, semantic richness, original perspective, practical examples, and minimum depth before publication.",
  kit:
    "Newsletter-style but not chatty filler: one sharp observation, one grounded example, one useful reflection or next question.",
  instagram:
    "Emotionally concise, identity-driven, relatable, visually quotable, simplified but not shallow.",
  tiktok:
    "Immediate tension, fast insight delivery, emotionally relevant, concise and sharp, no success-mindset phrasing.",
  x:
    "Compressed but specific: one pressure-tested idea, one concrete consequence, no vague motivational punchline.",
  youtube:
    "Search-aware, authority-building, retention-focused, layered insight progression, strong opening tension.",
  internal_blog:
    "Authority-led article draft with operational examples, semantic relevance, and no filler introduction or conclusion.",
};

export const internalEvaluationRubric = [
  "originality",
  "specificity",
  "depth",
  "realism",
  "platform fit",
  "repetition risk",
  "emotional authenticity",
  "AI-detection risk",
  "semantic value",
  "authority level",
];
