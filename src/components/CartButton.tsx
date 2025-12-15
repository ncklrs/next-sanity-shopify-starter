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
      className="relative p-2 text-[var(--foreground)] hover:text-[var(--gold)] transition-colors duration-300"
      aria-label={`Shopping cart with ${totalQuantity} items`}
    >
      <ShoppingCartIcon className="w-5 h-5" />

      {totalQuantity > 0 && (
        <span
          className={`absolute -top-1 -right-1 min-w-5 h-5 px-1.5 flex items-center justify-center text-[10px] font-semibold tracking-wide text-[var(--background-paper)] bg-[var(--gold)] transition-transform duration-300 ${
            isAnimating ? "scale-110" : "scale-100"
          }`}
        >
          {totalQuantity > 99 ? "99+" : totalQuantity}
        </span>
      )}
    </button>
  );
}
