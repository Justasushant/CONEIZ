"use client";

import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { DEFAULT_SITE_SETTINGS } from "@/lib/siteSettings";

type FormState = {
  contactEmail: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  github: string;
};

const DOC_ID = "main";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<FormState>({
    contactEmail: DEFAULT_SITE_SETTINGS.contactEmail,
    instagram: DEFAULT_SITE_SETTINGS.socials.instagram ?? "",
    twitter: "",
    linkedin: "",
    github: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { db } = await import("@/lib/firebase");
        const snap = await getDoc(doc(db, "site_settings", DOC_ID));
        if (snap.exists()) {
          const data = snap.data() as any;
          const socials = (data.socials ?? {}) as any;
          setForm({
            contactEmail: String(data.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail),
            instagram: String(socials.instagram ?? DEFAULT_SITE_SETTINGS.socials.instagram ?? ""),
            twitter: String(socials.twitter ?? ""),
            linkedin: String(socials.linkedin ?? ""),
            github: String(socials.github ?? ""),
          });
        }
      } catch {
        setError("Failed to load settings.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const canSave = useMemo(() => {
    return form.contactEmail.trim().length > 0;
  }, [form.contactEmail]);

  const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const save = async () => {
    if (!canSave || isSaving) return;
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const { db } = await import("@/lib/firebase");
      await setDoc(
        doc(db, "site_settings", DOC_ID),
        {
          contactEmail: form.contactEmail.trim(),
          socials: {
            instagram: form.instagram.trim(),
            twitter: form.twitter.trim(),
            linkedin: form.linkedin.trim(),
            github: form.github.trim(),
          },
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSaved(true);
    } catch {
      setError("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-medium text-brand-navy">Settings</h1>
        <p className="text-sm text-brand-navy/50 font-light mt-1">Edit contact email and social links.</p>
      </div>

      {error && <div className="mb-6 text-sm text-red-600">{error}</div>}
      {saved && <div className="mb-6 text-sm text-brand-blue">Saved.</div>}

      <div className="border border-gray-100">
        <div className="bg-brand-silver/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Site</div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-sm text-brand-navy/50 font-light">Loading…</div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Contact Email</label>
                <input
                  value={form.contactEmail}
                  onChange={onChange("contactEmail")}
                  type="email"
                  className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Instagram URL</label>
                  <input
                    value={form.instagram}
                    onChange={onChange("instagram")}
                    type="text"
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                    placeholder="https://www.instagram.com/coneiz"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Twitter/X URL</label>
                  <input
                    value={form.twitter}
                    onChange={onChange("twitter")}
                    type="text"
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">LinkedIn URL</label>
                  <input
                    value={form.linkedin}
                    onChange={onChange("linkedin")}
                    type="text"
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">GitHub URL</label>
                  <input
                    value={form.github}
                    onChange={onChange("github")}
                    type="text"
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={save}
                disabled={!canSave || isSaving}
                className="bg-brand-navy text-white px-6 py-4 text-sm font-medium rounded-none disabled:opacity-50"
              >
                {isSaving ? "Saving…" : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
