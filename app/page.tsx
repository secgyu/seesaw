import { Navigation } from "@/components/navigation";
import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCollection } from "@/components/home/featured-collection";

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
