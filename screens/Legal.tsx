import React, { useState } from 'react';
import { Shield, Scale, Map, ChevronRight } from 'lucide-react';

type LegalTab = 'privacy' | 'terms' | 'sitemap';

const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LegalTab>('privacy');

  return (
    <div className="animate-fade-in pt-32 pb-24 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-medium text-brand-navy mb-4">Legal Center</h1>
          <p className="text-brand-navy/50 font-light">Compliance, clarity, and trust in every interaction.</p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all relative ${activeTab === 'privacy' ? 'text-brand-blue' : 'text-brand-navy/40 hover:text-brand-navy'}`}
          >
            Privacy Policy
            {activeTab === 'privacy' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('terms')}
            className={`px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all relative ${activeTab === 'terms' ? 'text-brand-blue' : 'text-brand-navy/40 hover:text-brand-navy'}`}
          >
            Terms of Service
            {activeTab === 'terms' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('sitemap')}
            className={`px-8 py-4 text-sm font-bold tracking-widest uppercase transition-all relative ${activeTab === 'sitemap' ? 'text-brand-blue' : 'text-brand-navy/40 hover:text-brand-navy'}`}
          >
            Sitemap
            {activeTab === 'sitemap' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-blue"></div>}
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-brand-silver/10 rounded-3xl p-8 md:p-12 border border-gray-50">
          {activeTab === 'privacy' && (
            <div className="prose prose-brand max-w-none text-brand-navy/70 font-light leading-relaxed space-y-8">
              <section>
                <h2 className="text-2xl font-display font-medium text-brand-navy mb-4 flex items-center">
                  <Shield size={24} className="mr-3 text-brand-blue" /> Data Privacy at CONEIZ
                </h2>
                <p>Your privacy is fundamental to our architecture. This policy describes how we handle information across our cloud services and websites.</p>
              </section>
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-brand-navy">1. Information Collection</h3>
                <p>We collect only the data necessary to provide and secure our services. This includes authentication logs, service performance metrics, and contact information you voluntarily provide.</p>
                <h3 className="text-lg font-bold text-brand-navy">2. Usage and Security</h3>
                <p>CONEIZ implements zero-knowledge encryption protocols where possible. We do not sell user data. Access to data is restricted to authorized personnel using multi-factor authentication and role-based access control.</p>
                <h3 className="text-lg font-bold text-brand-navy">3. Third-Party Disclosures</h3>
                <p>We do not share your data with third parties except as required by law or to provide essential sub-processing services as listed in our DPA.</p>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="prose prose-brand max-w-none text-brand-navy/70 font-light leading-relaxed space-y-8">
              <section>
                <h2 className="text-2xl font-display font-medium text-brand-navy mb-4 flex items-center">
                  <Scale size={24} className="mr-3 text-brand-blue" /> Service Terms
                </h2>
                <p>By using CONEIZ, you agree to these legal obligations. Please read them carefully before deploying infrastructure.</p>
              </section>
              <section className="space-y-4">
                <h3 className="text-lg font-bold text-brand-navy">1. License and Access</h3>
                <p>We grant you a limited, non-exclusive license to access our services for your business operations, subject to compliance with our Acceptable Use Policy.</p>
                <h3 className="text-lg font-bold text-brand-navy">2. Prohibited Conduct</h3>
                <p>Users may not use CONEIZ to launch cyberattacks, host illegal content, or attempt to reverse engineer our proprietary algorithms.</p>
                <h3 className="text-lg font-bold text-brand-navy">3. Limitation of Liability</h3>
                <p>To the maximum extent permitted by law, CONEIZ shall not be liable for indirect, incidental, or consequential damages resulting from service interruptions or data loss.</p>
              </section>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xl font-display font-medium text-brand-navy mb-8 flex items-center">
                  <Map size={24} className="mr-3 text-brand-blue" /> Navigation Map
                </h2>
                <ul className="space-y-4">
                  {[
                    { label: 'Home', path: '#/' },
                    { label: 'Services', path: '#/services' },
                    { label: 'Pricing', path: '#/products' },
                    { label: 'About', path: '#/about' },
                    { label: 'Blog', path: '#/blog' },
                    { label: 'Contact', path: '#/contact' },
                  ].map((link) => (
                    <li key={link.label}>
                      <a href={link.path} className="flex items-center text-brand-navy/60 hover:text-brand-blue transition-all group">
                        <ChevronRight size={14} className="mr-2 text-brand-navy/20 group-hover:translate-x-1 transition-transform" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-sm font-bold uppercase tracking-widest text-brand-navy mb-4">Portal Status</h3>
                <p className="text-xs text-brand-navy/40 font-light mb-6">Index last updated: Oct 2025</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-navy/60">Pages Indexed</span>
                    <span className="font-mono text-brand-blue">12</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-brand-navy/60">API Endpoints</span>
                    <span className="font-mono text-brand-blue">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 text-center text-xs text-brand-navy/30 font-light">
          Last revised: October 2, 2025. Contact legal@coneiz.com for inquiries.
        </div>
      </div>
    </div>
  );
};

export default Legal;