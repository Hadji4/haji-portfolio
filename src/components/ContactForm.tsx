"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong");
      }
      toast.success("Message sent — I'll get back to you soon.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card-surface mx-auto mt-10 max-w-xl rounded-2xl p-8 text-left"
    >
      {/* Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
        <input
          {...register("name")}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-foreground outline-none focus:border-violet-500"
          placeholder="Your name"
        />
        {errors.name && <p className="mt-1 text-xs text-pink-400">{errors.name.message}</p>}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
        <input
          {...register("email")}
          type="email"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-foreground outline-none focus:border-violet-500"
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-pink-400">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Subject (optional)</label>
        <input
          {...register("subject")}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-foreground outline-none focus:border-violet-500"
          placeholder="What's this about?"
        />
      </div>

      <div className="mb-6">
        <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
        <textarea
          {...register("message")}
          rows={5}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-foreground outline-none focus:border-violet-500"
          placeholder="Tell me about your project..."
        />
        {errors.message && <p className="mt-1 text-xs text-pink-400">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
