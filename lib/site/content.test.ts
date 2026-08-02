import { describe, expect, it } from "vitest";
import { blogPosts } from "@/lib/site/content";

describe("generated blog content dates", () => {
  it("loads the August 2 publication and modification dates for the incident trend review article", () => {
    const post = blogPosts.find((item) => item.slug === "security-incident-trend-review-checklist");

    expect(post?.published).toBe("2026-08-02T00:00:00.000Z");
    expect(post?.updated).toBe("2026-08-02T00:00:00.000Z");
  });
});
