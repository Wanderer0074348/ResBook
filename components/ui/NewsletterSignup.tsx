"use client";

import { useState, useEffect } from "react";
import { Mail, Check } from "lucide-react";

const NEWSLETTER_KEY = "resbook-newsletter";

interface NewsletterSignupProps {
  className?: string;
}

export function NewsletterSignup({ className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(NEWSLETTER_KEY);
    if (stored === "subscribed") setIsSubscribed(true);
  }, []);

  if (isSubscribed) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    await new Promise((resolve) => setTimeout(resolve, 500));

    localStorage.setItem(NEWSLETTER_KEY, "subscribed");
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className={`flex items-center gap-2 text-green-600 ${className}`}>
        <Check className="w-4 h-4" />
        <span className="text-sm">Subscribed!</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-xs font-bold uppercase mb-2">Newsletter</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-700 dark:bg-black"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-2 py-1 bg-gray-900 text-white text-xs disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {status === "loading" ? "..." : <Mail className="w-3 h-3" />}
        </button>
      </form>
    </div>
  );
}