/**
 * EXAMPLE: Product Detail Page with Recently Viewed Tracking
 *
 * This file shows how to create a product detail page that:
 * 1. Automatically tracks the product as recently viewed
 * 2. Displays other recently viewed products at the bottom
 *
 * Copy this to: src/app/(site)/products/[handle]/page.tsx
 */

import { getProductByHandle } from "@/lib/shopify";
import { ProductPageClient } from "@/components/ProductPageClient";
import RecentlyViewedProducts from "@/components/RecentlyViewedProducts";
import Image from "next/image";
import { notFound } from "next/navigation";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} | Shop`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

// Main product page component
export default async function ProductPage({
  params,
}: {
  params: { handle: string };
}) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  const firstImage = product.images.edges[0]?.node;
  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;
  const onSale = compareAtPrice && compareAtPrice > minPrice;

  return (
    // Wrap entire page in ProductPageClient to auto-track viewing
    <ProductPageClient productHandle={params.handle}>
      <main className="min-h-screen">
        {/* Product Details Section */}
        <section className="section">
          <div className="container max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                {firstImage && (
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--surface)]">
                    <Image
                      src={firstImage.url}
                      alt={firstImage.altText || product.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                )}

                {/* Thumbnail grid */}
                {product.images.edges.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.edges.slice(1, 5).map((edge, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden bg-[var(--surface)] cursor-pointer hover:opacity-80 transition"
                      >
                        <Image
                          src={edge.node.url}
                          alt={edge.node.altText || `${product.title} ${idx + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 25vw, 12vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Breadcrumb */}
                <nav className="text-sm text-[var(--foreground-muted)]">
                  <a href="/" className="hover:text-[var(--foreground)]">
                    Home
                  </a>
                  <span className="mx-2">/</span>
                  <a href="/products" className="hover:text-[var(--foreground)]">
                    Products
                  </a>
                  <span className="mx-2">/</span>
                  <span>{product.title}</span>
                </nav>

                {/* Vendor */}
                {product.vendor && (
                  <p className="text-sm uppercase tracking-wide text-[var(--foreground-muted)]">
                    {product.vendor}
                  </p>
                )}

                {/* Title */}
                <h1 className="display-md">{product.title}</h1>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  {onSale && compareAtPrice && (
                    <span className="text-2xl text-[var(--foreground-muted)] line-through">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-3xl font-bold">
                    ${minPrice.toFixed(2)}
                  </span>
                  {onSale && (
                    <span className="px-3 py-1 bg-[var(--accent-rose)] text-white rounded-full text-sm font-semibold">
                      Sale
                    </span>
                  )}
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.availableForSale
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm">
                    {product.availableForSale ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Description */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-[var(--foreground-muted)]">
                    {product.description}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="btn btn-primary w-full"
                  disabled={!product.availableForSale}
                >
                  {product.availableForSale ? "Add to Cart" : "Sold Out"}
                </button>

                {/* Product Details */}
                {(product.productType || product.tags.length > 0) && (
                  <div className="border-t border-[var(--border)] pt-6 space-y-3">
                    {product.productType && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">Type:</span>
                        <span>{product.productType}</span>
                      </div>
                    )}
                    {product.tags.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">Tags:</span>
                        <div className="flex gap-2 flex-wrap">
                          {product.tags.slice(0, 5).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-[var(--surface)] rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recently Viewed Products Section */}
        <RecentlyViewedProducts
          title="Recently Viewed"
          maxItems={8}
          showClearButton={true}
          className="bg-[var(--background-secondary)]"
        />
      </main>
    </ProductPageClient>
  );
}
