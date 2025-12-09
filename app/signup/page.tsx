"use client";

import type React from "react";
import { useState } from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, Check, Eye, EyeOff } from "lucide-react";

import { AuthButton } from "@/components/ui/auth-button";
import { ErrorAlert } from "@/components/ui/error-alert";
import { FormInput } from "@/components/ui/form-input";
import { SuccessMessage } from "@/components/ui/success-message";

import { useToast } from "@/contexts/toast-context";

import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

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
  const { showToast } = useToast();

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
      showToast({ type: "error", message: "Passwords do not match" });
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      showToast({ type: "error", message: "Please agree to terms" });
      return;
    }

    if (!passwordRequirements.every((req) => req.met)) {
      setError("Password does not meet requirements");
      showToast({ type: "error", message: "Password too weak" });
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
      showToast({ type: "error", message: "Signup failed", description: error.message });
      setIsLoading(false);
      return;
    }

    showToast({
      type: "success",
      message: "Account created!",
      description: "Please check your email",
    });
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
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="text-sm font-light tracking-[0.3em] uppercase mb-16 block text-center"
          >
            SEESAW
          </Link>
          <SuccessMessage
            title="Check your email"
            description={
              <>
                We&apos;ve sent a confirmation link to
                <br />
                <span className="text-foreground">{formData.email}</span>
              </>
            }
          />
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="text-sm font-light tracking-[0.3em] uppercase mb-8 block">
            SEESAW
          </Link>
          <h1 className="text-2xl font-extralight tracking-wide mb-2">Create Account</h1>
          <p className="text-sm text-muted-foreground font-light mb-6">
            Create an account to enjoy exclusive benefits.
          </p>
          <ErrorAlert message={error} className="mb-4" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <FormInput
                label="Last Name"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              required
            />
            <div>
              <label className="block text-[10px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-border focus:border-foreground outline-none text-sm font-light transition-colors pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 space-y-0.5">
                {passwordRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check
                      className={`w-3 h-3 ${req.met ? "text-green-500" : "text-muted-foreground/30"}`}
                    />
                    <span
                      className={`text-[10px] ${req.met ? "text-green-500" : "text-muted-foreground"}`}
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <FormInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-foreground shrink-0"
                />
                <span className="text-[11px] font-light text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="underline hover:text-foreground">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={subscribeNewsletter}
                  onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-foreground shrink-0"
                />
                <span className="text-[11px] font-light text-muted-foreground">
                  Subscribe to newsletter
                </span>
              </label>
            </div>
            <AuthButton type="submit" isLoading={isLoading} className="mt-4">
              Create Account
            </AuthButton>
          </form>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm font-light text-muted-foreground text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-foreground underline underline-offset-4 hover:no-underline"
              >
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
            backgroundImage: `url('/images/account/signin.png')`,
          }}
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="text-white text-sm font-light tracking-[0.2em] uppercase">
            Join the SEESAW World
          </p>
        </div>
      </div>
    </main>
  );
}
