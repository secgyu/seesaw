import { NextResponse } from "next/server";

import { sendShippingNotificationEmail } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { orderNumber, status, trackingNumber } = await request.json();

    if (!orderNumber || !status) {
      return NextResponse.json({ error: "Order number and status are required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status,
        tracking_number: trackingNumber || null,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", orderNumber);

    if (updateError) {
      console.error("Failed to update order status:", updateError);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    if (status === "shipped" || status === "delivered") {
      await sendShippingNotificationEmail({
        orderNumber,
        email: order.email,
        status,
        trackingNumber,
      });
    }

    return NextResponse.json({ success: true, message: "Order status updated" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
