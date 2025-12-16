"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { MinusIcon, PlusIcon, TrashIcon, PackageIcon } from "@/components/icons";

export default function CartPageContent() {
  const { cart, totalQuantity, checkoutUrl, updateQuantity, removeItem, isLoading } = useCart();

  const cartLines = cart?.lines?.edges || [];
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");
  const currency = cart?.cost?.subtotalAmount?.currencyCode || "USD";

  // Loading state
  if (isLoading && !cart) {
    return (
      <main className="min-h-screen">
        <section className="section">
          <div className="container max-w-6xl">
            <div className="section-header mb-8">
              <h1 className="display-lg mb-4">
                Shopping <span className="text-gradient">Cart</span>
              </h1>
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--foreground)]" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Empty cart
  if (cartLines.length === 0) {
    return (
      <main className="min-h-screen">
        <section className="section">
          <div className="container max-w-6xl">
            <div className="section-header mb-8">
              <h1 className="display-lg mb-4">
                Shopping <span className="text-gradient">Cart</span>
              </h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="glass-card p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 mb-4 mx-auto rounded-full bg-[var(--surface)] flex items-center justify-center">
                      <PackageIcon className="w-10 h-10 text-[var(--foreground-muted)]" />
                    </div>
                    <h2 className="heading-lg mb-4">Your cart is empty</h2>
                    <p className="body-md text-[var(--foreground-muted)] mb-6">
                      Add some products to your cart to see them here
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/products" className="btn btn-primary">
                        Browse Products
                      </Link>
                      <Link href="/collections" className="btn btn-secondary">
                        View Collections
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="glass-card p-6 sticky top-8">
                  <h2 className="heading-md mb-6">Order Summary</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--foreground-muted)]">Subtotal</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--foreground-muted)]">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <div className="border-t border-[var(--border)] pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <span className="text-2xl font-bold">$0.00</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary w-full mb-3" disabled>
                    Proceed to Checkout
                  </button>
                  <Link href="/products" className="btn btn-secondary w-full">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Cart with items
  return (
    <main className="min-h-screen">
      <section className="section">
        <div className="container max-w-6xl">
          <div className="section-header mb-8">
            <h1 className="display-lg mb-4">
              Shopping <span className="text-gradient">Cart</span>
            </h1>
            <p className="text-[var(--foreground-muted)]">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartLines.map(({ node: line }) => {
                const merchandise = line.merchandise;
                const product = merchandise.product;
                const image = merchandise.image || product?.featuredImage;
                const price = parseFloat(merchandise.price.amount);
                const lineTotal = parseFloat(line.cost.totalAmount.amount);

                return (
                  <div
                    key={line.id}
                    className="glass-card p-4 sm:p-6 flex gap-4 sm:gap-6"
                  >
                    {/* Product Image */}
                    {image && (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[var(--surface)] flex-shrink-0">
                        <Image
                          src={image.url}
                          alt={image.altText || product?.title || merchandise.title}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex-1">
                        <h3 className="heading-sm mb-1 truncate">
                          {product?.title || merchandise.title}
                        </h3>
                        {merchandise.title !== "Default Title" && (
                          <p className="text-sm text-[var(--foreground-muted)] mb-2">
                            {merchandise.title}
                          </p>
                        )}
                        <p className="text-lg font-semibold">
                          {currency} ${price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(line.id, Math.max(0, line.quantity - 1))}
                            className="p-2 hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                            disabled={isLoading}
                          >
                            <MinusIcon className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            className="p-2 hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                            aria-label="Increase quantity"
                            disabled={isLoading}
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold">
                            ${lineTotal.toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(line.id)}
                            className="p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
                            aria-label="Remove item"
                            disabled={isLoading}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-8">
                <h2 className="heading-md mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--foreground-muted)]">
                      Subtotal ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--foreground-muted)]">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t border-[var(--border)] pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <a
                  href={checkoutUrl || "#"}
                  className={`btn btn-primary w-full mb-3 justify-center ${!checkoutUrl ? "opacity-50 pointer-events-none" : ""}`}
                >
                  Proceed to Checkout
                </a>
                <Link href="/products" className="btn btn-secondary w-full justify-center">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
