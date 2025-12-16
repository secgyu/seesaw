import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "결제",
  description: "SEESAW 안전한 결제 페이지",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
