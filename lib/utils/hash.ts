import crypto from "node:crypto";

export function normalizeContent(input: string): string {
  return input
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[#@]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function hashContent(input: string): string {
  return crypto.createHash("sha256").update(normalizeContent(input)).digest("hex");
}

export function similarityScore(a: string, b: string): number {
  const aTerms = new Set(normalizeContent(a).split(" ").filter(Boolean));
  const bTerms = new Set(normalizeContent(b).split(" ").filter(Boolean));
  if (aTerms.size === 0 || bTerms.size === 0) return 0;
  const intersection = [...aTerms].filter((term) => bTerms.has(term)).length;
  const union = new Set([...aTerms, ...bTerms]).size;
  return intersection / union;
}

export function id(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}
