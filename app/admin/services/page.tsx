"use client";

import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { SERVICES as LEGACY_SERVICES } from "@/constants";

type ServiceItem = {
  id: string;
  serviceName: string;
  description: string;
  price: string;
  isActive: boolean;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"idle" | "create" | "edit">("idle");
  const [activeId, setActiveId] = useState<string | null>(null);

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        unsub = onSnapshot(
          collection(db, "services"),
          (snap) => {
            const next = snap.docs
              .map((d) => {
                const data = d.data() as any;
                return {
                  id: d.id,
                  serviceName: String(data.serviceName ?? ""),
                  description: String(data.description ?? ""),
                  price: String(data.price ?? ""),
                  isActive: Boolean(data.isActive),
                } satisfies ServiceItem;
              })
              .sort((a, b) => a.serviceName.localeCompare(b.serviceName));

            setServices(next);
            setIsLoading(false);
          },
          () => {
            setError("Failed to load services.");
            setIsLoading(false);
          }
        );
      } catch {
        setError("Failed to load services.");
        setIsLoading(false);
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const resetForm = () => {
    setMode("idle");
    setActiveId(null);
    setServiceName("");
    setDescription("");
    setPrice("");
    setIsActive(true);
    setError(null);
  };

  const startCreate = () => {
    resetForm();
    setMode("create");
  };

  const startEdit = (service: ServiceItem) => {
    setMode("edit");
    setActiveId(service.id);
    setServiceName(service.serviceName);
    setDescription(service.description);
    setPrice(service.price);
    setIsActive(service.isActive);
  };

  const canSave = useMemo(() => {
    return serviceName.trim().length > 0 && description.trim().length > 0 && price.trim().length > 0;
  }, [serviceName, description, price]);

  const save = async () => {
    if (!canSave) return;
    setError(null);

    const payload = {
      serviceName: serviceName.trim(),
      description: description.trim(),
      price: price.trim(),
      isActive,
      updatedAt: serverTimestamp(),
    };

    try {
      const { db } = await import("@/lib/firebase");
      if (mode === "create") {
        const id = `${serviceName.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "")}-${Date.now()}`;
        await setDoc(doc(db, "services", id), { ...payload, createdAt: serverTimestamp() });
        resetForm();
        return;
      }

      if (mode === "edit" && activeId) {
        await updateDoc(doc(db, "services", activeId), payload);
        resetForm();
      }
    } catch {
      setError("Failed to save service.");
    }
  };

  const toggleActive = async (service: ServiceItem) => {
    setError(null);
    try {
      const { db } = await import("@/lib/firebase");
      await updateDoc(doc(db, "services", service.id), {
        isActive: !service.isActive,
        updatedAt: serverTimestamp(),
      });
    } catch {
      setError("Failed to update service.");
    }
  };

  const seedDefaults = async () => {
    setError(null);
    try {
      const { db } = await import("@/lib/firebase");

      for (const legacy of LEGACY_SERVICES) {
        const id = String(legacy.id ?? legacy.title)
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-_]/g, "");

        await setDoc(doc(db, "services", id), {
          serviceName: String(legacy.title),
          description: String(legacy.description),
          price: "Custom",
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
          <h1 className="text-2xl font-display font-medium text-brand-navy">Services</h1>
          <p className="text-sm text-brand-navy/50 font-light mt-1">Manage services shown on the public Services page.</p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="bg-brand-navy text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-none"
        >
          Add service
        </button>
      </div>

      {error && <div className="mb-6 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="border border-gray-100">
          <div className="bg-brand-silver/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
            Services
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Name</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Price</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Active</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Edit</th>
                </tr>
              </thead>
              <tbody className="text-sm text-brand-navy/80">
                {isLoading ? (
                  <tr>
                    <td className="py-5 px-4" colSpan={4}>
                      Loading…
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td className="py-5 px-4" colSpan={4}>
                      <div className="flex items-center justify-between gap-6">
                        <span>No services.</span>
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
                  services.map((s) => (
                    <tr key={s.id} className="border-t border-gray-100">
                      <td className="py-4 px-4 whitespace-nowrap">{s.serviceName}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{s.price}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleActive(s)}
                          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue"
                        >
                          {s.isActive ? "Disable" : "Enable"}
                        </button>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => startEdit(s)}
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
            {mode === "create" ? "Create service" : mode === "edit" ? "Edit service" : "Select a service"}
          </div>

          <div className="p-6">
            {mode === "idle" ? (
              <div className="text-sm text-brand-navy/50 font-light">Choose “Edit” or “Add service”.</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Service name</label>
                  <input
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Price</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
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
