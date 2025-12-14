"use client";

import { forwardRef, type HTMLAttributes } from "react";

type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "pre-order" | "coming-soon";

interface StockIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  status: StockStatus;
  quantity?: number;
  lowStockThreshold?: number;
  showQuantity?: boolean;
  variant?: "badge" | "text" | "dot";
  size?: "sm" | "md" | "lg";
  customLabels?: Partial<Record<StockStatus, string>>;
}

const StockIndicator = forwardRef<HTMLDivElement, StockIndicatorProps>(
  (
    {
      status,
      quantity,
      lowStockThreshold = 5,
      showQuantity = false,
      variant = "badge",
      size = "md",
      customLabels,
      className = "",
      ...props
    },
    ref
  ) => {
    const defaultLabels: Record<StockStatus, string> = {
      "in-stock": "In Stock",
      "low-stock": "Low Stock",
      "out-of-stock": "Out of Stock",
      "pre-order": "Pre-order",
      "coming-soon": "Coming Soon",
    };

    const labels = { ...defaultLabels, ...customLabels };

    const statusConfig = {
      "in-stock": {
        color: "text-[var(--accent-emerald)]",
        bgColor: "bg-[var(--accent-emerald)]/10",
        borderColor: "border-[var(--accent-emerald)]/20",
        dotColor: "bg-[var(--accent-emerald)]",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
      },
      "low-stock": {
        color: "text-[var(--accent-amber)]",
        bgColor: "bg-[var(--accent-amber)]/10",
        borderColor: "border-[var(--accent-amber)]/20",
        dotColor: "bg-[var(--accent-amber)]",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
      },
      "out-of-stock": {
        color: "text-[var(--foreground-subtle)]",
        bgColor: "bg-[var(--surface)]",
        borderColor: "border-[var(--border)]",
        dotColor: "bg-[var(--foreground-subtle)]",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
      },
      "pre-order": {
        color: "text-[var(--accent-cyan)]",
        bgColor: "bg-[var(--accent-cyan)]/10",
        borderColor: "border-[var(--accent-cyan)]/20",
        dotColor: "bg-[var(--accent-cyan)]",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
      "coming-soon": {
        color: "text-[var(--accent-violet)]",
        bgColor: "bg-[var(--accent-violet)]/10",
        borderColor: "border-[var(--accent-violet)]/20",
        dotColor: "bg-[var(--accent-violet)]",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ),
      },
    };

    const config = statusConfig[status];

    const sizeClasses = {
      sm: {
        text: "text-xs",
        padding: "px-2 py-0.5",
        dot: "w-1.5 h-1.5",
        gap: "gap-1",
      },
      md: {
        text: "text-sm",
        padding: "px-2.5 py-1",
        dot: "w-2 h-2",
        gap: "gap-1.5",
      },
      lg: {
        text: "text-base",
        padding: "px-3 py-1.5",
        dot: "w-2.5 h-2.5",
        gap: "gap-2",
      },
    };

    const classes = sizeClasses[size];

    const getQuantityMessage = () => {
      if (!showQuantity || quantity === undefined) return null;

      if (status === "low-stock") {
        return ` (Only ${quantity} left)`;
      }

      if (status === "in-stock" && quantity !== undefined) {
        return ` (${quantity} available)`;
      }

      return null;
    };

    // Badge Variant
    if (variant === "badge") {
      return (
        <div
          ref={ref}
          className={`
            inline-flex items-center ${classes.gap} ${classes.padding}
            ${classes.text} font-semibold rounded-full
            ${config.bgColor} ${config.color}
            border ${config.borderColor}
            ${className}
          `}
          {...props}
        >
          {config.icon}
          <span>
            {labels[status]}
            {getQuantityMessage()}
          </span>
        </div>
      );
    }

    // Text Variant
    if (variant === "text") {
      return (
        <div
          ref={ref}
          className={`inline-flex items-center ${classes.gap} ${classes.text} font-medium ${config.color} ${className}`}
          {...props}
        >
          {config.icon}
          <span>
            {labels[status]}
            {getQuantityMessage()}
          </span>
        </div>
      );
    }

    // Dot Variant
    if (variant === "dot") {
      return (
        <div
          ref={ref}
          className={`inline-flex items-center ${classes.gap} ${classes.text} ${className}`}
          {...props}
        >
          <span
            className={`${classes.dot} rounded-full ${config.dotColor} ${
              status === "in-stock" ? "animate-pulse" : ""
            }`}
          />
          <span className="text-[var(--foreground-muted)]">
            {labels[status]}
            {getQuantityMessage()}
          </span>
        </div>
      );
    }

    return null;
  }
);

StockIndicator.displayName = "StockIndicator";

interface StockBarProps extends HTMLAttributes<HTMLDivElement> {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md";
}

export const StockBar = forwardRef<HTMLDivElement, StockBarProps>(
  (
    {
      current,
      total,
      label = "In Stock",
      showPercentage = true,
      size = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const percentage = Math.round((current / total) * 100);
    const isLow = percentage < 30;
    const isCritical = percentage < 10;

    const barColor = isCritical
      ? "bg-[var(--error)]"
      : isLow
      ? "bg-[var(--accent-amber)]"
      : "bg-[var(--accent-emerald)]";

    const sizeClasses = {
      sm: {
        text: "text-xs",
        height: "h-1.5",
      },
      md: {
        text: "text-sm",
        height: "h-2",
      },
    };

    const classes = sizeClasses[size];

    return (
      <div ref={ref} className={className} {...props}>
        <div className="flex justify-between items-center mb-1.5">
          <span className={`${classes.text} font-medium text-[var(--foreground-muted)]`}>
            {label}
          </span>
          {showPercentage && (
            <span className={`${classes.text} font-semibold text-[var(--foreground)]`}>
              {percentage}%
            </span>
          )}
        </div>
        <div className={`w-full ${classes.height} bg-[var(--surface)] rounded-full overflow-hidden`}>
          <div
            className={`${classes.height} ${barColor} rounded-full transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

StockBar.displayName = "StockBar";

export default StockIndicator;
