"use client";

import { useState } from "react";

import { ArrowRight } from "lucide-react";

import { ErrorAlert } from "@/components/ui/error-alert";

import { useToast } from "@/contexts/toast-context";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send message");
        showToast({ type: "error", message: "Failed to send", description: data.error });
        setIsSubmitting(false);
        return;
      }

      showToast({
        type: "success",
        message: "Message sent!",
        description: "We'll get back to you soon",
      });
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("An error occurred. Please try again.");
      showToast({ type: "error", message: "Something went wrong" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-light">Thank you for your message.</p>
        <p className="text-sm font-light text-muted-foreground mt-2">
          We will be in touch shortly.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-8 text-[11px] font-light tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ErrorAlert message={error} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label
            htmlFor="name"
            className="block text-[11px] font-light tracking-[0.1em] uppercase mb-3"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full py-3 border-b border-black/20 bg-transparent text-sm font-light outline-none focus:border-black transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-[11px] font-light tracking-[0.1em] uppercase mb-3"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full py-3 border-b border-black/20 bg-transparent text-sm font-light outline-none focus:border-black transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-[11px] font-light tracking-[0.1em] uppercase mb-3"
        >
          Subject
        </label>
        <select
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
          className="w-full py-3 border-b border-black/20 bg-transparent text-sm font-light outline-none focus:border-black transition-colors appearance-none cursor-pointer"
        >
          <option value="">Select a subject</option>
          <option value="general">General Inquiry</option>
          <option value="orders">Orders & Shipping</option>
          <option value="stockists">Stockist Information</option>
          <option value="press">Press & Media</option>
          <option value="careers">Careers</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-[11px] font-light tracking-[0.1em] uppercase mb-3"
        >
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          className="w-full py-3 border-b border-black/20 bg-transparent text-sm font-light outline-none focus:border-black transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-3 py-4 px-8 bg-black text-white text-[11px] font-light tracking-[0.2em] uppercase hover:bg-black/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
