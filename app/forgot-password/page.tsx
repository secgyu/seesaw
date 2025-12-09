"use client";

import { useState } from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen flex items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <Link href="/" className="text-sm font-light tracking-[0.3em] uppercase mb-16 block">
            SEESAW
          </Link>

          <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-extralight tracking-wide mb-4">Check your email</h1>
          <p className="text-sm text-muted-foreground font-light mb-8">
            We&apos;ve sent a password reset link to
            <br />
            <span className="text-foreground">{email}</span>
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="text-sm font-light tracking-[0.3em] uppercase mb-16 block text-center"
        >
          SEESAW
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <h1 className="text-3xl font-extralight tracking-wide mb-3">Reset Password</h1>
        <p className="text-sm text-muted-foreground font-light mb-12">
          Enter your email address and we&apos;ll send you a link to reset your password.
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background py-4 text-[11px] font-light tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
          >
            {isLoading ? (
              <div className="w-4 h-4 border border-background/30 border-t-background rounded-full animate-spin" />
            ) : (
              <>
                Send Reset Link
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
