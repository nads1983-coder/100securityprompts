import { NextResponse } from "next/server";
import { product } from "@/lib/site/content";

export async function POST() {
  return NextResponse.redirect(
    process.env.STRIPE_PAYMENT_LINK || product.stripePaymentLink,
    303,
  );
}
