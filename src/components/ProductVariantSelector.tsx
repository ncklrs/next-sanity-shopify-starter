"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import AddToCartButton from "@/components/ui/add-to-cart-button";
import { formatPrice, createCart } from "@/lib/shopify";

interface Variant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  priceV2: {
    amount: string;
    currencyCode: string;
  };
  compareAtPriceV2?: {
    amount: string;
    currencyCode: string;
  } | null;
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

interface ProductVariantSelectorProps {
  variants: Variant[];
  options: ProductOption[];
  availableForSale: boolean;
  // Shop settings (from Sanity CMS)
  showBuyNowButton?: boolean;
  buyNowButtonText?: string;
}

/**
 * Find the variant that matches the selected options
 *
 * @param variants - Array of all product variants
 * @param selectedOptions - Record of option name to selected value (e.g., { "Size": "M", "Color": "Blue" })
 * @returns The matching variant, or undefined if no match found
 */
function findVariantByOptions(
  variants: Variant[],
  selectedOptions: Record<string, string>
): Variant | undefined {
  const selectedKeys = Object.keys(selectedOptions);

  return variants.find((variant) =>
    selectedKeys.every((key) =>
      variant.selectedOptions.some(
        (opt) => opt.name === key && opt.value === selectedOptions[key]
      )
    )
  );
}

export default function ProductVariantSelector({
  variants,
  options,
  availableForSale: productAvailable,
  showBuyNowButton = false,
  buyNowButtonText = "Buy Now",
}: ProductVariantSelectorProps) {
  const { addItem } = useCart();
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Initialize with first variant's options
  const initialOptions = useMemo(() => {
    const firstVariant = variants[0];
    if (!firstVariant) return {};
    return firstVariant.selectedOptions.reduce(
      (acc, opt) => ({ ...acc, [opt.name]: opt.value }),
      {} as Record<string, string>
    );
  }, [variants]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialOptions);

  // Find the currently selected variant
  const selectedVariant = useMemo(
    () => findVariantByOptions(variants, selectedOptions),
    [variants, selectedOptions]
  );

  // Fallback to first variant if no match (shouldn't happen with proper implementation)
  const currentVariant = selectedVariant || variants[0];
  const isOnSale = currentVariant?.compareAtPriceV2 &&
    parseFloat(currentVariant.compareAtPriceV2.amount) > parseFloat(currentVariant.priceV2.amount);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = async () => {
    if (currentVariant) {
      await addItem(currentVariant.id, 1);
    }
  };

  const handleBuyNow = async () => {
    if (!currentVariant) return;

    setIsBuyingNow(true);
    try {
      // Create a new cart with just this item and redirect to checkout
      const cart = await createCart({
        lines: [{ merchandiseId: currentVariant.id, quantity: 1 }],
      });

      // Redirect to Shopify checkout
      window.location.href = cart.checkoutUrl;
    } catch (error) {
      console.error("Buy now failed:", error);
      setIsBuyingNow(false);
    }
  };

  const canAddToCart = productAvailable && currentVariant?.availableForSale;

  // Price display component to avoid duplication
  const PriceDisplay = () => (
    <div className="space-y-1">
      {isOnSale && currentVariant?.compareAtPriceV2 ? (
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[var(--accent-red)]">
            {formatPrice(currentVariant.priceV2.amount, currentVariant.priceV2.currencyCode)}
          </span>
          <span className="text-xl text-[var(--foreground-muted)] line-through">
            {formatPrice(currentVariant.compareAtPriceV2.amount, currentVariant.compareAtPriceV2.currencyCode)}
          </span>
          <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wide bg-[var(--accent-red)] text-white rounded">
            Sale
          </span>
        </div>
      ) : (
        <span className="text-3xl font-bold">
          {currentVariant && formatPrice(currentVariant.priceV2.amount, currentVariant.priceV2.currencyCode)}
        </span>
      )}
    </div>
  );

  // Action buttons component
  const ActionButtons = () => (
    <div className={`flex gap-3 ${showBuyNowButton ? "flex-col sm:flex-row" : ""}`}>
      <AddToCartButton
        onAddToCart={handleAddToCart}
        disabled={!canAddToCart}
        fullWidth
        size="lg"
      >
        {canAddToCart ? "Add to Cart" : "Sold Out"}
      </AddToCartButton>

      {showBuyNowButton && canAddToCart && (
        <button
          onClick={handleBuyNow}
          disabled={isBuyingNow}
          className={`
            w-full px-8 py-4 text-lg font-semibold rounded-full
            border-2 border-[var(--foreground)] text-[var(--foreground)]
            hover:bg-[var(--foreground)] hover:text-[var(--background)]
            transition-all duration-300 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          `}
        >
          {isBuyingNow ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Redirecting...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{buyNowButtonText}</span>
            </>
          )}
        </button>
      )}
    </div>
  );

  // Don't render variant options if only one variant with default title
  if (variants.length === 1 && variants[0].title === "Default Title") {
    return (
      <div className="space-y-4">
        <PriceDisplay />
        <ActionButtons />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PriceDisplay />

      {/* Variant Options */}
      {options.map((option) => (
        <div key={option.id} className="space-y-3">
          <label className="block text-sm font-medium">
            {option.name}: <span className="text-[var(--foreground-muted)]">{selectedOptions[option.name]}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all
                    ${isSelected
                      ? "border-[var(--accent-violet)] bg-[var(--accent-violet)]/10 text-[var(--accent-violet)]"
                      : "border-[var(--border)] hover:border-[var(--foreground-muted)]"
                    }
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <ActionButtons />
    </div>
  );
}
