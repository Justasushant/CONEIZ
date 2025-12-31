
import React, { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { SERVICE_ILLUSTRATION_URL } from '../constants';
import { Circle, Layers, Zap } from 'lucide-react';
import ServiceContactModal from '@/components/ServiceContactModal';

type ServiceItem = {
  id: string;
  serviceName: string;
  description: string;
  price: string;
  isActive: boolean;
};

const Services: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selected, setSelected] = useState<{ service: string; price: string } | null>(null);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const q = query(collection(db, 'services'), orderBy('createdAt', 'asc'));
        unsub = onSnapshot(
          q,
          (snap) => {
            const next = snap.docs
              .map((d) => {
                const data = d.data() as any;
                return {
                  id: d.id,
                  serviceName: String(data.serviceName ?? ''),
                  description: String(data.description ?? ''),
                  price: String(data.price ?? ''),
                  isActive: Boolean(data.isActive),
                } satisfies ServiceItem;
              })
              .filter((s) => s.isActive);
            setServices(next);
          },
          () => {
            setServices([]);
          }
        );
      } catch {
        setServices([]);
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const openModal = (service: ServiceItem) => {
    setSelected({ service: service.serviceName, price: service.price });
  };

  const closeModal = () => setSelected(null);

  return (
    <div className="animate-fade-in">
      {/* Services Hero - Luxury Header */}
      <section className="bg-brand-silver/30 pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
             <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="relative">
                  <img 
                    src={SERVICE_ILLUSTRATION_URL} 
                    alt="Services Visualization" 
                    className="w-full h-auto object-contain mix-blend-multiply opacity-90"
                  />
                </div>
             </div>
             <div className="lg:w-1/2 order-1 lg:order-2">
               <div className="inline-flex items-center space-x-2 mb-6">
                 <div className="w-2 h-2 rounded-full bg-brand-blue"></div>
                 <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-navy/50">Capabilities</span>
               </div>
               <h1 className="text-5xl md:text-7xl font-display font-medium text-brand-navy mb-8 leading-[1.05]">
                 Digital <br/>
                 <span className="text-brand-blue">Ascension.</span>
               </h1>
               <p className="text-xl text-brand-navy/60 mb-10 font-light leading-relaxed max-w-lg">
                 We provide the architectural foundation for the world's most ambitious companies. Scalable, secure, and seamlessly integrated.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Service Grid - Bento Style */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
            {services.map((service, idx) => (
              <div 
                key={service.id} 
                className={`group p-12 rounded-3xl border border-gray-100 flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.05)] hover:border-brand-navy/5 ${
                  idx === 0 || idx === 3 ? 'bg-brand-silver/20' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-500 overflow-hidden text-brand-blue">
                    <Layers size={28} strokeWidth={1.5} />
                  </div>
                  <span className="text-brand-navy/20 font-display text-4xl font-bold opacity-50 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                </div>
                
                <h3 className="text-3xl font-display font-medium text-brand-navy mb-4">{service.serviceName}</h3>
                <p className="text-brand-navy/60 mb-10 flex-grow font-light leading-relaxed text-lg">{service.description}</p>

                <div className="pt-8 border-t border-brand-navy/5">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy/40">Price</div>
                      <div className="text-brand-navy font-medium mt-1">{service.price}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openModal(service)}
                      className="bg-brand-navy text-white px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-none"
                    >
                      Get Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section with Static Lucide Icons */}
      <section className="py-32 bg-brand-navy text-white relative overflow-hidden">
        {/* Three subtle diagonal slices behind the 3 steps */}
        <div className="absolute inset-y-0 left-[38%] w-[18%] bg-brand-blue/5 -skew-x-12"></div>
        <div className="absolute inset-y-0 left-[58%] w-[18%] bg-brand-blue/5 -skew-x-12"></div>
        <div className="absolute inset-y-0 left-[78%] w-[18%] bg-brand-blue/5 -skew-x-12"></div>
         <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
               <div className="lg:col-span-1">
                  <h2 className="text-4xl font-display font-medium mb-6">Our Methodology</h2>
                  <p className="text-white/60 font-light leading-relaxed">
                    We don't just deploy code; we engineer outcomes. Our cyclical process ensures continuous improvement and adaptation.
                  </p>
               </div>
               <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-brand-cyan mx-auto sm:mx-0">
                        <Circle size={24} className="animate-spin-slow" />
                     </div>
                     <h3 className="text-xl font-medium">1. Discovery</h3>
                     <p className="text-white/40 text-sm font-light leading-relaxed">Deep dive into infrastructure requirements and business goals.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-brand-cyan mx-auto sm:mx-0">
                        <Layers size={24} className="animate-icon-float" />
                     </div>
                     <h3 className="text-xl font-medium">2. Architecture</h3>
                     <p className="text-white/40 text-sm font-light leading-relaxed">Designing high-availability systems with zero single points of failure.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-brand-cyan mx-auto sm:mx-0">
                        <Zap size={24} className="animate-pulse" />
                     </div>
                     <h3 className="text-xl font-medium">3. Deployment</h3>
                     <p className="text-white/40 text-sm font-light leading-relaxed">Seamless rollout with automated testing and instant scalability.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <ServiceContactModal
        open={Boolean(selected)}
        onClose={closeModal}
        service={selected?.service ?? ''}
        price={selected?.price ?? ''}
      />
    </div>
  );
};

export default Services;
