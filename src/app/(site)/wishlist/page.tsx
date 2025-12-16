"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductByHandle, formatPrice, type ShopifyProduct } from "@/lib/shopify";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (wishlist.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const productPromises = wishlist.map((handle) =>
          getProductByHandle(handle).catch(() => null)
        );
        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts.filter((p): p is ShopifyProduct => p !== null));
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [wishlist]);

  return (
    <main className="min-h-screen">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h1 className="display-lg mb-4">
              My <span className="text-gradient">Wishlist</span>
            </h1>
            <p className="body-lg">
              Products you&apos;ve saved for later
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[var(--accent-violet)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-12">
              <div className="glass-card max-w-md mx-auto p-8">
                <h2 className="heading-lg mb-4">Your wishlist is empty</h2>
                <p className="body-md text-[var(--foreground-muted)] mb-6">
                  Save items you love by clicking the heart icon on any product
                </p>
                <Link href="/products" className="btn btn-primary">
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-[var(--foreground-muted)]">
                  {products.length} {products.length === 1 ? "item" : "items"} saved
                </p>
                <button
                  onClick={clearWishlist}
                  className="text-sm text-[var(--foreground-muted)] hover:text-red-500 transition-colors"
                >
                  Clear Wishlist
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const minPrice = product.priceRange.minVariantPrice;
                  return (
                    <div key={product.id} className="relative group">
                      <button
                        onClick={() => removeFromWishlist(product.handle)}
                        className="absolute top-3 right-3 z-10 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                        aria-label="Remove from wishlist"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      </button>
                      <Link href={`/products/${product.handle}`}>
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
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
