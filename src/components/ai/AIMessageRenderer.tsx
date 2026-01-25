"use client";

/**
 * AI Message Renderer
 * Premium chat message rendering with rich content support
 * Features refined typography, animations, and visual hierarchy
 */

import { memo } from "react";
import type { UIMessage } from "@ai-sdk/react";
import { AIProductCard, AIProductGrid } from "./AIProductCard";
import { AICheckoutSummary, AICartSummary } from "./AICheckoutSummary";
import type { AIProduct } from "@/lib/ai/types";

interface AIMessageRendererProps {
  message: UIMessage;
  isStreaming?: boolean;
  getMessageContent: (message: UIMessage) => string;
}

// Tool part type for AI SDK v6
interface ToolPart {
  type: string;
  toolCallId: string;
  state: string;
  input?: unknown;
  output?: unknown;
}

export const AIMessageRenderer = memo(function AIMessageRenderer({
  message,
  isStreaming = false,
  getMessageContent,
}: AIMessageRendererProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const textContent = getMessageContent(message);

  // Extract tool invocations from parts - in AI SDK v6, tool parts have type starting with "tool-"
  const toolInvocations: ToolPart[] = [];
  if (message.parts) {
    for (const part of message.parts) {
      if (part.type.startsWith("tool-") && "toolCallId" in part) {
        toolInvocations.push(part as unknown as ToolPart);
      }
    }
  }

  return (
    <div
      className={`flex gap-3.5 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar with refined styling */}
      <div
        className={`
          w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center
          shadow-sm transition-transform duration-200 hover:scale-105
          ${
            isUser
              ? "bg-[var(--color-text-primary)]"
              : "bg-gradient-to-br from-[var(--color-accent)] to-[#9a7a62]"
          }
        `}
        aria-hidden="true"
      >
        {isUser ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-bg-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
            className="opacity-90"
          >
            <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
          </svg>
        )}
      </div>

      {/* Message Content */}
      <div
        className={`
          flex-1 max-w-[85%] space-y-2
          ${isUser ? "text-right" : "text-left"}
        `}
      >
        {/* Text Content with refined bubble */}
        {textContent && (
          <div
            className={`
              inline-block px-4 py-3 text-sm leading-relaxed
              ${
                isUser
                  ? "bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] rounded-2xl rounded-br-sm shadow-sm"
                  : "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-2xl rounded-bl-sm border border-[var(--color-border-primary)]"
              }
            `}
          >
            <p className="whitespace-pre-wrap">{textContent}</p>
          </div>
        )}

        {/* Tool Invocations (Rich Content) */}
        {isAssistant && toolInvocations.length > 0 && (
          <div className="space-y-3 text-left">
            {toolInvocations.map((tool, index) => (
              <ToolResultRenderer
                key={`${tool.toolCallId}-${index}`}
                toolType={tool.type}
                result={tool.state === "output" ? tool.output : null}
                isLoading={tool.state === "input-streaming" || tool.state === "call"}
              />
            ))}
          </div>
        )}

        {/* Streaming Indicator */}
        {isAssistant && isStreaming && !textContent && toolInvocations.length === 0 && (
          <div className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[bounce_1s_ease-in-out_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[bounce_1s_ease-in-out_infinite_150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[bounce_1s_ease-in-out_infinite_300ms]" />
          </div>
        )}
      </div>
    </div>
  );
});

/**
 * Tool Result Renderer
 * Renders rich content based on tool execution results
 * Features refined loading states and polished content cards
 */
interface ToolResultRendererProps {
  toolType: string; // e.g., "tool-searchProducts"
  result: unknown;
  isLoading: boolean;
}

function ToolResultRenderer({ toolType, result, isLoading }: ToolResultRendererProps) {
  // Extract tool name from type (e.g., "tool-searchProducts" -> "searchProducts")
  const toolName = toolType.replace("tool-", "");

  if (isLoading) {
    const { message, icon } = getLoadingInfo(toolName);
    return (
      <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] animate-pulse">
        <div className="flex items-center gap-3">
          {/* Animated icon */}
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[var(--color-accent)] animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {message}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              This may take a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  // Type assertion for result
  const typedResult = result as Record<string, unknown>;

  // Handle different tool results with refined UI
  switch (toolName) {
    case "searchProducts":
    case "getFeaturedProducts":
      if (typedResult.success && Array.isArray(typedResult.products) && typedResult.products.length > 0) {
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AIProductGrid
              products={typedResult.products}
              title={typeof typedResult.count === "number" && typedResult.count > 0 ? `Found ${typedResult.count} products` : undefined}
            />
          </div>
        );
      }
      if (!typedResult.success || (Array.isArray(typedResult.products) && typedResult.products.length === 0)) {
        return (
          <div className="p-4 rounded-xl border border-dashed border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/50 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-tertiary)]">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                  <path d="M8 11h6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  No products found
                </p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                  Try a different search term or browse our collections.
                </p>
              </div>
            </div>
          </div>
        );
      }
      break;

    case "getProductDetails":
      if (typedResult.success && typedResult.product) {
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AIProductCard product={typedResult.product as AIProduct} showActions />
          </div>
        );
      }
      break;

    case "browseCollection":
      if (typedResult.success && Array.isArray(typedResult.products) && typedResult.products.length > 0) {
        const collection = typedResult.collection as { title?: string } | undefined;
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AIProductGrid
              products={typedResult.products}
              title={collection?.title}
            />
          </div>
        );
      }
      break;

    case "addToCart":
      if (typedResult.action === "ADD_TO_CART") {
        return (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                {typedResult.message as string}
              </p>
            </div>
          </div>
        );
      }
      break;

    case "getCart":
      if (typedResult.action === "GET_CART") {
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AICartSummary />
          </div>
        );
      }
      break;

    case "generateCheckout":
      if (typedResult.action === "GENERATE_CHECKOUT") {
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AICheckoutSummary expressCheckout={typedResult.expressCheckout as boolean} />
          </div>
        );
      }
      break;

    case "getRecommendations":
      if (typedResult.success && Array.isArray(typedResult.recommendations) && typedResult.recommendations.length > 0) {
        return (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <AIProductGrid
              products={typedResult.recommendations}
              title={`Similar to ${typedResult.basedOn as string}`}
            />
          </div>
        );
      }
      break;
  }

  return null;
}

/**
 * Get loading message and icon for a tool
 */
function getLoadingInfo(toolName: string): { message: string; icon: string } {
  switch (toolName) {
    case "searchProducts":
      return { message: "Searching our catalog...", icon: "search" };
    case "getProductDetails":
      return { message: "Loading product details...", icon: "product" };
    case "browseCollection":
      return { message: "Exploring the collection...", icon: "collection" };
    case "getFeaturedProducts":
      return { message: "Finding recommendations...", icon: "sparkle" };
    case "addToCart":
      return { message: "Adding to your cart...", icon: "cart" };
    case "getCart":
      return { message: "Loading your cart...", icon: "cart" };
    case "generateCheckout":
      return { message: "Preparing checkout...", icon: "checkout" };
    case "getRecommendations":
      return { message: "Finding similar products...", icon: "sparkle" };
    default:
      return { message: "Processing...", icon: "loading" };
  }
}
