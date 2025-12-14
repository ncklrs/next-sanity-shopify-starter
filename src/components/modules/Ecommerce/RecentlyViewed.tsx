"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { ArrowLeftIcon, ArrowRightIcon, ShoppingCartIcon } from "@/components/icons";

function getBackgroundStyle(backgroundColor?: string): React.CSSProperties | undefined {
  if (!backgroundColor) return undefined;

  const colorMap: Record<string, string> = {
    white: "var(--background)",
    default: "var(--background)",
    gray: "var(--background-secondary)",
    secondary: "var(--background-secondary)",
    primary: "var(--background-tertiary)",
    tertiary: "var(--background-tertiary)",
    transparent: "transparent",
  };

  const mappedColor = colorMap[backgroundColor.toLowerCase()];
  if (mappedColor) {
    return { backgroundColor: mappedColor };
  }

  return { backgroundColor };
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: string | number;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
}

interface RecentlyViewedProps {
  heading?: string;
  maxItems?: number;
  storageKey?: string;
  spacing?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
}

function ProductCard({
  product,
  onAddToCart,
  onClick,
}: {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onClick?: (product: Product) => void;
}) {
  return (
    <div className="flex-shrink-0 w-56 group">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-lg">
        {/* Product Image */}
        <div
          className="relative aspect-square overflow-hidden cursor-pointer"
          onClick={() => onClick?.(product)}
        >
          {product.image ? (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              width={product.image.width || 250}
              height={product.image.height || 250}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[var(--surface-elevated)] flex items-center justify-center">
              <span className="text-[var(--foreground-muted)] text-xs">No image</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3">
          <h3
            className="text-sm font-medium mb-2 cursor-pointer hover:text-[var(--accent-cyan)] transition-colors line-clamp-2"
            onClick={() => onClick?.(product)}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-gradient">
              {typeof product.price === "number" ? `$${product.price}` : product.price}
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product._id);
              }}
            >
              <ShoppingCartIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecentlyViewed({
  heading = "Recently Viewed",
  maxItems = 10,
  storageKey = "recently_viewed_products",
  spacing = "md",
  backgroundColor,
  onProductClick,
  onAddToCart,
}: RecentlyViewedProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const spacingMap = {
    sm: "py-8 px-4",
    md: "py-12 px-6",
    lg: "py-16 px-6",
    xl: "py-20 px-6",
  };

  // Load recently viewed products from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProducts(Array.isArray(parsed) ? parsed.slice(0, maxItems) : []);
      }
    } catch (error) {
      console.error("Failed to load recently viewed products:", error);
    }
  }, [storageKey, maxItems]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 240;
    const newPosition =
      direction === "left"
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(
            container.scrollWidth - container.clientWidth,
            scrollPosition + scrollAmount
          );

    container.scrollTo({ left: newPosition, behavior: "smooth" });
    setScrollPosition(newPosition);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollPosition(container.scrollLeft);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight =
    scrollContainerRef.current &&
    scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;

  // Don't render if no products
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className={`section ${spacingMap[spacing]}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-lg">{heading}</h2>

          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
            >
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
            >
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onClick={onProductClick}
              />
            ))}
          </div>

          {/* Gradient Overlays */}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />
          )}
        </div>
      </div>
    </section>
  );
}

// Utility function to add a product to recently viewed
export function addToRecentlyViewed(product: Product, storageKey = "recently_viewed_products", maxItems = 10) {
  try {
    const stored = localStorage.getItem(storageKey);
    const products: Product[] = stored ? JSON.parse(stored) : [];

    // Remove if already exists
    const filtered = products.filter((p) => p._id !== product._id);

    // Add to beginning
    const updated = [product, ...filtered].slice(0, maxItems);

    localStorage.setItem(storageKey, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save recently viewed product:", error);
  }
}

export default RecentlyViewed;
