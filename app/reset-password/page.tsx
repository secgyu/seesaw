"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordRequirements.every((req) => req.met)) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 3000);
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
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-extralight tracking-wide mb-4">Password Updated</h1>
          <p className="text-sm text-muted-foreground font-light mb-8">
            Your password has been successfully updated.
            <br />
            Redirecting to login...
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
          >
            Go to login
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
        <Link href="/" className="text-sm font-light tracking-[0.3em] uppercase mb-16 block text-center">
          SEESAW
        </Link>

        <h1 className="text-3xl font-extralight tracking-wide mb-3">Set New Password</h1>
        <p className="text-sm text-muted-foreground font-light mb-12">Please enter your new password below.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors pr-10"
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
            <div className="mt-3 space-y-1">
              {passwordRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 flex items-center justify-center ${
                      req.met ? "text-green-500" : "text-muted-foreground/30"
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                  <span className={`text-[10px] ${req.met ? "text-green-500" : "text-muted-foreground"}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
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
                Update Password
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
