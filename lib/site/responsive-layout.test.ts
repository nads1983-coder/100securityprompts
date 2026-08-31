import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/globals.css", "utf8");

describe("responsive layout CSS", () => {
  it("keeps mobile header navigation visible without horizontal scrolling", () => {
    expect(css).toContain(".site-header nav a");
    expect(css).toContain("min-height: 32px");
    expect(css).toContain("flex-wrap: wrap");
    expect(css).not.toContain("overflow-x: auto");
  });
});
