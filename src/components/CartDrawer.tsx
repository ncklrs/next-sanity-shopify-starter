"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui";
import { XIcon, MinusIcon, PlusIcon, TrashIcon, PackageIcon, TruckIcon } from "@/components/icons";

const FREE_SHIPPING_THRESHOLD = 100;

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, totalQuantity, checkoutUrl, updateQuantity, removeItem, isLoading } = useCart();

  const cartLines = cart?.lines?.edges || [];
  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Backdrop - clickable to close */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer - stop propagation to prevent backdrop click */}
      <div
        className="relative h-full w-full max-w-md bg-[var(--background)] shadow-2xl transform transition-transform duration-300 ease-out flex flex-col"
        style={{
          animation: "slideInFromRight 300ms ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 id="cart-title" className="text-xl font-semibold text-[var(--foreground)]">
            Shopping Cart
            {totalQuantity > 0 && (
              <span className="ml-2 text-sm font-normal text-[var(--foreground-muted)]">
                ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
            aria-label="Close cart"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        {cartLines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 mb-4 rounded-full bg-[var(--surface)] flex items-center justify-center">
              <PackageIcon className="w-10 h-10 text-[var(--foreground-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Your cart is empty
            </h3>
            <p className="text-[var(--foreground-muted)] mb-6 max-w-xs">
              Add some products to your cart to get started with your order.
            </p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress */}
            {remainingForFreeShipping > 0 && (
              <div className="p-4 bg-[var(--surface)]/50 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 mb-2 text-sm text-[var(--foreground-muted)]">
                  <TruckIcon className="w-4 h-4" />
                  <span>
                    Add ${remainingForFreeShipping.toFixed(2)} more for free shipping
                  </span>
                </div>
                <div className="w-full h-2 bg-[var(--surface)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-violet)] transition-all duration-500"
                    style={{ width: `${shippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {shippingProgress >= 100 && (
              <div className="p-4 bg-gradient-to-r from-[var(--accent-emerald)]/10 to-transparent border-b border-[var(--border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--accent-emerald)]">
                  <TruckIcon className="w-4 h-4" />
                  <span className="font-medium">You qualify for free shipping!</span>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                {cartLines.map(({ node: line }) => {
                  const merchandise = line.merchandise;
                  const product = merchandise.product;
                  const image = merchandise.image || product?.featuredImage;
                  const price = parseFloat(merchandise.price.amount);

                  return (
                    <div
                      key={line.id}
                      className="flex gap-4 p-4 rounded-lg bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
                    >
                      {/* Product Image */}
                      {image && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--background-secondary)] flex-shrink-0">
                          <Image
                            src={image.url}
                            alt={image.altText || product?.title || merchandise.title}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-[var(--foreground)] mb-1 truncate">
                          {product?.title || merchandise.title}
                        </h3>
                        {merchandise.title !== "Default Title" && (
                          <p className="text-xs text-[var(--foreground-muted)] mb-2">
                            {merchandise.title}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {merchandise.price.currencyCode} ${price.toFixed(2)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity - 1)}
                              className="p-1.5 hover:bg-[var(--surface-hover)] transition-colors"
                              aria-label="Decrease quantity"
                              disabled={isLoading}
                            >
                              <MinusIcon className="w-3 h-3" />
                            </button>
                            <span className="px-3 py-1.5 text-sm font-medium min-w-[2rem] text-center">
                              {line.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity + 1)}
                              className="p-1.5 hover:bg-[var(--surface-hover)] transition-colors"
                              aria-label="Increase quantity"
                              disabled={isLoading}
                            >
                              <PlusIcon className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(line.id)}
                            className="p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--error)] hover:bg-[var(--surface-hover)] transition-colors ml-auto"
                            aria-label="Remove item"
                            disabled={isLoading}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[var(--border)] p-6 space-y-4 bg-[var(--background)]">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-lg font-semibold">
                <span className="text-[var(--foreground)]">Subtotal</span>
                <span className="text-[var(--foreground)]">${subtotal.toFixed(2)}</span>
              </div>

              <p className="text-xs text-[var(--foreground-muted)]">
                Shipping and taxes calculated at checkout
              </p>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full justify-center"
                  onClick={() => {
                    if (checkoutUrl) {
                      window.location.href = checkoutUrl;
                    }
                  }}
                  disabled={!checkoutUrl}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-center"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
