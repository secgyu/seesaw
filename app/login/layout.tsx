import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인",
  description:
    "SEESAW 계정으로 로그인하세요. 주문 내역 확인, 위시리스트 관리 등 다양한 혜택을 누리세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
