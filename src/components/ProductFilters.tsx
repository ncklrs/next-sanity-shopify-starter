"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface ProductFiltersProps {
  products: Array<{
    availableForSale: boolean;
    productType: string;
    vendor: string;
    tags: string[];
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
  }>;
  // Shop settings from Sanity
  showFilters?: boolean;
  filterOptions?: string[];
  showSorting?: boolean;
  sortOptions?: string[];
  defaultSort?: string;
}

const SORT_OPTIONS: Record<string, { label: string; key: string; reverse: boolean }> = {
  bestSelling: { label: "Best Selling", key: "BEST_SELLING", reverse: false },
  priceAsc: { label: "Price: Low to High", key: "PRICE", reverse: false },
  priceDesc: { label: "Price: High to Low", key: "PRICE", reverse: true },
  newest: { label: "Newest", key: "CREATED_AT", reverse: true },
  titleAsc: { label: "A-Z", key: "TITLE", reverse: false },
  titleDesc: { label: "Z-A", key: "TITLE", reverse: true },
};

export default function ProductFilters({
  products,
  showFilters = false,
  filterOptions = [],
  showSorting = true,
  sortOptions = ["bestSelling", "priceAsc", "priceDesc", "newest"],
  defaultSort = "bestSelling",
}: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Get current filter values from URL
  const currentSort = searchParams.get("sort") || defaultSort;
  const currentAvailability = searchParams.get("availability");
  const currentPriceMin = searchParams.get("priceMin");
  const currentPriceMax = searchParams.get("priceMax");
  const currentProductType = searchParams.get("type");
  const currentVendor = searchParams.get("vendor");

  // Extract unique values for filter options
  const uniqueProductTypes = useMemo(
    () => [...new Set(products.map((p) => p.productType).filter(Boolean))].sort(),
    [products]
  );
  const uniqueVendors = useMemo(
    () => [...new Set(products.map((p) => p.vendor).filter(Boolean))].sort(),
    [products]
  );
  const priceRange = useMemo(() => {
    const prices = products.map((p) => parseFloat(p.priceRange.minVariantPrice.amount));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Update URL params
  const updateFilters = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Build active filter labels for display
  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (currentAvailability === "inStock") labels.push("In Stock");
    if (currentPriceMin || currentPriceMax) {
      const priceLabel = currentPriceMin && currentPriceMax
        ? `$${currentPriceMin}–$${currentPriceMax}`
        : currentPriceMin
        ? `$${currentPriceMin}+`
        : `Up to $${currentPriceMax}`;
      labels.push(priceLabel);
    }
    if (currentProductType) labels.push(currentProductType);
    if (currentVendor) labels.push(currentVendor);
    return labels;
  }, [currentAvailability, currentPriceMin, currentPriceMax, currentProductType, currentVendor]);

  const activeFilterCount = activeFilterLabels.length;

  if (!showFilters && !showSorting) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Filter Toggle Button */}
        {showFilters && filterOptions.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg hover:border-[var(--foreground-muted)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{isOpen ? "Hide Filters" : "Filters"}</span>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-[var(--accent-violet)] text-white rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* Active filter labels */}
            {activeFilterLabels.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {activeFilterLabels.map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1 text-sm bg-[var(--accent-violet)]/10 text-[var(--accent-violet)] rounded-full border border-[var(--accent-violet)]/20"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sort Dropdown */}
        {showSorting && sortOptions.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="sort" className="text-sm text-[var(--foreground-muted)]">
              Sort by:
            </label>
            <select
              id="sort"
              value={currentSort}
              onChange={(e) => updateFilters("sort", e.target.value)}
              className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:outline-none focus:border-[var(--accent-violet)]"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {SORT_OPTIONS[option]?.label || option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && filterOptions.length > 0 && isOpen && (
        <div className="mt-4">
          <div className="p-4 border border-[var(--border)] rounded-lg bg-[var(--surface)]">
            <div className="flex flex-wrap gap-6">
              {/* Availability Filter */}
              {filterOptions.includes("availability") && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Availability</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateFilters("availability", currentAvailability === "inStock" ? null : "inStock")}
                      className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                        currentAvailability === "inStock"
                          ? "border-[var(--accent-violet)] bg-[var(--accent-violet)]/10 text-[var(--accent-violet)]"
                          : "border-[var(--border)] hover:border-[var(--foreground-muted)]"
                      }`}
                    >
                      In Stock
                    </button>
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              {filterOptions.includes("price") && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Price</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder={`$${priceRange.min}`}
                      value={currentPriceMin || ""}
                      onChange={(e) => updateFilters("priceMin", e.target.value)}
                      className="w-20 px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:border-[var(--accent-violet)]"
                    />
                    <span className="text-[var(--foreground-muted)]">to</span>
                    <input
                      type="number"
                      placeholder={`$${priceRange.max}`}
                      value={currentPriceMax || ""}
                      onChange={(e) => updateFilters("priceMax", e.target.value)}
                      className="w-20 px-2 py-1.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:border-[var(--accent-violet)]"
                    />
                  </div>
                </div>
              )}

              {/* Product Type Filter */}
              {filterOptions.includes("productType") && uniqueProductTypes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueProductTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => updateFilters("type", currentProductType === type ? null : type)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          currentProductType === type
                            ? "border-[var(--accent-violet)] bg-[var(--accent-violet)]/10 text-[var(--accent-violet)]"
                            : "border-[var(--border)] hover:border-[var(--foreground-muted)]"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Vendor Filter */}
              {filterOptions.includes("vendor") && uniqueVendors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Brand</h3>
                  <div className="flex flex-wrap gap-2">
                    {uniqueVendors.map((vendor) => (
                      <button
                        key={vendor}
                        onClick={() => updateFilters("vendor", currentVendor === vendor ? null : vendor)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          currentVendor === vendor
                            ? "border-[var(--accent-violet)] bg-[var(--accent-violet)]/10 text-[var(--accent-violet)]"
                            : "border-[var(--border)] hover:border-[var(--foreground-muted)]"
                        }`}
                      >
                        {vendor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 text-sm text-[var(--accent-red)] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to filter products based on URL search params
 * Use this in the page component to apply filters to the product list
 */
export function useFilteredProducts<T extends {
  availableForSale: boolean;
  productType: string;
  vendor: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string } };
}>(products: T[]): T[] {
  const searchParams = useSearchParams();

  const availability = searchParams.get("availability");
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");
  const productType = searchParams.get("type");
  const vendor = searchParams.get("vendor");
  const sort = searchParams.get("sort") || "bestSelling";

  return useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (availability === "inStock") {
      filtered = filtered.filter((p) => p.availableForSale);
    }

    if (priceMin) {
      const min = parseFloat(priceMin);
      filtered = filtered.filter((p) => parseFloat(p.priceRange.minVariantPrice.amount) >= min);
    }

    if (priceMax) {
      const max = parseFloat(priceMax);
      filtered = filtered.filter((p) => parseFloat(p.priceRange.minVariantPrice.amount) <= max);
    }

    if (productType) {
      filtered = filtered.filter((p) => p.productType === productType);
    }

    if (vendor) {
      filtered = filtered.filter((p) => p.vendor === vendor);
    }

    // Apply sorting (client-side, basic implementation)
    const sortConfig = SORT_OPTIONS[sort];
    if (sortConfig) {
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (sortConfig.key) {
          case "PRICE":
            comparison = parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount);
            break;
          case "TITLE":
            comparison = (a as any).title?.localeCompare((b as any).title) || 0;
            break;
          default:
            // For BEST_SELLING and CREATED_AT, maintain original order (would need API support for proper sorting)
            comparison = 0;
        }
        return sortConfig.reverse ? -comparison : comparison;
      });
    }

    return filtered;
  }, [products, availability, priceMin, priceMax, productType, vendor, sort]);
}
