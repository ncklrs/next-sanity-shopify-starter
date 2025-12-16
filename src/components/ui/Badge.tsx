"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

type BadgeVariant = "default" | "gradient" | "success" | "new" | "warning" | "error";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
  dot?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", children, dot = false, className = "", ...props }, ref) => {
    // MAISON luxury badge styles - minimal, refined
    const variantStyles: Record<BadgeVariant, string> = {
      default: "badge",
      gradient: "badge badge-exclusive", // Gold outline - luxury accent
      success: "badge badge-limited", // Gold filled
      new: "badge badge-new",
      warning: "badge bg-[var(--warning)] text-[var(--background-paper)]",
      error: "badge bg-[var(--error)] text-[var(--background-paper)]",
    };

    // MAISON dot colors - gold, foreground, semantic
    const dotColors: Record<BadgeVariant, string> = {
      default: "bg-[var(--foreground-muted)]",
      gradient: "bg-[var(--gold)]",
      success: "bg-[var(--success)]",
      new: "bg-[var(--foreground)]",
      warning: "bg-[var(--warning)]",
      error: "bg-[var(--error)]",
    };

    return (
      <span
        ref={ref}
        className={`${variantStyles[variant]} ${className}`}
        {...props}
      >
        {dot && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;
