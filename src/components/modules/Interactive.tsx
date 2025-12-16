"use client";

import { useState, useCallback, useRef } from "react";
import { PortableText } from "@portabletext/react";
import { ChevronRightIcon } from "@/components/icons";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface PortableTextBlock {
  _type: string;
  children?: any[];
  [key: string]: any;
}

interface SanityImage {
  asset: {
    _ref: string;
    _type: string;
  };
  alt?: string;
  hotspot?: any;
}

interface TabItem {
  _key?: string;
  label: string;
  icon?: string;
  content?: PortableTextBlock[];
  image?: SanityImage;
}

interface AccordionItem {
  title: string;
  content?: PortableTextBlock[];
  defaultOpen?: boolean;
}

interface StepItem {
  title: string;
  description?: string;
  icon?: string;
  image?: SanityImage;
}

interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  image?: SanityImage;
  link?: {
    url: string;
    label: string;
  };
}

export interface TabsProps {
  title?: string;
  subtitle?: string;
  tabs: TabItem[];
  variant?: "default" | "pills" | "underline" | "vertical";
  defaultTab?: number;
  backgroundColor?: string;
  className?: string;
}

export interface AccordionProps {
  title?: string;
  subtitle?: string;
  items: AccordionItem[];
  allowMultiple?: boolean;
  variant?: "default" | "bordered" | "separated";
  backgroundColor?: string;
  className?: string;
}

export interface StepsProps {
  title?: string;
  subtitle?: string;
  steps: StepItem[];
  variant?: "numbered" | "icons" | "timeline" | "cards";
  orientation?: "horizontal" | "vertical";
  backgroundColor?: string;
  className?: string;
}

export interface TimelineProps {
  title?: string;
  subtitle?: string;
  events?: TimelineEvent[];
  // Sanity field names
  badge?: string;
  heading?: string;
  headingHighlight?: string;
  subheading?: string;
  items?: TimelineEvent[];
  spacing?: string;
  variant?: "default" | "alternating" | "compact";
  orientation?: "vertical" | "horizontal";
  backgroundColor?: string;
  className?: string;
}

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

const SectionHeader = ({
  title,
  subtitle,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  className?: string;
}) => {
  if (!title && !subtitle) return null;

  return (
    <div className={`section-header ${className}`}>
      {title && <h2 className="display-lg mb-4">{title}</h2>}
      {subtitle && <p className="body-lg">{subtitle}</p>}
    </div>
  );
};

// PortableText components for rendering rich content
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-[var(--foreground-muted)] leading-relaxed mb-4">{children}</p>
    ),
    h3: ({ children }: any) => (
      <h3 className="heading-md mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="heading-sm mt-4 mb-2">{children}</h4>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        className="text-[var(--gold)] hover:text-[var(--gold-dark)] transition-colors underline"
        target={value.blank ? "_blank" : undefined}
        rel={value.blank ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-[var(--foreground)]">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-[var(--foreground-muted)]">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-[var(--foreground-muted)]">{children}</ol>
    ),
  },
};

// Simple icon renderer (you can extend this based on your icon system)
const renderIcon = (iconName?: string) => {
  if (!iconName) return null;

  // For now, return a placeholder circle with the icon name
  // In production, you'd map icon names to actual icon components
  return (
    <div className="w-6 h-6 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-xs text-[var(--gold-dark)] font-medium">
      {iconName.charAt(0).toUpperCase()}
    </div>
  );
};

const getBackgroundStyle = (backgroundColor?: string) => {
  switch (backgroundColor) {
    case "muted":
      return { backgroundColor: "var(--background-warm)" };
    case "accent":
      return { backgroundColor: "var(--background-cream)" };
    default:
      return undefined;
  }
};

// ============================================================================
// TABS COMPONENT
// ============================================================================

export function Tabs({
  title,
  subtitle,
  tabs,
  variant = "default",
  defaultTab = 0,
  backgroundColor,
  className = "",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isVertical = variant === "vertical";

  // Keyboard navigation scoped to tablist focus
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isHorizontalNav = !isVertical;
      const prevKey = isHorizontalNav ? "ArrowLeft" : "ArrowUp";
      const nextKey = isHorizontalNav ? "ArrowRight" : "ArrowDown";

      if (e.key === nextKey) {
        e.preventDefault();
        const nextIndex = (activeTab + 1) % tabs.length;
        setActiveTab(nextIndex);
        tabRefs.current[nextIndex]?.focus();
      } else if (e.key === prevKey) {
        e.preventDefault();
        const prevIndex = (activeTab - 1 + tabs.length) % tabs.length;
        setActiveTab(prevIndex);
        tabRefs.current[prevIndex]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveTab(0);
        tabRefs.current[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const lastIndex = tabs.length - 1;
        setActiveTab(lastIndex);
        tabRefs.current[lastIndex]?.focus();
      }
    },
    [activeTab, tabs.length, isVertical]
  );

  const getTabButtonClass = (index: number) => {
    const isActive = activeTab === index;
    const baseClass =
      "transition-all duration-[var(--transition-base)] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

    switch (variant) {
      case "pills":
        return `${baseClass} px-6 py-3 rounded-full ${
          isActive
            ? "bg-[var(--gold)] text-white shadow-lg shadow-[var(--gold)]/30"
            : "bg-[var(--surface)] text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)]"
        }`;
      case "underline":
        return `${baseClass} px-4 py-3 border-b-2 ${
          isActive
            ? "border-[var(--gold)] text-[var(--foreground)]"
            : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)]"
        }`;
      case "vertical":
        return `${baseClass} px-6 py-4 rounded-lg text-left w-full ${
          isActive
            ? "bg-[var(--gold)]/10 text-[var(--foreground)] border-l-2 border-[var(--gold)]"
            : "bg-[var(--surface)] text-[var(--foreground-muted)] border-l-2 border-transparent hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
        }`;
      default:
        return `${baseClass} px-6 py-3 rounded-lg ${
          isActive
            ? "bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--border-hover)]"
            : "bg-transparent text-[var(--foreground-muted)] border border-[var(--border)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] hover:border-[var(--border-hover)]"
        }`;
    }
  };

  const currentTab = tabs[activeTab];

  return (
    <section
      className={`section ${className}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container">
        <SectionHeader title={title} subtitle={subtitle} />

        <div
          className={`grid ${isVertical ? "md:grid-cols-[280px_1fr] gap-8" : "gap-8"}`}
        >
          {/* Tab Buttons */}
          <div
            ref={tablistRef}
            className={`flex ${isVertical ? "flex-col" : "flex-wrap"} ${
              variant === "underline"
                ? "border-b border-[var(--border)]"
                : "gap-2"
            } ${!isVertical ? "justify-center" : ""}`}
            role="tablist"
            aria-orientation={isVertical ? "vertical" : "horizontal"}
            onKeyDown={handleKeyDown}
          >
            {tabs.map((tab, index) => (
              <button
                key={tab._key || index}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => setActiveTab(index)}
                className={getTabButtonClass(index)}
                role="tab"
                aria-selected={activeTab === index}
                aria-controls={`tab-panel-${index}`}
                id={`tab-${index}`}
                tabIndex={activeTab === index ? 0 : -1}
              >
                <span className="flex items-center gap-2">
                  {tab.icon && renderIcon(tab.icon)}
                  <span>{tab.label}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div
            id={`tab-panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
            className="min-h-[280px] focus:outline-none"
          >
            <div key={activeTab} className="animate-fade-in">
              {currentTab.image && (
                <div className="relative aspect-video mb-6 rounded-xl overflow-hidden border border-[var(--border)]">
                  <Image
                    src={urlFor(currentTab.image).width(1200).height(675).url()}
                    alt={currentTab.image.alt || currentTab.label}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {currentTab.content && (
                <div className="prose-dark">
                  <PortableText
                    value={currentTab.content}
                    components={portableTextComponents}
                  />
                </div>
              )}

              {!currentTab.image && !currentTab.content && (
                <div className="flex items-center justify-center h-[280px] text-[var(--foreground-muted)] border border-dashed border-[var(--border)] rounded-xl">
                  <p>No content for this tab</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ACCORDION COMPONENT
// ============================================================================

export function Accordion({
  title,
  subtitle,
  items,
  allowMultiple = false,
  variant = "default",
  backgroundColor,
  className = "",
}: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    return items
      .map((item, index) => (item.defaultOpen ? index : -1))
      .filter((index) => index !== -1);
  });

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  const isOpen = (index: number) => openIndices.includes(index);

  const getItemClass = () => {
    switch (variant) {
      case "bordered":
        return "bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-white/20";
      case "separated":
        return "bg-transparent border-none";
      default:
        return "bg-white/5 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-white/20";
    }
  };

  const spacing = variant === "separated" ? "space-y-6" : "space-y-4";

  return (
    <section
      className={`section ${className}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title={title} subtitle={subtitle} />

          <div className={spacing}>
            {items.map((item, index) => (
              <div key={index} className={getItemClass()}>
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-200 ${
                    variant === "separated"
                      ? "bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/20"
                      : "hover:bg-white/5"
                  }`}
                  aria-expanded={isOpen(index)}
                >
                  <span className="text-lg font-semibold text-white pr-4">
                    {item.title}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen(index) ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen(index)
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  style={{ overflow: "hidden" }}
                >
                  <div
                    className={`px-6 pb-4 pt-2 ${
                      variant === "separated"
                        ? "bg-white/5 border border-t-0 border-white/10 rounded-b-lg"
                        : ""
                    }`}
                  >
                    {item.content && (
                      <div className="prose-dark">
                        <PortableText
                          value={item.content}
                          components={portableTextComponents}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STEPS COMPONENT
// ============================================================================

export function Steps({
  title,
  subtitle,
  steps,
  variant = "numbered",
  orientation = "horizontal",
  backgroundColor,
  className = "",
}: StepsProps) {
  const isHorizontal = orientation === "horizontal";
  const isCards = variant === "cards";

  const renderStepIndicator = (index: number, step: StepItem) => {
    switch (variant) {
      case "icons":
        return (
          <div className="w-12 h-12 rounded-full bg-[var(--gold-light)] border-2 border-[var(--gold)] flex items-center justify-center flex-shrink-0">
            {renderIcon(step.icon)}
          </div>
        );
      case "timeline":
        return (
          <div className="relative flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-[var(--gold)] border-4 border-[var(--background)]" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-[var(--foreground)] flex items-center justify-center text-[var(--background)] text-xl font-bold flex-shrink-0 shadow-lg shadow-[var(--foreground)]/20">
            {index + 1}
          </div>
        );
    }
  };

  const renderConnector = (index: number) => {
    if (index === steps.length - 1) return null;

    if (variant === "timeline") {
      return isHorizontal ? (
        <div className="flex-1 h-0.5 bg-[var(--border-medium)] mx-4" />
      ) : (
        <div className="w-0.5 h-12 bg-[var(--border-medium)] mx-auto" />
      );
    }

    return isHorizontal ? (
      <div className="flex-1 h-0.5 bg-[var(--border-light)] mx-4 mt-6" />
    ) : (
      <div className="w-0.5 h-12 bg-[var(--border-light)] mx-auto" />
    );
  };

  return (
    <section
      className={`section ${className}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container">
        <SectionHeader title={title} subtitle={subtitle} />

        <div
          className={`${
            isHorizontal && !isCards
              ? "flex items-start"
              : isCards
              ? `grid gap-6 ${isHorizontal ? "md:grid-cols-2 lg:grid-cols-3" : "max-w-2xl mx-auto"}`
              : "space-y-8 max-w-2xl mx-auto"
          }`}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${
                isHorizontal && !isCards ? "flex-1" : ""
              } ${isCards ? "" : "flex items-start gap-4"} ${
                !isHorizontal && !isCards && variant === "timeline"
                  ? "relative pl-8"
                  : ""
              }`}
            >
              {!isHorizontal &&
                !isCards &&
                variant === "timeline" &&
                index !== steps.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-[var(--border-medium)]" />
                )}

              {isCards ? (
                <div className="feature-card h-full">
                  <div className="mb-4">{renderStepIndicator(index, step)}</div>
                  {step.image && (
                    <div className="relative aspect-video mb-4 rounded-lg overflow-hidden border border-white/10">
                      <Image
                        src={urlFor(step.image).width(600).height(400).url()}
                        alt={step.image.alt || step.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="heading-md mb-2 text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="body-md">{step.description}</p>
                  )}
                </div>
              ) : (
                <>
                  {renderStepIndicator(index, step)}
                  <div className="flex-1">
                    <h3 className="heading-md mb-2 text-[var(--foreground)]">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="body-md">{step.description}</p>
                    )}
                    {step.image && (
                      <div className="relative aspect-video mt-4 rounded-lg overflow-hidden border border-white/10">
                        <Image
                          src={urlFor(step.image).width(600).height(400).url()}
                          alt={step.image.alt || step.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                  {isHorizontal && renderConnector(index)}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TIMELINE COMPONENT
// ============================================================================

export function Timeline({
  title,
  subtitle,
  events,
  // Sanity fields
  heading,
  subheading,
  items,
  variant = "default",
  orientation = "vertical",
  backgroundColor,
  className = "",
}: TimelineProps) {
  // Use Sanity fields as fallbacks
  const displayTitle = title || heading;
  const displaySubtitle = subtitle || subheading;
  const displayEvents = events || items || [];

  const isVertical = orientation === "vertical";
  const isAlternating = variant === "alternating" && isVertical;
  const isCompact = variant === "compact";

  return (
    <section
      className={`section ${className}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container">
        <SectionHeader title={displayTitle} subtitle={displaySubtitle} />

        <div
          className={`${
            isVertical
              ? "max-w-4xl mx-auto"
              : "flex overflow-x-auto pb-4 gap-8 -mx-4 px-4"
          }`}
        >
          {isVertical ? (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-[var(--border-medium)]" />

              {displayEvents.map((event, index) => {
                const isLeft = isAlternating && index % 2 === 0;
                const isRight = isAlternating && index % 2 === 1;

                return (
                  <div
                    key={index}
                    className={`relative mb-12 last:mb-0 ${
                      isAlternating
                        ? `md:flex ${isRight ? "md:flex-row-reverse" : ""}`
                        : "flex items-start"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute ${
                        isAlternating
                          ? "left-[11px] md:left-1/2 md:-translate-x-1/2"
                          : "left-[11px]"
                      } w-2 h-2 rounded-full bg-[var(--background)] border-4 border-[var(--gold)] z-10`}
                    />

                    {/* Date badge */}
                    <div
                      className={`${
                        isAlternating
                          ? "ml-12 md:ml-0 md:w-1/2 md:pr-12 mb-4 md:mb-0 md:text-right"
                          : "ml-12"
                      } ${isRight && isAlternating ? "md:pl-12 md:text-left" : ""}`}
                    >
                      <span
                        className={`inline-block px-4 py-1.5 bg-[var(--gold-light)] border border-[var(--gold)]/40 text-[var(--gold-dark)] text-sm font-semibold ${
                          isCompact ? "mb-2" : "mb-4"
                        }`}
                      >
                        {event.date}
                      </span>
                    </div>

                    {/* Event content */}
                    <div
                      className={`${
                        isAlternating
                          ? "ml-12 md:ml-0 md:w-1/2 md:pl-12"
                          : "ml-12 flex-1"
                      } ${isRight && isAlternating ? "md:pr-12 md:pl-0" : ""}`}
                    >
                      <div
                        className={`${
                          isCompact
                            ? "bg-transparent"
                            : "bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        }`}
                      >
                        {event.image && !isCompact && (
                          <div className="relative aspect-video mb-4 rounded-lg overflow-hidden border border-white/10">
                            <Image
                              src={urlFor(event.image).width(800).height(450).url()}
                              alt={event.image.alt || event.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <h3
                          className={`${
                            isCompact ? "heading-sm" : "heading-md"
                          } mb-2 text-[var(--foreground)]`}
                        >
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="body-md mb-4">{event.description}</p>
                        )}
                        {event.link && (
                          <a
                            href={event.link.url}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-dark)] transition-colors"
                          >
                            {event.link.label}
                            <ChevronRightIcon className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Horizontal timeline
            <div className="relative flex items-start gap-8 min-w-max">
              {/* Horizontal timeline line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-[var(--border-medium)]" />

              {displayEvents.map((event, index) => (
                <div key={index} className="relative w-72 flex-shrink-0">
                  {/* Timeline dot */}
                  <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[var(--background)] border-4 border-[var(--gold)] z-10" />

                  {/* Date badge */}
                  <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-[var(--gold-light)] border border-[var(--gold)]/40 text-[var(--gold-dark)] text-sm font-semibold">
                      {event.date}
                    </span>
                  </div>

                  {/* Event content */}
                  <div
                    className={`${
                      isCompact
                        ? "bg-transparent"
                        : "bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    }`}
                  >
                    {event.image && !isCompact && (
                      <div className="relative aspect-video mb-4 rounded-lg overflow-hidden border border-white/10">
                        <Image
                          src={urlFor(event.image).width(600).height(400).url()}
                          alt={event.image.alt || event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3
                      className={`${
                        isCompact ? "heading-sm" : "heading-md"
                      } mb-2 text-[var(--foreground)]`}
                    >
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="body-md mb-4">{event.description}</p>
                    )}
                    {event.link && (
                      <a
                        href={event.link.url}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-dark)] transition-colors"
                      >
                        {event.link.label}
                        <ChevronRightIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  Tabs,
  Accordion,
  Steps,
  Timeline,
};
