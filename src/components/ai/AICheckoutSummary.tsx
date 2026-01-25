"use client";

/**
 * AI Checkout Summary
 * Premium checkout summary with refined styling
 * Features elegant transitions, visual hierarchy, and secure checkout indicators
 */

import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/shopify";

interface AICheckoutSummaryProps {
  expressCheckout?: boolean;
}

export function AICheckoutSummary({ expressCheckout = false }: AICheckoutSummaryProps) {
  const { cart, checkoutUrl, totalQuantity } = useCart();

  if (!cart || totalQuantity === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 p-5 text-center">
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[var(--color-text-tertiary)]"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          Your cart is empty
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Add some items to get started!
        </p>
      </div>
    );
  }

  const items = cart.lines.edges.map((edge) => edge.node);
  const subtotal = cart.cost.subtotalAmount;
  const total = cart.cost.totalAmount;

  return (
    <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-b from-[var(--color-bg-secondary)] to-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-lg font-medium text-[var(--color-text-primary)]">
              Order Summary
            </h4>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              {totalQuantity} {totalQuantity === 1 ? "item" : "items"} ready for checkout
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[var(--color-accent)]"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-[var(--color-border-primary)]">
        {items.slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 transition-colors hover:bg-[var(--color-bg-secondary)]/50"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Item Image */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] shadow-sm">
              {item.merchandise.product?.featuredImage ? (
                <Image
                  src={item.merchandise.product.featuredImage.url}
                  alt={item.merchandise.product.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-text-tertiary)]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">
                {item.merchandise.product?.title}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {item.merchandise.title}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Qty: {item.quantity}
                </span>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {formatPrice(
                    item.cost.totalAmount.amount,
                    item.cost.totalAmount.currencyCode
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* More items indicator */}
        {items.length > 3 && (
          <div className="px-4 py-3 text-center bg-[var(--color-bg-secondary)]/30">
            <span className="text-sm text-[var(--color-text-secondary)]">
              +{items.length - 3} more {items.length - 3 === 1 ? "item" : "items"}
            </span>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="px-5 py-4 bg-[var(--color-bg-secondary)]/50 border-t border-[var(--color-border-primary)]">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-[var(--color-text-secondary)]">Subtotal</span>
          <span className="text-[var(--color-text-primary)]">
            {formatPrice(subtotal.amount, subtotal.currencyCode)}
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-medium text-[var(--color-text-primary)]">Total</span>
          <span className="text-xl font-serif font-semibold text-[var(--color-text-primary)]">
            {formatPrice(total.amount, total.currencyCode)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="p-4 bg-[var(--color-bg-primary)]">
        {expressCheckout ? (
          <div className="space-y-2.5">
            {/* Shop Pay Button */}
            {checkoutUrl ? (
              <>
                <a
                  href={`${checkoutUrl}?payment=shop_pay`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[#5a31f4] text-white rounded-xl font-medium transition-all duration-200 hover:bg-[#4a21e4] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5a31f4] focus-visible:ring-offset-2"
                >
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 32 32" fill="currentColor" className="group-hover:scale-110 transition-transform">
                    <path d="M26.4 8H5.6C4.7 8 4 8.7 4 9.6v12.8c0 .9.7 1.6 1.6 1.6h20.8c.9 0 1.6-.7 1.6-1.6V9.6c0-.9-.7-1.6-1.6-1.6zM8 20c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                  Express Checkout
                </a>
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3 px-4 border border-[var(--color-border-primary)] text-[var(--color-text-primary)] rounded-xl font-medium transition-all duration-200 hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-secondary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                >
                  Standard Checkout
                </a>
              </>
            ) : (
              <div className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] rounded-xl font-medium cursor-wait">
                <svg aria-hidden="true" className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                </svg>
                Preparing checkout...
              </div>
            )}
          </div>
        ) : checkoutUrl ? (
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] rounded-xl font-medium transition-all duration-200 hover:opacity-90 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-text-primary)] focus-visible:ring-offset-2"
          >
            Proceed to Checkout
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-1 transition-transform"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        ) : (
          <div className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)] rounded-xl font-medium cursor-wait">
            <svg aria-hidden="true" className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
            Preparing checkout...
          </div>
        )}

        {/* Security indicator */}
        <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-[var(--color-text-tertiary)]">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Secure checkout powered by Shopify
        </div>
      </div>
    </div>
  );
}

/**
 * Cart Summary (compact version for showing cart state)
 * Features refined styling and visual hierarchy
 */
export function AICartSummary() {
  const { cart, totalQuantity, checkoutUrl } = useCart();

  if (!cart || totalQuantity === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border-primary)] p-5 text-center bg-[var(--color-bg-secondary)]/30">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[var(--color-text-tertiary)]"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          Your cart is empty
        </p>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Browse our collection to find something you&apos;ll love.
        </p>
      </div>
    );
  }

  const items = cart.lines.edges.map((edge) => edge.node);

  return (
    <div className="rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-bg-secondary)]/50 border-b border-[var(--color-border-primary)]">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-[var(--color-accent)]"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span className="font-medium text-[var(--color-text-primary)]">
            Your Cart
          </span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium">
          {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items */}
      <div className="px-4 py-3 space-y-2.5">
        {items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start gap-3 text-sm"
          >
            <div className="flex-1 min-w-0">
              <span className="text-[var(--color-text-primary)] line-clamp-1 font-medium">
                {item.merchandise.product?.title}
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)]">
                {" "}× {item.quantity}
              </span>
            </div>
            <span className="text-[var(--color-text-primary)] font-semibold flex-shrink-0">
              {formatPrice(
                item.cost.totalAmount.amount,
                item.cost.totalAmount.currencyCode
              )}
            </span>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-[var(--color-text-tertiary)] pt-1">
            +{items.length - 3} more {items.length - 3 === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {/* Total */}
      <div className="px-4 py-3 border-t border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/30 flex justify-between items-center">
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">Total</span>
        <span className="text-lg font-serif font-semibold text-[var(--color-text-primary)]">
          {formatPrice(
            cart.cost.totalAmount.amount,
            cart.cost.totalAmount.currencyCode
          )}
        </span>
      </div>
    </div>
  );
}
