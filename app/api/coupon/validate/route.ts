import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", code)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }

    const typedCoupon = coupon as Coupon;

    if (!typedCoupon.is_active) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 });
    }

    if (typedCoupon.starts_at && new Date(typedCoupon.starts_at) > new Date()) {
      return NextResponse.json({ error: "This coupon is not yet valid" }, { status: 400 });
    }

    if (typedCoupon.expires_at && new Date(typedCoupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }

    if (typedCoupon.max_uses && typedCoupon.used_count >= typedCoupon.max_uses) {
      return NextResponse.json(
        { error: "This coupon has reached its usage limit" },
        { status: 400 }
      );
    }

    if (typedCoupon.min_order_amount && subtotal < typedCoupon.min_order_amount) {
      return NextResponse.json(
        { error: `Minimum order amount is $${typedCoupon.min_order_amount}` },
        { status: 400 }
      );
    }

    let discountAmount: number;
    if (typedCoupon.discount_type === "percentage") {
      discountAmount = Math.round(subtotal * (typedCoupon.discount_value / 100));
    } else {
      discountAmount = Math.min(typedCoupon.discount_value, subtotal);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: typedCoupon.id,
        code: typedCoupon.code,
        description: typedCoupon.description,
        discountType: typedCoupon.discount_type,
        discountValue: typedCoupon.discount_value,
      },
      discountAmount,
    });
  } catch {
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 });
  }
}
