import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/breadcrumb";
import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { PromoBanner } from "@/components/promo-banner";
import { RecentlyViewed } from "@/components/recently-viewed";

import { getProductById, products } from "@/data/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: "Product Not Found | SEESAW" };
  }

  return {
    title: `${product.name} | SEESAW`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Collection", href: "/collection" },
    {
      label: product.category.charAt(0).toUpperCase() + product.category.slice(1),
      href: `/collection?category=${product.category}`,
    },
    { label: product.name },
  ];

  return (
    <main>
      <PromoBanner />
      <Navigation />
      <CartSidebar />

      <section className="pt-28 pb-24 lg:pb-32 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            <div className="lg:col-span-3">
              <ProductGallery images={product.images} name={product.name} />
            </div>
            <div className="lg:col-span-2">
              <ProductInfo product={product} />
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewed currentProductId={product.id} />

      <Footer />
    </main>
  );
}
