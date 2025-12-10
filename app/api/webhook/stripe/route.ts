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
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
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

  if (!metadata?.orderNumber) {
    console.error("No order number in metadata");
    return;
  }

  try {
    const supabase = await createClient();

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", metadata.orderNumber)
      .single();

    if (existingOrder) {
      console.log("Order already exists:", metadata.orderNumber);
      return;
    }

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

    if (error) {
      console.error("Failed to save order:", error);
      return;
    }

    console.log("Order saved via webhook:", metadata.orderNumber);

    if (metadata.userId !== "guest") {
      await supabase.from("carts").delete().eq("user_id", metadata.userId);
    }
  } catch (err) {
    console.error("Error processing webhook:", err);
  }
}
