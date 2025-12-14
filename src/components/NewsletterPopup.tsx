"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { XIcon } from "@/components/icons";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useExitIntent } from "@/hooks/useExitIntent";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface NewsletterPopupProps {
  /**
   * Popup title
   * @default "Get 10% Off Your First Order!"
   */
  title?: string;

  /**
   * Popup description/subtitle
   * @default "Subscribe to our newsletter and receive an exclusive discount code."
   */
  description?: string;

  /**
   * Discount code to show on success
   * @default "WELCOME10"
   */
  discountCode?: string;

  /**
   * Background image URL (product/lifestyle image)
   */
  backgroundImage?: string;

  /**
   * Trigger type
   * @default "exit-intent"
   */
  trigger?: "exit-intent" | "time-delay" | "scroll-depth";

  /**
   * Trigger value (milliseconds for time-delay, percentage for scroll-depth)
   * @default 5000 for time-delay, 50 for scroll-depth
   */
  triggerValue?: number;

  /**
   * Show only once per session
   * @default true
   */
  showOnce?: boolean;

  /**
   * Session storage key for tracking shown state
   * @default "newsletter-popup-shown"
   */
  sessionKey?: string;

  /**
   * Placeholder text for email input
   * @default "Enter your email"
   */
  emailPlaceholder?: string;

  /**
   * Submit button text
   * @default "Get My Discount"
   */
  submitButtonText?: string;

  /**
   * Success message
   * @default "Check your inbox for your discount code!"
   */
  successMessage?: string;

  /**
   * Callback when email is submitted
   */
  onSubmit?: (email: string) => Promise<void> | void;

  /**
   * Callback when popup is closed
   */
  onClose?: () => void;
}

// ============================================================================
// NEWSLETTER POPUP COMPONENT
// ============================================================================

export function NewsletterPopup({
  title = "Get 10% Off Your First Order!",
  description = "Subscribe to our newsletter and receive an exclusive discount code.",
  discountCode = "WELCOME10",
  backgroundImage,
  trigger = "exit-intent",
  triggerValue,
  showOnce = true,
  sessionKey = "newsletter-popup-shown",
  emailPlaceholder = "Enter your email",
  submitButtonText = "Get My Discount",
  successMessage = "Check your inbox for your discount code!",
  onSubmit,
  onClose,
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasTriggeredRef = useRef(false);

  // Mount effect
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Exit Intent Hook (only for exit-intent trigger)
  useExitIntent(
    () => {
      if (trigger === "exit-intent") {
        handleTrigger();
      }
    },
    {
      enabled: trigger === "exit-intent" && !isOpen,
      oncePerSession: showOnce,
      sessionKey: `${sessionKey}-exit-intent`,
    }
  );

  // Handle popup trigger
  const handleTrigger = () => {
    if (hasTriggeredRef.current) return;

    // Check if already shown
    if (showOnce) {
      const wasShown = sessionStorage.getItem(sessionKey);
      if (wasShown === "true") return;
    }

    hasTriggeredRef.current = true;
    setIsOpen(true);

    if (showOnce) {
      sessionStorage.setItem(sessionKey, "true");
    }
  };

  // Time delay trigger
  useEffect(() => {
    if (trigger !== "time-delay") return;
    if (hasTriggeredRef.current) return;

    const delay = triggerValue || 5000;
    const timer = setTimeout(handleTrigger, delay);

    return () => clearTimeout(timer);
  }, [trigger, triggerValue, showOnce, sessionKey]);

  // Scroll depth trigger
  useEffect(() => {
    if (trigger !== "scroll-depth") return;
    if (hasTriggeredRef.current) return;

    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      const threshold = triggerValue || 50;

      if (scrollPercent >= threshold) {
        handleTrigger();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trigger, triggerValue, showOnce, sessionKey]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle close
  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle keyboard (ESC to close)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call custom onSubmit handler if provided
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default: Submit to form action
        const response = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error("Failed to subscribe");
        }
      }

      setIsSuccess(true);
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not mounted or not open
  if (!isMounted || !isOpen) return null;

  const popupContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
      onClick={handleBackdropClick}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 scale-100 opacity-100"
        style={{
          backgroundColor: "var(--background)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
          aria-label="Close popup"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 min-h-[500px]">
          {/* Left Side: Image */}
          <div
            className="relative hidden md:block bg-gradient-to-br from-violet-600 to-cyan-600"
            style={{
              backgroundImage: backgroundImage
                ? `linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(6, 182, 212, 0.8) 100%), url(${backgroundImage})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!backgroundImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Exclusive Offer</h3>
                  <p className="text-lg opacity-90">Just for new subscribers</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            {!isSuccess ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[var(--foreground)]">
                    {title}
                  </h2>
                  <p className="text-lg text-[var(--foreground-muted)]">
                    {description}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder={emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 text-base"
                      disabled={isSubmitting}
                      required
                      autoFocus
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {submitButtonText}
                  </Button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors underline"
                  >
                    No thanks, I'll pay full price
                  </button>
                </form>

                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--foreground-muted)] text-center">
                    By subscribing, you agree to receive marketing emails. You can
                    unsubscribe at any time.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                {/* Success State */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-[var(--foreground)]">
                  Welcome to the Club!
                </h3>
                <p className="text-[var(--foreground-muted)] mb-6">
                  {successMessage}
                </p>

                {/* Discount Code Display */}
                <div className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border-2 border-violet-500/30 mb-6">
                  <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
                    Your Discount Code
                  </p>
                  <p className="text-3xl font-bold text-gradient tracking-wider">
                    {discountCode}
                  </p>
                </div>

                <p className="text-sm text-[var(--foreground-muted)] mb-6">
                  Copy this code and use it at checkout
                </p>

                <Button
                  onClick={handleClose}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Start Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
}

export default NewsletterPopup;
