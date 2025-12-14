"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "aurora-recently-viewed";
const MAX_ITEMS = 10;

export interface UseRecentlyViewedReturn {
  recentlyViewed: string[];
  addToRecentlyViewed: (handle: string) => void;
  getRecentlyViewed: () => string[];
  clearRecentlyViewed: () => void;
  isHydrated: boolean;
}

/**
 * Hook for tracking recently viewed products
 * Stores product handles in localStorage (max 10 items)
 */
export function useRecentlyViewed(): UseRecentlyViewedReturn {
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed.slice(0, MAX_ITEMS));
        }
      }
    } catch (error) {
      console.error("Failed to load recently viewed from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist recently viewed to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
      } catch (error) {
        console.error("Failed to save recently viewed to localStorage:", error);
      }
    }
  }, [recentlyViewed, isHydrated]);

  /**
   * Add a product handle to recently viewed
   * Moves it to the front if already exists
   * Maintains max 10 items
   */
  const addToRecentlyViewed = useCallback((handle: string) => {
    if (!handle) return;

    setRecentlyViewed((prev) => {
      // Remove the handle if it already exists
      const filtered = prev.filter((h) => h !== handle);

      // Add to the front and limit to MAX_ITEMS
      const updated = [handle, ...filtered].slice(0, MAX_ITEMS);

      return updated;
    });
  }, []);

  /**
   * Get the current list of recently viewed product handles
   */
  const getRecentlyViewed = useCallback(() => {
    return recentlyViewed;
  }, [recentlyViewed]);

  /**
   * Clear all recently viewed products
   */
  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
  }, []);

  return {
    recentlyViewed,
    addToRecentlyViewed,
    getRecentlyViewed,
    clearRecentlyViewed,
    isHydrated,
  };
}
