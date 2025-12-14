"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearch, type SearchResult } from "@/hooks/useSearch";
import { formatPrice } from "@/lib/shopify";

export default function SearchPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query);
    }
  };

  return (
    <main className="min-h-screen">
      <section className="section">
        <div className="container max-w-4xl">
          <div className="section-header">
            <h1 className="display-lg mb-4">
              Search <span className="text-gradient">Products</span>
            </h1>
            <p className="body-lg">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full px-6 py-4 text-lg bg-[var(--surface)] border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent-violet)] focus:border-transparent transition-all"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-[var(--accent-violet)] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </form>

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="heading-md">Recent Searches</h2>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-violet)] transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="px-4 py-2 bg-[var(--surface)] hover:bg-[var(--accent-violet)] hover:text-white rounded-full text-sm transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="body-lg text-red-500 mb-4">{error}</p>
              <button
                onClick={() => setQuery(query)}
                className="btn btn-secondary"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {query && !isLoading && !error && (
            <>
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="body-lg text-[var(--foreground-muted)] mb-4">
                    No products found for &quot;{query}&quot;
                  </p>
                  <Link href="/products" className="btn btn-primary">
                    Browse All Products
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-[var(--foreground-muted)] mb-6">
                    {results.length} result{results.length !== 1 ? "s" : ""} for &quot;{query}&quot;
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((result: SearchResult) => (
                      <Link
                        key={result.id}
                        href={`/products/${result.handle}`}
                        className="group"
                        onClick={() => addRecentSearch(query)}
                      >
                        <article className="glass-card h-full flex flex-col overflow-hidden">
                          {result.image && (
                            <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
                              <Image
                                src={result.image}
                                alt={result.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {!result.availableForSale && (
                                <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--surface)] text-xs font-medium rounded">
                                  Sold Out
                                </div>
                              )}
                            </div>
                          )}
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="heading-sm mb-2 group-hover:text-[var(--accent-violet)] transition-colors line-clamp-2">
                              {result.title}
                            </h3>
                            <div className="mt-auto font-semibold text-lg">
                              {formatPrice(result.price)}
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Empty State */}
          {!query && recentSearches.length === 0 && (
            <div className="text-center py-12">
              <p className="body-lg text-[var(--foreground-muted)] mb-4">
                Start typing to search for products
              </p>
              <Link href="/products" className="btn btn-secondary">
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
