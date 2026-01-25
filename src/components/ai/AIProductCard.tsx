"use client";

/**
 * AI Product Card
 * Premium product card for AI chat responses
 * Features refined typography, smooth transitions, and luxury styling
 */

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/shopify";
import type { AIProduct, AIProductVariant } from "@/lib/ai/types";

interface AIProductCardProps {
  product: AIProduct;
  selectedVariantId?: string;
  showActions?: boolean;
  compact?: boolean;
  onVariantSelect?: (variantId: string) => void;
}

export function AIProductCard({
  product,
  selectedVariantId,
  showActions = true,
  compact = false,
  onVariantSelect,
}: AIProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<AIProductVariant | null>(
    selectedVariantId
      ? product.variants.find((v) => v.id === selectedVariantId) || null
      : product.variants.length === 1
      ? product.variants[0]
      : null
  );

  const handleVariantChange = useCallback(
    (variantId: string) => {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant) {
        setSelectedVariant(variant);
        onVariantSelect?.(variantId);
      }
    },
    [product.variants, onVariantSelect]
  );

  const handleAddToCart = useCallback(async () => {
    if (!selectedVariant) return;

    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, 1);
    } catch (error) {
      // Error handled silently - AI chat provides feedback
    } finally {
      setIsAdding(false);
    }
  }, [selectedVariant, addItem]);

  const price = selectedVariant?.price || product.priceRange.minVariantPrice;
  const compareAtPrice =
    selectedVariant?.compareAtPrice || product.compareAtPriceRange?.minVariantPrice;
  const isOnSale =
    compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const hasMultipleVariants = product.variants.length > 1;

  return (
    <article
      className={`
        group rounded-xl border border-[var(--color-border-primary)]
        bg-[var(--color-bg-primary)] overflow-hidden
        transition-all duration-300 ease-out
        hover:border-[var(--color-border-secondary)]
        hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        ${compact ? "flex gap-3 p-3" : "flex flex-col"}
      `}
    >
      {/* Product Image */}
      <Link
        href={`/products/${product.handle}`}
        className={`
          relative block overflow-hidden bg-[var(--color-bg-secondary)]
          ${compact ? "w-20 h-20 flex-shrink-0 rounded-lg" : "aspect-square w-full"}
        `}
        aria-label={`View ${product.title}`}
      >
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            sizes={compact ? "80px" : "(max-width: 440px) 100vw, 200px"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[var(--color-text-tertiary)]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {/* Sale badge */}
        {isOnSale && (
          <span className="absolute top-2 left-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[var(--color-accent)] text-white rounded-full shadow-sm">
            Sale
          </span>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Product Info */}
      <div className={`flex flex-col ${compact ? "flex-1 min-w-0 justify-center" : "p-4"}`}>
        {/* Vendor (subtle) */}
        {!compact && product.vendor && (
          <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1">
            {product.vendor}
          </span>
        )}

        {/* Title */}
        <Link
          href={`/products/${product.handle}`}
          className="font-medium text-sm text-[var(--color-text-primary)] hover:text-[var(--color-accent)] line-clamp-2 transition-colors duration-200"
        >
          {product.title}
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`font-semibold ${isOnSale ? "text-[var(--color-accent)]" : "text-[var(--color-text-primary)]"}`}>
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {isOnSale && compareAtPrice && (
            <span className="text-xs text-[var(--color-text-tertiary)] line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
        </div>

        {/* Availability */}
        {!product.availableForSale && (
          <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            Out of Stock
          </span>
        )}

        {/* Variant Selector (if multiple variants and not compact) */}
        {showActions && hasMultipleVariants && !compact && (
          <div className="mt-3">
            <label className="sr-only" htmlFor={`variant-${product.id}`}>
              Select variant
            </label>
            <select
              id={`variant-${product.id}`}
              value={selectedVariant?.id || ""}
              onChange={(e) => handleVariantChange(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-[var(--color-border-primary)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)] transition-all duration-200 cursor-pointer"
            >
              <option value="">Select option</option>
              {product.variants.map((variant) => (
                <option
                  key={variant.id}
                  value={variant.id}
                  disabled={!variant.availableForSale}
                >
                  {variant.title}
                  {!variant.availableForSale && " (Out of Stock)"}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add to Cart Button */}
        {showActions && product.availableForSale && (
          <button
            onClick={handleAddToCart}
            disabled={isAdding || (hasMultipleVariants && !selectedVariant)}
            aria-busy={isAdding}
            className={`
              mt-3 w-full py-2.5 px-4 text-sm font-medium rounded-lg
              transition-all duration-200 ease-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
              ${
                isAdding || (hasMultipleVariants && !selectedVariant)
                  ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] cursor-not-allowed"
                  : "bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:opacity-90 hover:shadow-md active:scale-[0.98]"
              }
            `}
          >
            {isAdding ? (
              <span className="inline-flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
                Adding...
              </span>
            ) : hasMultipleVariants && !selectedVariant ? (
              "Select Options"
            ) : (
              "Add to Cart"
            )}
          </button>
        )}
      </div>
    </article>
  );
}

/**
 * Product Grid for displaying multiple products
 * Features refined spacing and subtle animations
 */
interface AIProductGridProps {
  products: AIProduct[];
  title?: string;
}

export function AIProductGrid({ products, title }: AIProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
            {title}
          </h4>
          <span className="flex-1 h-px bg-[var(--color-border-primary)]" />
        </div>
      )}
      <div
        className="grid grid-cols-2 gap-3"
        role="list"
        aria-label={title || "Products"}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            role="listitem"
            className="animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}
          >
            <AIProductCard product={product} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
