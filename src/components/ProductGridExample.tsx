"use client";

/**
 * Example: Product Grid with Quick View Integration
 *
 * This component demonstrates how to use the ProductCard with Quick View functionality.
 * It shows a grid of products from Shopify with both Quick View and Quick Add features.
 *
 * Usage:
 * 1. Import this component in your page
 * 2. Ensure your page is wrapped with Providers (already done in root layout)
 * 3. Pass an array of Shopify products
 *
 * Example:
 * ```tsx
 * import { ProductGridExample } from "@/components/ProductGridExample";
 * import { getAllProducts } from "@/lib/shopify";
 *
 * export default async function ShopPage() {
 *   const products = await getAllProducts();
 *   return <ProductGridExample products={products} />;
 * }
 * ```
 */

import { useRouter } from "next/navigation";
import ProductCard from "@/components/ui/product-card";
import { useQuickView } from "@/contexts/QuickViewContext";
import { useCart } from "@/contexts/CartContext";
import type { ShopifyProduct } from "@/lib/shopify";

interface ProductGridExampleProps {
  products: ShopifyProduct[];
}

export function ProductGridExample({ products }: ProductGridExampleProps) {
  const router = useRouter();
  const { openQuickView } = useQuickView();
  const { addItem } = useCart();

  const handleQuickAdd = (product: ShopifyProduct) => {
    // Get the first available variant
    const firstAvailableVariant = product.variants.edges.find(
      (edge) => edge.node.availableForSale
    )?.node;

    if (!firstAvailableVariant) {
      alert("This product is currently out of stock");
      return;
    }

    // Add to cart - addItem expects (merchandiseId, quantity)
    addItem(firstAvailableVariant.id, 1);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Shop Our Products</h1>
        <p className="text-lg text-[var(--foreground-muted)]">
          Click Quick View to see details or Quick Add to add to cart
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const price = parseFloat(product.priceRange.minVariantPrice.amount);
          const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
            ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
            : undefined;

          // Check if product is on sale
          const salePrice = compareAtPrice && compareAtPrice > price ? price : undefined;

          // Get product variants for color swatches
          const variants = product.variants.edges.map((edge) => ({
            id: edge.node.id,
            name: edge.node.title,
            color: edge.node.selectedOptions.find(
              (opt) => opt.name.toLowerCase() === "color"
            )?.value,
            inStock: edge.node.availableForSale,
          }));

          // Determine badge
          let badge = undefined;
          if (product.tags.includes("new")) {
            badge = <span className="badge badge-primary">New</span>;
          } else if (salePrice) {
            const discount = Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100);
            badge = <span className="badge badge-success">-{discount}%</span>;
          }

          return (
            <ProductCard
              key={product.id}
              image={product.featuredImage?.url || "/placeholder-product.jpg"}
              hoverImage={
                product.images.edges[1]?.node.url || product.featuredImage?.url
              }
              title={product.title}
              price={compareAtPrice || price}
              salePrice={salePrice}
              variants={variants}
              badge={badge}
              productHandle={product.handle}
              onQuickView={() => openQuickView(product.handle)}
              onQuickAdd={() => handleQuickAdd(product)}
              onCardClick={() => router.push(`/products/${product.handle}`)}
            />
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-[var(--foreground-muted)]">
            No products found
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductGridExample;
