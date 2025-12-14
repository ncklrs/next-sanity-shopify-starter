"use client";

import { useEffect, useRef, useCallback } from "react";

interface UseExitIntentOptions {
  /**
   * Enable exit intent detection
   * @default true
   */
  enabled?: boolean;

  /**
   * Sensitivity threshold for mouse position (pixels from top)
   * @default 10
   */
  sensitivity?: number;

  /**
   * Delay before exit intent can trigger again (ms)
   * @default 1000
   */
  delay?: number;

  /**
   * Only trigger once per session
   * @default true
   */
  oncePerSession?: boolean;

  /**
   * Session storage key for tracking
   * @default "exit-intent-triggered"
   */
  sessionKey?: string;

  /**
   * Enable mobile detection (visibility change)
   * @default true
   */
  enableMobile?: boolean;
}

/**
 * Hook for detecting exit intent behavior
 *
 * Desktop: Detects mouse leaving viewport from top
 * Mobile: Detects visibility change (tab switch/back button)
 *
 * @example
 * ```tsx
 * useExitIntent({
 *   enabled: true,
 *   oncePerSession: true,
 *   onExitIntent: () => {
 *     setShowPopup(true);
 *   }
 * });
 * ```
 */
export function useExitIntent(
  onExitIntent: () => void,
  options: UseExitIntentOptions = {}
) {
  const {
    enabled = true,
    sensitivity = 10,
    delay = 1000,
    oncePerSession = true,
    sessionKey = "exit-intent-triggered",
    enableMobile = true,
  } = options;

  const hasTriggeredRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggerRef = useRef<number>(0);

  const handleExitIntent = useCallback(() => {
    // Check if already triggered in this session
    if (oncePerSession) {
      const triggered = sessionStorage.getItem(sessionKey);
      if (triggered === "true") return;
    }

    // Check if we're within the delay period
    const now = Date.now();
    if (now - lastTriggerRef.current < delay) return;

    // Check if already triggered this mount
    if (hasTriggeredRef.current) return;

    // Mark as triggered
    hasTriggeredRef.current = true;
    lastTriggerRef.current = now;

    if (oncePerSession) {
      sessionStorage.setItem(sessionKey, "true");
    }

    // Execute callback
    onExitIntent();
  }, [onExitIntent, oncePerSession, sessionKey, delay]);

  useEffect(() => {
    if (!enabled) return;

    // Check if already triggered in session
    if (oncePerSession && sessionStorage.getItem(sessionKey) === "true") {
      return;
    }

    // Desktop: Mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from the top of the viewport
      if (e.clientY <= sensitivity) {
        handleExitIntent();
      }
    };

    // Mobile: Visibility change detection
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleExitIntent();
      }
    };

    // Mobile: Page hide event (back button, tab close)
    const handlePageHide = () => {
      handleExitIntent();
    };

    // Add event listeners
    document.addEventListener("mouseleave", handleMouseLeave);

    if (enableMobile) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("pagehide", handlePageHide);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, sensitivity, handleExitIntent, oncePerSession, sessionKey, enableMobile]);

  // Return method to reset the trigger state
  const reset = useCallback(() => {
    hasTriggeredRef.current = false;
    if (oncePerSession) {
      sessionStorage.removeItem(sessionKey);
    }
  }, [oncePerSession, sessionKey]);

  return { reset };
}
