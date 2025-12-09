import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { FeaturedCollection } from "@/components/home/featured-collection";
import { HeroSection } from "@/components/home/hero-section";
import { Navigation } from "@/components/navigation";

export default function HomePage() {
  return (
    <main>
      <Navigation />
      <CartSidebar />
      <HeroSection />
      <FeaturedCollection />
      <Footer />
    </main>
  );
}
