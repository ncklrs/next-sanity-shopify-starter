"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/shopify";
import { useCart } from "@/contexts/CartContext";
import AddToCartButton from "@/components/ui/add-to-cart-button";
import { WishlistButton } from "@/components/WishlistButton";

interface ProductCardProps {
  product: {
    id: string;
    handle: string;
    title: string;
    availableForSale: boolean;
    featuredImage?: {
      url: string;
      altText?: string;
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          availableForSale: boolean;
        };
      }>;
    };
  };
  // Shop settings (from Sanity CMS)
  showOutOfStockBadge?: boolean;
  showSaleBadge?: boolean;
  showQuickAdd?: boolean;
}

export default function ProductCard({
  product,
  showOutOfStockBadge = true,
  showSaleBadge = true,
  showQuickAdd = false,
}: ProductCardProps) {
  const { addItem, isLoading } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const minPrice = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const isOnSale =
    showSaleBadge &&
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(minPrice.amount);
  const isOutOfStock = !product.availableForSale;

  // Get first available variant for quick add
  const firstVariant = product.variants.edges[0]?.node;
  const canQuickAdd = showQuickAdd && firstVariant?.availableForSale;

  const handleQuickAdd = async () => {
    if (firstVariant) {
      await addItem(firstVariant.id, 1);
    }
  };

  const onQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isOnSale && (
                <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-[var(--accent-red)] text-white rounded">
                  Sale
                </span>
              )}
              {showOutOfStockBadge && isOutOfStock && (
                <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-[var(--foreground-muted)] text-white rounded">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <div className="absolute top-3 right-3 z-10">
              <WishlistButton
                productHandle={product.handle}
                className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
              />
            </div>

            {/* Quick Add Overlay */}
            {canQuickAdd && isHovered && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity"
                onClick={onQuickAddClick}
              >
                <AddToCartButton
                  onAddToCart={handleQuickAdd}
                  disabled={isLoading}
                  size="sm"
                >
                  Quick Add
                </AddToCartButton>
              </div>
            )}
          </div>
        )}

        <div className="p-4 flex-1 flex flex-col">
          <h2 className="heading-sm mb-2 group-hover:text-[var(--accent-violet)] transition-colors line-clamp-2">
            {product.title}
          </h2>
          <div className="mt-auto">
            {isOnSale && compareAtPrice ? (
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-lg text-[var(--accent-red)]">
                  {formatPrice(minPrice.amount, minPrice.currencyCode)}
                </span>
                <span className="text-sm text-[var(--foreground-muted)] line-through">
                  {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                </span>
              </div>
            ) : (
              <span className="font-semibold text-lg">
                {formatPrice(minPrice.amount, minPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
