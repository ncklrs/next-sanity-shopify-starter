import { getAllVisibleProducts } from "@/lib/shopify";
import { getShopSettings } from "@/lib/sanity";
import ProductGrid from "@/components/ProductGrid";

export const metadata = {
  title: "Products | Shop",
  description: "Browse our collection of products",
};

const isPlaceholder = () =>
  !process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN === 'placeholder';

export default async function ProductsPage() {
  const [products, shopSettings] = await Promise.all([
    isPlaceholder() ? Promise.resolve([]) : getAllVisibleProducts().catch(() => []),
    getShopSettings(),
  ]);

  return (
    <main className="min-h-screen">
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h1 className="display-lg mb-4">
              Our <span className="text-gradient">Products</span>
            </h1>
            <p className="body-lg">
              Discover our curated collection of premium products
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="body-lg text-[var(--foreground-muted)]">
                {isPlaceholder()
                  ? "Configure your Shopify credentials to display products"
                  : "No products found"}
              </p>
            </div>
          ) : (
            <ProductGrid
              products={products}
              showOutOfStockBadge={shopSettings?.showOutOfStockBadge ?? true}
              showSaleBadge={shopSettings?.showSaleBadge ?? true}
              showQuickAdd={shopSettings?.showQuickAdd ?? false}
              showFilters={shopSettings?.showFilters ?? false}
              filterOptions={shopSettings?.filterOptions ?? []}
              showSorting={shopSettings?.showSorting ?? true}
              sortOptions={shopSettings?.sortOptions ?? ["bestSelling", "priceAsc", "priceDesc", "newest"]}
              defaultSort={shopSettings?.defaultSort ?? "bestSelling"}
            />
          )}
        </div>
      </section>
    </main>
  );
}
