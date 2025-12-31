"use client";

import React, { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

type BlogPost = {
  id: string; // doc id
  title: string;
  slug: string;
  content: string;
  published: boolean;
  createdAtText: string;
};

const makeSlug = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<"idle" | "create" | "edit">("idle");
  const [activeId, setActiveId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    let unsub: (() => void) | null = null;

    const start = async () => {
      try {
        const { db } = await import("@/lib/firebase");
        unsub = onSnapshot(
          collection(db, "blog_posts"),
          (snap) => {
            const next = snap.docs
              .map((d) => {
                const data = d.data() as any;
                const ts = data.createdAt;
                const date = ts && typeof ts.toDate === "function" ? ts.toDate() : null;
                return {
                  id: d.id,
                  title: String(data.title ?? ""),
                  slug: String(data.slug ?? d.id),
                  content: String(data.content ?? ""),
                  published: Boolean(data.published),
                  createdAtText: date ? date.toLocaleString() : "",
                } satisfies BlogPost;
              })
              .sort((a, b) => b.createdAtText.localeCompare(a.createdAtText));

            setPosts(next);
            setIsLoading(false);
          },
          () => {
            setError("Failed to load posts.");
            setIsLoading(false);
          }
        );
      } catch {
        setError("Failed to load posts.");
        setIsLoading(false);
      }
    };

    void start();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const resetForm = () => {
    setMode("idle");
    setActiveId(null);
    setTitle("");
    setSlug("");
    setContent("");
    setPublished(false);
    setError(null);
  };

  const startCreate = () => {
    resetForm();
    setMode("create");
  };

  const startEdit = (post: BlogPost) => {
    setMode("edit");
    setActiveId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setPublished(post.published);
  };

  const canSave = useMemo(() => {
    return title.trim().length > 0 && slug.trim().length > 0 && content.trim().length > 0;
  }, [title, slug, content]);

  const save = async () => {
    if (!canSave) return;
    setError(null);

    const safeSlug = makeSlug(slug);
    if (!safeSlug) {
      setError("Slug is invalid.");
      return;
    }

    const payload = {
      title: title.trim(),
      slug: safeSlug,
      content: content,
      published,
      updatedAt: serverTimestamp(),
    };

    try {
      const { db } = await import("@/lib/firebase");

      if (mode === "create") {
        await setDoc(doc(db, "blog_posts", safeSlug), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        resetForm();
        return;
      }

      if (mode === "edit" && activeId) {
        await updateDoc(doc(db, "blog_posts", activeId), payload);
        resetForm();
      }
    } catch {
      setError("Failed to save post.");
    }
  };

  const togglePublished = async (post: BlogPost) => {
    setError(null);
    try {
      const { db } = await import("@/lib/firebase");
      await updateDoc(doc(db, "blog_posts", post.id), {
        published: !post.published,
        updatedAt: serverTimestamp(),
      });
    } catch {
      setError("Failed to update post.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-display font-medium text-brand-navy">Blog</h1>
          <p className="text-sm text-brand-navy/50 font-light mt-1">Create, edit and publish posts.</p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="bg-brand-navy text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-none"
        >
          New post
        </button>
      </div>

      {error && <div className="mb-6 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="border border-gray-100">
          <div className="bg-brand-silver/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
            Posts
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Title</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Slug</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Published</th>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">Edit</th>
                </tr>
              </thead>
              <tbody className="text-sm text-brand-navy/80">
                {isLoading ? (
                  <tr>
                    <td className="py-5 px-4" colSpan={4}>
                      Loading…
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td className="py-5 px-4" colSpan={4}>
                      No posts.
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="py-4 px-4">{p.title}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{p.slug}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => togglePublished(p)}
                          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue"
                        >
                          {p.published ? "Unpublish" : "Publish"}
                        </button>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/60 hover:text-brand-navy"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-gray-100">
          <div className="bg-brand-silver/30 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
            {mode === "create" ? "Create post" : mode === "edit" ? "Edit post" : "Select a post"}
          </div>

          <div className="p-6">
            {mode === "idle" ? (
              <div className="text-sm text-brand-navy/50 font-light">Choose “Edit” or “New post”.</div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Title</label>
                  <input
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (mode === "create" && slug.trim().length === 0) setSlug(makeSlug(e.target.value));
                    }}
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Slug</label>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50 mb-2">Content (markdown or text)</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full bg-brand-silver/40 border-0 rounded-none px-4 py-4 text-sm text-brand-navy focus:outline-none resize-none"
                  />
                </div>

                <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-navy/50">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 rounded-none"
                  />
                  Published
                </label>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={save}
                    disabled={!canSave}
                    className="bg-brand-navy text-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-none disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-white text-brand-navy px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-none border border-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
