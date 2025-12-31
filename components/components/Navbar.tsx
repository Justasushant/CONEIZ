"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, Instagram, Mail, Linkedin, Twitter } from "lucide-react";
import { NAV_ITEMS } from "@/constants";
import { useSiteSettings } from "@/lib/siteSettings";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const settings = useSiteSettings();

  const currentPath = pathname || "/";
  const isContactPage = useMemo(() => currentPath === "/contact", [currentPath]);

  const isAtTop = lastScrollY <= 50;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50 && !isOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const onUpdatingSoonClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.alert("Updating soon.");
  };

  const openOrSoon = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href) return onUpdatingSoonClick(e);
    // allow default navigation
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          lastScrollY > 50
            ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4'
            : (isContactPage ? 'bg-white py-6' : 'bg-transparent py-6')
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center relative z-[101]">
            {/* Logo */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center group cursor-pointer transition-all duration-500 ${lastScrollY > 50 && !isOpen ? 'scale-90' : 'scale-100'}`}
            >
              <img 
                src="https://i.postimg.cc/NG3FSdV3/coneiz_logo_current.png" 
                alt="CONEIZ Logo" 
                className="h-10 md:h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-xs tracking-[0.15em] uppercase transition-all duration-500 relative group py-2 font-medium ${
                    currentPath === item.path ? 'text-brand-blue' : 'text-brand-navy/60 hover:text-brand-navy'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-blue origin-left transition-transform duration-500 ease-out ${
                    currentPath === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Desktop CTA & Mobile Toggle */}
            <div className="flex items-center space-x-6">
              <div className="hidden md:block">
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center group relative overflow-hidden px-8 py-3 text-xs font-bold uppercase tracking-widest text-white bg-brand-navy rounded-sm transition-all duration-300 hover:shadow-[0_10px_20px_-10px_rgba(10,15,36,0.5)]"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 h-full w-full bg-brand-blue translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden p-2 rounded-full transition-all duration-300 ${
                  'text-brand-navy'
                } ${
                  isOpen ? 'rotate-90' : ''
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[99] bg-white transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden flex flex-col ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex-grow flex flex-col justify-center items-center space-y-8 p-6 mt-20">
          {NAV_ITEMS.map((item, idx) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`text-3xl font-display font-light text-brand-navy transition-all duration-500 hover:text-brand-blue transform ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className={`p-8 pb-12 bg-brand-silver/30 border-t border-gray-100 transition-all duration-700 delay-300 ${
             isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
           <div className="flex flex-col items-center text-center space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-navy/40">Get in touch</span>
              <div className="flex items-center space-x-8 mb-4">
                 <a
                   href={settings.socials.instagram || "#"}
                   target="_blank"
                   rel="noreferrer"
                   className="text-brand-navy/60 hover:text-brand-blue transition-all"
                   aria-label="Instagram"
                   onClick={openOrSoon(settings.socials.instagram || "")}
                 >
                   <Instagram size={24} strokeWidth={1.5} />
                 </a>
                 <a
                   href={settings.contactEmail ? `mailto:${settings.contactEmail}` : "#"}
                   onClick={settings.contactEmail ? undefined : onUpdatingSoonClick}
                   className="text-brand-navy/60 hover:text-brand-blue transition-all"
                   aria-label="Email"
                 >
                   <Mail size={24} strokeWidth={1.5} />
                 </a>
                 <a
                   href={settings.socials.linkedin || "#"}
                   onClick={openOrSoon(settings.socials.linkedin || "")}
                   target="_blank"
                   rel="noreferrer"
                   className="text-brand-navy/60 hover:text-brand-blue transition-all"
                   aria-label="LinkedIn"
                 >
                   <Linkedin size={24} strokeWidth={1.5} />
                 </a>
                 <a
                   href={settings.socials.twitter || "#"}
                   onClick={openOrSoon(settings.socials.twitter || "")}
                   target="_blank"
                   rel="noreferrer"
                   className="text-brand-navy/60 hover:text-brand-blue transition-all"
                   aria-label="Twitter"
                 >
                   <Twitter size={24} strokeWidth={1.5} />
                 </a>
              </div>
              <a
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full max-w-xs bg-brand-navy text-white py-4 rounded-sm font-medium text-sm tracking-widest uppercase hover:bg-brand-blue transition-colors duration-300 shadow-lg shadow-brand-navy/10"
              >
                Get Started <ArrowRight size={16} className="ml-2" />
              </a>
           </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
