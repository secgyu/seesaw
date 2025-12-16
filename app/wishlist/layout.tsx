import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "위시리스트",
  description: "내가 찜한 SEESAW 아이템. 마음에 드는 제품을 저장하고 언제든 확인하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
