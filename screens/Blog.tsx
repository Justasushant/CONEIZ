import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { BookOpen } from 'lucide-react';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAtText: string;
};

const excerpt = (value: string, max = 160) => {
  const v = (value ?? '').trim();
  if (v.length <= max) return v;
  return `${v.slice(0, max).trimEnd()}…`;
};

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import('@/lib/firebase');
        const q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
        unsub = onSnapshot(
          q,
          (snap) => {
            const next = snap.docs.map((d) => {
              const data = d.data() as any;
              const ts = data.createdAt;
              const date = ts && typeof ts.toDate === 'function' ? ts.toDate() : null;
              return {
                id: d.id,
                title: String(data.title ?? ''),
                slug: String(data.slug ?? d.id),
                content: String(data.content ?? ''),
                published: Boolean(data.published),
                createdAtText: date ? date.toLocaleString() : '',
              } satisfies BlogPost;
            });
            setPosts(next.filter((p) => p.published));
          },
          () => {
            setPosts([]);
          }
        );
      } catch {
        setPosts([]);
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const hasPosts = useMemo(() => posts.length > 0, [posts.length]);

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      
      {/* Editorial Header */}
      <section className="pt-40 pb-20 bg-brand-silver/20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-6xl font-display font-medium text-brand-navy mb-6">Insights</h1>
            <p className="text-xl text-brand-navy/50 font-light leading-relaxed">
              Thought leadership on the intersection of cloud computing, security, and the future of work.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32">
        {hasPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block border border-gray-100 bg-white p-10 transition-colors hover:border-brand-blue/30"
              >
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy/40">{post.createdAtText}</div>
                <h2 className="text-3xl font-display font-medium text-brand-navy mt-4 group-hover:text-brand-blue transition-colors">
                  {post.title}
                </h2>
                <p className="text-brand-navy/60 font-light leading-relaxed mt-4">{excerpt(post.content)}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="bg-brand-silver/30 rounded-3xl p-20 text-center max-w-2xl border border-dashed border-brand-navy/10">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-8 text-brand-blue/30">
                <BookOpen size={40} />
              </div>
              <h2 className="text-3xl font-display font-medium text-brand-navy mb-4">No posts uploaded yet.</h2>
              <p className="text-brand-navy/50 font-light leading-relaxed mb-8">
                Our editorial team is currently drafting insights on the future of tech. Check back soon for our first publication.
              </p>
              <div className="inline-flex items-center text-xs font-bold uppercase tracking-[0.3em] text-brand-blue animate-pulse">
                Coming Soon
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;