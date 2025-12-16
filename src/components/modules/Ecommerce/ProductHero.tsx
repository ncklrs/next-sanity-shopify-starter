"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CheckIcon, ShoppingCartIcon, HeartIcon, StarIcon } from "@/components/icons";

// Shared background style mapper
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

interface ProductImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ProductVariant {
  id: string;
  name: string;
  options: string[];
  selectedOption?: string;
}

/** Shopify variant data for cart lookup */
interface ShopifyVariant {
  id: string;
  title: string;
  option1?: string;
  option2?: string;
  option3?: string;
  price?: number;
  availableForSale?: boolean;
}

interface TrustBadge {
  icon?: string;
  text: string;
}

interface ProductHeroProps {
  badge?: string;
  productName: string;
  price: string | number;
  compareAtPrice?: string | number;
  description?: string;
  rating?: number;
  reviewCount?: number;
  images?: ProductImage[];
  /** Option groups for UI display (Color, Size, etc.) */
  variants?: ProductVariant[];
  /** All Shopify variants with their IDs for cart lookup */
  shopifyVariants?: ShopifyVariant[];
  /** First variant ID for simple single-variant products */
  firstVariantId?: string;
  trustBadges?: TrustBadge[];
  inStock?: boolean;
  ctaText?: string;
  spacing?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  /** Called with the Shopify variant ID when adding to cart */
  onAddToCart?: (variantId: string) => void;
}

export function ProductHero({
  badge,
  productName,
  price,
  compareAtPrice,
  description,
  rating = 5,
  reviewCount,
  images,
  variants,
  shopifyVariants,
  firstVariantId,
  trustBadges,
  inStock = true,
  ctaText = "Add to Cart",
  spacing = "xl",
  backgroundColor,
  onAddToCart,
}: ProductHeroProps) {
  // Ensure arrays are never null (handle edge cases from GROQ queries)
  const safeImages = images ?? [];
  const safeVariants = variants ?? [];
  const safeShopifyVariants = shopifyVariants ?? [];
  const safeTrustBadges = trustBadges ?? [];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    safeVariants.forEach(variant => {
      if (variant.selectedOption) {
        initial[variant.name] = variant.selectedOption;
      } else if (variant.options && variant.options.length > 0) {
        initial[variant.name] = variant.options[0];
      }
    });
    return initial;
  });

  /**
   * Find the Shopify variant ID based on selected options.
   * Shopify variants have option1, option2, option3 fields that match the selected values.
   */
  const findVariantId = (): string | undefined => {
    // For single-variant products, use firstVariantId
    if (safeShopifyVariants.length <= 1) {
      return firstVariantId;
    }

    // Get the selected option values in order
    const selectedValues = safeVariants.map(v => selectedVariants[v.name]).filter(Boolean);

    // Find matching variant
    const matchingVariant = safeShopifyVariants.find(sv => {
      const variantOptions = [sv.option1, sv.option2, sv.option3].filter(Boolean);
      return selectedValues.every((val, idx) => variantOptions[idx] === val);
    });

    return matchingVariant?.id || firstVariantId;
  };

  const spacingMap = {
    sm: "py-12 px-4",
    md: "py-16 px-6",
    lg: "py-20 px-6",
    xl: "py-24 px-6",
  };

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    const variantId = findVariantId();
    if (variantId) {
      onAddToCart?.(variantId);
    }
  };

  // Check if we can add to cart (need a variant ID)
  const canAddToCart = !!(firstVariantId || safeShopifyVariants.length > 0);

  const hasDiscount = compareAtPrice && Number(compareAtPrice) > Number(price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(compareAtPrice) - Number(price)) / Number(compareAtPrice)) * 100)
    : 0;

  return (
    <section
      className={`section ${spacingMap[spacing]}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]">
              {safeImages.length > 0 ? (
                <Image
                  src={safeImages[selectedImage].src}
                  alt={safeImages[selectedImage].alt}
                  width={safeImages[selectedImage].width || 800}
                  height={safeImages[selectedImage].height || 800}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--surface-elevated)]">
                  <span className="text-[var(--foreground-muted)]">No image</span>
                </div>
              )}

              {badge && (
                <div className="absolute top-4 left-4">
                  <Badge variant="gradient">{badge}</Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {safeImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {safeImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-[var(--accent-cyan)] ring-2 ring-[var(--accent-cyan)] ring-opacity-30"
                        : "border-[var(--border)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h1 className="display-md mb-3">{productName}</h1>

              {/* Rating */}
              {reviewCount !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(rating)
                            ? "text-[var(--accent-amber)] fill-current"
                            : "text-[var(--foreground-subtle)]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[var(--foreground-muted)]">
                    {rating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-gradient">
                {typeof price === "number" ? `$${price}` : price}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-2xl text-[var(--foreground-muted)] line-through">
                    {typeof compareAtPrice === "number" ? `$${compareAtPrice}` : compareAtPrice}
                  </span>
                  <Badge variant="success">Save {discountPercent}%</Badge>
                </>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="body-lg text-[var(--foreground-muted)]">{description}</p>
            )}

            {/* Variants */}
            {safeVariants.length > 0 && (
              <div className="space-y-4">
                {safeVariants.map((variant) => (
                  <div key={variant.id}>
                    <label className="block text-sm font-medium mb-2">
                      {variant.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(variant.options || []).map((option) => (
                        <button
                          key={option}
                          onClick={() => handleVariantChange(variant.name, option)}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            selectedVariants[variant.name] === option
                              ? "border-[var(--accent-cyan)] bg-[var(--accent-cyan)] bg-opacity-10 text-[var(--accent-cyan)]"
                              : "border-[var(--border)] hover:border-[var(--border-hover)]"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  inStock ? "bg-[var(--accent-emerald)]" : "bg-[var(--accent-rose)]"
                }`}
              />
              <span className="text-sm font-medium">
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!inStock || !canAddToCart}
                leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
              >
                {ctaText}
              </Button>
              <Button
                variant="outline"
                size="lg"
                leftIcon={<HeartIcon className="w-5 h-5" />}
              >
                Save
              </Button>
            </div>

            {/* Trust Badges */}
            {safeTrustBadges.length > 0 && (
              <div className="pt-6 border-t border-[var(--border)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {safeTrustBadges.map((badge, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm text-[var(--foreground-muted)]"
                    >
                      <CheckIcon className="w-5 h-5 text-[var(--accent-emerald)] flex-shrink-0" />
                      <span>{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductHero;
