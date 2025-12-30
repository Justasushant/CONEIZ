"use client";

import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { PRODUCT_PLANS } from "@/constants";

type PriceUnit = "per month" | "per year" | "one-time";

type PricingPack = {
  id: string;
  packName: string;
  priceValue: string; // keep as string for flexibility
  priceUnit: PriceUnit;
  features: string[];
  ctaText: string;
  isActive: boolean;
};

const DEFAULT_UNIT: PriceUnit = "per month";

const linesToList = (value: string) =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const listToLines = (list: string[]) => (list ?? []).join("\n");

export default function AdminPricingPage() {
  const [packs, setPacks] = useState<PricingPack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"create" | "edit" | "idle">("idle");
  const [activeId, setActiveId] = useState<string | null>(null);

  const [packName, setPackName] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>(DEFAULT_UNIT);
  const [featuresText, setFeaturesText] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        unsub = onSnapshot(
          collection(db, "pricing_packs"),
          (snap) => {
            const next = snap.docs
              .map((d) => {
                const data = d.data() as any;
                const unit: PriceUnit =
                  data.priceUnit === "per year" || data.priceUnit === "one-time" ? data.priceUnit : "per month";
                return {
                  id: d.id,
                  packName: String(data.packName ?? ""),
                  priceValue: String(data.priceValue ?? ""),
                  priceUnit: unit,
                  features: Array.isArray(data.features) ? data.features.map(String) : [],
                  ctaText: String(data.ctaText ?? ""),
                  isActive: Boolean(data.isActive),
                } satisfies PricingPack;
              })
              .sort((a, b) => a.packName.localeCompare(b.packName));

            setPacks(next);
            setIsLoading(false);
          },
          () => {
            setError("Failed to load pricing packs.");
            setIsLoading(false);
          }
        );
      } catch {
        setError("Failed to load pricing packs.");
        setIsLoading(false);
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const resetForm = () => {
    setPackName("");
    setPriceValue("");
    setPriceUnit(DEFAULT_UNIT);
    setFeaturesText("");
    setCtaText("");
    setIsActive(true);
    setActiveId(null);
    setMode("idle");
    setError(null);
  };

  const startCreate = () => {
    resetForm();
    setMode("create");
  };

  const startEdit = (pack: PricingPack) => {
    setMode("edit");
    setActiveId(pack.id);
    setPackName(pack.packName);
    setPriceValue(pack.priceValue);
    setPriceUnit(pack.priceUnit);
    setFeaturesText(listToLines(pack.features));
    setCtaText(pack.ctaText);
    setIsActive(pack.isActive);
  };

  const canSave = useMemo(() => {
    return packName.trim().length > 0 && priceValue.trim().length > 0 && ctaText.trim().length > 0;
  }, [packName, priceValue, ctaText]);

  const save = async () => {
    if (!canSave) return;
    setError(null);

    const payload = {
      packName: packName.trim(),
      priceValue: priceValue.trim(),
      priceUnit,
      features: linesToList(featuresText),
      ctaText: ctaText.trim(),
      isActive,
      updatedAt: serverTimestamp(),
    };

    try {
      const { db } = await import("@/lib/firebase");

      if (mode === "create") {
        const id = `${packName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "")}-${Date.now()}`;
        await setDoc(doc(db, "pricing_packs", id), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        resetForm();
        return;
      }

      if (mode === "edit" && activeId) {
        await updateDoc(doc(db, "pricing_packs", activeId), payload);
        resetForm();
      }
    } catch {
      setError("Failed to save pricing pack.");
    }
  };

  const toggleActive = async (pack: PricingPack) => {
    setError(null);
    try {
      const { db } = await import("@/lib/firebase");
      await updateDoc(doc(db, "pricing_packs", pack.id), {
        isActive: !pack.isActive,
        updatedAt: serverTimestamp(),
      });
    } catch {
      setError("Failed to update pack.");
    }
  };

  const seedDefaults = async () => {
    setError(null);
    try {
      const { db } = await import("@/lib/firebase");

      for (const plan of PRODUCT_PLANS) {
        const id = String(plan.name)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-_]/g, "");

        await setDoc(doc(db, "pricing_packs", id), {
          packName: String(plan.name),
          priceValue: String(plan.price),
          priceUnit: "per month",
          features: Array.isArray(plan.features) ? plan.features.map(String) : [],
          ctaText: String(plan.price) === "Custom" ? "Contact Sales" : "Choose Plan",
          isActive: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch {
      setError("Failed to seed defaults.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-display font-medium text-brand-navy">Pricing</h1>
          <p className="text-sm text-brand-navy/50 font-light mt-1">Manage pricing packs shown on the public Pricing page.</p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="bg-brand-navy text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-none"
        >
          Add pack
        </button>
      </div>

      {error && <div className="mb-6 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="border border-gray-100">
          <div className="bg-brand-silver/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
            Packs
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Name</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Price</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Unit</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Active</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Edit</th>
                </tr>
              </thead>
              <tbody className="text-sm text-brand-navy/80">
                {isLoading ? (
                  <tr>
                    <td className="py-5 px-4" colSpan={5}>
                      Loading…
                    </td>
                  </tr>
                ) : packs.length === 0 ? (
                  <tr>
                    <td className="py-5 px-4" colSpan={5}>
                      <div className="flex items-center justify-between gap-6">
                        <span>No packs.</span>
                        <button
                          type="button"
                          onClick={seedDefaults}
                          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue"
                        >
                          Seed defaults
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  packs.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="py-4 px-4 whitespace-nowrap">{p.packName}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{p.priceValue}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{p.priceUnit}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleActive(p)}
                          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue"
                        >
                          {p.isActive ? "Disable" : "Enable"}
                        </button>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/60 hover:text-brand-navy"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-gray-100">
          <div className="bg-brand-silver/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
            {mode === "create" ? "Create pack" : mode === "edit" ? "Edit pack" : "Select a pack"}
          </div>

          <div className="p-6">
            {mode === "idle" ? (
              <div className="text-sm text-brand-navy/50 font-light">Choose “Edit” or “Add pack”.</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Pack name</label>
                  <input
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Price value</label>
                    <input
                      value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Price unit</label>
                    <select
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
                      className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none"
                    >
                      <option value="per month">per month</option>
                      <option value="per year">per year</option>
                      <option value="one-time">one-time</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Features (one per line)</label>
                  <textarea
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    rows={7}
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">CTA text</label>
                  <input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 rounded-none"
                  />
                  Active
                </label>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={save}
                    disabled={!canSave}
                    className="bg-brand-navy text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-none disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-white text-brand-navy px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-none border border-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
