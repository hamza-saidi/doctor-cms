import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { getPageSeo } from "@/lib/pageSeo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("/blog");
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <section className="py-16 md:py-24 px-4 md:px-16 max-w-[1280px] mx-auto text-center">
        <h1 className="font-display text-headline-lg text-primary mb-4">
          WellSight Blog — Notes on Mental Health in Helsinki
        </h1>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          Reflections and practical guidance on therapy, wellbeing, and life in Helsinki.
        </p>
      </section>

      <Reveal>
        <section className="px-4 md:px-16 pb-16 md:pb-24">
          <div className="max-w-[1280px] mx-auto">
            {posts.length === 0 ? (
              <p className="text-on-surface-variant text-body-md text-center">
                No posts published yet — check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block bg-surface-container-lowest rounded-xl p-6 service-card-shadow service-card-hover transition-all duration-500"
                  >
                    {post.publishedAt && (
                      <p className="text-label-md text-on-surface-variant/70 uppercase tracking-widest mb-2">
                        {post.publishedAt.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <h2 className="font-display text-headline-sm text-primary mb-2">
                      {post.title}
                    </h2>
                    <p className="text-on-surface-variant text-body-md">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </Reveal>
    </>
  );
}
