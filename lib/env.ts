import { brands } from "@/lib/config/brands";
import { platformConfigs, platforms } from "@/lib/config/platforms";
import type { AutomationSettings, Brand, Platform } from "@/lib/types";

export function getEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export function requireServerSecret(): string {
  return getEnv("SEO_AUTOMATION_SECRET") ?? getEnv("CRON_SECRET") ?? "local-dev-secret";
}

export function isAutopublishEnabledByEnv(): boolean {
  return (getEnv("AUTOPUBLISH_ENABLED") ?? "false").toLowerCase() === "true";
}

export function getDefaultAutomationSettings(): AutomationSettings {
  const platformEnabled = Object.fromEntries(
    platforms.map((platform) => [platform, platformConfigs[platform].defaultEnabled]),
  ) as Record<Platform, boolean>;
  const brandEnabled = Object.fromEntries(brands.map((brand) => [brand, true])) as Record<Brand, boolean>;

  return {
    emergencyPaused: false,
    autopublishEnabled: isAutopublishEnabledByEnv(),
    maxPostsPerDay: 4,
    maxPostsPerPlatformPerDay: 2,
    retryLimit: 2,
    blockedPhrases: [
      "guaranteed ranking",
      "fake testimonial",
      "buy backlinks",
      "black hat",
      "mass comment",
      "private data",
    ],
    platformEnabled,
    brandEnabled,
  };
}

export function platformCredentialStatus(platform: Platform) {
  const config = platformConfigs[platform];
  const missingKeys = config.envKeys.filter((key) => !getEnv(key));
  const requiresExternalCredential = config.envKeys.length > 0;
  return {
    platform,
    configured: requiresExternalCredential ? missingKeys.length === 0 : false,
    enabled: config.defaultEnabled,
    missingKeys,
  };
}
