// @vitest-environment node
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { amazonAffiliateConfig } from "@/lib/site/amazon-affiliate";
import {
  recommendedSecurityEssentialsMetadata,
  recommendedSecurityEssentialsPath,
  securityEssentialsCategories,
} from "@/lib/site/security-essentials";

const projectRoot = process.cwd();
const pageSource = readFileSync(
  path.join(projectRoot, "app/recommended-security-essentials/page.tsx"),
  "utf8",
);
const sitemapSource = readFileSync(path.join(projectRoot, "app/sitemap.ts"), "utf8");

describe("recommended security essentials affiliate page", () => {
  it("uses Amazon UK affiliate links with the required store ID", () => {
    for (const category of securityEssentialsCategories) {
      const url = new URL(category.href);

      expect(url.hostname).toBe("www.amazon.co.uk");
      expect(url.searchParams.get("tag")).toBe(amazonAffiliateConfig.storeId);
      expect(category.href).not.toContain("amazon.com");
    }
  });

  it("defines the required affiliate attributes centrally", () => {
    expect(amazonAffiliateConfig.rel.split(" ").sort()).toEqual(
      ["nofollow", "noopener", "noreferrer", "sponsored"].sort(),
    );
    expect(amazonAffiliateConfig.target).toBe("_blank");
  });

  it("places the disclosure before the first Amazon affiliate link in the page source", () => {
    const disclosureIndex = pageSource.indexOf("amazonAffiliateConfig.disclosure");
    const firstLinkIndex = pageSource.indexOf("category.href");

    expect(disclosureIndex).toBeGreaterThanOrEqual(0);
    expect(firstLinkIndex).toBeGreaterThan(disclosureIndex);
    expect(pageSource).not.toContain("amazon.com");
  });

  it("is included in the sitemap", () => {
    expect(sitemapSource).toContain(recommendedSecurityEssentialsPath);
  });

  it("uses the site metadata and structured-data conventions", () => {
    expect(recommendedSecurityEssentialsMetadata.title).toBe(
      "Recommended Security Essentials for UK Security Professionals",
    );
    expect(pageSource).toContain("export const metadata");
    expect(pageSource).toContain("alternates");
    expect(pageSource).toContain("canonical");
    expect(pageSource).toContain("openGraph");
    expect(pageSource).toContain("BreadcrumbJsonLd");
    expect(pageSource).toContain('"@type": "CollectionPage"');
    expect(pageSource).toContain('"@type": "ItemList"');
  });
});
