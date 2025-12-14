"use client";

import { useWishlist } from "@/contexts/WishlistContext";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface WishlistButtonProps {
  productHandle: string;
  className?: string;
}

export function WishlistButton({ productHandle, className = "" }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch by waiting for client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inWishlist = isMounted ? isInWishlist(productHandle) : false;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);

    // Simulate brief animation delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (inWishlist) {
      removeFromWishlist(productHandle);
    } else {
      addToWishlist(productHandle);
    }

    setIsAdding(false);
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <button
        className={`group relative p-2 rounded-full transition-all duration-200 hover:bg-[var(--background-muted)] ${className}`}
        disabled
        aria-label="Add to wishlist"
      >
        <Heart className="w-5 h-5 text-[var(--foreground-muted)]" />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isAdding}
      className={`group relative p-2 rounded-full transition-all duration-200 hover:bg-[var(--background-muted)] ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-5 h-5 transition-all duration-200 ${
          isAdding ? "scale-125" : "scale-100"
        } ${
          inWishlist
            ? "fill-red-500 text-red-500"
            : "text-[var(--foreground-muted)] group-hover:text-red-500"
        }`}
      />
      {inWishlist && (
        <span className="absolute inset-0 rounded-full bg-red-500/10 animate-ping opacity-75" />
      )}
    </button>
  );
}
