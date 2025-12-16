import { notFound } from "next/navigation";

import { Breadcrumb } from "@/components/breadcrumb";
import { CartSidebar } from "@/components/cart-sidebar";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { PromoBanner } from "@/components/promo-banner";
import { RecentlyViewed } from "@/components/recently-viewed";

import { getProductBySlugServer } from "@/lib/products-server";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugServer(slug);

  if (!product) {
    return { title: "제품을 찾을 수 없습니다" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | SEESAW`,
      description: product.description,
      images: product.images?.[0]
        ? [
            {
              url: product.images[0],
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugServer(slug);

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
