import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from("contacts").insert({
      name,
      email,
      subject,
      message,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
