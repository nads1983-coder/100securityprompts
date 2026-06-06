export type Brand =
  | "nadinepierre.com"
  | "leadwithnadine.com"
  | "getstratiq.co"
  | "getcontentos.co"
  | "calmauthority.co";

export type Platform =
  | "linkedin"
  | "medium"
  | "kit"
  | "instagram"
  | "tiktok"
  | "x"
  | "youtube"
  | "internal_blog";

export type ContentType =
  | "linkedin_post"
  | "tiktok_caption"
  | "instagram_caption"
  | "youtube_short_metadata"
  | "medium_article"
  | "newsletter_snippet"
  | "founder_authority_post"
  | "ai_search_article"
  | "script_template"
  | "seo_opportunity";

export type RunStatus = "running" | "completed" | "failed" | "skipped";
export type QueueStatus = "queued" | "published" | "failed" | "skipped" | "blocked";
export type SafetyStatus = "approved" | "needs_review" | "blocked";

export interface BrandProfile {
  brand: Brand;
  displayName: string;
  positioning: string;
  voice: string;
  authorityPillars: string[];
  coreTopics: string[];
  audience: string;
  ctaOptions: string[];
  defaultCadence: string[];
}

export interface PlatformConfig {
  platform: Platform;
  label: string;
  envKeys: string[];
  defaultEnabled: boolean;
  maxPostsPerDay: number;
  cooldownHours: number;
}

export interface AgentRun {
  id: string;
  status: RunStatus;
  brand: Brand | null;
  started_at: string;
  completed_at: string | null;
  summary: Record<string, unknown>;
  failure_reason: string | null;
}

export interface StrategyPlan {
  brand: Brand;
  topicFocus: string;
  distributionFocus: Platform[];
  contentTypes: ContentType[];
  rationale: string;
  antiRepetitionNotes: string[];
}

export interface GeneratedContent {
  id: string;
  run_id: string;
  brand: Brand;
  platform: Platform | null;
  content_type: ContentType;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  quality_score: number;
  safety_status: SafetyStatus;
  safety_reasons: string[];
  content_hash: string;
  status: QueueStatus;
  created_at: string;
}

export interface SeoOpportunity {
  id: string;
  run_id: string;
  brand: Brand;
  opportunity_type: "backlink" | "brand_mention" | "guest_post" | "collaboration" | "podcast" | "entity_seo";
  title: string;
  target: string;
  rationale: string;
  priority_score: number;
  status: QueueStatus;
  created_at: string;
}

export interface SafetyResult {
  status: SafetyStatus;
  qualityScore: number;
  reasons: string[];
  blockedPhrases: string[];
  duplicateRisk: number;
}

export interface PublishResult {
  status: QueueStatus;
  platform: Platform;
  publishedUrl?: string;
  failureReason?: string;
  skippedReason?: string;
}

export interface AutomationSettings {
  emergencyPaused: boolean;
  autopublishEnabled: boolean;
  maxPostsPerDay: number;
  maxPostsPerPlatformPerDay: number;
  retryLimit: number;
  blockedPhrases: string[];
  platformEnabled: Record<Platform, boolean>;
  brandEnabled: Record<Brand, boolean>;
}

export interface DashboardSnapshot {
  settings: AutomationSettings;
  latestRun: AgentRun | null;
  runs: AgentRun[];
  generatedContent: GeneratedContent[];
  publishingQueue: GeneratedContent[];
  publishedPosts: PublishResult[];
  seoOpportunities: SeoOpportunity[];
  platformCredentials: Array<{ platform: Platform; configured: boolean; enabled: boolean; missingKeys: string[] }>;
  weeklyReports: Array<{ id: string; week_start: string; week_end: string; summary: Record<string, unknown> }>;
  logs: Array<{ id: string; level: string; message: string; created_at: string }>;
}
