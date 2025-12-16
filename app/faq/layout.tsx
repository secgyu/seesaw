import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description:
    "SEESAW에 대해 자주 묻는 질문과 답변. 주문, 배송, 반품, 결제 등 궁금한 점을 확인하세요.",
  openGraph: {
    title: "자주 묻는 질문 | SEESAW",
    description: "SEESAW에 대해 자주 묻는 질문과 답변",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
