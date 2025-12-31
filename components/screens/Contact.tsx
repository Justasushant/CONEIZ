import React from 'react';
import { Mail, MapPin, Phone, ArrowRight, MessageSquare, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="animate-fade-in min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Panel - Dark Luxury Theme */}
      <div className="w-full md:w-5/12 bg-brand-navy p-12 lg:p-24 flex flex-col justify-between relative overflow-hidden pt-32">
         {/* Decorative Background Elements */}
         <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
         
         <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 mb-8">
               <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-pulse"></div>
               <span className="text-xs tracking-widest uppercase font-mono text-white/40">Status: Pre-Launch</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-medium mb-8 leading-tight text-white">
              Let's build the<br/><span className="text-brand-cyan">future.</span>
            </h1>
            <p className="text-white/60 text-lg font-light leading-relaxed max-w-md mb-16">
              Our infrastructure is currently in a closed-access phase. Contact our support team to learn more about early entry.
            </p>

            <div className="space-y-10">
              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-6 group-hover:bg-brand-cyan group-hover:text-brand-navy group-hover:border-brand-cyan transition-all duration-300 text-brand-cyan">
                   <Mail size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-2">Email Us</h4>
                  <p className="text-white/60 font-light font-mono text-sm hover:text-brand-cyan transition-colors">support@coneiz.com</p>
                </div>
              </div>
              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-6 group-hover:bg-brand-cyan group-hover:text-brand-navy group-hover:border-brand-cyan transition-all duration-300 text-brand-cyan">
                   <MapPin size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-2">Location</h4>
                  <p className="text-white/40 font-light italic">Coming Soon</p>
                </div>
              </div>
            </div>
         </div>

         <div className="relative z-10 mt-12 md:mt-0">
           <div className="h-px w-full bg-white/5 mb-8"></div>
           <div className="flex justify-between text-white/20 text-xs font-mono">
              <span>EST. 2025</span>
              <span>CONEIZ INC</span>
           </div>
         </div>
      </div>

      {/* Right Panel - Form (Coming Soon) */}
      <div className="w-full md:w-7/12 bg-white p-12 lg:p-24 flex items-center justify-center relative">
        <div className="w-full max-w-lg relative z-10 text-center">
           <div className="w-20 h-20 bg-brand-silver rounded-2xl flex items-center justify-center mx-auto mb-8 text-brand-navy/10">
              <Clock size={40} />
           </div>
           <h2 className="text-3xl font-display font-medium text-brand-navy mb-4">Initiate Contact</h2>
           <p className="text-brand-navy/50 font-light mb-12">
             Our interactive portal is currently under maintenance. Please reach out directly via email for any inquiries.
           </p>
           
           <a 
             href="mailto:support@coneiz.com"
             className="inline-flex items-center justify-center bg-brand-navy text-white px-10 py-5 rounded-sm font-medium hover:bg-brand-blue transition-all"
           >
             support@coneiz.com <ArrowRight size={18} className="ml-3" />
           </a>
           
           <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.4em] text-brand-navy/20">
              Form Coming Soon
           </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;