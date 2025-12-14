"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { WishlistButton } from "@/components/WishlistButton";
import Button from "@/components/ui/Button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface WishlistProduct {
  handle: string;
  title: string;
  price: string;
  image?: string;
  description?: string;
}

interface WishlistProps {
  heading?: string;
  subheading?: string;
  emptyStateHeading?: string;
  emptyStateText?: string;
  emptyStateCta?: {
    text: string;
    url: string;
  };
  // In a real app, you would fetch products based on handles
  // For now, we'll use mock data or accept products as props
  products?: WishlistProduct[];
}

export function Wishlist({
  heading = "Your Wishlist",
  subheading = "Items you've saved for later",
  emptyStateHeading = "Your wishlist is empty",
  emptyStateText = "Start browsing and add items you love to your wishlist",
  emptyStateCta = { text: "Browse Products", url: "/" },
  products = [],
}: WishlistProps) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter products to only show those in wishlist
  // In a real implementation, you'd fetch product details based on wishlist handles
  const wishlistProducts = isMounted
    ? products.filter((product) => wishlist.includes(product.handle))
    : [];

  const handleAddToCart = async (productHandle: string) => {
    setAddingToCart(productHandle);
    // Simulate add to cart action
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In a real app, you'd dispatch to cart context here
    console.log("Added to cart:", productHandle);
    setAddingToCart(null);
  };

  const handleRemove = (productHandle: string) => {
    removeFromWishlist(productHandle);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      clearWishlist();
    }
  };

  // Show loading state during hydration
  if (!isMounted) {
    return (
      <section className="section-py">
        <div className="container-default">
          <div className="text-center mb-12">
            <h2 className="display-sm mb-4">{heading}</h2>
            {subheading && <p className="body-lg text-[var(--foreground-muted)]">{subheading}</p>}
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <section className="section-py">
        <div className="container-default">
          <div className="text-center mb-12">
            <h2 className="display-sm mb-4">{heading}</h2>
            {subheading && <p className="body-lg text-[var(--foreground-muted)]">{subheading}</p>}
          </div>
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="mb-6 p-6 rounded-full bg-[var(--background-muted)]">
              <Heart className="w-16 h-16 text-[var(--foreground-muted)]" />
            </div>
            <h3 className="display-xs mb-4">{emptyStateHeading}</h3>
            <p className="body-lg text-[var(--foreground-muted)] mb-8 max-w-md">
              {emptyStateText}
            </p>
            <Link href={emptyStateCta.url}>
              <Button variant="primary" size="lg">
                {emptyStateCta.text}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Wishlist with items
  return (
    <section className="section-py">
      <div className="container-default">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="display-sm mb-4">{heading}</h2>
            {subheading && <p className="body-lg text-[var(--foreground-muted)]">{subheading}</p>}
          </div>
          {wishlistProducts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistProducts.map((product) => (
            <div
              key={product.handle}
              className="group bg-[var(--background-elevated)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300"
            >
              {product.image && (
                <div className="relative aspect-square overflow-hidden bg-[var(--background-muted)]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <WishlistButton productHandle={product.handle} className="bg-white/90 backdrop-blur-sm" />
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="heading-sm mb-2">{product.title}</h3>
                {product.description && (
                  <p className="body-sm text-[var(--foreground-muted)] mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="heading-md text-[var(--accent-primary)]">{product.price}</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleAddToCart(product.handle)}
                    isLoading={addingToCart === product.handle}
                    leftIcon={!addingToCart && <ShoppingCart className="w-4 h-4" />}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleRemove(product.handle)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {wishlistProducts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="body-md text-[var(--foreground-muted)]">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} in your wishlist
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Wishlist;
