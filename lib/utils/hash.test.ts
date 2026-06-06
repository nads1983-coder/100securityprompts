import { describe, expect, it } from "vitest";
import { hashContent, similarityScore } from "@/lib/utils/hash";

describe("content hashing", () => {
  it("normalizes punctuation and case", () => {
    expect(hashContent("Hello, WORLD!")).toBe(hashContent("hello world"));
  });

  it("detects near overlap", () => {
    expect(similarityScore("calm authority workplace script", "workplace script with calm authority")).toBeGreaterThan(0.45);
  });
});
