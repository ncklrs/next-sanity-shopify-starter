"use client";

import { useState, useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { getProductByHandle } from "@/lib/shopify/queries";
import type { Product } from "@/lib/shopify/types";
import ProductCard from "@/components/ui/product-card";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";

interface RecentlyViewedProductsProps {
  className?: string;
  title?: string;
  maxItems?: number;
  showClearButton?: boolean;
}

/**
 * Display component for recently viewed products
 * Fetches product data for stored handles and displays as product card grid
 */
export default function RecentlyViewedProducts({
  className = "",
  title = "Recently Viewed",
  maxItems = 10,
  showClearButton = true,
}: RecentlyViewedProductsProps) {
  const { recentlyViewed, clearRecentlyViewed, isHydrated } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data for stored handles
  useEffect(() => {
    if (!isHydrated) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const handles = recentlyViewed.slice(0, maxItems);
        if (handles.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }

        // Fetch all products in parallel
        const productPromises = handles.map((handle) =>
          getProductByHandle(handle).catch((err) => {
            console.error(`Failed to fetch product ${handle}:`, err);
            return null;
          })
        );

        const fetchedProducts = await Promise.all(productPromises);
        const validProducts = fetchedProducts.filter(
          (product): product is Product => product !== null
        );

        setProducts(validProducts);
      } catch (err) {
        console.error("Error fetching recently viewed products:", err);
        setError("Failed to load recently viewed products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [recentlyViewed, isHydrated, maxItems]);

  const handleClear = () => {
    if (confirm("Clear your recently viewed products history?")) {
      clearRecentlyViewed();
      setProducts([]);
    }
  };

  // Don't render anything until hydrated
  if (!isHydrated) {
    return null;
  }

  // Empty state
  if (!isLoading && products.length === 0) {
    return (
      <div className={`py-12 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">
              {title}
            </h2>
            <p className="text-[var(--foreground-muted)] max-w-md mx-auto">
              You haven't viewed any products yet. Start browsing to see your history here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            {title}
          </h2>
          {showClearButton && products.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              leftIcon={<X className="w-4 h-4" />}
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            >
              Clear History
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: Math.min(maxItems, 5) }).map((_, i) => (
              <div
                key={i}
                className="bg-[var(--surface)] rounded-2xl overflow-hidden"
              >
                {/* Image skeleton */}
                <div className="aspect-[3/4] bg-[var(--background-tertiary)] animate-pulse" />
                {/* Content skeleton */}
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[var(--background-tertiary)] rounded animate-pulse" />
                  <div className="h-4 bg-[var(--background-tertiary)] rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-[var(--accent-rose)] mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => {
              const firstImage = product.images.edges[0]?.node;
              const secondImage = product.images.edges[1]?.node;
              const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
              const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
                ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                : undefined;

              // Extract variants for color swatches
              const variants = product.variants.edges.map((edge) => {
                const colorOption = edge.node.selectedOptions.find(
                  (opt) => opt.name.toLowerCase() === "color"
                );
                return {
                  id: edge.node.id,
                  name: edge.node.title,
                  color: colorOption?.value,
                  inStock: edge.node.availableForSale,
                };
              });

              return (
                <ProductCard
                  key={product.id}
                  image={firstImage?.url || ""}
                  hoverImage={secondImage?.url}
                  title={product.title}
                  price={minPrice}
                  salePrice={
                    compareAtPrice && compareAtPrice > minPrice
                      ? minPrice
                      : undefined
                  }
                  variants={variants}
                  onCardClick={() => {
                    window.location.href = `/products/${product.handle}`;
                  }}
                  onQuickAdd={() => {
                    // You can implement quick add functionality here
                    console.log("Quick add:", product.handle);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
