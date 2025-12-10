"use server";

import { createClient } from "@/lib/supabase/server";

interface NewsletterResult {
  success: boolean;
  message: string;
}

export async function subscribeNewsletter(email: string): Promise<NewsletterResult> {
  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "유효한 이메일을 입력해주세요.",
    };
  }

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.toLowerCase().trim(),
    });

    if (error) {
      if (error.code === "23505") {
        return {
          success: true,
          message: "이미 구독 중인 이메일입니다.",
        };
      }
      return {
        success: false,
        message: "구독 처리 중 오류가 발생했습니다.",
      };
    }

    return {
      success: true,
      message: "구독해 주셔서 감사합니다!",
    };
  } catch {
    return {
      success: false,
      message: "구독 처리 중 오류가 발생했습니다.",
    };
  }
}
