"use client";

/**
 * Sheet Component - Push-aside drawer
 * Built on Radix Dialog for accessibility
 * Uses PUSH behavior: main content slides left when sheet opens
 * No overlay - sheet sits beside content
 */

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================================================
// Sheet Root - Custom wrapper to handle push behavior
// ============================================================================

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined);

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}

const Sheet = ({ children, open: controlledOpen, onOpenChange, defaultOpen = false }: SheetProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isControlled, onOpenChange]);

  // Set data attribute for CSS targeting (push layout)
  // No body scroll lock - content remains scrollable since this is push, not overlay
  React.useEffect(() => {
    if (open) {
      document.documentElement.setAttribute("data-sheet-open", "true");
    } else {
      document.documentElement.removeAttribute("data-sheet-open");
    }
  }, [open]);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {/* modal={false} allows interaction with content outside the sheet (push layout) */}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
        {children}
      </DialogPrimitive.Root>
    </SheetContext.Provider>
  );
};

const SheetTrigger = DialogPrimitive.Trigger;

const SheetClose = DialogPrimitive.Close;

const SheetPortal = DialogPrimitive.Portal;

// ============================================================================
// Sheet Content Variants
// ============================================================================

const sheetVariants = cva(
  // Base styles: fixed, z-9999 (always on top), solid background
  "fixed z-[9999] gap-4 bg-[var(--color-bg-primary)] shadow-lg border-l border-[var(--color-border-primary)]",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-l-0 data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0 transition-transform duration-300 ease-out",
        bottom:
          "inset-x-0 bottom-0 border-t border-l-0 data-[state=closed]:translate-y-full data-[state=open]:translate-y-0 transition-transform duration-300 ease-out",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-l-0 sm:max-w-sm data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 transition-transform duration-300 ease-out",
        right:
          "inset-y-0 right-0 h-full w-full sm:w-[420px] data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 transition-transform duration-300 ease-out",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

// ============================================================================
// Sheet Content - No overlay, just the panel
// ============================================================================

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  /** Whether to show the close button */
  showClose?: boolean;
}

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      side = "right",
      className,
      children,
      showClose = true,
      ...props
    },
    ref
  ) => (
    <SheetPortal>
      {/* No overlay - we want push behavior, not modal overlay */}
      <DialogPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        // Prevent closing when clicking outside since there's no overlay
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            className="absolute right-4 top-4 rounded-full p-2 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 disabled:pointer-events-none z-10"
            aria-label="Close panel"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = DialogPrimitive.Content.displayName;

// ============================================================================
// Sheet Header
// ============================================================================

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 px-5 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

// ============================================================================
// Sheet Footer
// ============================================================================

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 border-t border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

// ============================================================================
// Sheet Title
// ============================================================================

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-serif text-lg font-medium tracking-tight text-[var(--color-text-primary)]",
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

// ============================================================================
// Sheet Description
// ============================================================================

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[var(--color-text-secondary)]", className)}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

// ============================================================================
// Exports
// ============================================================================

export {
  Sheet,
  SheetPortal,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
