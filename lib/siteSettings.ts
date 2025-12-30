"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export type SiteSocialLinks = {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
};

export type SiteSettings = {
  contactEmail: string;
  socials: SiteSocialLinks;
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contactEmail: "support@coneiz.com",
  socials: {
    instagram: "https://www.instagram.com/coneiz",
    twitter: "",
    linkedin: "",
    github: "",
  },
};

const normalizeUrl = (raw: unknown) => {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        unsub = onSnapshot(
          doc(db, "site_settings", "main"),
          (snap) => {
            if (!snap.exists()) return;
            const data = snap.data() as any;

            const contactEmail = String(data.contactEmail ?? DEFAULT_SITE_SETTINGS.contactEmail).trim();
            const socialsRaw = (data.socials ?? {}) as any;

            setSettings({
              contactEmail: contactEmail || DEFAULT_SITE_SETTINGS.contactEmail,
              socials: {
                instagram: normalizeUrl(socialsRaw.instagram ?? DEFAULT_SITE_SETTINGS.socials.instagram),
                twitter: normalizeUrl(socialsRaw.twitter ?? ""),
                linkedin: normalizeUrl(socialsRaw.linkedin ?? ""),
                github: normalizeUrl(socialsRaw.github ?? ""),
              },
            });
          },
          () => {
            // ignore and keep defaults
          }
        );
      } catch {
        // ignore and keep defaults
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return settings;
}
