"use client";

import { type ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { QuickViewProvider } from "@/contexts/QuickViewContext";
import { ToastProvider } from "@/contexts/ToastContext";
import ProductQuickView from "@/components/ProductQuickView";
import { FloatingCart } from "@/components/FloatingCart";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <QuickViewProvider>
            <ToastProvider>
              {children}
              <ProductQuickView />
              <FloatingCart />
            </ToastProvider>
          </QuickViewProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default Providers;
