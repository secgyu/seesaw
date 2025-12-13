import { headers } from "next/headers";
import { NextResponse } from "next/server";

import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid") {
      await handleSuccessfulPayment(session);
    }
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleSuccessfulPayment(session);
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.error("Async payment failed for session:", session.id);
  }

  return NextResponse.json({ received: true });
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata?.orderNumber) return;

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("orders").insert({
      order_number: metadata.orderNumber,
      user_id: metadata.userId !== "guest" ? metadata.userId : null,
      email: session.customer_email || "",
      status: "paid",
      subtotal: Math.round((session.amount_total || 0) / 100),
      shipping_cost: 0,
      total: Math.round((session.amount_total || 0) / 100),
      shipping_address: JSON.parse(metadata.shippingAddress || "{}"),
      items: JSON.parse(metadata.items || "[]"),
      stripe_session_id: session.id,
    });

    if (error) return;

    if (metadata.userId !== "guest") {
      await supabase.from("carts").delete().eq("user_id", metadata.userId);
    }

    if (metadata.couponId) {
      const { data: coupon } = await supabase
        .from("coupons")
        .select("used_count")
        .eq("id", metadata.couponId)
        .single();

      if (coupon) {
        await supabase
          .from("coupons")
          .update({ used_count: (coupon.used_count || 0) + 1 })
          .eq("id", metadata.couponId);
      }
    }
  } catch (error) {
    console.error("Failed to process payment:", error);
  }
}
