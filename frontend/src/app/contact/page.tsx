"use client";

import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">

      {/* Header */}
      <div className="mb-14">
        <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-4">
          contact
        </p>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
          Get in touch.
        </h1>
        <p className="text-white/55 text-lg">
          Have a question about Hyve, want to partner, or just curious how it
          works? Send us a message and we'll get back to you.
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-accent/30 via-accent/10 to-transparent mb-12" />

      {submitted ? (
        <div className="bg-card-bg border border-card-border rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-5">
            <span className="text-success text-xl">✓</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Message received.</h2>
          <p className="text-white/50 text-sm">
            Thanks for reaching out. We'll be in touch at{" "}
            <span className="text-accent">{form.email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/40">
                name
              </label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="your name"
                className="bg-card-bg border border-card-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-accent/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/40">
                email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="bg-card-bg border border-card-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-white/40">
              your question or message
            </label>
            <textarea
              name="message"
              required
              value={form.message}
              onChange={handleChange}
              rows={6}
              placeholder="What would you like to know?"
              className="bg-card-bg border border-card-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-semibold py-3.5 rounded-xl text-sm hover:bg-accent-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "sending..." : "send message"}
          </button>

        </form>
      )}

      {/* Footer note */}
      <p className="text-white/25 text-xs text-center mt-10">
        For urgent inquiries or partnership discussions, all messages are
        reviewed by the Hyve team.
      </p>

    </div>
  );
}
