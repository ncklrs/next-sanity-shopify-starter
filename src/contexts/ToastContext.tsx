"use client";

/**
 * Toast Context - Simple notification system
 * Provides visual feedback for cart actions and other user interactions
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { CheckIcon, XIcon, ShoppingCartIcon } from "@/components/icons";

// ============================================================================
// Types
// ============================================================================

type ToastType = "success" | "error" | "info" | "cart";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  showCartToast: (message?: string) => void;
}

// ============================================================================
// Context
// ============================================================================

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ============================================================================
// Toast Component
// ============================================================================

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const iconMap = {
    success: <CheckIcon className="w-5 h-5 text-[var(--accent-emerald)]" />,
    error: <XIcon className="w-5 h-5 text-[var(--accent-rose)]" />,
    info: <CheckIcon className="w-5 h-5 text-[var(--accent-cyan)]" />,
    cart: <ShoppingCartIcon className="w-5 h-5 text-[var(--accent-emerald)]" />,
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-lg backdrop-blur-sm animate-slide-up"
      role="alert"
    >
      <div className="flex-shrink-0">{iconMap[toast.type]}</div>
      <p className="text-sm font-medium text-[var(--foreground)]">
        {toast.message}
      </p>
      <button
        onClick={onRemove}
        className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-[var(--surface-elevated)] transition-colors"
        aria-label="Dismiss"
      >
        <XIcon className="w-4 h-4 text-[var(--foreground-muted)]" />
      </button>
    </div>
  );
}

// ============================================================================
// Provider Component
// ============================================================================

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = "info", duration: number = 3000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showCartToast = useCallback(
    (message: string = "Added to cart") => {
      addToast(message, "cart", 2500);
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, showCartToast }}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ============================================================================
// Hook
// ============================================================================

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
