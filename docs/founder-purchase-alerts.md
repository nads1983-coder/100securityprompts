# 100SecurityPrompts founder sale alerts

This site has **no free account registrations**. Its sales are created through a Stripe Payment Link. An alert must not be triggered by the /thank-you page or checkout clicks.

A dedicated signed Stripe webhook is staged at `/api/stripe/founder-notification`. It handles paid checkout.session.completed and checkout.session.async_payment_succeeded events, validating the **exact Stripe Payment Link ID, live mode, amount £9, currency GBP and payment status**.

## Production prerequisites
1. Apply `supabase/migrations/202610250001_paid_signup_notifications.sql` to the correct production Supabase database. Verify the service-role key is server only.
2. Provision a **new** Stripe webhook endpoint for this route with only the two event types above. Do not replace or edit any existing Stripe webhooks.
3. Set `STRIPE_SIGNUP_WEBHOOK_SECRET` to that endpoint's signing secret (never the Stripe API secret).
4. Set `STRIPE_EXPECTED_PAYMENT_LINK_ID` to the actual `plink_...` ID of the existing £9 Stripe Payment Link; do not guess it from the URL.
5. Set `RESEND_API_KEY` and verified `FOUNDER_EMAIL_FROM`.
6. After sandbox checks, set `FOUNDER_SIGNUP_NOTIFICATIONS_ENABLED=true` in production only. The recipient is `nads1983@gmail.com`.
7. Verify a signed test event, replay the same event, simulate a failure, and inspect the persistent receipt. Never use a real purchase for testing.

The handler fails closed when prerequisites are missing. No notification is sent on previews or for unrelated Stripe Payment Links. The receipt table is private with RLS enabled. A failed/incomplete delivery holds a 15-minute lease for reconciliation; provider idempotency additionally suppresses retries for the provider's supported window.
