"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Order } from "@/types";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, LogOut, Package, Settings, User } from "lucide-react";

import { AccountOrders } from "@/components/account/account-orders";
import { AccountOverview } from "@/components/account/account-overview";
import { AccountSettings } from "@/components/account/account-settings";
import { AccountWishlist } from "@/components/account/account-wishlist";
import { Logo } from "@/components/ui/logo";
import { Spinner } from "@/components/ui/spinner";

import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/contexts/toast-context";
import { useWishlist } from "@/contexts/wishlist-context";

import { type Product, getProductById } from "@/lib/products";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

type Tab = "overview" | "orders" | "wishlist" | "settings";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  const router = useRouter();
  const { user, isLoading: loading } = useAuth();
  const { state } = useWishlist();
  const { showToast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      const products: Product[] = [];
      for (const id of state.items) {
        const product = await getProductById(id);
        if (product) products.push(product);
      }
      setWishlistProducts(products);
    };
    fetchWishlistProducts();
  }, [state.items]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const loadOrders = async () => {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersData) {
        setOrders(ordersData as Order[]);
      }
      setOrdersLoading(false);
    };

    loadOrders();
  }, [user, loading, router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast({ type: "success", message: "Signed out", description: "See you soon!" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (!user) return null;

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.first_name ||
    user.email?.split("@")[0] ||
    "User";
  const userEmail = user.email || "";
  const initialName = user.user_metadata?.full_name || user.user_metadata?.first_name || "";

  const menuItems = [
    { id: "overview" as Tab, label: "Overview", icon: User },
    { id: "orders" as Tab, label: "Orders", icon: Package, count: orders.length },
    {
      id: "wishlist" as Tab,
      label: "Wishlist",
      icon: Heart,
      count: wishlistProducts.filter(Boolean).length,
    },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <nav className="flex items-center justify-between px-8 py-6 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Shop</span>
          </Link>
          <Logo width={80} height={14} />
          <div className="w-20" />
        </nav>
      </header>

      <div className="pt-32 pb-24 px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="mb-12">
            <h1 className="text-3xl font-extralight tracking-wide mb-2">My Account</h1>
            <p className="text-sm text-muted-foreground font-light">Welcome back, {userName}</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-light transition-colors ${
                      activeTab === item.id ? "bg-foreground text-background" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        className={`text-xs ${activeTab === item.id ? "text-background/70" : "text-muted-foreground"}`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-light text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </div>

            <div className="lg:col-span-3">
              {activeTab === "overview" && (
                <AccountOverview
                  userName={userName}
                  userEmail={userEmail}
                  orders={orders}
                  ordersLoading={ordersLoading}
                  onViewAllOrders={() => setActiveTab("orders")}
                />
              )}

              {activeTab === "orders" && (
                <AccountOrders orders={orders} ordersLoading={ordersLoading} />
              )}

              {activeTab === "wishlist" && <AccountWishlist products={wishlistProducts} />}

              {activeTab === "settings" && (
                <AccountSettings userEmail={userEmail} initialName={initialName} />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
