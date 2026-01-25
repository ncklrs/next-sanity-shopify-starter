"use client";

/**
 * AI Commerce Sheet
 * Premium conversational commerce interface
 * Features refined typography, smooth animations, and luxury styling
 */

import { useRef, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/Sheet";
import { useAICommerce } from "@/contexts/AICommerceContext";
import { AIMessageRenderer } from "./AIMessageRenderer";

export function AICommerceSheet() {
  const {
    isOpen,
    closeSheet,
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
    clearChat,
    stop,
    sendUserMessage,
    getMessageContent,
  } = useAICommerce();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when sheet opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  // Auto-resize textarea
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      // Auto-resize
      e.target.style.height = "auto";
      e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    },
    [setInput]
  );

  // Handle quick action clicks
  const handleQuickAction = useCallback(
    (suggestion: string) => {
      sendUserMessage(suggestion);
    },
    [sendUserMessage]
  );

  // Quick action suggestions with icons
  const quickActions = [
    { label: "New arrivals", prompt: "Show me new arrivals", icon: "sparkle" },
    { label: "Find a gift", prompt: "Help me find a gift", icon: "gift" },
    { label: "On sale", prompt: "What's on sale?", icon: "tag" },
    { label: "My cart", prompt: "View my cart", icon: "cart" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeSheet()}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 gap-0 bg-[var(--color-bg-primary)]"
        showClose={true}
      >
        {/* Header with refined styling - pr-12 to avoid X close button overlap */}
        <SheetHeader className="flex-shrink-0 border-b border-[var(--color-border-primary)] pr-12">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <SheetTitle className="font-serif text-xl tracking-tight">
                Personal Shopper
              </SheetTitle>
              <SheetDescription className="text-sm text-[var(--color-text-secondary)]">
                Find products, get recommendations, and checkout seamlessly.
              </SheetDescription>
            </div>
            {messages.length > 1 && (
              <button
                onClick={clearChat}
                className="flex-shrink-0 px-2.5 py-1 text-xs font-medium text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded-md transition-all duration-200"
                aria-label="Clear conversation"
              >
                Clear
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Messages container with refined scrollbar */}
        <div
          className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scroll-smooth"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "var(--color-border-secondary) transparent",
          }}
        >
          {messages.map((message, index) => (
            <AIMessageRenderer
              key={message.id}
              message={message}
              isStreaming={isLoading && index === messages.length - 1}
              getMessageContent={getMessageContent}
            />
          ))}

          {/* Elegant loading indicator */}
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* AI Avatar */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#9a7a62] flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="opacity-90"
                >
                  <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
                </svg>
              </div>
              {/* Thinking indicator */}
              <div className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[bounce_1s_ease-in-out_infinite]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[bounce_1s_ease-in-out_infinite_150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-[bounce_1s_ease-in-out_infinite_300ms]" />
              </div>
            </div>
          )}

          {/* Error message with refined styling */}
          {error && (
            <div
              className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 animate-in fade-in slide-in-from-bottom-2 max-w-full overflow-hidden"
              role="alert"
            >
              <div className="flex gap-3">
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="flex-shrink-0 text-red-500 mt-0.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-red-700 dark:text-red-300 break-words">
                  {error.message?.includes("API") || error.message?.includes("key")
                    ? "AI service is not configured. Please check API settings."
                    : error.message?.length > 100
                    ? "Something went wrong. Please try again."
                    : error.message || "Something went wrong. Please try again."}
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions with refined pills */}
        {messages.length <= 1 && (
          <div className="flex-shrink-0 px-5 pb-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <p className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2.5">
              Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  disabled={isLoading}
                  className="group inline-flex items-center gap-1.5 px-3.5 py-2 text-sm rounded-full border border-[var(--color-border-primary)] text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] hover:bg-[var(--color-bg-secondary)] hover:border-[var(--color-border-secondary)] hover:text-[var(--color-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <QuickActionIcon type={action.icon} />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area with premium styling */}
        <div className="flex-shrink-0 border-t border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-4">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about products, sizing, or recommendations..."
              rows={1}
              aria-label="Message input"
              className="w-full px-4 py-3.5 pr-14 text-sm rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 focus:border-[var(--color-accent)] focus:bg-[var(--color-bg-primary)] resize-none transition-all duration-200"
              style={{ minHeight: "52px", maxHeight: "120px" }}
              disabled={isLoading}
            />
            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop generating"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] hover:opacity-80 transition-opacity"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-[var(--color-accent)] text-white shadow-sm hover:shadow-md hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100 transition-all duration-200"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </form>
          <p className="mt-2.5 text-xs text-center text-[var(--color-text-tertiary)]">
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-secondary)] font-mono text-[10px]">Enter</kbd>
            {" "}to send · {" "}
            <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-bg-secondary)] font-mono text-[10px]">Shift + Enter</kbd>
            {" "}for new line
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Quick Action Icon component
 */
function QuickActionIcon({ type }: { type: string }) {
  const iconProps = {
    "aria-hidden": true as const,
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "opacity-70 group-hover:opacity-100 transition-opacity",
  };

  switch (type) {
    case "sparkle":
      return (
        <svg {...iconProps}>
          <path d="M12 3v5m0 8v5M5.5 8.5l3.5 3.5-3.5 3.5M18.5 8.5l-3.5 3.5 3.5 3.5" />
        </svg>
      );
    case "gift":
      return (
        <svg {...iconProps}>
          <rect x="3" y="8" width="18" height="13" rx="2" />
          <path d="M12 8v13M3 12h18M7.5 8a2.5 2.5 0 0 1 0-5C9.5 3 12 8 12 8M16.5 8a2.5 2.5 0 0 0 0-5C14.5 3 12 8 12 8" />
        </svg>
      );
    case "tag":
      return (
        <svg {...iconProps}>
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      );
    case "cart":
      return (
        <svg {...iconProps}>
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    default:
      return null;
  }
}
