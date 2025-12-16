import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getProductByHandle,
  getAllProductHandles,
  getRelatedProducts,
  formatPrice,
} from "@/lib/shopify";
import { getShopSettings, getSanityProductByHandle } from "@/lib/sanity";
import ProductVariantSelector from "@/components/ProductVariantSelector";
import { WishlistButton } from "@/components/WishlistButton";
import { ModuleRenderer } from "@/components/ModuleRenderer";

// Route segment config - ISR revalidation
export const revalidate = 3600; // Revalidate every hour
export const dynamicParams = true; // Allow params not in generateStaticParams

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN === 'placeholder') {
    return [];
  }
  try {
    const handles = await getAllProductHandles();
    return handles.map((handle) => ({ handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  try {
    const product = await getProductByHandle(handle);
    if (!product) return {};
    return {
      title: `${product.title} | Shop`,
      description: product.description,
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  try {
    // Fetch Shopify product, shop settings, and Sanity product data (with modules) in parallel
    const [product, shopSettings, sanityProduct] = await Promise.all([
      getProductByHandle(handle),
      getShopSettings(),
      getSanityProductByHandle(handle),
    ]);
    if (!product) notFound();

    // Check if product has modules configured in Sanity
    const hasModules = sanityProduct?.modules && sanityProduct.modules.length > 0;

    // If modules exist, render them instead of the default layout
    if (hasModules) {
      return (
        <main className="min-h-screen">
          <ModuleRenderer modules={sanityProduct.modules || []} />
        </main>
      );
    }

    // Default product layout (when no modules are configured)
    const relatedProducts = await getRelatedProducts(
      product.id,
      product.productType,
      product.tags,
      4
    ).catch(() => []);

    const variants = product.variants.edges.map((e) => e.node);

    return (
      <main className="min-h-screen">
        <section className="section">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                {product.featuredImage && (
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface)]">
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <nav className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                  <Link href="/products" className="hover:text-[var(--accent-violet)]">Products</Link>
                  <span>/</span>
                  <span>{product.title}</span>
                </nav>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="display-md">{product.title}</h1>
                  <WishlistButton
                    productHandle={handle}
                    className="mt-1 bg-[var(--surface)] hover:bg-[var(--background-muted)]"
                  />
                </div>
                {variants.length > 0 && (
                  <ProductVariantSelector
                    variants={variants}
                    options={product.options}
                    availableForSale={product.availableForSale}
                    showBuyNowButton={shopSettings?.showBuyNowButton ?? false}
                    buyNowButtonText={shopSettings?.buyNowButtonText ?? "Buy Now"}
                  />
                )}
                <div className="pt-6 border-t border-[var(--border)]">
                  <h2 className="heading-md mb-4">Description</h2>
                  <p className="text-[var(--foreground-muted)]">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="section bg-[var(--surface)]">
            <div className="container">
              <h2 className="heading-lg mb-8">Related Products</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.handle}`} className="group">
                    <article className="glass-card h-full flex flex-col overflow-hidden">
                      {p.featuredImage && (
                        <div className="relative aspect-square overflow-hidden bg-[var(--surface)]">
                          <Image
                            src={p.featuredImage.url}
                            alt={p.featuredImage.altText || p.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {!p.availableForSale && (
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wide bg-[var(--foreground-muted)] text-white rounded">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="heading-sm mb-2">{p.title}</h3>
                        <div className="font-semibold">
                          {formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}
