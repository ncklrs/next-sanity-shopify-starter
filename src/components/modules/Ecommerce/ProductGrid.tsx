"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { HeartIcon, ShoppingCartIcon, StarIcon } from "@/components/icons";

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
  category?: string;
  availableForSale?: boolean;
}

interface ProductGridProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  products: Product[];
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  productsPerPage?: number;
  spacing?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
}

// Product Card Component
function ProductCard({ product, onAddToCart, isPriority = false }: {
  product: Product;
  onAddToCart?: (productId: string) => void;
  isPriority?: boolean;
}) {
  const hasDiscount = product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)
    : 0;
  const isOutOfStock = product.availableForSale === false;
  const productUrl = `/products/${product.slug}`;

  return (
    <div className="group relative bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-2xl hover:-translate-y-1">
      {/* Product Image */}
      <Link href={productUrl} className="relative aspect-square overflow-hidden block">
        {product.image ? (
          <Image
            src={product.image.src}
            alt={product.image.alt}
            width={product.image.width || 600}
            height={product.image.height || 600}
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

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.(product._id);
            }}
            leftIcon={<ShoppingCartIcon className="w-4 h-4" />}
          >
            Add to Cart
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <HeartIcon className="w-5 h-5" />
          </Button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5">
        {product.category && (
          <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
            {product.category}
          </p>
        )}

        <Link href={productUrl}>
          <h3 className="heading-sm mb-2 hover:text-[var(--accent-cyan)] transition-colors">
            {product.name}
          </h3>
        </Link>

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
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gradient">
            {typeof product.price === "number" ? `$${product.price}` : product.price}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[var(--foreground-muted)] line-through">
              {typeof product.compareAtPrice === "number" ? `$${product.compareAtPrice}` : product.compareAtPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Skeleton
function ProductSkeleton() {
  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden animate-pulse">
      <div className="aspect-square bg-[var(--surface-elevated)]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-[var(--surface-elevated)] rounded w-1/3" />
        <div className="h-6 bg-[var(--surface-elevated)] rounded w-3/4" />
        <div className="h-4 bg-[var(--surface-elevated)] rounded w-1/2" />
      </div>
    </div>
  );
}

export function ProductGrid({
  badge,
  heading,
  subheading,
  products,
  columns = 3,
  showFilters = false,
  productsPerPage = 12,
  spacing = "xl",
  backgroundColor,
  onProductClick,
  onAddToCart,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const spacingMap = {
    sm: "py-12 px-4",
    md: "py-16 px-6",
    lg: "py-20 px-6",
    xl: "py-24 px-6",
  };

  const columnMap = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <section
      className={`section ${spacingMap[spacing]}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container mx-auto">
        {/* Section Header */}
        {(heading || subheading) && (
          <div className="section-header text-center max-w-3xl mx-auto mb-16">
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
        )}

        {/* Product Grid */}
        <div className={`grid ${columnMap[columns]} gap-8`}>
          {isLoading
            ? [...Array(productsPerPage)].map((_, i) => <ProductSkeleton key={i} />)
            : currentProducts.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={onAddToCart}
                  isPriority={index === 0}
                />
              ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductGrid;
