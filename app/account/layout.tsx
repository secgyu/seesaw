import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "마이페이지",
  description: "SEESAW 마이페이지. 주문 내역, 위시리스트, 계정 설정을 관리하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
