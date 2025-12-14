"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (productHandle: string) => void;
  removeFromWishlist: (productHandle: string) => void;
  isInWishlist: (productHandle: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "aurora-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch (error) {
        console.error("Failed to save wishlist to localStorage:", error);
      }
    }
  }, [wishlist, isHydrated]);

  const addToWishlist = (productHandle: string) => {
    setWishlist((prev) => {
      if (prev.includes(productHandle)) {
        return prev;
      }
      return [...prev, productHandle];
    });
  };

  const removeFromWishlist = (productHandle: string) => {
    setWishlist((prev) => prev.filter((handle) => handle !== productHandle));
  };

  const isInWishlist = (productHandle: string) => {
    return wishlist.includes(productHandle);
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
