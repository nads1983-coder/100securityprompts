import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const repoRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": repoRoot,
      "server-only": path.join(repoRoot, "test", "server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
  },
});
