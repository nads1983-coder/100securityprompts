import "server-only";

import { getDefaultAutomationSettings, platformCredentialStatus } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { id } from "@/lib/utils/hash";
import { brands } from "@/lib/config/brands";
import { platforms } from "@/lib/config/platforms";
import type {
  AgentRun,
  AutomationSettings,
  Brand,
  ContentType,
  DashboardSnapshot,
  GeneratedContent,
  Platform,
  PublishResult,
  QueueStatus,
  RunStatus,
  SafetyResult,
  SeoOpportunity,
} from "@/lib/types";

const memory = {
  settings: getDefaultAutomationSettings(),
  runs: [] as AgentRun[],
  generatedContent: [] as GeneratedContent[],
  seoOpportunities: [] as SeoOpportunity[],
  publishedPosts: [] as PublishResult[],
  weeklyReports: [] as Array<{ id: string; week_start: string; week_end: string; summary: Record<string, unknown> }>,
  logs: [] as Array<{ id: string; level: string; message: string; created_at: string }>,
};

function now() {
  return new Date().toISOString();
}

function serializeSettings(settings: AutomationSettings) {
  return {
    emergency_paused: settings.emergencyPaused,
    autopublish_enabled: settings.autopublishEnabled,
    max_posts_per_day: settings.maxPostsPerDay,
    max_posts_per_platform_per_day: settings.maxPostsPerPlatformPerDay,
    retry_limit: settings.retryLimit,
    blocked_phrases: settings.blockedPhrases,
    platform_enabled: settings.platformEnabled,
    brand_enabled: settings.brandEnabled,
  };
}

function deserializeSettings(row: Record<string, unknown> | null): AutomationSettings {
  const defaults = getDefaultAutomationSettings();
  if (!row) return defaults;
  const platformEnabled =
    typeof row.platform_enabled === "object" && row.platform_enabled !== null
      ? { ...defaults.platformEnabled, ...(row.platform_enabled as Partial<AutomationSettings["platformEnabled"]>) }
      : defaults.platformEnabled;
  const brandEnabled =
    typeof row.brand_enabled === "object" && row.brand_enabled !== null
      ? { ...defaults.brandEnabled, ...(row.brand_enabled as Partial<AutomationSettings["brandEnabled"]>) }
      : defaults.brandEnabled;
  return {
    emergencyPaused: Boolean(row.emergency_paused),
    autopublishEnabled: Boolean(row.autopublish_enabled),
    maxPostsPerDay: Number(row.max_posts_per_day ?? defaults.maxPostsPerDay),
    maxPostsPerPlatformPerDay: Number(row.max_posts_per_platform_per_day ?? defaults.maxPostsPerPlatformPerDay),
    retryLimit: Number(row.retry_limit ?? defaults.retryLimit),
    blockedPhrases: Array.isArray(row.blocked_phrases) ? (row.blocked_phrases as string[]) : defaults.blockedPhrases,
    platformEnabled,
    brandEnabled,
  };
}

export async function getAutomationSettings(): Promise<AutomationSettings> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return memory.settings;

  const { data, error } = await supabase.from("automation_settings").select("*").eq("id", "global").maybeSingle();
  if (error) {
    console.error("Failed to load automation settings", error);
    return memory.settings;
  }
  return deserializeSettings(data);
}

export async function saveAutomationSettings(settings: AutomationSettings) {
  memory.settings = settings;
  const supabase = getSupabaseAdmin();
  if (!supabase) return settings;

  const { error } = await supabase.from("automation_settings").upsert({
    id: "global",
    ...serializeSettings(settings),
    updated_at: now(),
  });
  if (error) throw new Error(error.message);
  return settings;
}

export async function createAgentRun(status: RunStatus = "running", brand: Brand | null = null): Promise<AgentRun> {
  const run: AgentRun = {
    id: id("run"),
    status,
    brand,
    started_at: now(),
    completed_at: null,
    summary: {},
    failure_reason: null,
  };
  memory.runs.unshift(run);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("agent_runs").insert(run);
    if (error) throw new Error(error.message);
  }
  return run;
}

export async function updateAgentRun(runId: string, update: Partial<AgentRun>) {
  const existing = memory.runs.find((run) => run.id === runId);
  if (existing) Object.assign(existing, update);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("agent_runs").update(update).eq("id", runId);
    if (error) throw new Error(error.message);
  }
}

export async function logAgent(runId: string | null, level: "info" | "warn" | "error", message: string, metadata = {}) {
  const row = { id: id("log"), run_id: runId, level, message, metadata, created_at: now() };
  memory.logs.unshift(row);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("agent_logs").insert(row);
  }
}

export async function saveGeneratedContent(input: {
  runId: string;
  brand: Brand;
  platform: Platform | null;
  contentType: ContentType;
  title: string;
  body: string;
  metadata?: Record<string, unknown>;
  safety: SafetyResult;
  contentHash: string;
  status: QueueStatus;
}): Promise<GeneratedContent> {
  const row: GeneratedContent = {
    id: id("content"),
    run_id: input.runId,
    brand: input.brand,
    platform: input.platform,
    content_type: input.contentType,
    title: input.title,
    body: input.body,
    metadata: input.metadata ?? {},
    quality_score: input.safety.qualityScore,
    safety_status: input.safety.status,
    safety_reasons: input.safety.reasons,
    content_hash: input.contentHash,
    status: input.status,
    created_at: now(),
  };
  memory.generatedContent.unshift(row);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("generated_content").insert(row);
    if (error) throw new Error(error.message);
    await supabase.from("safety_logs").insert({
      id: id("safety"),
      run_id: input.runId,
      content_id: row.id,
      brand: input.brand,
      platform: input.platform,
      status: input.safety.status,
      quality_score: input.safety.qualityScore,
      reasons: input.safety.reasons,
      blocked_phrases: input.safety.blockedPhrases,
      duplicate_risk: input.safety.duplicateRisk,
      created_at: now(),
    });
  }
  return row;
}

export async function enqueueContent(content: GeneratedContent, reason = "ready_for_distribution") {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("publishing_queue").insert({
      id: id("queue"),
      run_id: content.run_id,
      content_id: content.id,
      brand: content.brand,
      platform: content.platform,
      content_type: content.content_type,
      status: content.status,
      queue_reason: reason,
      retry_count: 0,
      scheduled_for: now(),
      created_at: now(),
      updated_at: now(),
    });
  }
}

export async function savePublicationResult(content: GeneratedContent, result: PublishResult) {
  memory.publishedPosts.unshift(result);
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  if (result.status === "published") {
    await supabase.from("published_posts").insert({
      id: id("published"),
      run_id: content.run_id,
      content_id: content.id,
      brand: content.brand,
      platform: result.platform,
      content_type: content.content_type,
      published_url: result.publishedUrl,
      status: result.status,
      created_at: now(),
    });
    return;
  }

  await supabase.from("failed_publications").insert({
    id: id("failed"),
    run_id: content.run_id,
    content_id: content.id,
    brand: content.brand,
    platform: result.platform,
    content_type: content.content_type,
    status: result.status,
    failure_reason: result.failureReason ?? result.skippedReason ?? "Unknown publishing result",
    retry_count: 0,
    created_at: now(),
  });
}

export async function saveSeoOpportunity(input: Omit<SeoOpportunity, "id" | "created_at" | "status">) {
  const row: SeoOpportunity = {
    ...input,
    id: id("seo"),
    status: "queued",
    created_at: now(),
  };
  memory.seoOpportunities.unshift(row);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const table =
      input.opportunity_type === "backlink"
        ? "backlink_opportunities"
        : input.opportunity_type === "brand_mention"
          ? "brand_mentions"
          : "seo_opportunities";
    await supabase.from(table).insert(row);
  }
  return row;
}

export async function findRecentContent(limit = 80) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return memory.generatedContent.slice(0, limit);

  const { data } = await supabase
    .from("generated_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as GeneratedContent[];
}

export async function getGeneratedContentById(contentId: string): Promise<GeneratedContent | null> {
  const local = memory.generatedContent.find((item) => item.id === contentId);
  const supabase = getSupabaseAdmin();
  if (!supabase) return local ?? null;

  const { data, error } = await supabase.from("generated_content").select("*").eq("id", contentId).maybeSingle();
  if (error) {
    console.error("Failed to load generated content detail", error);
    return local ?? null;
  }
  return (data as GeneratedContent | null) ?? local ?? null;
}

export async function saveWeeklyReport(summary: Record<string, unknown>) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 7);
  const row = {
    id: id("report"),
    week_start: start.toISOString(),
    week_end: end.toISOString(),
    summary,
  };
  memory.weeklyReports.unshift(row);

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("weekly_reports").insert({
      ...row,
      created_at: now(),
    });
  }
  return row;
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const settings = await getAutomationSettings();
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return {
      settings,
      latestRun: memory.runs[0] ?? null,
      runs: memory.runs.slice(0, 12),
      generatedContent: memory.generatedContent.slice(0, 30),
      publishingQueue: memory.generatedContent.filter((item) => item.status === "queued").slice(0, 30),
      publishedPosts: memory.publishedPosts.slice(0, 30),
      seoOpportunities: memory.seoOpportunities.slice(0, 30),
      platformCredentials: platforms.map((platform) => ({ ...platformCredentialStatus(platform), enabled: settings.platformEnabled[platform] })),
      weeklyReports: memory.weeklyReports.slice(0, 8),
      logs: memory.logs.slice(0, 40),
    };
  }

  const [runs, content, published, seo, backlink, mentions, reports, logs] = await Promise.all([
    supabase.from("agent_runs").select("*").order("started_at", { ascending: false }).limit(12),
    supabase.from("generated_content").select("*").order("created_at", { ascending: false }).limit(30),
    supabase.from("published_posts").select("*").order("created_at", { ascending: false }).limit(30),
    supabase.from("seo_opportunities").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("backlink_opportunities").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("brand_mentions").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("weekly_reports").select("id, week_start, week_end, summary").order("created_at", { ascending: false }).limit(8),
    supabase.from("agent_logs").select("id, level, message, created_at").order("created_at", { ascending: false }).limit(40),
  ]);

  return {
    settings,
    latestRun: ((runs.data ?? [])[0] as AgentRun | undefined) ?? null,
    runs: (runs.data ?? []) as AgentRun[],
    generatedContent: (content.data ?? []) as GeneratedContent[],
    publishingQueue: ((content.data ?? []) as GeneratedContent[]).filter((item) => item.status === "queued"),
    publishedPosts: (published.data ?? []) as unknown as PublishResult[],
    seoOpportunities: [...(seo.data ?? []), ...(backlink.data ?? []), ...(mentions.data ?? [])] as SeoOpportunity[],
    platformCredentials: platforms.map((platform) => ({ ...platformCredentialStatus(platform), enabled: settings.platformEnabled[platform] })),
    weeklyReports: (reports.data ?? []) as DashboardSnapshot["weeklyReports"],
    logs: (logs.data ?? []) as DashboardSnapshot["logs"],
  };
}

export function allBrands() {
  return brands;
}

export function allPlatforms() {
  return platforms;
}
