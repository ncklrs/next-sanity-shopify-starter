"use client";

import { useRef, useState, useEffect } from "react";
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
  availableForSale?: boolean;
  /** Shopify variant ID for add-to-cart (e.g., "gid://shopify/ProductVariant/123") */
  firstVariantId?: string;
}

interface RelatedProductsProps {
  heading?: string;
  products: Product[];
  layout?: "carousel" | "grid";
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
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const isOutOfStock = product.availableForSale === false;

  return (
    <div className="flex-shrink-0 w-64 group">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-lg hover:-translate-y-1">
        {/* Product Image */}
        <div
          className="relative aspect-square overflow-hidden cursor-pointer"
          onClick={() => onClick?.(product)}
        >
          {product.image ? (
            <Image
              src={product.image.src}
              alt={product.image.alt}
              width={product.image.width || 300}
              height={product.image.height || 300}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-[var(--surface-elevated)] flex items-center justify-center">
              <span className="text-[var(--foreground-muted)] text-sm">No image</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badge && (
              <Badge variant="gradient" className="text-xs">{product.badge}</Badge>
            )}
            {isOutOfStock && (
              <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-[var(--foreground-muted)] text-white rounded">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3
            className="text-sm font-semibold mb-2 cursor-pointer hover:text-[var(--accent-cyan)] transition-colors line-clamp-2"
            onClick={() => onClick?.(product)}
          >
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating !== undefined && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!)
                      ? "text-[var(--accent-amber)] fill-current"
                      : "text-[var(--foreground-subtle)]"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-gradient">
              {typeof product.price === "number" ? `$${product.price}` : product.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[var(--foreground-muted)] line-through">
                {typeof product.compareAtPrice === "number" ? `$${product.compareAtPrice}` : product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              if (product.firstVariantId) {
                onAddToCart?.(product.firstVariantId);
              }
            }}
            disabled={!product.firstVariantId || isOutOfStock}
            leftIcon={<ShoppingCartIcon className="w-3 h-3" />}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export function RelatedProducts({
  heading = "You May Also Like",
  products,
  layout = "carousel",
  spacing = "lg",
  backgroundColor,
  onProductClick,
  onAddToCart,
}: RelatedProductsProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const spacingMap = {
    sm: "py-8 px-4",
    md: "py-12 px-6",
    lg: "py-16 px-6",
    xl: "py-20 px-6",
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 280;
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

  if (layout === "grid") {
    return (
      <section
        className={`section ${spacingMap[spacing]}`}
        style={getBackgroundStyle(backgroundColor)}
      >
        <div className="container mx-auto">
          <h2 className="heading-lg mb-8">{heading}</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
                onClick={onProductClick}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`section ${spacingMap[spacing]}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
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

export default RelatedProducts;
