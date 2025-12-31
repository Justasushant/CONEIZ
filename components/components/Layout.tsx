"use client";

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname() || '/';
  const isAdmin = useMemo(() => pathname.startsWith('/admin'), [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

export default Layout;