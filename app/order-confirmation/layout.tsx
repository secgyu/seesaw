import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "주문 완료",
  description: "SEESAW 주문이 완료되었습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderConfirmationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
