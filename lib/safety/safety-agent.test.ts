import { describe, expect, it } from "vitest";
import { getDefaultAutomationSettings } from "@/lib/env";
import { validateContent } from "@/lib/safety/safety-agent";

describe("validateContent", () => {
  it("blocks fake ranking claims", async () => {
    const result = await validateContent({
      brand: "leadwithnadine.com",
      platform: "linkedin",
      title: "Guaranteed ranking",
      body: "This post promises guaranteed ranking and buy backlinks for everyone using mass comment automation.",
      settings: getDefaultAutomationSettings(),
    });

    expect(result.status).toBe("blocked");
  });

  it("approves useful premium content", async () => {
    const result = await validateContent({
      brand: "calmauthority.co",
      platform: "linkedin",
      title: "A calmer script for a tense meeting",
      body: "Calm Authority helps professionals prepare clearer workplace scripts. When a meeting is already tense, the risk is that a leader keeps explaining until the room hears uncertainty instead of care. For example: name the decision, name the constraint, and ask for the specific next step. This gives the conversation a useful shape because people know what is being decided and what happens next.",
      settings: getDefaultAutomationSettings(),
    });

    expect(result.status).toBe("approved");
    expect(result.qualityScore).toBeGreaterThan(70);
  });

  it("blocks generic influencer-style phrasing", async () => {
    const result = await validateContent({
      brand: "leadwithnadine.com",
      platform: "linkedin",
      title: "Unlock your potential",
      body: "Unlock your potential with these 5 tips to level up, crush your goals, drive results, and move the needle in today's fast-paced world. The key is to believe in yourself and empower your team.",
      settings: getDefaultAutomationSettings(),
    });

    expect(result.status).toBe("blocked");
  });
});
