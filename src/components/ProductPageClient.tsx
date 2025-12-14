"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

interface ProductPageClientProps {
  productHandle: string;
  children?: React.ReactNode;
}

/**
 * Client-side wrapper for product pages
 * Automatically tracks products as recently viewed when the page mounts
 *
 * Usage:
 * ```tsx
 * // In your product detail page
 * export default async function ProductDetailPage({ params }: { params: { handle: string } }) {
 *   const product = await getProductByHandle(params.handle);
 *
 *   return (
 *     <ProductPageClient productHandle={params.handle}>
 *       <div>Your product page content here...</div>
 *     </ProductPageClient>
 *   );
 * }
 * ```
 */
export function ProductPageClient({ productHandle, children }: ProductPageClientProps) {
  const { addToRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (productHandle) {
      addToRecentlyViewed(productHandle);
    }
  }, [productHandle, addToRecentlyViewed]);

  return <>{children}</>;
}
