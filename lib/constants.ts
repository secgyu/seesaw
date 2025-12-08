export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "outerwear", label: "Outerwear" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "accessories", label: "Accessories" },
  { value: "fragrance", label: "Fragrance" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const STANDARD_SIZES = ["XS", "S", "M", "L", "XL"] as const;
export const BELT_SIZES = ["S", "M", "L"] as const;
export const ONE_SIZE = ["One Size"] as const;
export const FRAGRANCE_SIZES = ["30ml", "50ml", "100ml"] as const;

export type StandardSize = (typeof STANDARD_SIZES)[number];
export type BeltSize = (typeof BELT_SIZES)[number];

export const SIZE_GUIDE = [
  { size: "XS", chest: "82-86", waist: "62-66", hips: "88-92" },
  { size: "S", chest: "86-90", waist: "66-70", hips: "92-96" },
  { size: "M", chest: "90-94", waist: "70-74", hips: "96-100" },
  { size: "L", chest: "94-98", waist: "74-78", hips: "100-104" },
  { size: "XL", chest: "98-102", waist: "78-82", hips: "104-108" },
] as const;

export const SIZE_CHART_WOMEN = {
  headers: ["Size", "XS", "S", "M", "L", "XL"],
  rows: [
    ["US Size", "0-2", "4-6", "8-10", "12-14", "16"],
    ["UK Size", "4-6", "8-10", "12-14", "16-18", "20"],
    ["EU Size", "32-34", "36-38", "40-42", "44-46", "48"],
    ["Bust (cm)", "78-82", "84-88", "90-94", "98-102", "108-112"],
    ["Waist (cm)", "60-64", "66-70", "74-78", "82-86", "92-96"],
    ["Hips (cm)", "86-90", "92-96", "98-102", "106-110", "116-120"],
  ],
} as const;

export const NAV_LINKS = [
  { href: "/collection", label: "Collection" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const MOBILE_NAV_LINKS = [
  { href: "/collection", label: "Collection" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping & Returns" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { href: "/collection", label: "All Products" },
    { href: "/collection?category=outerwear", label: "Outerwear" },
    { href: "/collection?category=tops", label: "Tops" },
    { href: "/collection?category=bottoms", label: "Bottoms" },
    { href: "/lookbook", label: "Lookbook" },
  ],
  about: [
    { href: "/about", label: "Our Story" },
    { href: "/about#philosophy", label: "Philosophy" },
    { href: "/about#process", label: "Process" },
  ],
  help: [
    { href: "/contact", label: "Contact Us" },
    { href: "/faq", label: "FAQ" },
    { href: "/shipping", label: "Shipping & Returns" },
    { href: "/size-guide", label: "Size Guide" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
} as const;

export const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", icon: "instagram" },
  { href: "https://twitter.com", label: "Twitter", icon: "twitter" },
] as const;

export const BRAND = {
  name: "SEESAW",
  email: "contact@seesaw.com",
  fitEmail: "fit@seesaw.com",
  copyright: `© ${new Date().getFullYear()} SEESAW. All rights reserved.`,
} as const;

export const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  { value: "JP", label: "Japan" },
  { value: "KR", label: "South Korea" },
  { value: "AU", label: "Australia" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
] as const;

export const SHIPPING_OPTIONS = [
  {
    value: "standard",
    label: "Standard Shipping",
    description: "5-7 business days",
    price: 0,
  },
  {
    value: "express",
    label: "Express Shipping",
    description: "2-3 business days",
    price: 25,
  },
] as const;

export type ShippingMethod = (typeof SHIPPING_OPTIONS)[number]["value"];
