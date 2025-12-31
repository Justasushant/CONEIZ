"use client";

import React, { useMemo, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Mail } from "lucide-react";
import { useSiteSettings } from "@/lib/siteSettings";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export default function ContactPage() {
  const settings = useSiteSettings();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0 && phone.trim().length > 0 && message.trim().length > 0;
  }, [name, email, phone, message]);

  const makeSubmissionDocId = (rawName: string) => {
    const base = rawName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/-+/g, "-")
      .replace(/^[-_]+|[-_]+$/g, "");

    const safeBase = base.length > 0 ? base : "anonymous";
    return `${safeBase}-${Date.now()}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitState.status === "submitting") return;

    setSubmitState({ status: "submitting" });
    try {
      const { db } = await import("@/lib/firebase");
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPhone = phone.trim();
      const trimmedMessage = message.trim();
      const docId = makeSubmissionDocId(trimmedName);

      await setDoc(doc(db, "contact_submissions", docId), {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        message: trimmedMessage,
        status: "unread",
        timestamp: serverTimestamp(),
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSubmitState({ status: "success" });
    } catch (err) {
      setSubmitState({ status: "error", message: "Submission failed. Please try again." });
    }
  };

  return (
    <div className="animate-fade-in min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side: keep existing dark background as-is */}
      <div className="w-full md:w-5/12 bg-brand-navy p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden pt-40 md:pt-44">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 mb-8">
            <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse"></div>
            <span className="text-xs tracking-widest uppercase font-mono text-white/40">Status: Pre-Launch</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-display font-medium mb-8 leading-tight text-white">
            Let&apos;s build the<br />
            <span className="text-brand-cyan">future.</span>
          </h1>
          <p className="text-white/60 text-lg font-light leading-relaxed max-w-md mb-16">
            Our infrastructure is currently in a closed-access phase. Contact our support team to learn more about early entry.
          </p>

          <div className="space-y-10">
            <div className="flex items-start group">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-6 group-hover:bg-brand-cyan group-hover:text-brand-navy group-hover:border-brand-cyan transition-all duration-300 text-brand-cyan">
                <Mail size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-2">Email Us</h4>
                <a
                  href={settings.contactEmail ? `mailto:${settings.contactEmail}` : undefined}
                  className="text-white/60 font-light font-mono text-sm hover:text-brand-cyan transition-colors"
                >
                  {settings.contactEmail}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <div className="h-px w-full bg-white/5 mb-8"></div>
          <div className="flex justify-between text-white/20 text-xs font-mono">
            <span>EST. 2025</span>
            <span>CONEIZ INC</span>
          </div>
        </div>
      </div>

      {/* Right side: INITIATE CONTACT */}
      <div className="w-full md:w-7/12 bg-white p-12 lg:p-24 flex items-start justify-center relative pt-40 md:pt-44">
        <div className="w-full max-w-xl">
          <h2 className="text-2xl md:text-3xl font-display font-medium text-brand-navy mb-10 tracking-wide">
            INITIATE CONTACT
          </h2>

          {submitState.status === "success" ? (
            <div className="bg-brand-silver/40 p-10 text-left">
              <div className="w-14 h-14 bg-white flex items-center justify-center mb-6 text-brand-blue">
                <Mail size={28} strokeWidth={1.5} />
              </div>
              <p className="text-brand-navy text-lg font-light leading-relaxed">
                Thank you for contacting us. We’ll get back to you very soon.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  autoComplete="name"
                  className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  autoComplete="tel"
                  className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none resize-none"
                  required
                />
              </div>

              {submitState.status === "error" && <div className="text-sm text-red-600">{submitState.message}</div>}

              <button
                type="submit"
                disabled={!canSubmit || submitState.status === "submitting"}
                className="w-full bg-brand-navy text-white px-6 py-4 text-sm font-medium rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitState.status === "submitting" ? "Submitting…" : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
