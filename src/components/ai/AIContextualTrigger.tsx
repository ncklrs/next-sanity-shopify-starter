"use client";

/**
 * AI Contextual Trigger
 * Premium context-aware trigger with refined styling
 * Features elegant animations and luxury visual treatment
 */

import { useEffect } from "react";
import { useAICommerce } from "@/contexts/AICommerceContext";
import type { PageContext, AIProduct } from "@/lib/ai/types";

interface AIContextualTriggerProps {
  /** The context type */
  type: PageContext["type"];
  /** Product data (for product pages) */
  product?: {
    id: string;
    handle: string;
    title: string;
    description: string;
    vendor: string;
    productType: string;
    tags: string[];
    availableForSale: boolean;
    featuredImage: {
      url: string;
      altText: string | null;
      width: number;
      height: number;
    } | null;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
      maxVariantPrice: { amount: string; currencyCode: string };
    };
  };
  /** Collection data (for collection pages) */
  collection?: {
    handle: string;
    title: string;
  };
  /** Search query (for search pages) */
  searchQuery?: string;
  /** Custom prompt to display */
  customPrompt?: string;
  /** Whether to show the inline trigger button */
  showInlineTrigger?: boolean;
}

export function AIContextualTrigger({
  type,
  product,
  collection,
  searchQuery,
  customPrompt,
  showInlineTrigger = true,
}: AIContextualTriggerProps) {
  const { setPageContext, openSheet, sendUserMessage, isOpen } = useAICommerce();

  // Update page context when component mounts or props change
  useEffect(() => {
    const context: PageContext = {
      type,
      handle: product?.handle || collection?.handle,
      title: product?.title || collection?.title,
      product: product
        ? {
            id: product.id,
            handle: product.handle,
            title: product.title,
            description: product.description,
            vendor: product.vendor,
            productType: product.productType,
            tags: product.tags,
            availableForSale: product.availableForSale,
            featuredImage: product.featuredImage,
            priceRange: product.priceRange,
            compareAtPriceRange: null,
            variants: [],
            options: [],
          }
        : undefined,
      collection: collection,
      searchQuery: searchQuery,
    };

    setPageContext(context);

    // Cleanup on unmount
    return () => {
      setPageContext(null);
    };
  }, [type, product, collection, searchQuery, setPageContext]);

  // Get contextual prompts based on page type
  const getContextualPrompts = (): { label: string; prompt: string }[] => {
    switch (type) {
      case "product":
        return [
          { label: "Sizing help", prompt: `What size should I get for ${product?.title}?` },
          { label: "Similar items", prompt: `Show me products similar to ${product?.title}` },
          { label: "Styling tips", prompt: `How should I style ${product?.title}?` },
        ];
      case "collection":
        return [
          { label: "Best sellers", prompt: `What are the best sellers in ${collection?.title}?` },
          { label: "Help me choose", prompt: `Help me find something from ${collection?.title}` },
          { label: "New arrivals", prompt: `Show me new arrivals in ${collection?.title}` },
        ];
      case "search":
        return [
          { label: "Refine search", prompt: `Help me refine my search for "${searchQuery}"` },
          { label: "Alternatives", prompt: `Show me alternatives to "${searchQuery}"` },
        ];
      case "cart":
        return [
          { label: "Review cart", prompt: "Help me review my cart" },
          { label: "Complete the look", prompt: "What else goes with items in my cart?" },
          { label: "Checkout", prompt: "I'm ready to checkout" },
        ];
      default:
        return [
          { label: "Browse", prompt: "Show me what's popular" },
          { label: "Find something", prompt: "Help me find something" },
        ];
    }
  };

  const prompts = getContextualPrompts();
  const displayPrompt = customPrompt || getDefaultPrompt(type, product?.title, collection?.title);

  const handlePromptClick = (prompt: string) => {
    if (!isOpen) {
      openSheet();
    }
    // Small delay to ensure sheet is open
    setTimeout(() => sendUserMessage(prompt), 100);
  };

  if (!showInlineTrigger) return null;

  return (
    <div className="inline-flex items-center gap-2.5 flex-wrap" role="group" aria-label="AI assistant suggestions">
      {/* Main trigger with context - premium styling */}
      <button
        onClick={() => handlePromptClick(prompts[0]?.prompt || "Help me")}
        className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-secondary)] hover:shadow-sm transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
        aria-label={`Ask AI: ${prompts[0]?.prompt || displayPrompt}`}
      >
        {/* Sparkle icon with animation */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[var(--color-accent)] group-hover:scale-110 transition-transform duration-200"
        >
          <path
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
            fill="currentColor"
          />
          <circle cx="19" cy="5" r="1.5" fill="currentColor" opacity="0.6" />
          <circle cx="5" cy="17" r="1" fill="currentColor" opacity="0.4" />
        </svg>
        {displayPrompt}
      </button>

      {/* Additional prompts (shown as elegant pills) */}
      {prompts.slice(1).map((item, index) => (
        <button
          key={item.label}
          onClick={() => handlePromptClick(item.prompt)}
          className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border-primary)] text-[var(--color-text-tertiary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-secondary)] transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1 animate-in fade-in"
          style={{ animationDelay: `${(index + 1) * 50}ms`, animationFillMode: "backwards" }}
          aria-label={`Quick suggestion: ${item.label}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Get default prompt text based on context
 */
function getDefaultPrompt(
  type: PageContext["type"],
  productTitle?: string,
  collectionTitle?: string
): string {
  switch (type) {
    case "product":
      return "Need help with this?";
    case "collection":
      return "Help me explore";
    case "search":
      return "Refine my search";
    case "cart":
      return "Review my cart";
    default:
      return "Ask AI";
  }
}

/**
 * Minimal inline trigger for tight spaces
 * Elegant link-style trigger with refined hover states
 */
interface AIInlineTriggerProps {
  prompt?: string;
  label?: string;
  className?: string;
}

export function AIInlineTrigger({
  prompt = "Help me",
  label = "Ask AI",
  className = "",
}: AIInlineTriggerProps) {
  const { openSheet, sendUserMessage, isOpen } = useAICommerce();

  const handleClick = () => {
    if (!isOpen) {
      openSheet();
    }
    setTimeout(() => sendUserMessage(prompt), 100);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Ask AI: ${prompt}`}
      className={`
        group inline-flex items-center gap-1.5 text-sm font-medium
        text-[var(--color-accent)] hover:text-[var(--color-accent-hover,#9a7a62)]
        transition-colors duration-200
        focus:outline-none focus-visible:underline focus-visible:underline-offset-2
        ${className}
      `}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="group-hover:scale-110 transition-transform duration-200"
      >
        <path
          d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
          fill="currentColor"
        />
      </svg>
      <span className="group-hover:underline underline-offset-2">{label}</span>
    </button>
  );
}
