"use client";

import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";

type RequestStatus = "read" | "unread";

type RequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestampText: string;
  status: RequestStatus;
  service?: string;
  price?: string | number;
};

const truncate = (value: string, max: number) => {
  const v = value ?? "";
  if (v.length <= max) return v;
  return `${v.slice(0, max).trimEnd()}…`;
};

export default function AdminRequestsPage() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        const q = query(collection(db, "contact_submissions"), orderBy("timestamp", "desc"));
        unsub = onSnapshot(
          q,
          (snap) => {
            const nextRows: RequestRow[] = snap.docs.map((d) => {
              const data = d.data() as any;
              const ts = data.timestamp;
              const date = ts && typeof ts.toDate === "function" ? ts.toDate() : null;
              const status: RequestStatus = data.status === "read" ? "read" : "unread";
              return {
                id: d.id,
                name: String(data.name ?? ""),
                email: String(data.email ?? ""),
                phone: String(data.phone ?? ""),
                message: String(data.message ?? ""),
                timestampText: date ? date.toLocaleString() : "",
                status,
                service: data.service ? String(data.service) : undefined,
                price: data.price ?? undefined,
              };
            });
            setRows(nextRows);
            setIsLoading(false);
          },
          () => {
            setError("Failed to load requests.");
            setIsLoading(false);
          }
        );
      } catch {
        setError("Failed to load requests.");
        setIsLoading(false);
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const visibleRows = useMemo(() => {
    if (!showUnreadOnly) return rows;
    return rows.filter((r) => r.status === "unread");
  }, [rows, showUnreadOnly]);

  const setStatus = async (id: string, next: RequestStatus) => {
    try {
      const { db } = await import("@/lib/firebase");
      await updateDoc(doc(db, "contact_submissions", id), { status: next });
    } catch {
      setError("Failed to update status.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-display font-medium text-brand-navy">Requests</h1>
          <p className="text-sm text-brand-navy/50 font-light mt-1">Contact + service requests (newest first).</p>
        </div>

        <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
            className="h-4 w-4 rounded-none"
          />
          Unread only
        </label>
      </div>

      {error && <div className="mb-6 text-sm text-red-600">{error}</div>}

      <div className="overflow-x-auto border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-silver/30">
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Status</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Name</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Email</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Phone</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Service</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Price</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Message</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Received</th>
              <th className="py-4 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-brand-navy/80">
            {isLoading ? (
              <tr>
                <td className="py-6 px-4" colSpan={9}>
                  Loading…
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <td className="py-6 px-4" colSpan={9}>
                  No requests.
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => {
                const mailto = `mailto:${encodeURIComponent(row.email)}?subject=${encodeURIComponent(
                  "CONEIZ — Reply"
                )}&body=${encodeURIComponent(`Hi ${row.name || ""},\n\n`)} `;

                return (
                  <tr key={row.id} className="border-t border-gray-100 align-top">
                    <td className="py-5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-none border ${
                          row.status === "unread"
                            ? "bg-white text-brand-navy border-brand-navy/20"
                            : "bg-brand-silver/30 text-brand-navy/50 border-gray-100"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-5 px-4 whitespace-nowrap">{row.name}</td>
                    <td className="py-5 px-4 whitespace-nowrap">{row.email}</td>
                    <td className="py-5 px-4 whitespace-nowrap">{row.phone}</td>
                    <td className="py-5 px-4 whitespace-nowrap">{row.service ?? ""}</td>
                    <td className="py-5 px-4 whitespace-nowrap">{row.price ?? ""}</td>
                    <td className="py-5 px-4 min-w-[340px]">
                      <div className="font-light">{truncate(row.message, 120)}</div>
                    </td>
                    <td className="py-5 px-4 whitespace-nowrap">{row.timestampText}</td>
                    <td className="py-5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setStatus(row.id, row.status === "unread" ? "read" : "unread")}
                          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue"
                        >
                          Mark {row.status === "unread" ? "read" : "unread"}
                        </button>
                        <a
                          href={mailto}
                          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/60 hover:text-brand-navy"
                        >
                          Reply
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
