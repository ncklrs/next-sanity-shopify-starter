"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { searchProducts } from "@/lib/shopify/search";
import type { Product } from "@/lib/shopify/types";

export interface SearchResult {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string | null;
  availableForSale: boolean;
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

const DEBOUNCE_DELAY = 300;
const RECENT_SEARCHES_KEY = "shopify-recent-searches";
const MAX_RECENT_SEARCHES = 5;

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const cacheRef = useRef<Map<string, SearchResult[]>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to load recent searches:", err);
    }
  }, []);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [query]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Check cache first
    const cached = cacheRef.current.get(debouncedQuery);
    if (cached) {
      setResults(cached);
      setIsLoading(false);
      return;
    }

    // Abort previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const performSearch = async () => {
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const products = await searchProducts(debouncedQuery);

        // Transform products to search results
        const searchResults: SearchResult[] = products.map((product: Product) => ({
          id: product.id,
          handle: product.handle,
          title: product.title,
          price: product.priceRange.minVariantPrice.amount,
          image: product.featuredImage?.url || product.images.edges[0]?.node.url || null,
          availableForSale: product.availableForSale,
        }));

        // Cache the results
        cacheRef.current.set(debouncedQuery, searchResults);

        if (!controller.signal.aborted) {
          setResults(searchResults);
          setIsLoading(false);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Search failed");
          setResults([]);
          setIsLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  const addRecentSearch = useCallback((searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    setRecentSearches((prev) => {
      // Remove if already exists, then add to front
      const filtered = prev.filter((s) => s !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save recent searches:", err);
      }

      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {
      console.error("Failed to clear recent searches:", err);
    }
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
}
