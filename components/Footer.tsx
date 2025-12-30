"use client";

import React from "react";
import Link from "next/link";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { useSiteSettings } from "@/lib/siteSettings";

const Footer: React.FC = () => {
  const settings = useSiteSettings();

  const onUpdatingSoonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.alert("Updating soon.");
  };

  const openOrSoon = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href) return onUpdatingSoonClick(e);
    // allow default navigation
  };

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-8">
            <Link href="/" className="block">
               <img 
                 src="https://i.postimg.cc/NG3FSdV3/coneiz_logo_current.png" 
                 alt="CONEIZ" 
                 className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity"
               />
            </Link>
            <p className="text-brand-navy/60 text-sm leading-loose font-light max-w-xs">
              Pioneering the digital frontier with enterprise-grade cloud infrastructure and intelligent SaaS solutions.
            </p>
            <div className="flex space-x-6">
              <a
                href={settings.socials.instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="text-brand-navy/40 hover:text-brand-blue transition-colors"
                aria-label="Instagram"
                onClick={openOrSoon(settings.socials.instagram || "")}
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a
                href={settings.socials.twitter || "#"}
                onClick={openOrSoon(settings.socials.twitter || "")}
                target="_blank"
                rel="noreferrer"
                className="text-brand-navy/40 hover:text-brand-blue transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} strokeWidth={1.5} />
              </a>
              <a
                href={settings.socials.linkedin || "#"}
                onClick={openOrSoon(settings.socials.linkedin || "")}
                target="_blank"
                rel="noreferrer"
                className="text-brand-navy/40 hover:text-brand-blue transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
              <a
                href={settings.socials.github || "#"}
                onClick={openOrSoon(settings.socials.github || "")}
                target="_blank"
                rel="noreferrer"
                className="text-brand-navy/40 hover:text-brand-blue transition-colors"
                aria-label="GitHub"
              >
                <Github size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Desktop Spacer */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Links Container */}
          <div className="md:col-span-6 grid grid-cols-3 gap-4 md:gap-8">
              {/* Links Column 1 */}
              <div>
                <h3 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] mb-6 md:mb-8 text-brand-navy">Company</h3>
                <ul className="space-y-3 md:space-y-4 text-brand-navy/60 text-sm font-light">
                  <li><Link href="/about" className="hover:text-brand-blue transition-colors">About</Link></li>
                  <li><Link href="/blog" className="hover:text-brand-blue transition-colors">Insights</Link></li>
                  <li><Link href="/contact" className="hover:text-brand-blue transition-colors">Careers</Link></li>
                  <li><Link href="/contact" className="hover:text-brand-blue transition-colors">Contact</Link></li>
                </ul>
              </div>

              {/* Links Column 2 */}
              <div>
                <h3 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] mb-6 md:mb-8 text-brand-navy">Product</h3>
                <ul className="space-y-3 md:space-y-4 text-brand-navy/60 text-sm font-light">
                  <li><Link href="/services" className="hover:text-brand-blue transition-colors">Cloud</Link></li>
                  <li><Link href="/products" className="hover:text-brand-blue transition-colors">Pricing</Link></li>
                  <li><Link href="/services" className="hover:text-brand-blue transition-colors">Web Dev</Link></li>
                  <li><Link href="/about" className="hover:text-brand-blue transition-colors">API</Link></li>
                </ul>
              </div>

              {/* Links Column 3 */}
              <div>
                <h3 className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] mb-6 md:mb-8 text-brand-navy">Legal</h3>
                <ul className="space-y-3 md:space-y-4 text-brand-navy/60 text-sm font-light">
                  <li><Link href="/legal" className="hover:text-brand-blue transition-colors">Privacy</Link></li>
                  <li><Link href="/legal" className="hover:text-brand-blue transition-colors">Terms</Link></li>
                  <li><Link href="/legal" className="hover:text-brand-blue transition-colors">Sitemap</Link></li>
                </ul>
              </div>
          </div>
        </div>

        <div className="border-t border-gray-50 pt-10 flex flex-col md:flex-row justify-between items-center text-xs text-brand-navy/40 font-light tracking-wide">
          <p>&copy; {new Date().getFullYear()} CONEIZ Inc. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Designed for the Future.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;