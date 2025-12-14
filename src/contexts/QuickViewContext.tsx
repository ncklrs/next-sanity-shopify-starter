"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface QuickViewContextType {
  isOpen: boolean;
  currentProductHandle: string | null;
  openQuickView: (productHandle: string) => void;
  closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentProductHandle, setCurrentProductHandle] = useState<string | null>(null);

  const openQuickView = useCallback((productHandle: string) => {
    // Prevent opening multiple modals - close any existing first
    if (isOpen) {
      setIsOpen(false);
      setCurrentProductHandle(null);
      // Small delay to allow close animation before reopening
      setTimeout(() => {
        setCurrentProductHandle(productHandle);
        setIsOpen(true);
      }, 150);
    } else {
      setCurrentProductHandle(productHandle);
      setIsOpen(true);
    }
  }, [isOpen]);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
    // Clear the product handle after animation completes
    setTimeout(() => {
      setCurrentProductHandle(null);
    }, 300);
  }, []);

  return (
    <QuickViewContext.Provider
      value={{
        isOpen,
        currentProductHandle,
        openQuickView,
        closeQuickView,
      }}
    >
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const context = useContext(QuickViewContext);
  if (context === undefined) {
    throw new Error("useQuickView must be used within a QuickViewProvider");
  }
  return context;
}
