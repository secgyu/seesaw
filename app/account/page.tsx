"use client";

import { useState, useEffect } from "react";

// Vercel 정적 생성 방지
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogOut, ChevronRight, ArrowLeft } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { createClient } from "@/lib/supabase/client";
import { getProductById } from "@/lib/products";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const { state } = useWishlist();
  const wishlistProductIds = state.items;
  const wishlistProducts = wishlistProductIds.map((id) => getProductById(id)).filter(Boolean);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getUser();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border border-foreground/30 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName =
    user.user_metadata?.full_name || user.user_metadata?.first_name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "";

  const menuItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlistProducts.length },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // 더미 주문 데이터
  const orders = [
    { id: "ORD-2024-001", date: "Dec 1, 2024", status: "Delivered", total: 1280 },
    { id: "ORD-2024-002", date: "Nov 15, 2024", status: "Shipped", total: 890 },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <nav className="flex items-center justify-between px-8 py-6 lg:px-12">
          <Link
            href="/"
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Shop</span>
          </Link>
          <Link href="/" className="text-sm font-light tracking-[0.3em] uppercase">
            SEESAW
          </Link>
          <div className="w-20" /> {/* Spacer for centering */}
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
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border border-border p-6">
                      <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-4">
                        Account Details
                      </h3>
                      <p className="text-sm font-light mb-1">{userName}</p>
                      <p className="text-sm text-muted-foreground font-light">{userEmail}</p>
                    </div>
                    <div className="border border-border p-6">
                      <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-4">
                        Default Address
                      </h3>
                      <p className="text-sm text-muted-foreground font-light">No default address set</p>
                      <button className="text-xs font-light underline underline-offset-4 mt-2 hover:no-underline">
                        Add Address
                      </button>
                    </div>
                  </div>

                  <div className="border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground">
                        Recent Orders
                      </h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-xs font-light underline underline-offset-4 hover:no-underline"
                      >
                        View All
                      </button>
                    </div>
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 2).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between py-3 border-b border-border last:border-0"
                          >
                            <div>
                              <p className="text-sm font-light">{order.id}</p>
                              <p className="text-xs text-muted-foreground">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-light">${order.total}</p>
                              <p className="text-xs text-muted-foreground">{order.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground font-light">No orders yet</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-extralight tracking-wide mb-6">Order History</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border p-6 flex items-center justify-between">
                          <div>
                            <p className="text-sm font-light mb-1">{order.id}</p>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                          <div className="text-center">
                            <span
                              className={`inline-block px-3 py-1 text-[10px] tracking-wider uppercase ${
                                order.status === "Delivered"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-light">${order.total}</p>
                            <button className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-border">
                      <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-sm text-muted-foreground font-light mb-4">No orders yet</p>
                      <Link
                        href="/collection"
                        className="inline-flex items-center gap-2 text-xs font-light tracking-[0.15em] uppercase underline underline-offset-4 hover:no-underline"
                      >
                        Start Shopping <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-extralight tracking-wide mb-6">My Wishlist</h2>
                  {wishlistProducts.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {wishlistProducts.map((product) => (
                        <Link
                          key={product!.id}
                          href={`/product/${product!.id}`}
                          className="group border border-border p-4 flex gap-4"
                        >
                          <div className="w-24 h-32 bg-neutral-100 dark:bg-neutral-800 shrink-0">
                            <img
                              src={product!.images[0] || "/placeholder.svg"}
                              alt={product!.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-light group-hover:underline">{product!.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">${product!.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-border">
                      <Heart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-sm text-muted-foreground font-light mb-4">Your wishlist is empty</p>
                      <Link
                        href="/collection"
                        className="inline-flex items-center gap-2 text-xs font-light tracking-[0.15em] uppercase underline underline-offset-4 hover:no-underline"
                      >
                        Explore Collection <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-8">
                  <h2 className="text-xl font-extralight tracking-wide mb-6">Account Settings</h2>

                  <div className="border border-border p-6">
                    <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-6">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          defaultValue={userName}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={userEmail}
                          disabled
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-muted-foreground outline-none text-sm font-light"
                        />
                      </div>
                    </div>
                    <button className="mt-6 bg-foreground text-background px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors">
                      Save Changes
                    </button>
                  </div>

                  <div className="border border-border p-6">
                    <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-6">
                      Change Password
                    </h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                        />
                      </div>
                    </div>
                    <button className="mt-6 bg-foreground text-background px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors">
                      Update Password
                    </button>
                  </div>

                  <div className="border border-red-200 dark:border-red-800 p-6">
                    <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-red-500 mb-4">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-muted-foreground font-light mb-4">
                      Once you delete your account, there is no going back.
                    </p>
                    <button className="px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
