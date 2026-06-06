import "server-only";

import { getEnv } from "@/lib/env";
import { platformConfigs } from "@/lib/config/platforms";
import type { GeneratedContent, Platform, PublishResult } from "@/lib/types";

export interface PublisherAdapter {
  platform: Platform;
  hasCredentials(): boolean;
  canPublish(content: GeneratedContent): boolean;
  format(content: GeneratedContent): Record<string, unknown>;
  publish(content: GeneratedContent): Promise<PublishResult>;
  rateLimitKey(content: GeneratedContent): string;
  dedupeKey(content: GeneratedContent): string;
  logResult(result: PublishResult): string;
}

export abstract class QueueFirstPublisher implements PublisherAdapter {
  abstract platform: Platform;

  hasCredentials(): boolean {
    return platformConfigs[this.platform].envKeys.every((key) => Boolean(getEnv(key)));
  }

  canPublish(content: GeneratedContent): boolean {
    return content.platform === this.platform && content.safety_status === "approved";
  }

  format(content: GeneratedContent): Record<string, unknown> {
    return {
      title: content.title,
      body: content.body,
      metadata: content.metadata,
    };
  }

  async publish(content: GeneratedContent): Promise<PublishResult> {
    if (!this.hasCredentials()) {
      return {
        status: "skipped",
        platform: this.platform,
        skippedReason: `Missing credentials for ${platformConfigs[this.platform].label}.`,
      };
    }

    if (!this.canPublish(content)) {
      return {
        status: "blocked",
        platform: this.platform,
        failureReason: "Content is not approved for this platform.",
      };
    }

    return this.publishWithProvider(content);
  }

  async publishWithProvider(_content: GeneratedContent): Promise<PublishResult> {
    void _content;
    return {
      status: "queued",
      platform: this.platform,
      skippedReason: "Provider-specific live publishing is intentionally queue-first in v1.",
    };
  }

  rateLimitKey(content: GeneratedContent): string {
    return `${this.platform}:${content.brand}:${new Date().toISOString().slice(0, 10)}`;
  }

  dedupeKey(content: GeneratedContent): string {
    return `${this.platform}:${content.content_hash}`;
  }

  logResult(result: PublishResult): string {
    return `${this.platform}:${result.status}:${result.failureReason ?? result.skippedReason ?? result.publishedUrl ?? "ok"}`;
  }
}
