import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비밀번호 재설정",
  description: "SEESAW 계정 비밀번호를 재설정하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
