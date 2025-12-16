import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getCollectionByHandle,
  getAllCollectionHandles,
  filterHiddenProducts,
  formatPrice,
} from "@/lib/shopify";
import { getHiddenProductHandles, getSanityCollectionByHandle } from "@/lib/sanity";
import { ModuleRenderer } from "@/components/ModuleRenderer";

// Route segment config - ISR revalidation
export const revalidate = 3600; // Revalidate every hour
export const dynamicParams = true; // Allow params not in generateStaticParams

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN === 'placeholder') {
    return [];
  }
  try {
    const handles = await getAllCollectionHandles();
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  try {
    const collection = await getCollectionByHandle(handle);
    if (!collection) return {};
    return {
      title: `${collection.title} | Shop`,
      description: collection.description || `Browse our ${collection.title} collection`,
    };
  } catch {
    return {};
  }
}

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  try {
    // Fetch Shopify collection, hidden handles, and Sanity collection data (with modules) in parallel
    const [collection, hiddenHandles, sanityCollection] = await Promise.all([
      getCollectionByHandle(handle),
      getHiddenProductHandles(),
      getSanityCollectionByHandle(handle),
    ]);
    if (!collection) notFound();

    // Check if collection has modules configured in Sanity
    const hasModules = sanityCollection?.modules && sanityCollection.modules.length > 0;

    // If modules exist, render them instead of the default layout
    if (hasModules) {
      return (
        <main className="min-h-screen">
          <ModuleRenderer modules={sanityCollection.modules || []} />
        </main>
      );
    }

    // Default collection layout (when no modules are configured)
    // Get products and filter out hidden ones
    const allProducts = collection.products?.edges?.map((edge) => edge.node) || [];
    const products = filterHiddenProducts(allProducts, hiddenHandles);

    return (
      <main className="min-h-screen">
        <section className="section">
          <div className="container">
            {collection.image && (
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-12">
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h1 className="display-lg text-white mb-2">{collection.title}</h1>
                  {collection.description && (
                    <p className="body-lg text-white/80 max-w-2xl">
                      {collection.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {!collection.image && (
              <div className="section-header">
                <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)] mb-4">
                  <Link href="/collections" className="hover:text-[var(--accent-violet)]">
                    Collections
                  </Link>
                  <span>/</span>
                  <span>{collection.title}</span>
                </nav>
                <h1 className="display-lg mb-4">{collection.title}</h1>
                {collection.description && (
                  <p className="body-lg">{collection.description}</p>
                )}
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="body-lg text-[var(--foreground-muted)]">
                  No products in this collection yet
                </p>
                <Link href="/products" className="btn btn-primary mt-4">
                  Browse All Products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-[var(--foreground-muted)]">
                    {products.length} {products.length === 1 ? "product" : "products"}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => {
                    const minPrice = product.priceRange.minVariantPrice;
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.handle}`}
                        className="group"
                      >
                        <article className="glass-card h-full flex flex-col overflow-hidden">
                          {product.featuredImage && (
                            <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
                              <Image
                                src={product.featuredImage.url}
                                alt={product.featuredImage.altText || product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {!product.availableForSale && (
                                <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--surface)] text-xs font-medium rounded">
                                  Sold Out
                                </div>
                              )}
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col">
                            <h2 className="heading-sm mb-2 group-hover:text-[var(--accent-violet)] transition-colors line-clamp-2">
                              {product.title}
                            </h2>
                            <div className="mt-auto font-semibold text-lg">
                              {formatPrice(minPrice.amount, minPrice.currencyCode)}
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('Error loading collection:', error);
    notFound();
  }
}
