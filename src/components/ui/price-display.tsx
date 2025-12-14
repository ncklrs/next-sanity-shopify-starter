"use client";

import { forwardRef, type HTMLAttributes } from "react";

interface PriceDisplayProps extends HTMLAttributes<HTMLDivElement> {
  price: number;
  salePrice?: number;
  currency?: string;
  locale?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSavings?: boolean;
  savingsPosition?: "inline" | "below";
  align?: "left" | "center" | "right";
}

const PriceDisplay = forwardRef<HTMLDivElement, PriceDisplayProps>(
  (
    {
      price,
      salePrice,
      currency = "USD",
      locale = "en-US",
      size = "md",
      showSavings = true,
      savingsPosition = "inline",
      align = "left",
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

    const isOnSale = salePrice !== undefined && salePrice < price;
    const savings = isOnSale ? price - salePrice : 0;
    const savingsPercent = isOnSale ? Math.round((savings / price) * 100) : 0;

    const sizeClasses = {
      sm: {
        price: "text-sm",
        salePrice: "text-base",
        originalPrice: "text-xs",
        savings: "text-xs",
      },
      md: {
        price: "text-lg",
        salePrice: "text-xl",
        originalPrice: "text-sm",
        savings: "text-sm",
      },
      lg: {
        price: "text-2xl",
        salePrice: "text-3xl",
        originalPrice: "text-base",
        savings: "text-base",
      },
      xl: {
        price: "text-3xl",
        salePrice: "text-4xl",
        originalPrice: "text-lg",
        savings: "text-lg",
      },
    };

    const alignClasses = {
      left: "justify-start text-left",
      center: "justify-center text-center",
      right: "justify-end text-right",
    };

    const classes = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={`flex flex-col ${alignClasses[align]} ${className}`}
        {...props}
      >
        <div className={`flex items-baseline gap-2 flex-wrap ${alignClasses[align]}`}>
          {isOnSale ? (
            <>
              {/* Sale Price */}
              <span
                className={`${classes.salePrice} font-bold text-[var(--accent-rose)]`}
              >
                {formatPrice(salePrice)}
              </span>

              {/* Original Price */}
              <span
                className={`${classes.originalPrice} font-medium text-[var(--foreground-subtle)] line-through`}
              >
                {formatPrice(price)}
              </span>

              {/* Inline Savings Badge */}
              {showSavings && savingsPosition === "inline" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--accent-rose)]/10 text-[var(--accent-rose)] text-xs font-semibold">
                  Save {savingsPercent}%
                </span>
              )}
            </>
          ) : (
            /* Regular Price */
            <span className={`${classes.price} font-bold text-[var(--foreground)]`}>
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Below Savings */}
        {isOnSale && showSavings && savingsPosition === "below" && (
          <div className={`mt-1 ${classes.savings} text-[var(--accent-emerald)] font-medium`}>
            You save {formatPrice(savings)} ({savingsPercent}%)
          </div>
        )}
      </div>
    );
  }
);

PriceDisplay.displayName = "PriceDisplay";

interface PriceRangeProps extends HTMLAttributes<HTMLDivElement> {
  minPrice: number;
  maxPrice: number;
  currency?: string;
  locale?: string;
  size?: "sm" | "md" | "lg" | "xl";
  separator?: string;
  align?: "left" | "center" | "right";
}

export const PriceRange = forwardRef<HTMLDivElement, PriceRangeProps>(
  (
    {
      minPrice,
      maxPrice,
      currency = "USD",
      locale = "en-US",
      size = "md",
      separator = "–",
      align = "left",
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

    const sizeClasses = {
      sm: "text-sm",
      md: "text-lg",
      lg: "text-2xl",
      xl: "text-3xl",
    };

    const alignClasses = {
      left: "justify-start text-left",
      center: "justify-center text-center",
      right: "justify-end text-right",
    };

    return (
      <div
        ref={ref}
        className={`flex items-baseline gap-1 ${alignClasses[align]} ${className}`}
        {...props}
      >
        <span className={`${sizeClasses[size]} font-bold text-[var(--foreground)]`}>
          {formatPrice(minPrice)}
        </span>
        <span className="text-[var(--foreground-subtle)] mx-1">{separator}</span>
        <span className={`${sizeClasses[size]} font-bold text-[var(--foreground)]`}>
          {formatPrice(maxPrice)}
        </span>
      </div>
    );
  }
);

PriceRange.displayName = "PriceRange";

interface InstallmentPriceProps extends HTMLAttributes<HTMLDivElement> {
  totalPrice: number;
  installments: number;
  currency?: string;
  locale?: string;
  size?: "sm" | "md";
}

export const InstallmentPrice = forwardRef<HTMLDivElement, InstallmentPriceProps>(
  (
    {
      totalPrice,
      installments,
      currency = "USD",
      locale = "en-US",
      size = "md",
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

    const installmentPrice = totalPrice / installments;

    const sizeClasses = {
      sm: {
        container: "text-xs",
        price: "text-sm",
      },
      md: {
        container: "text-sm",
        price: "text-base",
      },
    };

    const classes = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={`flex items-baseline gap-1 ${classes.container} text-[var(--foreground-muted)] ${className}`}
        {...props}
      >
        <span>or</span>
        <span className={`${classes.price} font-semibold text-[var(--foreground)]`}>
          {formatPrice(installmentPrice)}
        </span>
        <span>x {installments} monthly</span>
      </div>
    );
  }
);

InstallmentPrice.displayName = "InstallmentPrice";

export default PriceDisplay;
