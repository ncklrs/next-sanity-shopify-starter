"use client";

import { forwardRef, useState, useEffect, type HTMLAttributes } from "react";

interface QuantitySelectorProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const QuantitySelector = forwardRef<HTMLDivElement, QuantitySelectorProps>(
  (
    {
      value = 1,
      onChange,
      min = 1,
      max = 99,
      disabled = false,
      size = "md",
      label,
      className = "",
      ...props
    },
    ref
  ) => {
    const [quantity, setQuantity] = useState(value);
    const [inputValue, setInputValue] = useState(String(value));

    useEffect(() => {
      setQuantity(value);
      setInputValue(String(value));
    }, [value]);

    const handleIncrement = () => {
      if (quantity < max) {
        const newValue = quantity + 1;
        setQuantity(newValue);
        setInputValue(String(newValue));
        onChange?.(newValue);
      }
    };

    const handleDecrement = () => {
      if (quantity > min) {
        const newValue = quantity - 1;
        setQuantity(newValue);
        setInputValue(String(newValue));
        onChange?.(newValue);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);

      // Only update the actual value if it's a valid number
      const numVal = parseInt(val, 10);
      if (!isNaN(numVal)) {
        const clampedValue = Math.max(min, Math.min(max, numVal));
        setQuantity(clampedValue);
      }
    };

    const handleInputBlur = () => {
      // On blur, ensure the input shows a valid number
      const numVal = parseInt(inputValue, 10);
      if (isNaN(numVal) || numVal < min) {
        setQuantity(min);
        setInputValue(String(min));
        onChange?.(min);
      } else if (numVal > max) {
        setQuantity(max);
        setInputValue(String(max));
        onChange?.(max);
      } else {
        setInputValue(String(numVal));
        onChange?.(numVal);
      }
    };

    const sizeClasses = {
      sm: {
        container: "h-8",
        button: "w-8 h-8 text-sm",
        input: "w-10 text-sm",
      },
      md: {
        container: "h-10",
        button: "w-10 h-10 text-base",
        input: "w-12 text-base",
      },
      lg: {
        container: "h-12",
        button: "w-12 h-12 text-lg",
        input: "w-14 text-lg",
      },
    };

    const classes = sizeClasses[size];

    return (
      <div ref={ref} className={className} {...props}>
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            {label}
          </label>
        )}
        <div
          className={`inline-flex items-center border-2 border-[var(--border)] rounded-full overflow-hidden bg-[var(--surface)] transition-colors ${
            disabled ? "opacity-50 cursor-not-allowed" : "hover:border-[var(--foreground-subtle)]"
          } ${classes.container}`}
        >
          {/* Decrement Button */}
          <button
            onClick={handleDecrement}
            disabled={disabled || quantity <= min}
            className={`
              ${classes.button}
              flex items-center justify-center
              text-[var(--foreground)] font-medium
              transition-all duration-200
              hover:bg-[var(--surface-hover)]
              active:scale-90
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            `}
            aria-label="Decrease quantity"
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          {/* Quantity Input */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            disabled={disabled}
            className={`
              ${classes.input}
              text-center font-semibold
              bg-transparent border-none outline-none
              text-[var(--foreground)]
              disabled:cursor-not-allowed
            `}
            aria-label="Quantity"
          />

          {/* Increment Button */}
          <button
            onClick={handleIncrement}
            disabled={disabled || quantity >= max}
            className={`
              ${classes.button}
              flex items-center justify-center
              text-[var(--foreground)] font-medium
              transition-all duration-200
              hover:bg-[var(--surface-hover)]
              active:scale-90
              disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent
            `}
            aria-label="Increase quantity"
            type="button"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);

QuantitySelector.displayName = "QuantitySelector";

export default QuantitySelector;
