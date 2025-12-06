"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const supabase = createClient();

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "One number", met: /[0-9]/.test(formData.password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (!passwordRequirements.every((req) => req.met)) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          subscribe_newsletter: subscribeNewsletter,
        },
      },
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
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>

          <h1 className="text-2xl font-extralight tracking-wide mb-4">Check your email</h1>
          <p className="text-sm text-muted-foreground font-light mb-8">
            We&apos;ve sent a confirmation link to
            <br />
            <span className="text-foreground">{formData.email}</span>
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
    <main className="min-h-screen flex">
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

          <h1 className="text-3xl font-extralight tracking-wide mb-3">Create Account</h1>
          <p className="text-sm text-muted-foreground font-light mb-12">
            Create an account to enjoy exclusive benefits.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-0 py-3 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors"
                required
              />
            </div>

            <div className="space-y-4 pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-foreground"
                />
                <span className="text-xs font-light text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="underline hover:text-foreground">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-foreground"
                />
                <span className="text-xs font-light text-muted-foreground">
                  Subscribe to our newsletter for exclusive updates
                </span>
              </label>
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
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm font-light text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground underline underline-offset-4 hover:no-underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative bg-neutral-900 dark:bg-neutral-100">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/minimalist-fashion-editorial-cream-beige-model.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-white text-sm font-light tracking-[0.2em] uppercase">Join the SEESAW World</p>
        </div>
      </div>
    </main>
  );
}
