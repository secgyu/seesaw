"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Order } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  Heart,
  LogOut,
  Package,
  Settings,
  User,
} from "lucide-react";

import { OrderSkeleton } from "@/components/ui/skeleton";

import { useToast } from "@/contexts/toast-context";
import { useWishlist } from "@/contexts/wishlist-context";

import { createClient } from "@/lib/supabase/client";

import { getProductById } from "@/data/products";

export const dynamic = "force-dynamic";

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const { state } = useWishlist();
  const { showToast } = useToast();
  const wishlistProductIds = state.items;
  const wishlistProducts = wishlistProductIds.map((id) => getProductById(id)).filter(Boolean);
  const supabase = createClient();

  const [profileName, setProfileName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setProfileName(user.user_metadata?.full_name || user.user_metadata?.first_name || "");
        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (ordersData) {
          setOrders(ordersData as Order[]);
        }
        setOrdersLoading(false);
      } else {
        router.push("/login");
      }
      setLoading(false);
    };
    getUser();
  }, [router, supabase.auth, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast({ type: "success", message: "Signed out", description: "See you soon!" });
    router.push("/");
    router.refresh();
  };

  const handleProfileUpdate = async () => {
    setProfileSaving(true);
    setProfileError("");
    setProfileSuccess(false);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: profileName },
    });

    if (error) {
      setProfileError(error.message);
      showToast({ type: "error", message: "Update failed", description: error.message });
    } else {
      setProfileSuccess(true);
      showToast({ type: "success", message: "Profile updated" });
      setTimeout(() => setProfileSuccess(false), 3000);
    }
    setProfileSaving(false);
  };

  const handlePasswordChange = async () => {
    setPasswordSaving(true);
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match");
      showToast({ type: "error", message: "Passwords do not match" });
      setPasswordSaving(false);
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      showToast({ type: "error", message: "Password too short" });
      setPasswordSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordError(error.message);
      showToast({ type: "error", message: "Update failed", description: error.message });
    } else {
      setPasswordSuccess(true);
      setNewPassword("");
      setConfirmNewPassword("");
      showToast({ type: "success", message: "Password updated" });
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setPasswordSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setDeleteError("Please type DELETE to confirm");
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Failed to delete account");
        setDeleting(false);
        return;
      }

      router.push("/?deleted=true");
    } catch {
      setDeleteError("An error occurred. Please try again.");
      setDeleting(false);
    }
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
    user.user_metadata?.full_name ||
    user.user_metadata?.first_name ||
    user.email?.split("@")[0] ||
    "User";
  const userEmail = user.email || "";

  const menuItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package, count: orders.length },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlistProducts.length },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
    }
  };

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
          <Link href="/" className="text-sm font-light tracking-[0.3em] uppercase">
            SEESAW
          </Link>
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
                      <p className="text-sm text-muted-foreground font-light">
                        No default address set
                      </p>
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
                    {ordersLoading ? (
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-3 border-b border-border animate-pulse"
                          >
                            <div className="space-y-1">
                              <div className="h-4 w-24 bg-muted rounded" />
                              <div className="h-3 w-20 bg-muted rounded" />
                            </div>
                            <div className="text-right space-y-1">
                              <div className="h-4 w-16 bg-muted rounded" />
                              <div className="h-3 w-12 bg-muted rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.slice(0, 2).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between py-3 border-b border-border last:border-0"
                          >
                            <div>
                              <p className="text-sm font-light">{order.order_number}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-light">${order.total}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {order.status}
                              </p>
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
                  {ordersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <OrderSkeleton key={i} />
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-border p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-light mb-1">{order.order_number}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                            <div className="text-center">
                              <span
                                className={`inline-block px-3 py-1 text-[10px] tracking-wider uppercase ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-light">${order.total}</p>
                            </div>
                          </div>
                          {/* Order Items */}
                          <div className="border-t border-border pt-4 mt-4">
                            <p className="text-[10px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
                              Items ({order.items.length})
                            </p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm font-light">
                                  <span>
                                    {item.name} × {item.quantity}
                                    <span className="text-muted-foreground ml-2">
                                      ({item.size})
                                    </span>
                                  </span>
                                  <span>${item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Shipping Address */}
                          <div className="border-t border-border pt-4 mt-4">
                            <p className="text-[10px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                              Shipping Address
                            </p>
                            <p className="text-sm font-light text-muted-foreground">
                              {order.shipping_address.firstName} {order.shipping_address.lastName}
                              <br />
                              {order.shipping_address.address}
                              <br />
                              {order.shipping_address.city}, {order.shipping_address.postalCode}
                              <br />
                              {order.shipping_address.country}
                            </p>
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
                          href={`/product/${product!.slug}`}
                          className="group border border-border p-4 flex gap-4"
                        >
                          <div className="w-24 h-32 bg-neutral-100 dark:bg-neutral-800 shrink-0 relative">
                            <Image
                              src={product!.images[0] || "/placeholder.svg"}
                              alt={product!.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-light group-hover:underline">
                              {product!.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">${product!.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 border border-border">
                      <Heart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                      <p className="text-sm text-muted-foreground font-light mb-4">
                        Your wishlist is empty
                      </p>
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

                    {profileSuccess && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Profile updated successfully
                      </div>
                    )}
                    {profileError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {profileError}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          disabled
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border text-muted-foreground outline-none text-sm font-light"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={profileSaving}
                      className="mt-6 bg-foreground text-background px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {profileSaving ? (
                        <div className="w-4 h-4 border border-background/30 border-t-background rounded-full animate-spin" />
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>

                  <div className="border border-border p-6">
                    <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-6">
                      Change Password
                    </h3>

                    {passwordSuccess && (
                      <div className="mb-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Password updated successfully
                      </div>
                    )}
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {passwordError}
                      </div>
                    )}

                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                          placeholder="At least 8 characters"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePasswordChange}
                      disabled={passwordSaving || !newPassword || !confirmNewPassword}
                      className="mt-6 bg-foreground text-background px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {passwordSaving ? (
                        <div className="w-4 h-4 border border-background/30 border-t-background rounded-full animate-spin" />
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>

                  <div className="border border-red-200 dark:border-red-800 p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-red-500 mb-2">
                          Danger Zone
                        </h3>
                        <p className="text-sm text-muted-foreground font-light">
                          Once you delete your account, there is no going back. All your data will
                          be permanently removed.
                        </p>
                      </div>
                    </div>

                    {deleteError && (
                      <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                        {deleteError}
                      </div>
                    )}

                    <div className="max-w-md">
                      <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                        Type DELETE to confirm
                      </label>
                      <input
                        type="text"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-red-300 focus:border-red-500 outline-none text-sm font-light transition-colors"
                        placeholder="DELETE"
                      />
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting || deleteConfirm !== "DELETE"}
                      className="mt-6 px-6 py-3 text-[11px] font-light tracking-[0.15em] uppercase border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {deleting ? (
                        <div className="w-4 h-4 border border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                      ) : (
                        "Delete Account"
                      )}
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
