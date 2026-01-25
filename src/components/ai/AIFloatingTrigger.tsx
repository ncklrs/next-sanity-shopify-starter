"use client";

/**
 * AI Floating Trigger
 * Premium floating button for the AI commerce assistant
 * Features sophisticated animations and luxury styling
 * Memoized to prevent unnecessary re-renders
 */

import { memo } from "react";
import { useAICommerce } from "@/contexts/AICommerceContext";

interface AIFloatingTriggerProps {
  /** Position of the button */
  position?: "bottom-right" | "bottom-left";
  /** Whether to show the button */
  show?: boolean;
}

export const AIFloatingTrigger = memo(function AIFloatingTrigger({
  position = "bottom-right",
  show = true,
}: AIFloatingTriggerProps) {
  const { isOpen, toggleSheet } = useAICommerce();

  // Hide when sheet is open or when explicitly hidden
  if (!show || isOpen) return null;

  const positionClasses = {
    "bottom-right": "right-4 sm:right-6",
    "bottom-left": "left-4 sm:left-6",
  };

  return (
    <button
      onClick={toggleSheet}
      aria-label={isOpen ? "Close shopping assistant" : "Open shopping assistant"}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className={`
        fixed bottom-20 sm:bottom-6 z-40
        ${positionClasses[position]}
        group
        w-14 h-14 rounded-full
        bg-gradient-to-br from-[var(--color-accent)] to-[#9a7a62]
        text-white
        shadow-[0_4px_20px_rgba(184,151,126,0.35)]
        hover:shadow-[0_8px_30px_rgba(184,151,126,0.5)]
        transform transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:scale-110 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]
        ${isOpen ? "rotate-135" : "rotate-0"}
      `}
    >
      {/* Gradient overlay for depth */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Icon container with smooth transitions */}
      <span className="relative z-10 flex items-center justify-center w-full h-full">
        {isOpen ? (
          // Close icon (elegant X)
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Sparkles/AI icon - refined design
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300 group-hover:scale-110"
          >
            {/* Main sparkle */}
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="currentColor"
              className="drop-shadow-sm"
            />
            {/* Small sparkles */}
            <circle cx="19" cy="5" r="1.5" fill="currentColor" opacity="0.7" />
            <circle cx="5" cy="18" r="1" fill="currentColor" opacity="0.5" />
          </svg>
        )}
      </span>

      {/* Elegant pulse ring when closed */}
      {!isOpen && (
        <>
          <span
            className="absolute inset-0 rounded-full border-2 border-[var(--color-accent)] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40"
            aria-hidden="true"
          />
          <span
            className="absolute inset-[-4px] rounded-full border border-[var(--color-accent)]/20 animate-[pulse_3s_ease-in-out_infinite]"
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
});

/**
 * AI Header Trigger
 * Elegant header button with refined hover states
 */
interface AIHeaderTriggerProps {
  className?: string;
  /** Show label text alongside icon */
  showLabel?: boolean;
}

export const AIHeaderTrigger = memo(function AIHeaderTrigger({
  className = "",
  showLabel = false,
}: AIHeaderTriggerProps) {
  const { isOpen, toggleSheet } = useAICommerce();

  return (
    <button
      onClick={toggleSheet}
      aria-label={isOpen ? "Close shopping assistant" : "Open shopping assistant"}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className={`
        group relative
        inline-flex items-center gap-2
        px-3 py-2 rounded-full
        text-[var(--color-text-primary)]
        hover:bg-[var(--color-bg-secondary)]
        transition-all duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1
        ${className}
      `}
    >
      {/* Sparkle icon with animation */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
      >
        {/* Main sparkle - filled for better visibility */}
        <path
          d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        {/* Small accent sparkles */}
        <circle
          cx="19"
          cy="5"
          r="1.5"
          fill="currentColor"
          className="opacity-60 group-hover:opacity-100 transition-opacity"
        />
        <circle
          cx="5"
          cy="17"
          r="1"
          fill="currentColor"
          className="opacity-40 group-hover:opacity-80 transition-opacity"
        />
      </svg>

      {/* Optional label */}
      {showLabel && (
        <span className="text-sm font-medium tracking-wide">
          Ask AI
        </span>
      )}

      {/* Subtle indicator dot when active */}
      {isOpen && (
        <span
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--color-accent)]"
          aria-hidden="true"
        />
      )}
    </button>
  );
});
