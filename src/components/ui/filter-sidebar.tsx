"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface FilterGroup {
  id: string;
  title: string;
  type: "checkbox" | "radio" | "range" | "color";
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  defaultOpen?: boolean;
}

interface FilterGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  group: FilterGroup;
  selectedValues?: string[];
  rangeValue?: [number, number];
  onChange?: (groupId: string, values: string[] | [number, number]) => void;
  collapsible?: boolean;
}

const FilterGroupComponent = forwardRef<HTMLDivElement, FilterGroupProps>(
  (
    {
      group,
      selectedValues = [],
      rangeValue,
      onChange,
      collapsible = true,
      className = "",
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(group.defaultOpen !== false);

    const handleCheckboxChange = (optionId: string) => {
      const newValues = selectedValues.includes(optionId)
        ? selectedValues.filter((id) => id !== optionId)
        : [...selectedValues, optionId];
      onChange?.(group.id, newValues);
    };

    const handleRadioChange = (optionId: string) => {
      onChange?.(group.id, [optionId]);
    };

    const handleRangeChange = (index: 0 | 1, value: number) => {
      const currentRange = rangeValue || [group.min || 0, group.max || 100];
      const newRange: [number, number] =
        index === 0 ? [value, currentRange[1]] : [currentRange[0], value];
      onChange?.(group.id, newRange);
    };

    return (
      <div
        ref={ref}
        className={`border-b border-[var(--border)] ${className}`}
        {...props}
      >
        {/* Group Header */}
        <button
          onClick={() => collapsible && setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between py-4 text-left transition-colors hover:text-[var(--foreground)]"
          disabled={!collapsible}
        >
          <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wide">
            {group.title}
          </h3>
          {collapsible && (
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
          )}
        </button>

        {/* Group Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[500px] pb-4" : "max-h-0"
          }`}
        >
          {/* Checkbox Type */}
          {group.type === "checkbox" && group.options && (
            <div className="space-y-3">
              {group.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 cursor-pointer group ${
                    option.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.id)}
                    onChange={() => !option.disabled && handleCheckboxChange(option.id)}
                    disabled={option.disabled}
                    className="w-4 h-4 rounded border-2 border-[var(--border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-2 focus:ring-offset-[var(--background)] transition-all"
                  />
                  <span className="flex-1 text-sm text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">
                    {option.label}
                  </span>
                  {option.count !== undefined && (
                    <span className="text-xs text-[var(--foreground-subtle)]">
                      ({option.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}

          {/* Radio Type */}
          {group.type === "radio" && group.options && (
            <div className="space-y-3">
              {group.options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 cursor-pointer group ${
                    option.disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name={group.id}
                    checked={selectedValues.includes(option.id)}
                    onChange={() => !option.disabled && handleRadioChange(option.id)}
                    disabled={option.disabled}
                    className="w-4 h-4 border-2 border-[var(--border)] text-[var(--foreground)] focus:ring-2 focus:ring-[var(--foreground)] focus:ring-offset-2 focus:ring-offset-[var(--background)] transition-all"
                  />
                  <span className="flex-1 text-sm text-[var(--foreground-muted)] group-hover:text-[var(--foreground)] transition-colors">
                    {option.label}
                  </span>
                  {option.count !== undefined && (
                    <span className="text-xs text-[var(--foreground-subtle)]">
                      ({option.count})
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}

          {/* Color Type */}
          {group.type === "color" && group.options && (
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const isSelected = selectedValues.includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => !option.disabled && handleCheckboxChange(option.id)}
                    disabled={option.disabled}
                    className={`
                      relative w-8 h-8 rounded-full border-2 transition-all
                      ${
                        isSelected
                          ? "border-[var(--foreground)] ring-2 ring-[var(--foreground)] ring-offset-2 ring-offset-[var(--background)] scale-110"
                          : "border-[var(--border)] hover:border-[var(--foreground-subtle)]"
                      }
                      ${option.disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                    `}
                    style={{ backgroundColor: option.id }}
                    title={option.label}
                    aria-label={option.label}
                  />
                );
              })}
            </div>
          )}

          {/* Range Type */}
          {group.type === "range" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={rangeValue?.[0] ?? group.min ?? 0}
                  onChange={(e) => handleRangeChange(0, Number(e.target.value))}
                  min={group.min}
                  max={group.max}
                  step={group.step}
                  className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                />
                <span className="text-[var(--foreground-subtle)]">—</span>
                <input
                  type="number"
                  value={rangeValue?.[1] ?? group.max ?? 100}
                  onChange={(e) => handleRangeChange(1, Number(e.target.value))}
                  min={group.min}
                  max={group.max}
                  step={group.step}
                  className="w-full px-3 py-2 text-sm bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FilterGroupComponent.displayName = "FilterGroup";

interface FilterSidebarProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  groups: FilterGroup[];
  selectedFilters?: Record<string, string[] | [number, number]>;
  onChange?: (filters: Record<string, string[] | [number, number]>) => void;
  onClearAll?: () => void;
  title?: string;
  showClearButton?: boolean;
  collapsible?: boolean;
  variant?: "sidebar" | "drawer";
}

const FilterSidebar = forwardRef<HTMLDivElement, FilterSidebarProps>(
  (
    {
      groups,
      selectedFilters = {},
      onChange,
      onClearAll,
      title = "Filters",
      showClearButton = true,
      collapsible = true,
      variant = "sidebar",
      className = "",
      ...props
    },
    ref
  ) => {
    const handleFilterChange = (groupId: string, values: string[] | [number, number]) => {
      const newFilters = {
        ...selectedFilters,
        [groupId]: values,
      };
      onChange?.(newFilters);
    };

    const activeFilterCount = Object.values(selectedFilters).reduce((count, values) => {
      if (Array.isArray(values) && values.length > 0) {
        return count + (typeof values[0] === "number" ? 1 : values.length);
      }
      return count;
    }, 0);

    const containerClasses =
      variant === "drawer"
        ? "bg-[var(--background)] h-full flex flex-col"
        : "bg-[var(--surface)] border border-[var(--border)] rounded-2xl";

    return (
      <div ref={ref} className={`${containerClasses} ${className}`} {...props}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--foreground)]">
            {title}
            {activeFilterCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-white bg-[var(--foreground)] rounded-full">
                {activeFilterCount}
              </span>
            )}
          </h2>
          {showClearButton && activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="text-sm font-medium text-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter Groups */}
        <div className={variant === "drawer" ? "flex-1 overflow-y-auto px-6" : "px-6"}>
          {groups.map((group) => (
            <FilterGroupComponent
              key={group.id}
              group={group}
              selectedValues={
                Array.isArray(selectedFilters[group.id])
                  ? (selectedFilters[group.id] as string[])
                  : []
              }
              rangeValue={
                group.type === "range"
                  ? (selectedFilters[group.id] as [number, number])
                  : undefined
              }
              onChange={handleFilterChange}
              collapsible={collapsible}
            />
          ))}
        </div>

        {/* Footer (for drawer variant) */}
        {variant === "drawer" && (
          <div className="p-6 border-t border-[var(--border)]">
            <button
              className="w-full bg-[var(--foreground)] text-[var(--background)] font-semibold py-3 px-6 rounded-full transition-all hover:opacity-90 active:scale-95"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    );
  }
);

FilterSidebar.displayName = "FilterSidebar";

export { FilterGroupComponent as FilterGroup };
export default FilterSidebar;
