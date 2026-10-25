import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const SITE = "100securityprompts.com";
const RECIPIENT = "nads1983@gmail.com";
type StripeCheckout = {
  id?: string;
  payment_link?: string | null;
  payment_status?: string;
  amount_total?: number;
  currency?: string;
  livemode?: boolean;
  mode?: string;
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
};
type StripeEvent = { id?: string; type?: string; data?: { object?: StripeCheckout } };

export function stripeSignatureValid(
  raw: string,
  header: string | null,
  secret: string,
  now = Math.floor(Date.now() / 1000),
) {
  if (!header || !secret) return false;
  const fields = header.split(",").map((x) => x.trim());
  const timestamp = fields.find((x) => x.startsWith("t="))?.slice(2);
  const candidates = fields.filter((x) => x.startsWith("v1=")).map((x) => x.slice(3));
  const seconds = Number(timestamp);
  if (!timestamp || !Number.isSafeInteger(seconds) || Math.abs(now - seconds) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest();
  return candidates.some((candidate) => {
    if (!/^[0-9a-f]{64}$/i.test(candidate)) return false;
    const value = Buffer.from(candidate, "hex");
    return value.length === expected.length && timingSafeEqual(value, expected);
  });
}

export function eligiblePurchase(event: StripeEvent, paymentLinkId: string) {
  const session = event.data?.object;
  return Boolean(
    event.id &&
    (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") &&
    session?.id?.startsWith("cs_") &&
    session.payment_link === paymentLinkId &&
    session.payment_status === "paid" &&
    session.mode === "payment" &&
    session.livemode === true &&
    session.currency === "gbp" &&
    session.amount_total === 900,
  );
}

export async function POST(request: Request) {
  const signingSecret = process.env.STRIPE_SIGNUP_WEBHOOK_SECRET;
  if (!signingSecret) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const raw = await request.text();
  if (raw.length > 100000 ||
      !stripeSignatureValid(raw, request.headers.get("stripe-signature"), signingSecret))
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });

  let event: StripeEvent;
  try { event = JSON.parse(raw); }
  catch { return NextResponse.json({ error: "invalid_event" }, { status: 400 }); }

  if (process.env.FOUNDER_SIGNUP_NOTIFICATIONS_ENABLED !== "true" ||
      process.env.VERCEL_ENV !== "production")
    return NextResponse.json({ received: true, disabled: true });

  const paymentLink = process.env.STRIPE_EXPECTED_PAYMENT_LINK_ID || "";
  if (!paymentLink.startsWith("plink_") || !eligiblePurchase(event, paymentLink))
    return NextResponse.json({ received: true, ignored: true });

  const { getSupabaseAdmin } = await import("@/lib/supabase/server");
  const db = getSupabaseAdmin();
  if (!db || !process.env.RESEND_API_KEY || !process.env.FOUNDER_EMAIL_FROM)
    return NextResponse.json({ error: "notification_configuration_incomplete" }, { status: 503 });
  const session = event.data!.object!;
  const sessionId = session.id!;
  const email = session.customer_details?.email || session.customer_email || "";
  const { error: claimError } = await db.from("paid_signup_notifications").insert({
    stripe_session_id: sessionId,
    event_id: event.id,
    email,
    notification_status: "processing",
  });
  if (claimError) {
    if (claimError.code !== "23505") return NextResponse.json({ error: "receipt_unavailable" }, { status: 503 });
    const { data: previous, error: readError } = await db.from("paid_signup_notifications")
      .select("notification_status,created_at").eq("stripe_session_id", sessionId).maybeSingle();
    if (readError || !previous) return NextResponse.json({ error: "receipt_unavailable" }, { status: 503 });
    if (previous.notification_status === "sent") return NextResponse.json({ received: true, duplicate: true });
    const old = new Date(previous.created_at).getTime();
    if (!Number.isFinite(old) || Date.now() - old < 15 * 60_000)
      return NextResponse.json({ error: "previous_attempt_in_progress" }, { status: 503 });
    const { data: reclaimed, error: reclaimError } = await db.from("paid_signup_notifications")
      .update({ created_at: new Date().toISOString(), event_id: event.id })
      .eq("stripe_session_id", sessionId).eq("notification_status", "processing")
      .eq("created_at", previous.created_at).select("stripe_session_id").maybeSingle();
    if (reclaimError || !reclaimed) return NextResponse.json({ error: "retry_claim_unavailable" }, { status: 503 });
  }
  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `100securityprompts-purchase-${sessionId}`,
      },
      body: JSON.stringify({
        from: process.env.FOUNDER_EMAIL_FROM,
        to: [RECIPIENT],
        subject: "[100SecurityPrompts] New paid customer",
        text: [
          `Website: ${SITE}`,
          "Signup type: Paid digital customer",
          "Product: 100 AI Prompts for Security Managers",
          "Amount: £9.00",
          `Customer email: ${email || "Not available"}`,
          `Stripe session: ${sessionId}`,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10000),
    });
    const receipt = await result.json().catch(() => ({})) as { id?: string };
    if (!result.ok || !receipt.id) throw new Error("delivery_rejected");
    const { error } = await db.from("paid_signup_notifications").update({
      notification_status: "sent", provider_message_id: receipt.id, delivered_at: new Date().toISOString(),
    }).eq("stripe_session_id", sessionId);
    if (error) throw new Error("receipt_write_failed");
    return NextResponse.json({ received: true });
  } catch {
    // Leave a lease for controlled retry rather than rerouting or altering checkout.
    console.error("100SecurityPrompts founder notification delivery needs reconciliation");
    return NextResponse.json({ error: "delivery_retry_required" }, { status: 503 });
  }
}
