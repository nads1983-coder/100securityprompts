import "server-only";

import { phaseOneDraftOnly } from "@/lib/config/content-quality";
import { enqueueContent, logAgent, savePublicationResult } from "@/lib/db/repository";
import { getPublisher } from "@/lib/publishers/adapters";
import type { AutomationSettings, GeneratedContent, PublishResult } from "@/lib/types";

export async function distributeContent({
  runId,
  content,
  settings,
}: {
  runId: string;
  content: GeneratedContent[];
  settings: AutomationSettings;
}): Promise<PublishResult[]> {
  const results: PublishResult[] = [];

  for (const item of content) {
    if (!item.platform) {
      await enqueueContent(item, "no_platform_content");
      continue;
    }

    const publisher = getPublisher(item.platform);
    if (!publisher) {
      const result: PublishResult = { status: "skipped", platform: item.platform, skippedReason: "No publisher adapter exists." };
      await savePublicationResult(item, result);
      results.push(result);
      continue;
    }

    if (settings.emergencyPaused) {
      const result: PublishResult = { status: "skipped", platform: item.platform, skippedReason: "Emergency pause is enabled." };
      await enqueueContent(item, "emergency_paused");
      await savePublicationResult(item, result);
      results.push(result);
      continue;
    }

    if (!settings.platformEnabled[item.platform]) {
      const result: PublishResult = { status: "skipped", platform: item.platform, skippedReason: "Platform disabled in settings." };
      await enqueueContent(item, "platform_disabled");
      await savePublicationResult(item, result);
      results.push(result);
      continue;
    }

    if (item.safety_status === "blocked") {
      const result: PublishResult = { status: "blocked", platform: item.platform, failureReason: item.safety_reasons.join("; ") };
      await enqueueContent(item, "safety_blocked");
      await savePublicationResult(item, result);
      results.push(result);
      continue;
    }

    if (phaseOneDraftOnly) {
      const result: PublishResult = { status: "queued", platform: item.platform, skippedReason: "Phase 1 draft-only mode; human approval required before publication." };
      await enqueueContent(item, "phase_1_draft_only_review");
      await savePublicationResult(item, result);
      results.push(result);
      continue;
    }

    if (item.safety_status !== "approved") {
      const result: PublishResult = { status: "blocked", platform: item.platform, failureReason: item.safety_reasons.join("; ") };
      await enqueueContent(item, "safety_needs_review");
      await savePublicationResult(item, result);
      results.push(result);
      continue;
    }

    if (!settings.autopublishEnabled) {
      const result: PublishResult = { status: "queued", platform: item.platform, skippedReason: "Autopublish disabled; queued for review." };
      await enqueueContent(item, "autopublish_disabled");
      await savePublicationResult(item, result);
      results.push(result);
      continue;
    }

    const result = await publisher.publish(item);
    if (result.status === "queued" || result.status === "skipped") {
      await enqueueContent(item, result.skippedReason ?? "provider_queue_first");
    }
    await savePublicationResult(item, result);
    await logAgent(runId, result.status === "published" ? "info" : "warn", publisher.logResult(result));
    results.push(result);
  }

  return results;
}
