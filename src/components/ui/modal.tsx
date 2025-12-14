"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal compound components must be used within Modal");
  }
  return context;
};

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-root">{children}</div>
    </ModalContext.Provider>,
    document.body
  );
};

interface ModalBackdropProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const ModalBackdrop = forwardRef<HTMLDivElement, ModalBackdropProps>(
  ({ children, className = "", onClick, ...props }, ref) => {
    const { onClose } = useModalContext();

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
        onClick?.(event);
      }
    };

    return (
      <div
        ref={ref}
        className={`modal-backdrop ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalBackdrop.displayName = "ModalBackdrop";

interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ children, size = "md", className = "", ...props }, ref) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const combinedRef = (ref as any) || modalRef;

    useEffect(() => {
      const focusableElements = combinedRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }, [combinedRef]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = combinedRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const sizeStyles: Record<string, string> = {
      sm: "modal-content-sm",
      md: "modal-content-md",
      lg: "modal-content-lg",
      xl: "modal-content-xl",
      full: "modal-content-full",
    };

    return (
      <div
        ref={combinedRef}
        className={`modal-content ${sizeStyles[size]} ${className}`}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalContent.displayName = "ModalContent";

interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`modal-header ${className}`} {...props}>
      {children}
    </div>
  )
);

ModalHeader.displayName = "ModalHeader";

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ children, as: Component = "h2", className = "", ...props }, ref) => (
    <Component ref={ref} className={`modal-title ${className}`} {...props}>
      {children}
    </Component>
  )
);

ModalTitle.displayName = "ModalTitle";

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`modal-body ${className}`} {...props}>
      {children}
    </div>
  )
);

ModalBody.displayName = "ModalBody";

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`modal-footer ${className}`} {...props}>
      {children}
    </div>
  )
);

ModalFooter.displayName = "ModalFooter";

interface ModalCloseButtonProps extends HTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ModalCloseButton = forwardRef<HTMLButtonElement, ModalCloseButtonProps>(
  ({ className = "", ...props }, ref) => {
    const { onClose } = useModalContext();

    return (
      <button
        ref={ref}
        type="button"
        className={`modal-close ${className}`}
        onClick={onClose}
        aria-label="Close modal"
        {...props}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15M5 5L15 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }
);

ModalCloseButton.displayName = "ModalCloseButton";
