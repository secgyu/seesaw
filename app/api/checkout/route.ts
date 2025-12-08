import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const { items, shippingCost, formData } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // 현재 로그인된 사용자 확인
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Stripe line items 생성
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `Size: ${item.size} / Color: ${item.color}`,
          images: item.image ? [item.image] : [],
        },
        unit_amount: item.price * 100, // Stripe는 센트 단위
      },
      quantity: item.quantity,
    }));

    // 배송비 추가 (있으면)
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
            description: "Express Shipping (2-3 business days)",
            images: [],
          },
          unit_amount: shippingCost * 100,
        },
        quantity: 1,
      });
    }

    // 주문 번호 생성
    const orderNumber = `SEESAW-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Checkout Session 생성
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get("origin")}/order-confirmation?session_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
      cancel_url: `${request.headers.get("origin")}/checkout?canceled=true`,
      customer_email: formData?.email || undefined,
      metadata: {
        orderNumber,
        userId: user?.id || "guest",
        items: JSON.stringify(
          items.map((item: CartItem) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
          }))
        ),
        shippingAddress: JSON.stringify({
          firstName: formData?.firstName,
          lastName: formData?.lastName,
          address: formData?.address,
          city: formData?.city,
          postalCode: formData?.postalCode,
          country: formData?.country,
          phone: formData?.phone,
        }),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

