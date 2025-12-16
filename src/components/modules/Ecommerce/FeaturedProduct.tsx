"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CheckIcon, ShoppingCartIcon, StarIcon, ArrowRightIcon } from "@/components/icons";

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

interface Feature {
  icon?: string;
  text: string;
}

interface FeaturedProductProps {
  badge?: string;
  productName: string;
  productSlug?: string;
  description?: string;
  price: string | number;
  compareAtPrice?: string | number;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  features?: Feature[];
  rating?: number;
  reviewCount?: number;
  ctaText?: string;
  ctaLink?: string;
  imagePosition?: "left" | "right";
  inStock?: boolean;
  spacing?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  onCTAClick?: () => void;
}

export function FeaturedProduct({
  badge,
  productName,
  productSlug,
  description,
  price,
  compareAtPrice,
  image,
  features = [],
  rating,
  reviewCount,
  ctaText = "Shop Now",
  ctaLink,
  imagePosition = "right",
  inStock = true,
  spacing = "xl",
  backgroundColor,
  onCTAClick,
}: FeaturedProductProps) {
  // Determine the link - prefer ctaLink, fallback to product page
  const productUrl = ctaLink || (productSlug ? `/products/${productSlug}` : undefined);
  const spacingMap = {
    sm: "py-12 px-4",
    md: "py-16 px-6",
    lg: "py-20 px-6",
    xl: "py-24 px-6",
  };

  const hasDiscount = compareAtPrice && Number(compareAtPrice) > Number(price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(compareAtPrice) - Number(price)) / Number(compareAtPrice)) * 100)
    : 0;

  const imageOnLeft = imagePosition === "left";

  return (
    <section
      className={`section ${spacingMap[spacing]}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
          <div className={`grid lg:grid-cols-2 gap-0 items-center ${imageOnLeft ? "lg:flex-row-reverse" : ""}`}>
            {/* Product Details */}
            <div className={`p-12 lg:p-16 ${imageOnLeft ? "lg:order-2" : ""}`}>
              {badge && (
                <Badge variant="gradient" className="mb-6">
                  {badge}
                </Badge>
              )}

              <h2 className="display-md mb-4">{productName}</h2>

              {/* Rating */}
              {rating !== undefined && reviewCount !== undefined && (
                <div className="flex items-center gap-2 mb-6">
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

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
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

              {description && (
                <p className="body-lg text-[var(--foreground-muted)] mb-8">
                  {description}
                </p>
              )}

              {/* Features */}
              {features.length > 0 && (
                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center mt-0.5">
                        <CheckIcon className="w-4 h-4 text-[var(--accent-emerald)]" />
                      </div>
                      <span className="text-base text-[var(--foreground)]">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-8">
                <div
                  className={`w-3 h-3 rounded-full ${
                    inStock ? "bg-[var(--accent-emerald)]" : "bg-[var(--accent-rose)]"
                  }`}
                />
                <span className="text-sm font-medium">
                  {inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* CTA Button */}
              {productUrl ? (
                <Link href={productUrl}>
                  <Button
                    variant="primary"
                    size="lg"
                    disabled={!inStock}
                    leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
                    rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                  >
                    {ctaText}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onCTAClick}
                  disabled={!inStock}
                  leftIcon={<ShoppingCartIcon className="w-5 h-5" />}
                  rightIcon={<ArrowRightIcon className="w-4 h-4" />}
                >
                  {ctaText}
                </Button>
              )}
            </div>

            {/* Product Image */}
            {image && (
              <div className={`relative aspect-square lg:aspect-auto lg:h-full ${imageOnLeft ? "lg:order-1" : ""}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 800}
                  height={image.height || 800}
                  className="w-full h-full object-cover"
                  priority
                />

                {/* Gradient Overlay on Mobile */}
                <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />

                {/* Decorative gradient orb */}
                <div
                  className="absolute -z-10 w-[80%] h-[80%] top-[10%] left-[10%] rounded-full blur-[120px] opacity-20"
                  style={{ background: "var(--gradient-primary)" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProduct;
