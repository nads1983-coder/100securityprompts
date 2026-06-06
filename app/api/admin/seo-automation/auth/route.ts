import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookie, setAdminCookie } from "@/lib/auth";
import { requireServerSecret } from "@/lib/env";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  if (body.secret !== requireServerSecret()) {
    return NextResponse.json({ error: "Invalid admin secret" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
