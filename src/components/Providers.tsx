"use client";

import { type ReactNode } from "react";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { QuickViewProvider } from "@/contexts/QuickViewContext";
import ProductQuickView from "@/components/ProductQuickView";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <QuickViewProvider>
          {children}
          <ProductQuickView />
        </QuickViewProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default Providers;
