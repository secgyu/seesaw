import { AboutHero } from "@/components/about/about-hero";
import { AboutPhilosophy } from "@/components/about/about-philosophy";
import { AboutProcess } from "@/components/about/about-process";
import { AboutStory } from "@/components/about/about-story";
import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export const metadata = {
  title: "About | SEESAW",
  description:
    "Discover the story behind SEESAW. A luxury fashion brand defined by balance, duality, and minimalist design.",
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
