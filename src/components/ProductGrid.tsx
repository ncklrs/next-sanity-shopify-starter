"use client";

import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import ProductFilters, { useFilteredProducts } from "@/components/ProductFilters";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductGridProps {
  products: ShopifyProduct[];
  // Shop settings from Sanity
  showOutOfStockBadge?: boolean;
  showSaleBadge?: boolean;
  showQuickAdd?: boolean;
  showFilters?: boolean;
  filterOptions?: string[];
  showSorting?: boolean;
  sortOptions?: string[];
  defaultSort?: string;
}

function ProductGridContent({
  products,
  showOutOfStockBadge = true,
  showSaleBadge = true,
  showQuickAdd = false,
  showFilters = false,
  filterOptions = [],
  showSorting = true,
  sortOptions = ["bestSelling", "priceAsc", "priceDesc", "newest"],
  defaultSort = "bestSelling",
}: ProductGridProps) {
  const filteredProducts = useFilteredProducts(products);

  return (
    <>
      <ProductFilters
        products={products}
        showFilters={showFilters}
        filterOptions={filterOptions}
        showSorting={showSorting}
        sortOptions={sortOptions}
        defaultSort={defaultSort}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="body-lg text-[var(--foreground-muted)]">
            No products match your filters
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showOutOfStockBadge={showOutOfStockBadge}
              showSaleBadge={showSaleBadge}
              showQuickAdd={showQuickAdd}
            />
          ))}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-[var(--foreground-muted)]">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </>
  );
}

export default function ProductGrid(props: ProductGridProps) {
  return (
    <Suspense fallback={
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse">
            <div className="aspect-square bg-[var(--surface)]" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-[var(--surface)] rounded w-3/4" />
              <div className="h-4 bg-[var(--surface)] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    }>
      <ProductGridContent {...props} />
    </Suspense>
  );
}
