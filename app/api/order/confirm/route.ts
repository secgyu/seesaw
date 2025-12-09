import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const metadata = session.metadata;
    if (!metadata) {
      return NextResponse.json({ error: "No metadata found" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", metadata.orderNumber)
      .single();

    if (existingOrder) {
      return NextResponse.json({ success: true, message: "Order already exists" });
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
    });

    if (error) {
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    if (metadata.userId !== "guest") {
      await supabase.from("carts").delete().eq("user_id", metadata.userId);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 });
  }
}
