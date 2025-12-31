"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Requests", href: "/admin/requests" },
  { label: "Pricing", href: "/admin/pricing" },
  { label: "Services", href: "/admin/services" },
  { label: "Blog", href: "/admin/blog" },
  { label: "About", href: "/admin/about" },
  { label: "Settings", href: "/admin/settings" },
] as const;

export default function AdminNavbar() {
  const pathname = usePathname() || "/admin";

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link href="/admin/requests" className="flex items-center">
            <img
              src="https://i.postimg.cc/NG3FSdV3/coneiz_logo_current.png"
              alt="CONEIZ"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-8">
            {NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-bold uppercase tracking-[0.2em] py-2 border-b-2 transition-colors ${
                    isActive
                      ? "text-brand-blue border-brand-blue"
                      : "text-brand-navy/50 border-transparent hover:text-brand-navy"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
