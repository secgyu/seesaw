"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";

import { AuthButton } from "@/components/ui/auth-button";
import { FormInput } from "@/components/ui/form-input";
import { PasswordInput } from "@/components/ui/password-input";

import { useToast } from "@/contexts/toast-context";

import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

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

            <AuthButton type="submit" isLoading={isLoading} className="mt-8">
              Sign In
            </AuthButton>
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
