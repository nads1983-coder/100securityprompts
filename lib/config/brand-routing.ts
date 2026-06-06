import type { Brand, ContentType, Platform } from "@/lib/types";

export interface BrandContentRoute {
  distributionFocus: Platform[];
  contentTypes: ContentType[];
}

export const brandContentRoutes: Record<Brand, BrandContentRoute> = {
  "nadinepierre.com": {
    distributionFocus: ["linkedin", "medium", "youtube"],
    contentTypes: ["founder_authority_post", "linkedin_post", "medium_article", "youtube_short_metadata"],
  },
  "leadwithnadine.com": {
    distributionFocus: ["linkedin", "instagram", "tiktok", "medium"],
    contentTypes: ["linkedin_post", "instagram_caption", "tiktok_caption", "medium_article"],
  },
  "getstratiq.co": {
    distributionFocus: ["linkedin", "medium", "youtube"],
    contentTypes: ["linkedin_post", "ai_search_article", "youtube_short_metadata", "newsletter_snippet"],
  },
  "getcontentos.co": {
    distributionFocus: ["linkedin", "instagram", "tiktok", "medium", "youtube", "kit"],
    contentTypes: [
      "linkedin_post",
      "instagram_caption",
      "tiktok_caption",
      "medium_article",
      "youtube_short_metadata",
      "newsletter_snippet",
    ],
  },
  "calmauthority.co": {
    distributionFocus: ["linkedin", "instagram", "tiktok", "medium"],
    contentTypes: ["linkedin_post", "instagram_caption", "tiktok_caption", "script_template", "medium_article"],
  },
};
