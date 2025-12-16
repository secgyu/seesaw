import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seesaw.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/auth/",
          "/admin/",
          "/checkout/",
          "/account/",
          "/wishlist/",
          "/order-confirmation/",
          "/login/",
          "/signup/",
          "/forgot-password/",
          "/reset-password/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
