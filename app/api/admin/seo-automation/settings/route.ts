import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { getAutomationSettings, saveAutomationSettings } from "@/lib/db/repository";
import type { AutomationSettings } from "@/lib/types";

const settingsPatchSchema = z.object({
  emergencyPaused: z.boolean().optional(),
  autopublishEnabled: z.boolean().optional(),
  maxPostsPerDay: z.number().min(0).max(50).optional(),
  maxPostsPerPlatformPerDay: z.number().min(0).max(20).optional(),
  retryLimit: z.number().min(0).max(10).optional(),
  blockedPhrases: z.array(z.string()).optional(),
  platformEnabled: z.record(z.boolean()).optional(),
  brandEnabled: z.record(z.boolean()).optional(),
});

export async function PATCH(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = settingsPatchSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
  }

  const current = await getAutomationSettings();
  const next: AutomationSettings = {
    ...current,
    ...parsed.data,
    platformEnabled: { ...current.platformEnabled, ...(parsed.data.platformEnabled as Partial<AutomationSettings["platformEnabled"]> | undefined) },
    brandEnabled: { ...current.brandEnabled, ...(parsed.data.brandEnabled as Partial<AutomationSettings["brandEnabled"]> | undefined) },
  };
  return NextResponse.json(await saveAutomationSettings(next));
}
