import type { Platform, PlatformConfig } from "@/lib/types";

export const platformConfigs: Record<Platform, PlatformConfig> = {
  linkedin: {
    platform: "linkedin",
    label: "LinkedIn",
    envKeys: ["LINKEDIN_ACCESS_TOKEN"],
    defaultEnabled: true,
    maxPostsPerDay: 2,
    cooldownHours: 12,
  },
  medium: {
    platform: "medium",
    label: "Medium",
    envKeys: ["MEDIUM_ACCESS_TOKEN"],
    defaultEnabled: true,
    maxPostsPerDay: 1,
    cooldownHours: 24,
  },
  kit: {
    platform: "kit",
    label: "Kit / ConvertKit",
    envKeys: ["KIT_API_KEY"],
    defaultEnabled: true,
    maxPostsPerDay: 1,
    cooldownHours: 24,
  },
  instagram: {
    platform: "instagram",
    label: "Instagram",
    envKeys: ["INSTAGRAM_API_KEY"],
    defaultEnabled: true,
    maxPostsPerDay: 1,
    cooldownHours: 18,
  },
  tiktok: {
    platform: "tiktok",
    label: "TikTok",
    envKeys: ["TIKTOK_API_KEY"],
    defaultEnabled: true,
    maxPostsPerDay: 1,
    cooldownHours: 18,
  },
  x: {
    platform: "x",
    label: "X / Twitter",
    envKeys: ["X_API_KEY"],
    defaultEnabled: true,
    maxPostsPerDay: 2,
    cooldownHours: 8,
  },
  youtube: {
    platform: "youtube",
    label: "YouTube Metadata",
    envKeys: ["YOUTUBE_API_KEY"],
    defaultEnabled: true,
    maxPostsPerDay: 1,
    cooldownHours: 24,
  },
  internal_blog: {
    platform: "internal_blog",
    label: "Internal Blog",
    envKeys: [],
    defaultEnabled: false,
    maxPostsPerDay: 1,
    cooldownHours: 24,
  },
};

export const platforms = Object.keys(platformConfigs) as Platform[];
