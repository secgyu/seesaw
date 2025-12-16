import { AboutHero } from "@/components/about/about-hero";
import { AboutPhilosophy } from "@/components/about/about-philosophy";
import { AboutProcess } from "@/components/about/about-process";
import { AboutStory } from "@/components/about/about-story";
import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export const metadata = {
  title: "About",
  description:
    "SEESAW의 이야기를 만나보세요. 균형, 이중성, 미니멀리즘으로 정의되는 프리미엄 패션 브랜드입니다.",
  openGraph: {
    title: "About | SEESAW",
    description: "SEESAW의 브랜드 스토리와 철학",
  },
};

export default function AboutPage() {
  return (
    <main>
      <Navigation />
      <CartSidebar />
      <AboutHero />
      <AboutStory />
      <AboutPhilosophy />
      <AboutProcess />
      <Footer />
    </main>
  );
}
