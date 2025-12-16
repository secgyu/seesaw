import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "회원가입",
  description:
    "SEESAW 회원이 되어 특별한 혜택을 누리세요. 신규 회원 할인, 신상품 알림, 위시리스트 저장 등.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
