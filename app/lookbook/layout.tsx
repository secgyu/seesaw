import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lookbook SS25",
  description: "SEESAW SS25 시즌 룩북. 균형과 대비의 미학을 담은 에디토리얼 컬렉션을 만나보세요.",
  openGraph: {
    title: "Lookbook SS25 | SEESAW",
    description: "SEESAW SS25 시즌 룩북",
    images: [
      {
        url: "/images/lookbook/look1.png",
        width: 800,
        height: 1067,
        alt: "SEESAW SS25 Lookbook",
      },
    ],
  },
};

export default function LookbookLayout({ children }: { children: React.ReactNode }) {
  return children;
}
