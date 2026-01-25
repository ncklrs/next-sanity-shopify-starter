"use client";

import { type ReactNode, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { QuickViewProvider } from "@/contexts/QuickViewContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { AICommerceProvider } from "@/contexts/AICommerceContext";
import ProductQuickView from "@/components/ProductQuickView";
import { FloatingCart } from "@/components/FloatingCart";
import { AIFloatingTrigger } from "@/components/ai";

// Lazy load the AI Commerce Sheet for better initial bundle size
const AICommerceSheet = dynamic(
  () => import("@/components/ai/AICommerceSheet").then((mod) => ({ default: mod.AICommerceSheet })),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <QuickViewProvider>
            <ToastProvider>
              <AICommerceProvider>
                {/* Main content wrapper - shifts left when AI sheet opens */}
                <div id="main-content" className="min-h-screen transition-transform duration-300 ease-out">
                  {children}
                </div>
                <ProductQuickView />
                <FloatingCart />
                <AICommerceSheet />
                <AIFloatingTrigger position="bottom-right" />
              </AICommerceProvider>
            </ToastProvider>
          </QuickViewProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default Providers;
