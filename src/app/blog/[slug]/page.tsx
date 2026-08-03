import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import RichParagraph from "@/components/RichParagraph";
import { prisma } from "@/lib/prisma";
import { business, psychologistBio } from "@/lib/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post || post.status !== "published") return { title: "WellSight Blog" };

  return {
    title: { absolute: `${post.title} | WellSight` },
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || post.status !== "published") notFound();

  const paragraphs = post.body.split(/\n\s*\n/).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Organization", name: business.name },
    publisher: { "@type": "Organization", name: business.name },
    mainEntityOfPage: `https://www.wellsightcare.com/blog/${post.slug}`,
  };

  return (
    <Reveal>
      <article className="py-16 md:py-24 px-4 md:px-16 max-w-3xl mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link
          href="/blog"
          className="text-primary text-label-lg hover:opacity-70 transition-opacity"
        >
          ← Back to Blog
        </Link>

        {post.publishedAt && (
          <p className="text-label-md text-on-surface-variant/70 uppercase tracking-widest mt-8 mb-2">
            {post.publishedAt.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <h1 className="font-display text-headline-lg text-primary mb-4">{post.title}</h1>
        <p className="text-on-surface-variant text-sm mb-8">
          By the {business.name} clinical team · {psychologistBio.credentials}
        </p>

        <div className="space-y-6 text-on-surface text-body-lg">
          {paragraphs.map((p, i) => (
            <RichParagraph key={i} text={p} />
          ))}
        </div>
      </article>
    </Reveal>
  );
}
