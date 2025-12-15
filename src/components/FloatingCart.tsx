"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/CartDrawer";
import { ShoppingCartIcon } from "@/components/icons";

export function FloatingCart() {
  const { totalQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Show/hide based on cart quantity
  useEffect(() => {
    if (totalQuantity > 0) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]);

  // Animate badge when quantity changes
  useEffect(() => {
    if (totalQuantity > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]);

  if (!isVisible) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14
          bg-[var(--foreground)] text-[var(--background-paper)]
          shadow-[0_4px_20px_rgba(0,0,0,0.15)]
          hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]
          flex items-center justify-center
          transition-all duration-500 ease-out
          hover:scale-[1.02] active:scale-[0.98]
          ${totalQuantity > 0 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
        aria-label={`Shopping cart with ${totalQuantity} items`}
      >
        <ShoppingCartIcon className="w-5 h-5" />

        {/* Badge - Gold accent for luxury feel */}
        <span
          className={`
            absolute -top-2 -right-2
            min-w-[1.5rem] h-6 px-2
            flex items-center justify-center
            text-xs font-semibold tracking-wide
            text-[var(--background-paper)] bg-[var(--gold)]
            transition-transform duration-300
            ${isAnimating ? "scale-110" : "scale-100"}
          `}
        >
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
