import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { getAllPosts, getEngagementsForBlog } from "../../../../sanity/queries";
import { GlobalEngagement } from "@/components/GlobalEngagement";

export const metadata = {
  title: "Blog | MAISON",
  description: "Latest articles and insights from the MAISON editorial team",
};

export default async function BlogPage() {
  // Skip data fetching when using placeholder credentials (CI builds)
  const isPlaceholder = !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'placeholder';

  const [posts, engagements] = isPlaceholder
    ? [[], []]
    : await Promise.all([
        getAllPosts(),
        getEngagementsForBlog(),
      ]);

  return (
    <>
      <GlobalEngagement engagements={engagements} />
      <main className="min-h-screen">
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h1 className="display-lg mb-4">
                Latest <span className="text-gradient">Articles</span>
              </h1>
              <p className="body-lg">
                Insights, tutorials, and updates from our team
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group"
                >
                  <article className="glass-card h-full flex flex-col overflow-hidden">
                    {post.featuredImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={urlFor(post.featuredImage).width(600).height(340).url()}
                          alt={post.featuredImage.alt || post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      {post.publishedAt && (
                        <time className="text-sm text-[var(--foreground-muted)] mb-2">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      )}
                      <h2 className="heading-md mb-3 group-hover:text-[var(--accent-violet)] transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-[var(--foreground-muted)] line-clamp-3 flex-grow">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-4 pt-4 border-t border-[var(--border)]">
                        <span className="text-[var(--accent-violet)] font-semibold text-sm flex items-center gap-2">
                          Read More
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                            <path d="M5 12l6-6-6-6" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
