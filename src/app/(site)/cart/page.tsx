import Link from "next/link";

export const metadata = {
  title: "Shopping Cart | Shop",
  description: "Review your cart and checkout",
};

export default function CartPage() {
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
