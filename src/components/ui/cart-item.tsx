"use client";

import { forwardRef, type HTMLAttributes } from "react";
import Image from "next/image";
import QuantitySelector from "./quantity-selector";
import PriceDisplay from "./price-display";

export interface CartItemData {
  id: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
  maxQuantity?: number;
}

interface CartItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  item: CartItemData;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  variant?: "default" | "compact";
  showImage?: boolean;
  editable?: boolean;
}

const CartItem = forwardRef<HTMLDivElement, CartItemProps>(
  (
    {
      item,
      onQuantityChange,
      onRemove,
      variant = "default",
      showImage = true,
      editable = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const handleQuantityChange = (newQuantity: number) => {
      onQuantityChange?.(item.id, newQuantity);
    };

    const handleRemove = () => {
      onRemove?.(item.id);
    };

    const totalPrice = (item.salePrice || item.price) * item.quantity;

    const variantText = item.variant
      ? Object.entries(item.variant)
          .filter(([_, value]) => value)
          .map(([key, value]) => `${key}: ${value}`)
          .join(" | ")
      : null;

    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={`flex items-center gap-3 py-3 ${className}`}
          {...props}
        >
          {showImage && (
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--background-tertiary)] flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-[var(--foreground)] truncate">
              {item.name}
            </h4>
            {variantText && (
              <p className="text-xs text-[var(--foreground-subtle)] mt-0.5">
                {variantText}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-[var(--foreground)]">
                ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
              </span>
              <span className="text-xs text-[var(--foreground-subtle)]">
                x{item.quantity}
              </span>
            </div>
          </div>

          {editable && (
            <button
              onClick={handleRemove}
              className="flex-shrink-0 p-1 text-[var(--foreground-subtle)] hover:text-[var(--error)] transition-colors"
              aria-label="Remove item"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      );
    }

    // Default variant
    return (
      <div
        ref={ref}
        className={`relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 transition-all hover:border-[var(--border-hover)] ${className}`}
        {...props}
      >
        <div className="flex gap-4">
          {/* Product Image */}
          {showImage && (
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[var(--background-tertiary)] flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </div>
          )}

          {/* Product Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Title and Remove Button */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] line-clamp-2">
                {item.name}
              </h3>
              {editable && (
                <button
                  onClick={handleRemove}
                  className="flex-shrink-0 p-1.5 rounded-full text-[var(--foreground-subtle)] hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-all"
                  aria-label="Remove item"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Variant Info */}
            {variantText && (
              <p className="text-sm text-[var(--foreground-subtle)] mb-3">
                {variantText}
              </p>
            )}

            {/* Price and Quantity */}
            <div className="mt-auto flex items-end justify-between gap-4 flex-wrap">
              {/* Quantity Selector */}
              {editable ? (
                <QuantitySelector
                  value={item.quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={item.maxQuantity}
                  size="sm"
                />
              ) : (
                <div className="text-sm text-[var(--foreground-muted)]">
                  Qty: <span className="font-semibold text-[var(--foreground)]">{item.quantity}</span>
                </div>
              )}

              {/* Price */}
              <div className="text-right">
                <PriceDisplay
                  price={item.price * item.quantity}
                  salePrice={item.salePrice ? item.salePrice * item.quantity : undefined}
                  size="md"
                  align="right"
                  showSavings={false}
                />
                {item.quantity > 1 && (
                  <div className="text-xs text-[var(--foreground-subtle)] mt-0.5">
                    ${(item.salePrice || item.price).toFixed(2)} each
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CartItem.displayName = "CartItem";

interface CartSummaryProps extends HTMLAttributes<HTMLDivElement> {
  subtotal: number;
  shipping?: number;
  tax?: number;
  discount?: number;
  total: number;
  currency?: string;
  locale?: string;
  itemCount?: number;
}

export const CartSummary = forwardRef<HTMLDivElement, CartSummaryProps>(
  (
    {
      subtotal,
      shipping,
      tax,
      discount,
      total,
      currency = "USD",
      locale = "en-US",
      itemCount,
      className = "",
      ...props
    },
    ref
  ) => {
    const formatPrice = (amount: number) => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      }).format(amount);
    };

    return (
      <div
        ref={ref}
        className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 ${className}`}
        {...props}
      >
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Order Summary
          {itemCount !== undefined && (
            <span className="text-sm font-normal text-[var(--foreground-subtle)] ml-2">
              ({itemCount} {itemCount === 1 ? "item" : "items"})
            </span>
          )}
        </h3>

        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between text-sm">
            <span className="text-[var(--foreground-muted)]">Subtotal</span>
            <span className="font-medium text-[var(--foreground)]">
              {formatPrice(subtotal)}
            </span>
          </div>

          {/* Shipping */}
          {shipping !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">Shipping</span>
              <span className="font-medium text-[var(--foreground)]">
                {shipping === 0 ? (
                  <span className="text-[var(--accent-emerald)]">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </span>
            </div>
          )}

          {/* Tax */}
          {tax !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">Tax</span>
              <span className="font-medium text-[var(--foreground)]">
                {formatPrice(tax)}
              </span>
            </div>
          )}

          {/* Discount */}
          {discount !== undefined && discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[var(--foreground-muted)]">Discount</span>
              <span className="font-medium text-[var(--accent-emerald)]">
                -{formatPrice(discount)}
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[var(--border)] pt-3 mt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-base font-semibold text-[var(--foreground)]">
                Total
              </span>
              <span className="text-2xl font-bold text-[var(--foreground)]">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CartSummary.displayName = "CartSummary";

export default CartItem;
