import "server-only";

import { brands } from "@/lib/config/brands";
import {
  createAgentRun,
  getAutomationSettings,
  logAgent,
  saveGeneratedContent,
  saveSeoOpportunity,
  saveWeeklyReport,
  updateAgentRun,
} from "@/lib/db/repository";
import { generateContentDrafts } from "@/lib/agents/content-agent";
import { distributeContent } from "@/lib/agents/distribution-agent";
import { generateSeoOpportunities } from "@/lib/agents/seo-agent";
import { selectDailyStrategy } from "@/lib/agents/strategy-agent";
import { validateContent } from "@/lib/safety/safety-agent";
import type { Brand, GeneratedContent } from "@/lib/types";

export async function runDailyAgents(options: { brand?: Brand } = {}) {
  const settings = await getAutomationSettings();
  const enabledBrands = brands.filter((brand) => settings.brandEnabled[brand]);
  const run = await createAgentRun("running");

  try {
    if (enabledBrands.length === 0) {
      await updateAgentRun(run.id, {
        status: "skipped",
        completed_at: new Date().toISOString(),
        summary: { reason: "No brands enabled." },
      });
      return { runId: run.id, status: "skipped", reason: "No brands enabled." };
    }

    await logAgent(run.id, "info", "Strategy Agent started.");
    await logAgent(run.id, "info", `Active supported sites: ${enabledBrands.join(", ")}`);
    const strategy = options.brand && enabledBrands.includes(options.brand)
      ? {
          ...(await selectDailyStrategy([options.brand])),
          brand: options.brand,
        }
      : await selectDailyStrategy(enabledBrands as Brand[]);
    await updateAgentRun(run.id, { brand: strategy.brand });

    await logAgent(run.id, "info", `Content Agent generating content for ${strategy.brand}.`);
    const drafts = await generateContentDrafts(strategy);

    const savedContent: GeneratedContent[] = [];
    for (const draft of drafts) {
      const safety = await validateContent({
        brand: strategy.brand,
        platform: draft.platform,
        title: draft.title,
        body: draft.body,
        settings,
      });
      await logAgent(
        run.id,
        safety.status === "blocked" ? "warn" : "info",
        `Safety Agent result for ${strategy.brand}/${draft.platform ?? "none"}/${draft.contentType}: ${safety.status} (${safety.qualityScore})`,
        { reasons: safety.reasons },
      );

      const status = safety.status === "approved" ? "queued" : safety.status === "needs_review" ? "queued" : "blocked";
      const saved = await saveGeneratedContent({
        runId: run.id,
        brand: strategy.brand,
        platform: draft.platform,
        contentType: draft.contentType,
        title: draft.title,
        body: draft.body,
        metadata: draft.metadata,
        safety,
        contentHash: safety.contentHash,
        status,
      });
      savedContent.push(saved);
    }

    await logAgent(run.id, "info", "SEO Agent generating authority opportunities.");
    const opportunities = await generateSeoOpportunities(strategy);
    for (const opportunity of opportunities) {
      await saveSeoOpportunity({ run_id: run.id, ...opportunity });
    }

    await logAgent(run.id, "info", "Distribution Agent processing queue-first publishing.");
    const publicationResults = await distributeContent({ runId: run.id, content: savedContent, settings });

    const summary = {
      brand: strategy.brand,
      activeBrands: enabledBrands,
      topicFocus: strategy.topicFocus,
      contentGenerated: savedContent.length,
      approvedContent: savedContent.filter((item) => item.safety_status === "approved").length,
      blockedContent: savedContent.filter((item) => item.safety_status === "blocked").length,
      opportunitiesGenerated: opportunities.length,
      publicationResults,
    };

    await updateAgentRun(run.id, {
      status: "completed",
      completed_at: new Date().toISOString(),
      summary,
    });
    return { runId: run.id, status: "completed", summary };
  } catch (error) {
    const failure = error instanceof Error ? error.message : "Unknown daily agent failure.";
    await logAgent(run.id, "error", failure);
    await updateAgentRun(run.id, {
      status: "failed",
      completed_at: new Date().toISOString(),
      failure_reason: failure,
    });
    throw error;
  }
}

export async function runWeeklyReport() {
  const settings = await getAutomationSettings();
  const run = await createAgentRun("running", null);
  try {
    const summary = {
      contentGenerated: "See generated_content for prior seven days.",
      contentPublished: "See published_posts for prior seven days.",
      failedPublishingAttempts: "See failed_publications for prior seven days.",
      skippedPlatforms: "Platforms without credentials or disabled settings were skipped safely.",
      backlinkOpportunities: "See backlink_opportunities.",
      authorityOpportunities: "See seo_opportunities and brand_mentions.",
      nextWeekRecommendations: [
        "Keep queue-first publishing until each platform adapter is verified with live credentials.",
        "Turn top approved long-form drafts into canonical authority assets.",
        "Use podcast and collaboration opportunities for founder authority expansion.",
      ],
      topPerformingThemes: ["Leadership clarity", "AI-search entity authority", "calm workplace scripts"],
      contentDiversityAnalysis: "The strategy agent rotates brand, platform, and content type to reduce repetition.",
      platformActivitySummary: settings.platformEnabled,
    };
    const report = await saveWeeklyReport(summary);
    await updateAgentRun(run.id, {
      status: "completed",
      completed_at: new Date().toISOString(),
      summary: { reportId: report.id },
    });
    return report;
  } catch (error) {
    const failure = error instanceof Error ? error.message : "Unknown weekly report failure.";
    await updateAgentRun(run.id, {
      status: "failed",
      completed_at: new Date().toISOString(),
      failure_reason: failure,
    });
    throw error;
  }
}
