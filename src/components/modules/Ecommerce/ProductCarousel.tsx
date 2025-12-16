"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ArrowLeftIcon, ArrowRightIcon, ShoppingCartIcon, StarIcon } from "@/components/icons";

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
  compareAtPrice?: string | number;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  badge?: string;
  rating?: number;
  reviewCount?: number;
  availableForSale?: boolean;
}

interface ProductCarouselProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  products: Product[];
  autoplay?: boolean;
  autoplayInterval?: number;
  spacing?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
}

function ProductCard({ product, onAddToCart, onClick, isPriority = false }: {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onClick?: (product: Product) => void;
  isPriority?: boolean;
}) {
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : 0;
  const isOutOfStock = product.availableForSale === false;

  return (
    <div className="flex-shrink-0 w-80 group">
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-2xl hover:-translate-y-1">
        {/* Product Image */}
        <div
          className="relative aspect-square overflow-hidden cursor-pointer"
          onClick={() => onClick?.(product)}
        >
          {product.image ? (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              width={product.image.width || 400}
              height={product.image.height || 400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              priority={isPriority}
            />
          ) : (
            <div className="w-full h-full bg-[var(--surface-elevated)] flex items-center justify-center">
              <span className="text-[var(--foreground-muted)]">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.badge && (
              <Badge variant="gradient">{product.badge}</Badge>
            )}
            {isOutOfStock && (
              <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-[var(--foreground-muted)] text-white rounded">
                Out of Stock
              </span>
            )}
          </div>
          {hasDiscount && (
            <div className="absolute top-3 right-3">
              <Badge variant="success">-{discountPercent}%</Badge>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-5">
          <h3
            className="heading-sm mb-2 cursor-pointer hover:text-[var(--accent-cyan)] transition-colors line-clamp-2"
            onClick={() => onClick?.(product)}
          >
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating!)
                      ? "text-[var(--accent-amber)] fill-current"
                      : "text-[var(--foreground-subtle)]"
                  }`}
                />
              ))}
              {product.reviewCount !== undefined && (
                <span className="text-xs text-[var(--foreground-muted)] ml-1">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold text-gradient">
              {typeof product.price === "number" ? `$${product.price}` : product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[var(--foreground-muted)] line-through">
                {typeof product.compareAtPrice === "number" ? `$${product.compareAtPrice}` : product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={() => onAddToCart?.(product._id)}
            leftIcon={<ShoppingCartIcon className="w-4 h-4" />}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductCarousel({
  badge,
  heading,
  subheading,
  products,
  autoplay = false,
  autoplayInterval = 5000,
  spacing = "xl",
  backgroundColor,
  onProductClick,
  onAddToCart,
}: ProductCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const spacingMap = {
    sm: "py-12 px-4",
    md: "py-16 px-6",
    lg: "py-20 px-6",
    xl: "py-24 px-6",
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 350; // Width of card + gap
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

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;
      const nextPosition = scrollPosition + 350;

      if (nextPosition >= maxScroll) {
        container.scrollTo({ left: 0, behavior: "smooth" });
        setScrollPosition(0);
      } else {
        scroll("right");
      }
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplay, autoplayInterval, scrollPosition]);

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight =
    scrollContainerRef.current &&
    scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth;

  return (
    <section
      className={`section ${spacingMap[spacing]}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="max-w-3xl">
            {badge && (
              <Badge variant="gradient" className="mb-4">
                {badge}
              </Badge>
            )}
            {heading && <h2 className="display-lg mb-4">{heading}</h2>}
            {subheading && (
              <p className="body-lg text-[var(--foreground-muted)]">{subheading}</p>
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
            >
              <ArrowRightIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, index) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onClick={onProductClick}
                isPriority={index === 0}
              />
            ))}
          </div>

          {/* Gradient Overlays */}
          {canScrollLeft && (
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none" />
          )}
          {canScrollRight && (
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
          >
            <ArrowRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ProductCarousel;
