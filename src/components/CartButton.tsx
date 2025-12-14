"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCartIcon } from "@/components/icons";

interface CartButtonProps {
  onOpen?: () => void;
}

export function CartButton({ onOpen }: CartButtonProps = {}) {
  const { totalQuantity } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate badge when item count changes
  useEffect(() => {
    if (totalQuantity > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalQuantity]);

  const handleClick = () => {
    if (onOpen) {
      onOpen();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="relative p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
      aria-label={`Shopping cart with ${totalQuantity} items`}
    >
      <ShoppingCartIcon className="w-6 h-6" />

      {totalQuantity > 0 && (
        <span
          className={`absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center text-xs font-semibold text-white bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-violet)] rounded-full transition-transform ${
            isAnimating ? "scale-110" : "scale-100"
          }`}
          style={{
            animation: isAnimating ? "bounce 300ms ease-out" : "none",
          }}
        >
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </button>
  );
}
