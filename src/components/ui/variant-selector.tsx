"use client";

import { forwardRef, type HTMLAttributes } from "react";

export interface VariantOption {
  id: string;
  name: string;
  value: string;
  color?: string;
  inStock: boolean;
  disabled?: boolean;
}

interface ColorSwatchesProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: VariantOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const ColorSwatches = forwardRef<HTMLDivElement, ColorSwatchesProps>(
  ({ options, value, onChange, label, size = "md", className = "", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-10 h-10",
    };

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
            {label}
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = value === option.id;
            const isDisabled = option.disabled || !option.inStock;

            return (
              <button
                key={option.id}
                onClick={() => !isDisabled && onChange?.(option.id)}
                disabled={isDisabled}
                className={`
                  relative ${sizeClasses[size]} rounded-full
                  border-2 transition-all duration-200
                  ${isSelected
                    ? "border-[var(--foreground)] ring-2 ring-[var(--foreground)] ring-offset-2 ring-offset-[var(--background)] scale-110"
                    : "border-[var(--border)] hover:border-[var(--foreground-subtle)]"
                  }
                  ${isDisabled
                    ? "opacity-30 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
                  }
                `}
                style={{
                  backgroundColor: option.color || "#e5e5e5",
                }}
                title={`${option.name}${!option.inStock ? " (Out of stock)" : ""}`}
                aria-label={`Select ${option.name}`}
                aria-pressed={isSelected}
              >
                {/* Out of stock diagonal line */}
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-[var(--foreground-subtle)] rotate-45" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

ColorSwatches.displayName = "ColorSwatches";

interface SizePillsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  options: VariantOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  variant?: "default" | "minimal";
}

export const SizePills = forwardRef<HTMLDivElement, SizePillsProps>(
  ({ options, value, onChange, label, variant = "default", className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)] mb-3">
            {label}
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = value === option.id;
            const isDisabled = option.disabled || !option.inStock;

            return (
              <button
                key={option.id}
                onClick={() => !isDisabled && onChange?.(option.id)}
                disabled={isDisabled}
                className={`
                  relative min-w-[3rem] px-4 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${
                    variant === "minimal"
                      ? isSelected
                        ? "bg-[var(--foreground)] text-[var(--background)] border-2 border-[var(--foreground)]"
                        : "bg-transparent text-[var(--foreground)] border-2 border-[var(--border)] hover:border-[var(--foreground-subtle)]"
                      : isSelected
                      ? "bg-[var(--foreground)] text-[var(--background)] border-2 border-[var(--foreground)] shadow-md scale-105"
                      : "bg-[var(--surface)] text-[var(--foreground)] border-2 border-[var(--border)] hover:border-[var(--foreground-subtle)] hover:bg-[var(--surface-hover)]"
                  }
                  ${
                    isDisabled
                      ? "opacity-30 cursor-not-allowed"
                      : "cursor-pointer active:scale-95"
                  }
                `}
                aria-label={`Select size ${option.name}`}
                aria-pressed={isSelected}
              >
                <span className={isDisabled ? "line-through" : ""}>{option.value}</span>
                {!option.inStock && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--error)] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

SizePills.displayName = "SizePills";

interface VariantSelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  colorOptions?: VariantOption[];
  sizeOptions?: VariantOption[];
  selectedColor?: string;
  selectedSize?: string;
  onColorChange?: (value: string) => void;
  onSizeChange?: (value: string) => void;
  colorLabel?: string;
  sizeLabel?: string;
  swatchSize?: "sm" | "md" | "lg";
  pillVariant?: "default" | "minimal";
}

const VariantSelector = forwardRef<HTMLDivElement, VariantSelectorProps>(
  (
    {
      colorOptions,
      sizeOptions,
      selectedColor,
      selectedSize,
      onColorChange,
      onSizeChange,
      colorLabel = "Color",
      sizeLabel = "Size",
      swatchSize = "md",
      pillVariant = "default",
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`space-y-6 ${className}`} {...props}>
        {colorOptions && colorOptions.length > 0 && (
          <ColorSwatches
            options={colorOptions}
            value={selectedColor}
            onChange={onColorChange}
            label={colorLabel}
            size={swatchSize}
          />
        )}
        {sizeOptions && sizeOptions.length > 0 && (
          <SizePills
            options={sizeOptions}
            value={selectedSize}
            onChange={onSizeChange}
            label={sizeLabel}
            variant={pillVariant}
          />
        )}
      </div>
    );
  }
);

VariantSelector.displayName = "VariantSelector";

export default VariantSelector;
