import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getDashboardSnapshot } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await getDashboardSnapshot());
}
