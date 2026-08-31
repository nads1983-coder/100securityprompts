import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { blogPosts, siteUrl } from "@/lib/site/content";
import {
  buildPromptCollectionSchema,
  promptCollections,
  rejectedPromptCollectionSlugs,
} from "@/lib/site/prompt-collections";

const approvedPaths = promptCollections.map((collection) => `/prompts/${collection.slug}`);
const rejectedPaths = rejectedPromptCollectionSlugs.map((slug) => `/prompts/${slug}`);

function uniqueValues(values: readonly string[]) {
  return new Set(values).size === values.length;
}

function words(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3);
}

function similarity(first: string, second: string) {
  const firstWords = new Set(words(first));
  const secondWords = new Set(words(second));
  const intersection = [...firstWords].filter((word) => secondWords.has(word)).length;
  const union = new Set([...firstWords, ...secondWords]).size;
  return union ? intersection / union : 0;
}

function pageCopy(collection: (typeof promptCollections)[number]) {
  return [
    collection.title,
    collection.h1,
    collection.description,
    collection.intro,
    ...collection.useCases,
    ...collection.samples.flatMap((sample) => [
      sample.title,
      sample.helpsWith,
      sample.prompt,
      ...sample.variables,
    ]),
    ...collection.customisationTips,
    ...collection.responsibleUse,
  ].join(" ");
}

describe("prompt collections", () => {
  it("keeps approved routes unique", () => {
    expect(promptCollections).toHaveLength(10);
    expect(uniqueValues(promptCollections.map((collection) => collection.slug))).toBe(true);
    expect(uniqueValues(promptCollections.map((collection) => collection.title))).toBe(true);
    expect(uniqueValues(promptCollections.map((collection) => collection.h1))).toBe(true);
    expect(uniqueValues(promptCollections.map((collection) => collection.description))).toBe(true);
  });

  it("does not leak rejected routes into the approved registry", () => {
    for (const rejectedSlug of rejectedPromptCollectionSlugs.map(String)) {
      expect(promptCollections.some((collection) => collection.slug === rejectedSlug)).toBe(false);
    }
  });

  it("has substantial, bounded sample content without reproducing the paid prompt wording", () => {
    const paidPromptFragments = [
      "Act as an experienced Corporate Security Manager. Create a",
      "Act as a Security Director preparing a board-level",
      "Help security leaders complete",
    ];

    for (const collection of promptCollections) {
      expect(words(pageCopy(collection)).length).toBeGreaterThanOrEqual(250);
      expect(collection.samples.length).toBeGreaterThanOrEqual(3);
      expect(collection.samples.length).toBeLessThanOrEqual(4);

      for (const sample of collection.samples) {
        expect(words(sample.prompt).length).toBeGreaterThanOrEqual(20);
        for (const fragment of paidPromptFragments) {
          expect(sample.prompt).not.toContain(fragment);
        }
      }
    }
  });

  it("keeps page copy distinct across collections", () => {
    for (let index = 0; index < promptCollections.length; index += 1) {
      for (let nextIndex = index + 1; nextIndex < promptCollections.length; nextIndex += 1) {
        expect(
          similarity(pageCopy(promptCollections[index]), pageCopy(promptCollections[nextIndex])),
        ).toBeLessThan(0.62);
      }
    }
  });

  it("uses valid internal links and avoids orphaned prompt collections", () => {
    const approvedSlugs = new Set(promptCollections.map((collection) => collection.slug));
    const blogSlugs = new Set(blogPosts.map((post) => post.slug));
    const linkedSlugs = new Set<string>();

    for (const collection of promptCollections) {
      expect(collection.relatedCollections).not.toContain(collection.slug);
      expect(collection.relatedCollections.length).toBeGreaterThanOrEqual(3);
      expect(collection.blogLinks.length).toBeGreaterThanOrEqual(2);

      for (const relatedSlug of collection.relatedCollections) {
        expect(approvedSlugs.has(relatedSlug)).toBe(true);
        linkedSlugs.add(relatedSlug);
      }

      for (const blogLink of collection.blogLinks) {
        expect(blogSlugs.has(blogLink.slug)).toBe(true);
      }
    }

    for (const collection of promptCollections) {
      expect(linkedSlugs.has(collection.slug)).toBe(true);
    }
  });

  it("builds canonical collection schema with item lists", () => {
    for (const collection of promptCollections) {
      const schema = buildPromptCollectionSchema(collection);
      const graph = schema["@graph"];
      expect(graph[0]).toMatchObject({
        "@type": "CollectionPage",
        url: `${siteUrl}/prompts/${collection.slug}`,
        name: collection.h1,
        description: collection.description,
      });
      expect(graph[1]).toMatchObject({
        "@type": "ItemList",
        name: `${collection.h1} sample prompts`,
      });
      expect(graph[1].itemListElement).toHaveLength(collection.samples.length);
    }
  });

  it("keeps sitemap consistent with approved and rejected prompt routes", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain(`${siteUrl}/prompts`);
    for (const path of approvedPaths) {
      expect(urls).toContain(`${siteUrl}${path}`);
    }

    for (const path of rejectedPaths) {
      expect(urls).not.toContain(`${siteUrl}${path}`);
    }
  });

  it("blocks unsupported claims and route themes", () => {
    const unsupportedTerms = [
      "cybersecurity",
      "penetration test",
      "London security prompts",
      "healthcare compliance",
      "retail security service",
      "serve customers",
      "service area",
    ];
    const combined = promptCollections.map(pageCopy).join(" ");

    for (const term of unsupportedTerms) {
      expect(combined.toLowerCase()).not.toContain(term.toLowerCase());
    }
  });
});
