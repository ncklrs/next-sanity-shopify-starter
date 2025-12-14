"use client";

import { forwardRef, useState, useEffect, type ButtonHTMLAttributes } from "react";

type ButtonState = "idle" | "loading" | "success" | "error";

interface AddToCartButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onAddToCart?: () => void | Promise<void>;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  successDuration?: number;
  variant?: "primary" | "secondary" | "outline";
}

const AddToCartButton = forwardRef<HTMLButtonElement, AddToCartButtonProps>(
  (
    {
      onAddToCart,
      size = "md",
      fullWidth = false,
      successDuration = 2000,
      variant = "primary",
      disabled,
      className = "",
      children = "Add to Cart",
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<ButtonState>("idle");

    useEffect(() => {
      if (state === "success") {
        const timer = setTimeout(() => {
          setState("idle");
        }, successDuration);
        return () => clearTimeout(timer);
      }
    }, [state, successDuration]);

    const handleClick = async () => {
      if (state !== "idle" || disabled) return;

      setState("loading");

      try {
        await onAddToCart?.();
        setState("success");
      } catch (error) {
        setState("error");
        setTimeout(() => setState("idle"), 2000);
      }
    };

    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const variantClasses = {
      primary: "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--foreground-muted)]",
      secondary: "bg-[var(--surface)] text-[var(--foreground)] border-2 border-[var(--border)] hover:border-[var(--foreground-subtle)] hover:bg-[var(--surface-hover)]",
      outline: "bg-transparent text-[var(--foreground)] border-2 border-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]",
    };

    const stateClasses = {
      idle: variantClasses[variant],
      loading: "bg-[var(--foreground-muted)] text-[var(--background)] cursor-wait",
      success: "bg-[var(--accent-emerald)] text-white cursor-default",
      error: "bg-[var(--error)] text-white cursor-default",
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || state !== "idle"}
        className={`
          relative font-semibold rounded-full
          transition-all duration-300
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
          ${sizeClasses[size]}
          ${stateClasses[state]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        <span
          className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${
            state === "idle" ? "opacity-100" : "opacity-0"
          }`}
        >
          {state === "idle" && (
            <>
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {children}
            </>
          )}
        </span>

        {/* Loading State */}
        {state === "loading" && (
          <span className="absolute inset-0 flex items-center justify-center">
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
          </span>
        )}

        {/* Success State */}
        {state === "success" && (
          <span className="absolute inset-0 flex items-center justify-center gap-2 animate-scale-in">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            Added!
          </span>
        )}

        {/* Error State */}
        {state === "error" && (
          <span className="absolute inset-0 flex items-center justify-center gap-2 animate-scale-in">
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
            Error
          </span>
        )}
      </button>
    );
  }
);

AddToCartButton.displayName = "AddToCartButton";

export default AddToCartButton;
