import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { requireServerSecret } from "@/lib/env";

const COOKIE_NAME = "seo_automation_admin";

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === digest(requireServerSecret());
}

export async function setAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, digest(requireServerSecret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function isAuthorizedRequest(request: NextRequest) {
  const expected = requireServerSecret();
  const authHeader = request.headers.get("authorization");
  const querySecret = request.nextUrl.searchParams.get("secret");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  return bearer === expected || querySecret === expected;
}
