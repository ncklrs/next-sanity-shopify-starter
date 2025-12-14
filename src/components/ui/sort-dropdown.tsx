"use client";

import { forwardRef, useState, useRef, useEffect, type HTMLAttributes } from "react";

export interface SortOption {
  id: string;
  label: string;
  value: string;
}

interface SortDropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal";
  align?: "left" | "right";
}

const SortDropdown = forwardRef<HTMLDivElement, SortDropdownProps>(
  (
    {
      options,
      value,
      onChange,
      label = "Sort by",
      placeholder = "Select...",
      size = "md",
      variant = "default",
      align = "left",
      className = "",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.id === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (optionId: string) => {
      onChange?.(optionId);
      setIsOpen(false);
    };

    const sizeClasses = {
      sm: {
        button: "text-sm px-3 py-1.5",
        menu: "text-sm",
      },
      md: {
        button: "text-base px-4 py-2.5",
        menu: "text-sm",
      },
      lg: {
        button: "text-lg px-5 py-3",
        menu: "text-base",
      },
    };

    const classes = sizeClasses[size];

    const buttonClasses =
      variant === "minimal"
        ? `inline-flex items-center gap-2 font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors ${classes.button}`
        : `inline-flex items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-full transition-all hover:border-[var(--foreground-subtle)] hover:bg-[var(--surface-hover)] ${classes.button}`;

    const menuAlignClass = align === "right" ? "right-0" : "left-0";

    return (
      <div ref={ref} className={`relative ${className}`} {...props}>
        {/* Dropdown Button */}
        <div ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={buttonClasses}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className="flex items-center gap-2">
              {variant === "default" && label && (
                <span className="text-[var(--foreground-subtle)]">{label}:</span>
              )}
              <span className="font-semibold text-[var(--foreground)]">
                {selectedOption?.label || placeholder}
              </span>
            </span>
            <svg
              className={`w-5 h-5 text-[var(--foreground-subtle)] transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div
              className={`absolute ${menuAlignClass} mt-2 w-56 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-xl overflow-hidden z-50 animate-scale-in`}
              role="listbox"
            >
              <div className="py-2">
                {options.map((option, index) => {
                  const isSelected = value === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      className={`
                        w-full flex items-center justify-between px-4 py-2.5 ${classes.menu}
                        transition-colors text-left
                        ${
                          isSelected
                            ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-semibold"
                            : "text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                        }
                        ${index > 0 ? "border-t border-[var(--border)]/50" : ""}
                      `}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <svg
                          className="w-5 h-5 text-[var(--accent-emerald)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

SortDropdown.displayName = "SortDropdown";

interface SortBarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  resultCount?: number;
  label?: string;
  showCount?: boolean;
}

export const SortBar = forwardRef<HTMLDivElement, SortBarProps>(
  (
    {
      options,
      value,
      onChange,
      resultCount,
      label = "Sort",
      showCount = true,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-between gap-4 flex-wrap ${className}`}
        {...props}
      >
        {/* Result Count */}
        {showCount && resultCount !== undefined && (
          <p className="text-sm text-[var(--foreground-muted)]">
            <span className="font-semibold text-[var(--foreground)]">{resultCount}</span>{" "}
            {resultCount === 1 ? "product" : "products"}
          </p>
        )}

        {/* Sort Dropdown */}
        <SortDropdown
          options={options}
          value={value}
          onChange={onChange}
          label={label}
          size="sm"
          variant="minimal"
          align="right"
        />
      </div>
    );
  }
);

SortBar.displayName = "SortBar";

interface QuickSortProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: SortOption[];
  value?: string;
  onChange?: (value: string) => void;
  variant?: "pills" | "buttons";
}

export const QuickSort = forwardRef<HTMLDivElement, QuickSortProps>(
  (
    {
      options,
      value,
      onChange,
      variant = "pills",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseButtonClass =
      variant === "pills"
        ? "px-4 py-2 text-sm font-medium rounded-full transition-all"
        : "px-3 py-1.5 text-xs font-medium rounded-lg transition-all";

    return (
      <div
        ref={ref}
        className={`flex items-center gap-2 flex-wrap ${className}`}
        {...props}
      >
        {options.map((option) => {
          const isSelected = value === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange?.(option.id)}
              className={`
                ${baseButtonClass}
                ${
                  isSelected
                    ? "bg-[var(--foreground)] text-[var(--background)] shadow-md"
                    : "bg-[var(--surface)] text-[var(--foreground-muted)] border border-[var(--border)] hover:border-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }
);

QuickSort.displayName = "QuickSort";

export default SortDropdown;
