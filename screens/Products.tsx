import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Info, X, DollarSign, Euro, Banknote, ChevronDown } from 'lucide-react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const CURRENCIES = [
  { symbol: '$', label: 'USD', name: 'US Dollar' },
  { symbol: '€', label: 'EUR', name: 'Euro' },
  { symbol: '£', label: 'GBP', name: 'British Pound' },
  { symbol: '₹', label: 'INR', name: 'Indian Rupee' },
];

type Rates = Record<string, number>;

type PriceUnit = 'per month' | 'per year' | 'one-time';

type PricingPack = {
  id: string;
  packName: string;
  priceValue: string;
  priceUnit: PriceUnit;
  features: string[];
  ctaText: string;
  isActive: boolean;
};

const FX_CACHE_KEY = 'coneiz_fx_rates_v1';
const FX_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const Products: React.FC = () => {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [rates, setRates] = useState<Rates>({ USD: 1 });
  const closeTimerRef = useRef<number | null>(null);
  const [packs, setPacks] = useState<PricingPack[]>([]);

  useEffect(() => {
    const loadRates = async () => {
      try {
        const cached = sessionStorage.getItem(FX_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as { ts: number; rates: Rates };
          if (parsed?.ts && parsed?.rates && Date.now() - parsed.ts < FX_CACHE_TTL_MS) {
            setRates({ USD: 1, ...parsed.rates });
            return;
          }
        }
      } catch {
        // ignore cache errors
      }

      try {
        const res = await fetch('https://api.frankfurter.app/latest?from=USD');
        if (!res.ok) throw new Error('fx fetch failed');
        const data = (await res.json()) as { rates: Rates };
        if (!data?.rates) throw new Error('fx missing rates');
        const nextRates: Rates = { USD: 1, ...data.rates };
        setRates(nextRates);
        try {
          sessionStorage.setItem(FX_CACHE_KEY, JSON.stringify({ ts: Date.now(), rates: data.rates }));
        } catch {
          // ignore
        }
      } catch {
        // keep default USD-only if offline
        setRates((prev) => prev);
      }
    };

    void loadRates();
  }, []);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const q = query(collection(db, 'pricing_packs'), orderBy('createdAt', 'asc'));
        unsub = onSnapshot(
          q,
          (snap) => {
            const next = snap.docs.map((d) => {
              const data = d.data() as any;
              const unit: PriceUnit =
                data.priceUnit === 'per year' || data.priceUnit === 'one-time' ? data.priceUnit : 'per month';
              return {
                id: d.id,
                packName: String(data.packName ?? ''),
                priceValue: String(data.priceValue ?? ''),
                priceUnit: unit,
                features: Array.isArray(data.features) ? data.features.map(String) : [],
                ctaText: String(data.ctaText ?? ''),
                isActive: Boolean(data.isActive),
              } satisfies PricingPack;
            });
            setPacks(next.filter((p) => p.isActive));
          },
          () => {
            // If Firestore fails, leave packs empty.
            setPacks([]);
          }
        );
      } catch {
        setPacks([]);
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const openMenu = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsMenuOpen(true);
  };

  const scheduleCloseMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsMenuOpen(false);
    }, 250);
  };

  const selectCurrency = (c: typeof CURRENCIES[0]) => {
    setCurrency(c);
    setIsMenuOpen(false);
  };

  const formatPrice = (usd: number) => {
    const rate = rates[currency.label] ?? 1;
    const amount = usd * rate;
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currency.label,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch {
      // Fallback to symbol + rounded amount
      return `${currency.symbol}${Math.round(amount * 100) / 100}`;
    }
  };

  const unitSuffix = (unit: PriceUnit) => {
    if (unit === 'per year') return '/yr';
    if (unit === 'per month') return '/mo';
    return ''; // one-time
  };

  const parseNumeric = (value: string) => {
    const trimmed = (value ?? '').trim();
    if (!trimmed) return null;
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : null;
  };

  return (
    <div className="animate-fade-in pt-32 pb-24 bg-white relative">
      {/* Enhanced Currency Switcher Dropdown */}
      <div 
        className="absolute top-28 right-6 lg:right-12 z-50"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleCloseMenu}
      >
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center space-x-3 bg-white border border-gray-100 pl-4 pr-3 py-2 rounded-full shadow-sm hover:shadow-md transition-all group"
        >
          <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xs">
            {currency.symbol}
          </div>
          <span className="text-[10px] font-bold text-brand-navy/80 uppercase tracking-widest">{currency.label}</span>
          <ChevronDown size={14} className={`text-brand-navy/30 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl transition-all duration-300 origin-top-right ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
          onMouseEnter={openMenu}
          onMouseLeave={scheduleCloseMenu}
        >
          <div className="p-2 space-y-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.label}
                onClick={() => selectCurrency(c)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${currency.label === c.label ? 'bg-brand-blue/5 text-brand-blue' : 'hover:bg-gray-50 text-brand-navy/70'}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold w-4">{c.symbol}</span>
                  <span className="font-medium">{c.label}</span>
                </div>
                {currency.label === c.label && <Check size={14} />}
              </button>
            ))}
          </div>
          <div className="bg-gray-50/50 p-2 rounded-b-xl border-t border-gray-100">
             <p className="text-[9px] text-center text-brand-navy/40 uppercase tracking-tighter">Automatic rate conversion</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-brand-navy/10 text-brand-navy/60 text-xs font-medium tracking-widest uppercase">
            Pricing & Plans
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-medium text-brand-navy mb-8">Investment in <span className="text-brand-blue">Excellence.</span></h1>
          <p className="text-xl text-brand-navy/50 font-light">Predictable, transparent pricing designed to scale with your ambition.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-32">
          {packs.map((pack, idx) => {
            const recommended = packs.length === 3 ? idx === 1 : false;
            const numeric = parseNumeric(pack.priceValue);
            const displayPrice = numeric === null ? pack.priceValue : formatPrice(numeric);

            return (
            <div 
              key={pack.id} 
              className={`relative rounded-2xl p-10 transition-all duration-500 ${
                recommended 
                  ? 'bg-brand-navy text-white shadow-2xl shadow-brand-navy/20 scale-105 z-10' 
                  : 'bg-white border border-gray-100 text-brand-navy hover:border-brand-blue/30'
              }`}
            >
              {recommended && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white text-[10px] font-bold uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">
                  Recommended
                </div>
              )}
              <h3 className={`text-sm font-bold tracking-[0.2em] uppercase mb-4 ${recommended ? 'text-brand-cyan' : 'text-brand-navy/40'}`}>{pack.packName}</h3>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-light tracking-tight">
                  {displayPrice}
                </span>
                {unitSuffix(pack.priceUnit) && (
                  <span className={`ml-2 text-lg font-light ${recommended ? 'text-white/40' : 'text-brand-navy/40'}`}>{unitSuffix(pack.priceUnit)}</span>
                )}
              </div>
              <p className={`text-sm pb-8 mb-8 border-b font-light ${recommended ? 'text-white/60 border-white/10' : 'text-brand-navy/60 border-gray-100'}`}>
                {pack.priceUnit === 'one-time' ? 'One-time pricing for defined deliverables.' : 'Predictable billing designed to scale.'}
              </p>

              <ul className="space-y-5 mb-12">
                {pack.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Check className={`h-4 w-4 ${recommended ? 'text-brand-cyan' : 'text-brand-blue'}`} strokeWidth={3} />
                    </div>
                    <p className={`ml-4 text-sm font-light ${recommended ? 'text-white/80' : 'text-brand-navy/80'}`}>{feature}</p>
                  </li>
                ))}
              </ul>

              <div>
                <a
                  href="/contact"
                  className={`block w-full text-center px-6 py-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                    recommended
                      ? 'bg-white text-brand-navy hover:bg-brand-silver'
                      : 'bg-brand-navy text-white hover:bg-brand-blue'
                  }`}
                >
                  {pack.ctaText || 'Choose Plan'}
                </a>
              </div>
            </div>
          );
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-medium text-brand-navy mb-12 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="py-4 px-6 text-sm font-semibold text-brand-navy bg-gray-50/50 rounded-tl-lg">Features</th>
                  <th className="py-4 px-6 text-sm font-medium text-center text-brand-navy/60 bg-gray-50/50">Starter</th>
                  <th className="py-4 px-6 text-sm font-medium text-center text-brand-blue bg-gray-50/50">Growth</th>
                  <th className="py-4 px-6 text-sm font-medium text-center text-brand-navy bg-gray-50/50 rounded-tr-lg">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-brand-navy/80">
                <tr className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                  <td className="py-6 px-6">Global Edge Network</td>
                  <td className="py-6 px-6 text-center"><Check size={16} className="mx-auto text-brand-navy/30" /></td>
                  <td className="py-6 px-6 text-center"><Check size={16} className="mx-auto text-brand-blue" /></td>
                  <td className="py-6 px-6 text-center"><Check size={16} className="mx-auto text-brand-navy" /></td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                  <td className="py-6 px-6">DDoS Protection</td>
                  <td className="py-6 px-6 text-center">Basic</td>
                  <td className="py-6 px-6 text-center">Advanced</td>
                  <td className="py-6 px-6 text-center font-medium">Custom Rules</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                  <td className="py-6 px-6">Uptime SLA</td>
                  <td className="py-6 px-6 text-center text-brand-navy/40">99.5%</td>
                  <td className="py-6 px-6 text-center">99.9%</td>
                  <td className="py-6 px-6 text-center font-medium">99.99%</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                  <td className="py-6 px-6">Dedicated Support</td>
                  <td className="py-6 px-6 text-center"><X size={16} className="mx-auto text-brand-navy/20" /></td>
                  <td className="py-6 px-6 text-center">Email</td>
                  <td className="py-6 px-6 text-center font-medium">24/7 Live Agent</td>
                </tr>
                 <tr className="hover:bg-gray-50/30 transition-colors">
                  <td className="py-6 px-6">On-Premise Deployment</td>
                  <td className="py-6 px-6 text-center"><X size={16} className="mx-auto text-brand-navy/20" /></td>
                  <td className="py-6 px-6 text-center"><X size={16} className="mx-auto text-brand-navy/20" /></td>
                  <td className="py-6 px-6 text-center"><Check size={16} className="mx-auto text-brand-navy" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-24 bg-brand-silver/30 rounded-2xl p-12 text-center">
           <h3 className="text-2xl font-display font-medium text-brand-navy mb-4">Need a custom quote?</h3>
           <p className="text-brand-navy/60 font-light mb-8">Our sales architects are ready to build a plan that fits your specific infrastructure needs.</p>
           <a href="/contact" className="text-brand-blue font-medium border-b border-brand-blue/30 hover:border-brand-blue transition-all pb-0.5">Contact our Sales Team</a>
        </div>
      </div>
    </div>
  );
};

export default Products;
