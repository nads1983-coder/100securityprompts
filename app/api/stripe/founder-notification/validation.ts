import { createHmac, timingSafeEqual } from "node:crypto";

export type StripeCheckout = {
  id?: string; payment_link?: string | null; payment_status?: string;
  amount_total?: number; currency?: string; livemode?: boolean; mode?: string;
  customer_details?: { email?: string | null } | null; customer_email?: string | null;
};
export type StripeEvent = { id?: string; type?: string; data?: { object?: StripeCheckout } };

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

