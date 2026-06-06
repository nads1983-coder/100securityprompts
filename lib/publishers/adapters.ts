import "server-only";

import { QueueFirstPublisher } from "@/lib/publishers/base";
import type { GeneratedContent, Platform, PublishResult } from "@/lib/types";

class LinkedInPublisher extends QueueFirstPublisher {
  platform: Platform = "linkedin";
}

class MediumPublisher extends QueueFirstPublisher {
  platform: Platform = "medium";
}

class KitPublisher extends QueueFirstPublisher {
  platform: Platform = "kit";
}

class InstagramPublisher extends QueueFirstPublisher {
  platform: Platform = "instagram";
}

class TikTokPublisher extends QueueFirstPublisher {
  platform: Platform = "tiktok";
}

class XPublisher extends QueueFirstPublisher {
  platform: Platform = "x";
}

class YouTubePublisher extends QueueFirstPublisher {
  platform: Platform = "youtube";

  format(content: GeneratedContent) {
    return {
      title: content.title.slice(0, 100),
      description: content.body,
      tags: [content.brand, content.content_type],
    };
  }
}

class InternalBlogPublisher extends QueueFirstPublisher {
  platform: Platform = "internal_blog";

  hasCredentials(): boolean {
    return false;
  }

  async publish(_content: GeneratedContent): Promise<PublishResult> {
    void _content;
    return {
      status: "skipped",
      platform: this.platform,
      skippedReason: "Internal blog publishing is disabled until a specific blog API is configured.",
    };
  }
}

export const publisherAdapters = [
  new LinkedInPublisher(),
  new MediumPublisher(),
  new KitPublisher(),
  new InstagramPublisher(),
  new TikTokPublisher(),
  new XPublisher(),
  new YouTubePublisher(),
  new InternalBlogPublisher(),
];

export function getPublisher(platform: Platform) {
  return publisherAdapters.find((adapter) => adapter.platform === platform);
}
