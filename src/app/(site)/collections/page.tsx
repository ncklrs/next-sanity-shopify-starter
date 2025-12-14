import Link from "next/link";
import Image from "next/image";
import { getAllCollections } from "@/lib/shopify";

export const metadata = {
  title: "Collections | Shop",
  description: "Browse our product collections",
};

const isPlaceholder = () =>
  !process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN === 'placeholder';

export default async function CollectionsPage() {
  const collections = isPlaceholder() ? [] : await getAllCollections().catch(() => []);

  return (
    <main className="min-h-screen">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h1 className="display-lg mb-4">
              Shop by <span className="text-gradient">Collection</span>
            </h1>
            <p className="body-lg">
              Explore our carefully curated product collections
            </p>
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-12">
              <p className="body-lg text-[var(--foreground-muted)]">
                {isPlaceholder()
                  ? "Configure your Shopify credentials to display collections"
                  : "No collections found"}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.handle}`}
                  className="group"
                >
                  <article className="glass-card h-full flex flex-col overflow-hidden">
                    {collection.image && (
                      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface)]">
                        <Image
                          src={collection.image.url}
                          alt={collection.image.altText || collection.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h2 className="heading-lg text-white">{collection.title}</h2>
                        </div>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      {!collection.image && (
                        <h2 className="heading-md mb-3 group-hover:text-[var(--accent-violet)] transition-colors">
                          {collection.title}
                        </h2>
                      )}
                      {collection.description && (
                        <p className="text-[var(--foreground-muted)] line-clamp-3">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
