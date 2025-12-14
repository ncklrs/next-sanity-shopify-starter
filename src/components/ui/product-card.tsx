"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import Image from "next/image";

interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  inStock: boolean;
}

interface ProductCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  image: string;
  hoverImage?: string;
  title: string;
  price: number;
  salePrice?: number;
  variants?: ProductVariant[];
  badge?: ReactNode;
  onQuickAdd?: () => void;
  onQuickView?: () => void;
  onCardClick?: () => void;
  className?: string;
  productHandle?: string;
}

const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      image,
      hoverImage,
      title,
      price,
      salePrice,
      variants = [],
      badge,
      onQuickAdd,
      onQuickView,
      onCardClick,
      className = "",
      productHandle,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    };

    const handleQuickAdd = (e: React.MouseEvent) => {
      e.stopPropagation();
      onQuickAdd?.();
    };

    const handleQuickView = (e: React.MouseEvent) => {
      e.stopPropagation();
      onQuickView?.();
    };

    return (
      <div
        ref={ref}
        className={`group relative bg-[var(--surface)] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onCardClick}
        {...props}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[var(--background-tertiary)]">
          <Image
            src={isHovered && hoverImage ? hoverImage : image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3 z-10">
              {badge}
            </div>
          )}

          {/* Quick View and Quick Add Buttons */}
          <div
            className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300 ${
              isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            <div className="flex gap-2">
              {onQuickView && (
                <button
                  onClick={handleQuickView}
                  className="flex-1 bg-white/90 backdrop-blur-sm text-[#0a0a0f] font-semibold py-3 px-4 rounded-full transition-all duration-200 hover:bg-white active:scale-95 shadow-lg"
                  aria-label="Quick view"
                >
                  Quick View
                </button>
              )}
              {onQuickAdd && (
                <button
                  onClick={handleQuickAdd}
                  className="flex-1 bg-white text-[#0a0a0f] font-semibold py-3 px-4 rounded-full transition-all duration-200 hover:bg-[#f4f4f7] active:scale-95 shadow-lg"
                >
                  Quick Add
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-2 line-clamp-2 min-h-[2.5rem]">
            {title}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            {salePrice ? (
              <>
                <span className="text-base font-semibold text-[var(--accent-rose)]">
                  {formatPrice(salePrice)}
                </span>
                <span className="text-sm text-[var(--foreground-subtle)] line-through">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold text-[var(--foreground)]">
                {formatPrice(price)}
              </span>
            )}
          </div>

          {/* Color Swatches */}
          {variants.length > 0 && (
            <div className="flex gap-1.5">
              {variants.slice(0, 5).map((variant) => (
                <button
                  key={variant.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(variant.id);
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    selectedVariant === variant.id
                      ? "border-[var(--foreground)] scale-110"
                      : "border-transparent hover:border-[var(--foreground-subtle)]"
                  } ${!variant.inStock ? "opacity-30 cursor-not-allowed" : ""}`}
                  style={{
                    backgroundColor: variant.color || "#e5e5e5",
                  }}
                  title={variant.name}
                  disabled={!variant.inStock}
                  aria-label={`Select ${variant.name}`}
                />
              ))}
              {variants.length > 5 && (
                <div className="flex items-center justify-center w-6 h-6 text-xs text-[var(--foreground-subtle)]">
                  +{variants.length - 5}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
