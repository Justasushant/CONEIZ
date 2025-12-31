"use client";

import React, { useMemo, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Mail, X } from "lucide-react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

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

export default function ServiceContactModal({
  open,
  onClose,
  service,
  price,
}: {
  open: boolean;
  onClose: () => void;
  service: string;
  price: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const canSubmit = useMemo(() => {
    return name.trim().length > 0 && email.trim().length > 0 && phone.trim().length > 0 && message.trim().length > 0;
  }, [name, email, phone, message]);

  if (!open) return null;

  const close = () => {
    setSubmitState({ status: "idle" });
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    onClose();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitState.status === "submitting") return;

    setSubmitState({ status: "submitting" });
    try {
      const { db } = await import("@/lib/firebase");
      const docId = makeSubmissionDocId(name);
      await setDoc(doc(db, "contact_submissions", docId), {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        service,
        price,
        status: "unread",
        timestamp: serverTimestamp(),
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setSubmitState({ status: "success" });
    } catch {
      setSubmitState({ status: "error", message: "Submission failed. Please try again." });
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-[201] w-full max-w-xl mx-6 bg-white rounded-none">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50">Initiate Contact</div>
            <div className="text-sm text-brand-navy mt-1 font-light">
              Service: <span className="font-medium">{service}</span> · Price: <span className="font-medium">{price}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="p-2 text-brand-navy/60 hover:text-brand-navy"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
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
