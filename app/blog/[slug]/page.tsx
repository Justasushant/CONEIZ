"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";

type Post = {
  title: string;
  content: string;
  published: boolean;
  createdAtText: string;
};

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      setError(null);
      try {
        const { db } = await import("@/lib/firebase");
        const snap = await getDoc(doc(db, "blog_posts", slug));
        if (!snap.exists()) {
          setPost(null);
          return;
        }
        const data = snap.data() as any;
        const ts = data.createdAt;
        const date = ts && typeof ts.toDate === "function" ? ts.toDate() : null;
        const next: Post = {
          title: String(data.title ?? ""),
          content: String(data.content ?? ""),
          published: Boolean(data.published),
          createdAtText: date ? date.toLocaleString() : "",
        };
        setPost(next);
      } catch {
        setError("Failed to load post.");
      }
    };

    void load();
  }, [slug]);

  if (!slug) return null;

  if (error) {
    return (
      <div className="animate-fade-in bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-sm text-red-600">{error}</div>
          <div className="mt-6">
            <Link href="/blog" className="text-brand-blue font-medium">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post || !post.published) {
    return (
      <div className="animate-fade-in bg-white min-h-screen pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-2xl font-display font-medium text-brand-navy">Post not available.</h1>
          <div className="mt-6">
            <Link href="/blog" className="text-brand-blue font-medium">
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      <section className="pt-40 pb-10 bg-brand-silver/20 border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <Link href="/blog" className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">
            Back
          </Link>
          <h1 className="text-5xl font-display font-medium text-brand-navy mt-6">{post.title}</h1>
          {post.createdAtText && <div className="mt-4 text-sm text-brand-navy/40">{post.createdAtText}</div>}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-brand-navy/80 font-light whitespace-pre-wrap leading-relaxed">{post.content}</div>
        </div>
      </section>
    </div>
  );
}
