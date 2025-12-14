import Link from "next/link";
import Image from "next/image";
import { getAllProducts, formatPrice } from "@/lib/shopify";

export const metadata = {
  title: "Products | Shop",
  description: "Browse our collection of products",
};

const isPlaceholder = () =>
  !process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN === 'placeholder';

export default async function ProductsPage() {
  const products = isPlaceholder() ? [] : await getAllProducts().catch(() => []);

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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const minPrice = product.priceRange.minVariantPrice;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="group"
                  >
                    <article className="glass-card h-full flex flex-col overflow-hidden">
                      {product.featuredImage && (
                        <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col">
                        <h2 className="heading-sm mb-2 group-hover:text-[var(--accent-violet)] transition-colors line-clamp-2">
                          {product.title}
                        </h2>
                        <div className="mt-auto font-semibold text-lg">
                          {formatPrice(minPrice.amount, minPrice.currencyCode)}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
