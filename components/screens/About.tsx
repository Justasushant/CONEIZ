import React, { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { User } from 'lucide-react';

type AboutSectionFlags = {
  manifesto: boolean;
  origin: boolean;
  values: boolean;
  team: boolean;
};

type OriginTimelineEntry = {
  title: string;
  date: string;
  primary?: boolean;
};

type AboutOrigin = {
  year: string;
  foundedDate: string;
  description: string;
  timeline: OriginTimelineEntry[];
};

type AboutValue = {
  title: string;
  description: string;
};

type TeamMember = {
  name: string;
  role: string;
};

type AboutContent = {
  heading: string;
  description: string;
  highlights: string[];
  sections: AboutSectionFlags;
  origin: AboutOrigin;
  values: AboutValue[];
  teamMembers: TeamMember[];
};

const DEFAULT_CONTENT: AboutContent = {
  heading: "The future isn't inherited.\nIt's engineered.",
  description:
    "At CONEIZ, we believe technology should be invisible, infinite, and instantaneous. We are building the bedrock for a civilization that runs on the cloud.",
  highlights: [],
  sections: {
    manifesto: true,
    origin: true,
    values: true,
    team: true,
  },
  origin: {
    year: '2025',
    foundedDate: 'October 2nd, 2025',
    description:
      'CONEIZ was officially established on October 2nd, 2025. Born from a necessity to simplify infrastructure, our 2026 goal is to launch our first suite of revolutionary products.',
    timeline: [
      { title: 'Foundation', date: 'OCT 02, 2025', primary: true },
      { title: 'Global Product Launch', date: 'Q1 2026' },
      { title: 'Updating Soon', date: 'Q3 2026' },
    ],
  },
  values: [
    {
      title: 'Precision',
      description: 'We measure success in milliseconds. Every line of code is optimized for absolute performance.',
    },
    {
      title: 'Integrity',
      description: 'Your data is your property. We build zero-knowledge systems that guarantee privacy.',
    },
    {
      title: 'Vision',
      description: "We don't chase trends. We build the infrastructure that allows trends to exist.",
    },
  ],
  teamMembers: [],
};

const About: React.FC = () => {
  const [content, setContent] = useState<AboutContent>(DEFAULT_CONTENT);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        unsub = onSnapshot(
          doc(db, 'about_content', 'main'),
          (snap) => {
            if (!snap.exists()) return;
            const data = snap.data() as any;

            const rawSections = (data.sections ?? {}) as any;
            const sections: AboutSectionFlags = {
              manifesto: Boolean(rawSections.manifesto ?? DEFAULT_CONTENT.sections.manifesto),
              origin: Boolean(rawSections.origin ?? DEFAULT_CONTENT.sections.origin),
              values: Boolean(rawSections.values ?? DEFAULT_CONTENT.sections.values),
              team: Boolean(rawSections.team ?? DEFAULT_CONTENT.sections.team),
            };

            const rawOrigin = (data.origin ?? {}) as any;
            const timelineRaw = Array.isArray(rawOrigin.timeline) ? rawOrigin.timeline : [];
            const timeline: OriginTimelineEntry[] = timelineRaw
              .map((t: any) => ({
                title: String(t?.title ?? '').trim(),
                date: String(t?.date ?? '').trim(),
                primary: Boolean(t?.primary),
              }))
              .filter((t: OriginTimelineEntry) => t.title.length > 0 && t.date.length > 0);

            const valuesRaw = Array.isArray(data.values) ? data.values : [];
            const values: AboutValue[] = valuesRaw
              .map((v: any) => ({
                title: String(v?.title ?? '').trim(),
                description: String(v?.description ?? '').trim(),
              }))
              .filter((v: AboutValue) => v.title.length > 0 && v.description.length > 0);

            const membersRaw = Array.isArray(data.teamMembers) ? data.teamMembers : [];
            const teamMembers: TeamMember[] = membersRaw
              .map((m: any) => ({
                name: String(m?.name ?? '').trim(),
                role: String(m?.role ?? '').trim(),
              }))
              .filter((m: TeamMember) => m.name.length > 0);

            setContent({
              heading: String(data.heading ?? DEFAULT_CONTENT.heading),
              description: String(data.description ?? DEFAULT_CONTENT.description),
              highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
              sections,
              origin: {
                year: String(rawOrigin.year ?? DEFAULT_CONTENT.origin.year),
                foundedDate: String(rawOrigin.foundedDate ?? DEFAULT_CONTENT.origin.foundedDate),
                description: String(rawOrigin.description ?? DEFAULT_CONTENT.origin.description),
                timeline: timeline.length > 0 ? timeline : DEFAULT_CONTENT.origin.timeline,
              },
              values: values.length > 0 ? values : DEFAULT_CONTENT.values,
              teamMembers,
            });
          },
          () => {
            // ignore and keep defaults
          }
        );
      } catch {
        // ignore
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Manifesto Section */}
      {content.sections.manifesto && (
      <section className="py-32 md:py-48 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-block mb-8 p-3 rounded-full bg-brand-silver/50">
             <div className="w-2 h-2 bg-brand-blue rounded-full"></div>
          </div>
          <h1 className="text-[11px] font-bold text-brand-navy/40 uppercase tracking-[0.4em] mb-12">The CONEIZ Manifesto</h1>
          <p className="text-4xl md:text-6xl text-brand-navy leading-[1.15] font-display font-medium mb-12 whitespace-pre-line">
            {content.heading}
          </p>
          <div className="w-20 h-1 bg-brand-blue mx-auto mb-12"></div>
          <p className="text-xl md:text-2xl text-brand-navy/60 font-light leading-relaxed">
            {content.description}
          </p>

          {content.highlights.length > 0 && (
            <ul className="mt-10 space-y-3 text-brand-navy/70 text-sm md:text-base font-light">
              {content.highlights.map((h, idx) => (
                <li key={idx} className="flex items-start justify-center gap-3">
                  <span className="mt-2 w-1.5 h-1.5 bg-brand-blue rounded-full flex-shrink-0" />
                  <span className="max-w-2xl text-left">{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      )}

      {/* The Foundation Date & Roadmap */}
      {content.sections.origin && (
      <section className="py-32 bg-brand-black text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-brand-blue/10 blur-[100px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
             <div>
               <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-cyan mb-8">Our Origin</h2>
               <div className="text-9xl font-display font-bold text-white tracking-tighter leading-none -ml-2 mb-6">{content.origin.year}</div>
               <p className="text-white/70 text-lg font-light leading-relaxed max-w-md">
                 {content.origin.description.split(content.origin.foundedDate).map((part, idx, arr) => (
                   <React.Fragment key={idx}>
                     {part}
                     {idx < arr.length - 1 && (
                       <span className="text-white font-medium border-b border-white/20 pb-0.5">{content.origin.foundedDate}</span>
                     )}
                   </React.Fragment>
                 ))}
               </p>
             </div>
             <div className="relative pl-8 md:pl-16 border-l border-white/10 space-y-16 py-8">
                {content.origin.timeline.map((entry, idx) => (
                  <div key={`${entry.title}-${idx}`} className="relative group">
                    {entry.primary ? (
                      <span className="absolute -left-[41px] md:-left-[73px] top-1.5 w-3 h-3 bg-brand-blue rounded-full shadow-[0_0_15px_rgba(0,68,204,0.5)]"></span>
                    ) : (
                      <span className="absolute -left-[41px] md:-left-[73px] top-1.5 w-3 h-3 bg-brand-navy border border-white/20 rounded-full group-hover:border-brand-cyan group-hover:bg-brand-cyan/20 transition-all"></span>
                    )}
                    <h3 className="text-2xl font-display font-medium text-white mb-2 group-hover:text-brand-cyan transition-colors">
                      {entry.title}
                    </h3>
                    <p className="text-white/40 text-sm font-mono">{entry.date}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
      )}

      {/* Values */}
      {content.sections.values && (
      <section className="py-32 bg-brand-silver/30">
         <div className="max-w-7xl mx-auto px-6 lg:px-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                 {content.values.slice(0, 3).map((v, idx) => (
                   <div key={`${v.title}-${idx}`} className="p-8 bg-white rounded-2xl shadow-sm">
                     <h3 className="text-lg font-bold text-brand-navy mb-4 uppercase tracking-wider">{v.title}</h3>
                     <p className="text-brand-navy/60 font-light">{v.description}</p>
                   </div>
                 ))}
             </div>
         </div>
      </section>
      )}

      {/* Team - Coming Soon */}
      {content.sections.team && (
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-display font-medium text-brand-navy mb-4">The Architects</h2>
            <p className="text-brand-navy/50 font-light uppercase tracking-widest text-xs">
              {content.teamMembers.length > 0 ? 'Core Team' : 'Profiles Coming Soon'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {content.teamMembers.length > 0
              ? content.teamMembers.slice(0, 3).map((m, idx) => (
                  <div key={`${m.name}-${idx}`} className="group">
                    <div className="relative mb-6 w-full aspect-[3/4] overflow-hidden rounded-lg bg-brand-silver flex items-center justify-center">
                      <User size={64} className="text-brand-navy/5" />
                      <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-brand-navy font-medium">{m.name}</div>
                      <div className="text-brand-navy/50 text-sm font-light">{m.role}</div>
                    </div>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div key={i} className="group">
                    <div className="relative mb-6 w-full aspect-[3/4] overflow-hidden rounded-lg bg-brand-silver flex items-center justify-center">
                      <User size={64} className="text-brand-navy/5" />
                      <div className="absolute inset-0 bg-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 w-32 bg-brand-silver mx-auto mb-2 rounded animate-pulse"></div>
                      <div className="h-3 w-20 bg-brand-silver/50 mx-auto rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
      )}
    </div>
  );
};

export default About;