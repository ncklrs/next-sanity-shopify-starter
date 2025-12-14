"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchIcon, XIcon, ClockIcon } from "@/components/icons";
import { useSearch } from "@/hooks/useSearch";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const router = useRouter();
  const {
    query,
    setQuery,
    results,
    isLoading,
    error,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useSearch();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const itemCount = results.length;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < itemCount - 1 ? prev + 1 : prev));
          break;

        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;

        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            handleProductSelect(results[selectedIndex].handle);
          } else if (query.trim()) {
            handleSearch(query);
          }
          break;

        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const selectedElement = resultsContainerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleProductSelect = useCallback(
    (handle: string) => {
      addRecentSearch(query);
      onClose();
      router.push(`/products/${handle}`);
    },
    [query, addRecentSearch, onClose, router]
  );

  const handleSearch = useCallback(
    (searchQuery: string) => {
      addRecentSearch(searchQuery);
      onClose();
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    },
    [addRecentSearch, onClose, router]
  );

  const handleRecentSearchClick = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);
    },
    [setQuery]
  );

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(price));
  };

  if (!isOpen) return null;

  const showRecentSearches = !query && recentSearches.length > 0;
  const showResults = query && results.length > 0;
  const showNoResults = query && !isLoading && results.length === 0 && !error;
  const showError = query && error;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[10vh] px-4">
      <div
        ref={dialogRef}
        className="w-full max-w-2xl bg-[var(--background)] rounded-2xl shadow-2xl border border-[var(--border)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-dialog-title"
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <SearchIcon className="w-5 h-5 text-[var(--foreground-muted)] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-[var(--foreground)] placeholder-[var(--foreground-muted)] outline-none text-base"
            aria-label="Search products"
            id="search-dialog-title"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md hover:bg-[var(--surface)] transition-colors"
              aria-label="Clear search"
            >
              <XIcon className="w-5 h-5 text-[var(--foreground-muted)]" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-[var(--surface)] transition-colors"
            aria-label="Close search"
          >
            <span className="text-xs text-[var(--foreground-muted)] font-mono">ESC</span>
          </button>
        </div>

        {/* Results Container */}
        <div
          ref={resultsContainerRef}
          className="max-h-[60vh] overflow-y-auto overscroll-contain"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[var(--foreground-muted)]">Searching...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {showError && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-[var(--accent-rose)]">{error}</p>
            </div>
          )}

          {/* No Results */}
          {showNoResults && (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-[var(--foreground-muted)]">
                No products found for "{query}"
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {showRecentSearches && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[var(--surface)] transition-colors text-left"
                  >
                    <ClockIcon className="w-4 h-4 text-[var(--foreground-muted)] flex-shrink-0" />
                    <span className="text-sm text-[var(--foreground)]">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {showResults && (
            <div className="p-2">
              {results.map((product, index) => (
                <button
                  key={product.id}
                  data-index={index}
                  onClick={() => handleProductSelect(product.handle)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center gap-4 w-full p-3 rounded-lg transition-colors text-left ${
                    index === selectedIndex
                      ? "bg-[var(--surface)]"
                      : "hover:bg-[var(--surface)]/50"
                  }`}
                >
                  {/* Product Image */}
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--surface)]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <SearchIcon className="w-6 h-6 text-[var(--foreground-muted)]" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[var(--foreground)] line-clamp-2">
                      {product.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-semibold text-[var(--primary)]">
                        {formatPrice(product.price)}
                      </p>
                      {!product.availableForSale && (
                        <span className="text-xs text-[var(--foreground-muted)]">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Enter Icon */}
                  {index === selectedIndex && (
                    <div className="flex-shrink-0 text-xs text-[var(--foreground-muted)] font-mono border border-[var(--border)] rounded px-2 py-1">
                      ↵
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        {!isLoading && (
          <div className="border-t border-[var(--border)] px-4 py-3 bg-[var(--surface)]/30">
            <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] font-mono">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] font-mono">
                    ↵
                  </kbd>
                  <span>Select</span>
                </span>
              </div>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] font-mono">
                  ESC
                </kbd>
                <span>Close</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
