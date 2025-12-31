"use client";

import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const DOC_ID = "main";

const linesToList = (value: string) =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const listToLines = (value: string[] | undefined) => (value ?? []).join("\n");

const parsePairs = (value: string) => {
  return value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...rest] = line.split("|");
      return {
        left: String(left ?? "").trim(),
        right: String(rest.join("|") ?? "").trim(),
      };
    })
    .filter((p) => p.left.length > 0);
};

export default function AdminAboutPage() {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [highlightsText, setHighlightsText] = useState("");

  const [showManifesto, setShowManifesto] = useState(true);
  const [showOrigin, setShowOrigin] = useState(true);
  const [showValues, setShowValues] = useState(true);

  const [originYear, setOriginYear] = useState("");
  const [originFoundedDate, setOriginFoundedDate] = useState("");
  const [originDescription, setOriginDescription] = useState("");
  const [originTimelineText, setOriginTimelineText] = useState("");

  const [value1Title, setValue1Title] = useState("");
  const [value1Desc, setValue1Desc] = useState("");
  const [value2Title, setValue2Title] = useState("");
  const [value2Desc, setValue2Desc] = useState("");
  const [value3Title, setValue3Title] = useState("");
  const [value3Desc, setValue3Desc] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { db } = await import("@/lib/firebase");
        const snap = await getDoc(doc(db, "about_content", DOC_ID));
        if (snap.exists()) {
          const data = snap.data() as any;
          setHeading(String(data.heading ?? ""));
          setDescription(String(data.description ?? ""));
          setHighlightsText(listToLines(Array.isArray(data.highlights) ? data.highlights.map(String) : []));

          const sections = (data.sections ?? {}) as any;
          setShowManifesto(Boolean(sections.manifesto ?? true));
          setShowOrigin(Boolean(sections.origin ?? true));
          setShowValues(Boolean(sections.values ?? true));

          const origin = (data.origin ?? {}) as any;
          setOriginYear(String(origin.year ?? ""));
          setOriginFoundedDate(String(origin.foundedDate ?? ""));
          setOriginDescription(String(origin.description ?? ""));
          if (Array.isArray(origin.timeline)) {
            const lines = origin.timeline
              .map((t: any) => {
                const title = String(t?.title ?? "").trim();
                const date = String(t?.date ?? "").trim();
                if (!title || !date) return "";
                return `${title} | ${date}`;
              })
              .filter(Boolean)
              .join("\n");
            setOriginTimelineText(lines);
          }

          const values = Array.isArray(data.values) ? data.values : [];
          const v1 = values[0] ?? {};
          const v2 = values[1] ?? {};
          const v3 = values[2] ?? {};
          setValue1Title(String(v1.title ?? ""));
          setValue1Desc(String(v1.description ?? ""));
          setValue2Title(String(v2.title ?? ""));
          setValue2Desc(String(v2.description ?? ""));
          setValue3Title(String(v3.title ?? ""));
          setValue3Desc(String(v3.description ?? ""));

        }
      } catch {
        setError("Failed to load About content.");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const canSave = useMemo(() => {
    return heading.trim().length > 0 && description.trim().length > 0;
  }, [heading, description]);

  const save = async () => {
    if (!canSave) return;
    setSaved(false);
    setIsSaving(true);
    setError(null);

    try {
      const { db } = await import("@/lib/firebase");

      const timelinePairs = parsePairs(originTimelineText);
      const timeline = timelinePairs
        .filter((p) => p.left.length > 0 && p.right.length > 0)
        .map((p, idx) => ({
          title: p.left,
          date: p.right,
          primary: idx === 0,
        }));

      const values = [
        { title: value1Title.trim(), description: value1Desc.trim() },
        { title: value2Title.trim(), description: value2Desc.trim() },
        { title: value3Title.trim(), description: value3Desc.trim() },
      ].filter((v) => v.title.length > 0 && v.description.length > 0);

      await setDoc(
        doc(db, "about_content", DOC_ID),
        {
          heading: heading.trim(),
          description: description.trim(),
          highlights: linesToList(highlightsText),
          sections: {
            manifesto: showManifesto,
            origin: showOrigin,
            values: showValues,
          },
          origin: {
            year: originYear.trim(),
            foundedDate: originFoundedDate.trim(),
            description: originDescription.trim(),
            timeline,
          },
          values,
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      setSaved(true);
    } catch {
      setError("Failed to save About content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-medium text-brand-navy">About</h1>
        <p className="text-sm text-brand-navy/50 font-light mt-1">Edit About page content.</p>
      </div>

      {error && <div className="mb-6 text-sm text-red-600">{error}</div>}
      {saved && <div className="mb-6 text-sm text-brand-blue">Saved.</div>}

      <div className="border border-gray-100 bg-white">
        <div className="bg-brand-silver/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Content</div>
        <div className="p-6">
          {isLoading ? (
            <div className="text-sm text-brand-navy/50 font-light">Loading…</div>
          ) : (
            <div className="space-y-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-3">Sections</div>
                <div className="space-y-3 text-sm text-brand-navy">
                  <label className="flex items-center justify-between gap-4">
                    <span className="text-brand-navy/60">Manifesto</span>
                    <input type="checkbox" checked={showManifesto} onChange={(e) => setShowManifesto(e.target.checked)} />
                  </label>
                  <label className="flex items-center justify-between gap-4">
                    <span className="text-brand-navy/60">Our Origin</span>
                    <input type="checkbox" checked={showOrigin} onChange={(e) => setShowOrigin(e.target.checked)} />
                  </label>
                  <label className="flex items-center justify-between gap-4">
                    <span className="text-brand-navy/60">Values</span>
                    <input type="checkbox" checked={showValues} onChange={(e) => setShowValues(e.target.checked)} />
                  </label>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-3">Manifesto Content</div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Heading</label>
                    <textarea
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      rows={4}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Highlights (one per line)</label>
                    <textarea
                      value={highlightsText}
                      onChange={(e) => setHighlightsText(e.target.value)}
                      rows={6}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-3">Our Origin</div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Year</label>
                    <input
                      value={originYear}
                      onChange={(e) => setOriginYear(e.target.value)}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Founded Date (highlight)</label>
                    <input
                      value={originFoundedDate}
                      onChange={(e) => setOriginFoundedDate(e.target.value)}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy placeholder:text-brand-navy/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Description</label>
                    <textarea
                      value={originDescription}
                      onChange={(e) => setOriginDescription(e.target.value)}
                      rows={5}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Timeline (one per line: Title | Date)</label>
                    <textarea
                      value={originTimelineText}
                      onChange={(e) => setOriginTimelineText(e.target.value)}
                      rows={5}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none resize-none"
                    />
                    <div className="mt-2 text-[11px] text-brand-navy/40 font-light">The first line is treated as the primary (blue) milestone.</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-3">Values</div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Value 1</label>
                    <input value={value1Title} onChange={(e) => setValue1Title(e.target.value)} className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-3 text-sm text-brand-navy focus:outline-none" placeholder="Title" />
                    <textarea value={value1Desc} onChange={(e) => setValue1Desc(e.target.value)} rows={3} className="mt-2 w-full bg-brand-silver/40 border-0 rounded-none px-4 py-3 text-sm text-brand-navy focus:outline-none resize-none" placeholder="Description" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Value 2</label>
                    <input value={value2Title} onChange={(e) => setValue2Title(e.target.value)} className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-3 text-sm text-brand-navy focus:outline-none" placeholder="Title" />
                    <textarea value={value2Desc} onChange={(e) => setValue2Desc(e.target.value)} rows={3} className="mt-2 w-full bg-brand-silver/40 border-0 rounded-none px-4 py-3 text-sm text-brand-navy focus:outline-none resize-none" placeholder="Description" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Value 3</label>
                    <input value={value3Title} onChange={(e) => setValue3Title(e.target.value)} className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-3 text-sm text-brand-navy focus:outline-none" placeholder="Title" />
                    <textarea value={value3Desc} onChange={(e) => setValue3Desc(e.target.value)} rows={3} className="mt-2 w-full bg-brand-silver/40 border-0 rounded-none px-4 py-3 text-sm text-brand-navy focus:outline-none resize-none" placeholder="Description" />
                  </div>
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
