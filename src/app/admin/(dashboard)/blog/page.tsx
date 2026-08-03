import { prisma } from "@/lib/prisma";
import { createPost, updatePost, deletePost } from "./actions";

const inputClass =
  "w-full border border-outline-variant focus:border-primary rounded-lg p-2.5 bg-surface-container-lowest text-sm";
const labelClass = "text-label-md text-on-surface-variant uppercase tracking-widest";

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-headline-md text-primary mb-8">Blog</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <form
            key={post.id}
            action={updatePost.bind(null, post.id)}
            className="bg-surface-container-lowest rounded-xl p-6 service-card-shadow space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Title</label>
                <input name="title" defaultValue={post.title} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Status</label>
                <select name="status" defaultValue={post.status} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Excerpt (used in listing &amp; meta description)</label>
              <input name="excerpt" defaultValue={post.excerpt} className={inputClass} />
            </div>

            <div className="space-y-1">
              <label className={labelClass}>
                Body (paragraphs, blank line between — link text with [label](/path))
              </label>
              <textarea name="body" defaultValue={post.body} rows={8} className={inputClass} />
            </div>

            <p className="text-xs text-on-surface-variant/60">
              /blog/{post.slug}
              {post.publishedAt && ` · published ${post.publishedAt.toLocaleDateString()}`}
            </p>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                Save
              </button>
              <button
                formAction={deletePost.bind(null, post.id)}
                className="text-error text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>

      <h2 className="font-display text-headline-sm text-primary mt-12 mb-4">Add a post</h2>
      <form
        action={createPost}
        className="bg-surface-container rounded-xl p-6 space-y-4 border border-dashed border-outline-variant"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Title</label>
            <input name="title" required className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Status</label>
            <select name="status" defaultValue="draft" className={inputClass}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Excerpt (used in listing &amp; meta description)</label>
          <input name="excerpt" className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Body (paragraphs, blank line between)</label>
          <textarea name="body" rows={6} className={inputClass} />
        </div>
        <button
          type="submit"
          className="bg-primary text-on-primary px-5 py-2 rounded-full text-sm hover:bg-primary-container hover:text-on-primary-container transition-colors"
        >
          Add post
        </button>
      </form>
    </div>
  );
}
