"use client";

import React from "react";
import AdminGate from "./_components/AdminGate";
import AdminNavbar from "./_components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">{children}</main>
      </div>
    </AdminGate>
  );
}
