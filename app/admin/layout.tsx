"use client";

import type React from "react";
import { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BarChart3,
  Box,
  Home,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  X,
} from "lucide-react";

import { QueryProvider } from "@/components/providers/query-provider";
import { Spinner } from "@/components/ui/spinner";

import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAILS = ["admin@seesaw.com", "rbals1915@naver.com"];

const navItems = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login?redirect=/admin");
        return;
      }

      const email = user.email || "";
      setUserEmail(email);

      if (!ADMIN_EMAILS.includes(email)) {
        router.push("/");
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -m-2">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium tracking-wide">SEESAW Admin</span>
          <div className="w-9" />
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-neutral-900 text-white transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
            <Link href="/admin" className="text-lg font-light tracking-[0.3em]">
              SEESAW
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 -m-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-white text-neutral-900"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-neutral-800">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs text-neutral-500">Signed in as</p>
              <p className="text-sm text-neutral-300 truncate">{userEmail}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen pt-14 lg:pt-0">
        <QueryProvider>{children}</QueryProvider>
      </main>
    </div>
  );
}
