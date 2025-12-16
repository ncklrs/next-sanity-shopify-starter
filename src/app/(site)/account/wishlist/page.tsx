"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";
import { getProductByHandle, formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";

export default function AccountWishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem, isLoading: cartLoading } = useCart();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

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

  const handleAddToCart = async (product: ShopifyProduct) => {
    const firstVariant = product.variants.edges[0]?.node;
    if (!firstVariant) return;

    setAddingToCart(product.handle);
    try {
      await addItem(firstVariant.id, 1);
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="display-md">My Wishlist</h1>
        <p className="mt-2 text-[var(--foreground-muted)]">
          Products you&apos;ve saved for later
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="border border-dashed border-[var(--border-light)] bg-[var(--surface)] py-16 text-center">
          <Heart className="mx-auto h-12 w-12 text-[var(--foreground-muted)] opacity-40" />
          <h3 className="mt-4 font-serif text-lg text-[var(--foreground)]">
            Your wishlist is empty
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Save items you love by clicking the heart icon on any product
          </p>
          <Link href="/products" className="btn btn-primary mt-6">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-[var(--foreground-muted)]">
              {products.length} {products.length === 1 ? "item" : "items"} saved
            </p>
            <button
              onClick={clearWishlist}
              className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-red)] transition-colors duration-300"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const minPrice = product.priceRange.minVariantPrice;
              const firstVariant = product.variants.edges[0]?.node;
              const canAddToCart = firstVariant?.availableForSale;

              return (
                <div
                  key={product.id}
                  className="group relative border border-[var(--border-light)] bg-[var(--surface)] overflow-hidden"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromWishlist(product.handle)}
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-red-50 transition-colors duration-300"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="h-4 w-4 fill-current text-[var(--accent-red)]" />
                  </button>

                  <Link href={`/products/${product.handle}`}>
                    {product.featuredImage && (
                      <div className="relative aspect-[3/4] overflow-hidden bg-[var(--background-warm)]">
                        <Image
                          src={product.featuredImage.url}
                          alt={product.featuredImage.altText || product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {!product.availableForSale && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <span className="bg-white px-4 py-2 text-xs uppercase tracking-wider font-medium">
                              Sold Out
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${product.handle}`}>
                      <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors duration-300 line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="mt-1 font-serif text-lg text-[var(--foreground)]">
                      {formatPrice(minPrice.amount, minPrice.currencyCode)}
                    </p>

                    {canAddToCart && (
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={cartLoading || addingToCart === product.handle}
                        className="btn btn-primary w-full mt-4"
                      >
                        {addingToCart === product.handle ? "Adding..." : "Add to Cart"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
