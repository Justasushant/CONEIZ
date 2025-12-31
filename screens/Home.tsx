import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Cloud, Zap, ShieldCheck, Code, LayoutGrid, Workflow, Lock } from 'lucide-react';
import { HERO_ILLUSTRATION_URL, SERVICE_ILLUSTRATION_URL } from '../constants';
import CardSwap, { Card } from '../components/CardSwap';

const Home: React.FC = () => {
  
  const highlightCards = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Optimized routing protocols ensure your data travels the shortest path possible.",
      stat: "LATENCY: 12ms",
      statColor: "text-brand-blue",
      theme: "light", 
      iconBg: "bg-brand-blue/10",
      iconColor: "text-brand-blue"
    },
    {
      icon: ShieldCheck,
      title: "Secure Core",
      desc: "Advanced threat detection algorithms running in real-time on every request.",
      stat: "THREATS: BLOCKED",
      statColor: "text-brand-cyan",
      theme: "dark",
      iconBg: "bg-white/10",
      iconColor: "text-brand-cyan"
    },
    {
      icon: Code,
      title: "Dev First",
      desc: "Built by developers, for developers. Best-in-class documentation and SDKs.",
      stat: "API: READY",
      statColor: "text-brand-purple",
      theme: "light",
      iconBg: "bg-brand-purple/10",
      iconColor: "text-brand-purple"
    }
  ];

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const autoPlayRef = useRef<number | null>(null);

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, []);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = window.setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % highlightCards.length);
    }, 3000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    stopAutoPlay();
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      startAutoPlay();
      return;
    }
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (diff > threshold) setActiveCardIndex((prev) => (prev + 1) % highlightCards.length);
    else if (diff < -threshold) setActiveCardIndex((prev) => (prev - 1 + highlightCards.length) % highlightCards.length);
    touchStartX.current = 0;
    touchEndX.current = 0;
    startAutoPlay();
  };

  const handleManualDotClick = (idx: number) => {
    stopAutoPlay();
    setActiveCardIndex(idx);
    startAutoPlay();
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-white pt-32 md:pt-40 pb-20 md:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="max-w-2xl animate-slide-up order-2 lg:order-1">
              <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight text-brand-navy mb-8 leading-[1.1]">
                The Future <br/>
                <span className="text-brand-blue relative inline-block">
                  Built by CONEIZ.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-brand-navy/60 mb-12 leading-relaxed max-w-lg font-light">
                We engineer the digital nervous system for tomorrow's enterprises. Uncompromising speed, security, and scalability.
              </p>
              <div className="flex flex-col sm:flex-row gap-5">
                <a 
                  href="#/contact" 
                  className="inline-flex justify-center items-center px-8 py-4 text-sm font-medium rounded-md text-white bg-brand-navy hover:bg-brand-blue transition-all duration-300"
                >
                  Get Started
                </a>
                <a 
                  href="#/services" 
                  className="inline-flex justify-center items-center px-8 py-4 text-sm font-medium rounded-md text-brand-navy bg-gray-50 hover:bg-gray-100 transition-all duration-300"
                >
                  View Services
                </a>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 animate-fade-in flex justify-center lg:justify-end">
               <div className="relative w-full max-w-xl">
                 <img 
                   src={HERO_ILLUSTRATION_URL} 
                   alt="CONEIZ Cloud Infrastructure" 
                   className="relative z-10 object-cover w-full h-auto mix-blend-multiply"
                 />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-brand-navy mb-6">
              The CONEIZ Suite
            </h2>
            <p className="text-brand-navy/60 max-w-2xl font-light text-lg">
              A unified ecosystem of tools engineered for excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-brand-silver rounded-2xl p-10 relative overflow-hidden group min-h-[320px]">
               <div className="relative z-10">
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-brand-blue group-hover:animate-icon-float">
                    <Cloud size={24} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-2xl font-semibold text-brand-navy mb-4">Global Cloud Platform</h3>
                 <p className="text-brand-navy/60 max-w-md font-light leading-relaxed">
                   Deploy instantly to our edge network spanning 40+ regions. Experience latency so low it feels instantaneous.
                 </p>
               </div>
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-tl-full translate-y-12 translate-x-12 transition-transform duration-700 group-hover:scale-110"></div>
            </div>

            <div className="md:row-span-2 bg-brand-navy rounded-2xl p-10 relative overflow-hidden group">
              <div className="relative z-10 h-full flex flex-col">
                 <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-brand-cyan group-hover:animate-icon-pulse">
                    <ShieldCheck size={24} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-2xl font-semibold text-white mb-4">Fortress Security</h3>
                 <p className="text-white/60 font-light leading-relaxed mb-8">
                   Zero-trust architecture built into the core. Protecting your data with military-grade encryption at rest and in transit.
                 </p>
                 <div className="mt-auto pt-8 border-t border-white/10">
                    <div className="flex items-center text-brand-cyan text-sm font-mono">
                       <Lock size={14} className="mr-2" /> STATUS: SECURE
                    </div>
                 </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors duration-300 group">
               <div className="flex items-start justify-between mb-4">
                 <div className="w-10 h-10 bg-brand-silver rounded-lg flex items-center justify-center text-brand-navy group-hover:scale-110 transition-transform">
                    <LayoutGrid size={20} strokeWidth={1.5} />
                 </div>
                 <ArrowRight size={20} className="text-brand-gray -rotate-45 group-hover:text-brand-blue transition-colors" />
               </div>
               <h3 className="text-lg font-semibold text-brand-navy mb-2">SaaS Integrations</h3>
               <p className="text-sm text-brand-navy/60 font-light">Seamlessly connect with 200+ enterprise tools.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-brand-blue/30 transition-colors duration-300 group">
               <div className="flex items-start justify-between mb-4">
                 <div className="w-10 h-10 bg-brand-silver rounded-lg flex items-center justify-center text-brand-navy group-hover:scale-110 transition-transform">
                    <Workflow size={20} strokeWidth={1.5} />
                 </div>
                 <ArrowRight size={20} className="text-brand-gray -rotate-45 group-hover:text-brand-blue transition-colors" />
               </div>
               <h3 className="text-lg font-semibold text-brand-navy mb-2">Workflow AI</h3>
               <p className="text-sm text-brand-navy/60 font-light">Automate repetitive tasks with predictive models.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Website Development Section */}
      <section className="py-32 md:py-48 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="mb-20">
            <div className="inline-block mb-4 p-2 rounded-full bg-brand-silver">
              <div className="w-2 h-2 bg-brand-cyan rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-brand-navy mb-6">
              Full-Service Web Development
            </h2>
            <p className="text-lg md:text-xl text-brand-navy/60 max-w-3xl font-light leading-relaxed">
              CONEIZ is a comprehensive web development team capable of building anything you envision. From scalable ecommerce platforms and high-converting landing pages to custom enterprise applications, we deliver excellence across the entire digital spectrum.
            </p>
          </div>

          {/* Core Web Features */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold text-brand-navy mb-8">What We Build</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-blue">
                  <Code size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Landing Pages</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  High-converting landing pages optimized for your campaigns. Fast-loading, mobile-responsive, and designed to maximize conversions.
                </p>
                <ul className="space-y-2 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3"></span>A/B Testing Ready</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3"></span>SEO Optimized</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3"></span>Conversion Focused</li>
                </ul>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-cyan">
                  <ShieldCheck size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Corporate Websites</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Professional brand presence with dynamic content management. Showcase your expertise and attract clients with a powerful website.
                </p>
                <ul className="space-y-2 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3"></span>CMS Integration</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3"></span>Team Pages</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3"></span>Blog Platform</li>
                </ul>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-purple">
                  <Cloud size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Web Applications</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Complex, scalable web applications with real-time functionality. From SaaS platforms to internal tools, we build it right.
                </p>
                <ul className="space-y-2 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3"></span>Real-Time Features</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3"></span>Database Design</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3"></span>API Development</li>
                </ul>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-blue">
                  <LayoutGrid size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Ecommerce Platforms</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Scalable ecommerce solutions from startup shops to enterprise marketplaces. Conversion-optimized and payment-ready.
                </p>
                <ul className="space-y-2 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3"></span>Payment Integration</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3"></span>Inventory Management</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3"></span>Order Fulfillment</li>
                </ul>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-cyan">
                  <Zap size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Mobile Apps</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Native and cross-platform mobile applications. React Native expertise for iOS and Android with native app performance.
                </p>
                <ul className="space-y-2 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3"></span>React Native</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3"></span>iOS & Android</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3"></span>Push Notifications</li>
                </ul>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-purple">
                  <Workflow size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Custom Solutions</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Bespoke digital solutions tailored to your unique business needs. We build exactly what you envision.
                </p>
                <ul className="space-y-2 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3"></span>Custom Architecture</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3"></span>Legacy Integration</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3"></span>Consulting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Ecommerce Features */}
          <div className="mb-16 pt-12 border-t border-brand-gray">
            <h3 className="text-2xl font-semibold text-brand-navy mb-8">Our Technical Excellence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-blue">
                  <Code size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Modern Tech Stack</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Built with Next.js, TypeScript, React, and Node.js. We leverage the latest frameworks and technologies for optimal performance.
                </p>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-cyan">
                  <Zap size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Blazing Fast Performance</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Sub-100ms page loads with optimized images, lazy loading, and edge caching. Every millisecond counts.
                </p>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-purple">
                  <ShieldCheck size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Enterprise Security</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Security-first architecture with SSL/TLS encryption, CSRF protection, rate limiting, and OWASP compliance.
                </p>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-blue">
                  <LayoutGrid size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Responsive Design</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Pixel-perfect design across all devices. Mobile-first approach with full accessibility (WCAG) compliance.
                </p>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-cyan">
                  <Cloud size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Cloud Infrastructure</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Globally distributed servers with automatic scaling, failover protection, and 99.99% uptime guarantee.
                </p>
              </div>

              <div className="bg-brand-silver/40 rounded-2xl p-10 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 text-brand-purple">
                  <Workflow size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-brand-navy mb-3">Content Management</h3>
                <p className="text-brand-navy/60 font-light leading-relaxed mb-4">
                  Firebase and Firestore integration for real-time updates, dynamic content, and admin dashboards without rebuilds.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Expertise Areas</h3>
                <ul className="space-y-3 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3 flex-shrink-0"></span>Frontend Development</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3 flex-shrink-0"></span>Backend Architecture</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3 flex-shrink-0"></span>Database Design</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-blue rounded-full mr-3 flex-shrink-0"></span>API Development</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Integration & Tools</h3>
                <ul className="space-y-3 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3 flex-shrink-0"></span>Payment Gateways</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3 flex-shrink-0"></span>Third-Party APIs</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3 flex-shrink-0"></span>Email Services</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-3 flex-shrink-0"></span>Analytics Platforms</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Optimization & Support</h3>
                <ul className="space-y-3 text-sm text-brand-navy/70">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3 flex-shrink-0"></span>SEO Optimization</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3 flex-shrink-0"></span>Performance Tuning</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3 flex-shrink-0"></span>Ongoing Support</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-purple rounded-full mr-3 flex-shrink-0"></span>Maintenance Plans</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-brand-gray">
            <h3 className="text-2xl font-semibold text-brand-navy mb-6">Development Excellence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-brand-navy/70">
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0 mt-1.5"></div>
                <div>
                  <p className="font-light leading-relaxed">
                    <strong className="font-semibold text-brand-navy">SEO Optimized:</strong> Structured data, meta tags, and performance metrics ensure maximum discoverability.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full flex-shrink-0 mt-1.5"></div>
                <div>
                  <p className="font-light leading-relaxed">
                    <strong className="font-semibold text-brand-navy">Analytics Integrated:</strong> Comprehensive tracking of user behavior and engagement metrics.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 bg-brand-purple rounded-full flex-shrink-0 mt-1.5"></div>
                <div>
                  <p className="font-light leading-relaxed">
                    <strong className="font-semibold text-brand-navy">Continuous Deployment:</strong> Automated testing and deployment pipeline for zero-downtime updates.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0 mt-1.5"></div>
                <div>
                  <p className="font-light leading-relaxed">
                    <strong className="font-semibold text-brand-navy">Developer Experience:</strong> Clean code, comprehensive documentation, and maintainable architecture.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-center">
              <a 
                href="#/contact"
                className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-md text-white bg-brand-navy hover:bg-brand-blue transition-all duration-300"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CardSwap Section */}
      <section className="py-20 md:py-40 bg-brand-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="text-white">
                <h2 className="text-4xl md:text-6xl font-display font-medium mb-8 leading-tight">
                  Engineered for<br/>Excellence.
                </h2>
                <p className="text-white/60 text-lg mb-12 font-light leading-relaxed max-w-md">
                  Experience the difference of a platform built without legacy constraints. Pure performance, delivered.
                </p>
                <div className="space-y-6">
                  {[
                    "99.99% Uptime Guarantee",
                    "Zero-Trust Security Architecture",
                    "Real-time Global Edge Network"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-1 h-1 bg-brand-cyan rounded-full"></div>
                      <span className="text-white/90 font-light tracking-wide">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="hidden lg:flex relative h-[500px] w-full items-center justify-center lg:justify-end">
                <div style={{ height: '400px', width: '320px', position: 'relative' }}>
                  <CardSwap
                    cardDistance={30}
                    verticalDistance={40}
                    delay={3500}
                    pauseOnHover={true}
                  >
                    {highlightCards.map((card, idx) => (
                      <Card
                        key={idx}
                        className={`${
                          card.title === 'Secure Core'
                            ? 'bg-brand-navy text-white border border-white/10'
                            : card.title === 'Lightning Fast'
                              ? 'bg-brand-silver text-brand-navy border border-brand-navy/10'
                              : 'bg-white text-brand-navy border border-gray-100'
                        } p-8 shadow-2xl flex flex-col justify-between h-full`}
                      >
                         <div>
                            <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center mb-6`}>
                              <card.icon className={card.iconColor} size={20} />
                            </div>
                            <h3 className={`text-2xl font-display font-bold ${card.title === 'Secure Core' ? 'text-white' : 'text-brand-navy'} mb-2`}>{card.title}</h3>
                            <p className={`${card.title === 'Secure Core' ? 'text-white/60' : 'text-brand-navy/60'} leading-relaxed`}>
                              {card.desc}
                            </p>
                         </div>
                         <div className={`${card.statColor} font-mono text-xs`}>{card.stat}</div>
                      </Card>
                    ))}
                  </CardSwap>
                </div>
              </div>

              <div className="lg:hidden w-full flex flex-col items-center mt-4">
                 <div 
                   className="relative w-full max-w-[300px] h-[320px]"
                   onTouchStart={handleTouchStart}
                   onTouchMove={handleTouchMove}
                   onTouchEnd={handleTouchEnd}
                 >
                   {highlightCards.map((card, idx) => {
                      const isActive = idx === activeCardIndex;
                      return (
                        <div 
                          key={idx}
                          className={`absolute inset-0 w-full h-full rounded-2xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
                             isActive 
                               ? 'opacity-100 scale-100 z-10 translate-x-0 rotate-0' 
                               : 'opacity-0 scale-90 z-0 translate-x-8 rotate-6 pointer-events-none'
                          } ${card.theme === 'dark' ? 'bg-brand-navy text-white' : 'bg-white text-brand-navy'}`}
                        >
                           <div>
                              <div className={`w-10 h-10 rounded-full ${card.iconBg} flex items-center justify-center mb-6`}>
                                <card.icon className={card.iconColor} size={20} />
                              </div>
                              <h3 className={`text-2xl font-display font-bold mb-3 ${card.theme === 'dark' ? 'text-white' : 'text-brand-navy'}`}>{card.title}</h3>
                              <p className={`text-sm font-light leading-relaxed ${card.theme === 'dark' ? 'text-white/60' : 'text-brand-navy/60'}`}>
                                {card.desc}
                              </p>
                           </div>
                           <div className={`${card.statColor} font-mono text-[10px] pt-6`}>{card.stat}</div>
                        </div>
                      );
                   })}
                 </div>

                 <div className="flex space-x-3 mt-8">
                    {highlightCards.map((_, idx) => (
                       <button 
                          key={idx}
                          onClick={() => handleManualDotClick(idx)}
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                              idx === activeCardIndex ? 'bg-brand-cyan w-8' : 'bg-white/10 w-1.5 hover:bg-white/30'
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                       />
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-brand-silver/30 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-semibold text-brand-navy mb-8">Ready to elevate your infrastructure?</h2>
          <p className="text-xl text-brand-navy/60 mb-12 font-light">
            Join the forward-thinking companies building the future with CONEIZ.
          </p>
          <a 
            href="#/contact"
            className="inline-block bg-brand-navy text-white font-medium px-12 py-5 rounded-md hover:bg-brand-blue transition-all duration-300"
          >
            Start Conversation
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;