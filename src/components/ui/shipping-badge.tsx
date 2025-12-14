"use client";

import { forwardRef, useState, useEffect, type HTMLAttributes } from "react";

interface ShippingBadgeProps extends HTMLAttributes<HTMLDivElement> {
  currentAmount: number;
  threshold: number;
  currency?: string;
  locale?: string;
  variant?: "progress" | "simple" | "compact";
  showIcon?: boolean;
}

const ShippingBadge = forwardRef<HTMLDivElement, ShippingBadgeProps>(
  (
    {
      currentAmount,
      threshold,
      currency = "USD",
      locale = "en-US",
      variant = "progress",
      showIcon = true,
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

    const remaining = Math.max(0, threshold - currentAmount);
    const progress = Math.min(100, (currentAmount / threshold) * 100);
    const hasReachedThreshold = currentAmount >= threshold;

    const ShippingIcon = () => (
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    );

    // Simple Variant
    if (variant === "simple") {
      return (
        <div
          ref={ref}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            hasReachedThreshold
              ? "bg-[var(--accent-emerald)]/10 text-[var(--accent-emerald)]"
              : "bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]"
          } ${className}`}
          {...props}
        >
          {showIcon && <ShippingIcon />}
          <span className="text-sm font-semibold">
            {hasReachedThreshold ? (
              "Free Shipping!"
            ) : (
              <>
                {formatPrice(remaining)} away from free shipping
              </>
            )}
          </span>
        </div>
      );
    }

    // Compact Variant
    if (variant === "compact") {
      return (
        <div
          ref={ref}
          className={`flex items-center gap-2 text-sm ${className}`}
          {...props}
        >
          {showIcon && (
            <div
              className={
                hasReachedThreshold
                  ? "text-[var(--accent-emerald)]"
                  : "text-[var(--foreground-subtle)]"
              }
            >
              <ShippingIcon />
            </div>
          )}
          <span className="text-[var(--foreground-muted)]">
            {hasReachedThreshold ? (
              <span className="font-semibold text-[var(--accent-emerald)]">
                Free shipping unlocked!
              </span>
            ) : (
              <>
                Add{" "}
                <span className="font-semibold text-[var(--foreground)]">
                  {formatPrice(remaining)}
                </span>{" "}
                for free shipping
              </>
            )}
          </span>
        </div>
      );
    }

    // Progress Variant (default)
    return (
      <div
        ref={ref}
        className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 ${className}`}
        {...props}
      >
        <div className="flex items-start gap-3 mb-3">
          {showIcon && (
            <div
              className={`mt-0.5 ${
                hasReachedThreshold
                  ? "text-[var(--accent-emerald)]"
                  : "text-[var(--accent-cyan)]"
              }`}
            >
              <ShippingIcon />
            </div>
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-semibold mb-1 ${
                hasReachedThreshold
                  ? "text-[var(--accent-emerald)]"
                  : "text-[var(--foreground)]"
              }`}
            >
              {hasReachedThreshold ? (
                <>
                  <svg
                    className="w-4 h-4 inline-block mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  You've unlocked free shipping!
                </>
              ) : (
                <>
                  You're {formatPrice(remaining)} away from{" "}
                  <span className="text-[var(--accent-emerald)]">free shipping</span>
                </>
              )}
            </p>
            {!hasReachedThreshold && (
              <p className="text-xs text-[var(--foreground-subtle)]">
                Free standard shipping on orders over {formatPrice(threshold)}
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-2 bg-[var(--background-tertiary)] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                hasReachedThreshold
                  ? "bg-[var(--accent-emerald)]"
                  : "bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-violet)]"
              }`}
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              {!hasReachedThreshold && (
                <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              )}
            </div>
          </div>

          {/* Milestone markers */}
          <div className="absolute top-0 left-0 w-full h-2 flex justify-between px-1">
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className={`w-0.5 h-full ${
                  progress >= milestone
                    ? "bg-transparent"
                    : "bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress percentage */}
        {!hasReachedThreshold && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-[var(--foreground-subtle)]">
              {formatPrice(currentAmount)}
            </span>
            <span className="text-xs font-semibold text-[var(--accent-cyan)]">
              {Math.round(progress)}%
            </span>
            <span className="text-xs text-[var(--foreground-subtle)]">
              {formatPrice(threshold)}
            </span>
          </div>
        )}
      </div>
    );
  }
);

ShippingBadge.displayName = "ShippingBadge";

interface ShippingTimerProps extends HTMLAttributes<HTMLDivElement> {
  cutoffTime: string; // e.g., "17:00" for 5 PM
  shippingMessage?: string;
  expiredMessage?: string;
  showCountdown?: boolean;
}

export const ShippingTimer = forwardRef<HTMLDivElement, ShippingTimerProps>(
  (
    {
      cutoffTime,
      shippingMessage = "Order within {time} for same-day shipping",
      expiredMessage = "Order now for next-day shipping",
      showCountdown = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [hasExpired, setHasExpired] = useState(false);

    useEffect(() => {
      const calculateTimeRemaining = () => {
        const now = new Date();
        const [hours, minutes] = cutoffTime.split(":").map(Number);
        const cutoff = new Date();
        cutoff.setHours(hours, minutes, 0, 0);

        if (now > cutoff) {
          setHasExpired(true);
          return;
        }

        const diff = cutoff.getTime() - now.getTime();
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeRemaining(
          `${hoursLeft}h ${minutesLeft}m`
        );
        setHasExpired(false);
      };

      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

      return () => clearInterval(interval);
    }, [cutoffTime]);

    return (
      <div
        ref={ref}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
          hasExpired
            ? "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground-muted)]"
            : "bg-[var(--accent-amber)]/10 text-[var(--accent-amber)] border border-[var(--accent-amber)]/20"
        } ${className}`}
        {...props}
      >
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-sm font-semibold">
          {hasExpired
            ? expiredMessage
            : shippingMessage.replace("{time}", timeRemaining)}
        </span>
      </div>
    );
  }
);

ShippingTimer.displayName = "ShippingTimer";

export default ShippingBadge;
