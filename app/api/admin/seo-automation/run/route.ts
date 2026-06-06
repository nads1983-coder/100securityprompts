import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { runDailyAgents, runWeeklyReport } from "@/lib/agents/orchestrator";
import { brands } from "@/lib/config/brands";
import type { Brand } from "@/lib/types";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const type = body.type === "weekly-report" ? "weekly-report" : "daily-run";
  const brand = brands.includes(body.brand as Brand) ? (body.brand as Brand) : undefined;
  const result = type === "weekly-report" ? await runWeeklyReport() : await runDailyAgents({ brand });
  return NextResponse.json(result);
}
