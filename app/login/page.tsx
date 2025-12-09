"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

import { useToast } from "@/contexts/toast-context";

import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      showToast({ type: "error", message: "Login failed", description: error.message });
      setIsLoading(false);
      return;
    }

    showToast({ type: "success", message: "Welcome back!", description: "Successfully signed in" });
    router.push("/account");
    router.refresh();
  };

  return (
    <main className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-100 dark:bg-neutral-900">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/account/login.png')`,
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-white text-sm font-light tracking-[0.2em] uppercase">
            The Art of Balance
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="text-sm font-light tracking-[0.3em] uppercase mb-16 block">
            SEESAW
          </Link>

          <h1 className="text-3xl font-extralight tracking-wide mb-3">Sign In</h1>
          <p className="text-sm text-muted-foreground font-light mb-12">
            Welcome back. Please sign in to your account.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-foreground" />
                <span className="text-xs font-light text-muted-foreground">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background py-4 text-[11px] font-light tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {isLoading ? (
                <div className="w-4 h-4 border border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm font-light text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-foreground underline underline-offset-4 hover:no-underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
