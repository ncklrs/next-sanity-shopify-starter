"use client";

import { CheckIcon } from "@/components/icons";

function getBackgroundStyle(backgroundColor?: string): React.CSSProperties | undefined {
  if (!backgroundColor) return undefined;

  const colorMap: Record<string, string> = {
    white: "var(--background)",
    default: "var(--background)",
    gray: "var(--background-secondary)",
    secondary: "var(--background-secondary)",
    primary: "var(--background-tertiary)",
    tertiary: "var(--background-tertiary)",
    transparent: "transparent",
  };

  const mappedColor = colorMap[backgroundColor.toLowerCase()];
  if (mappedColor) {
    return { backgroundColor: mappedColor };
  }

  return { backgroundColor };
}

interface TrustBadge {
  icon?: string;
  text: string;
  description?: string;
}

interface TrustBadgesProps {
  heading?: string;
  badges: TrustBadge[];
  layout?: "horizontal" | "grid";
  variant?: "default" | "minimal" | "detailed";
  spacing?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
}

// Default trust badges if none provided
const DEFAULT_BADGES: TrustBadge[] = [
  { text: "Free Shipping", description: "On orders over $50" },
  { text: "Secure Checkout", description: "256-bit SSL encryption" },
  { text: "30-Day Returns", description: "Money-back guarantee" },
  { text: "24/7 Support", description: "Always here to help" },
];

export function TrustBadges({
  heading,
  badges = DEFAULT_BADGES,
  layout = "horizontal",
  variant = "default",
  spacing = "md",
  backgroundColor,
}: TrustBadgesProps) {
  const spacingMap = {
    sm: "py-6 px-4",
    md: "py-8 px-6",
    lg: "py-12 px-6",
    xl: "py-16 px-6",
  };

  const renderBadge = (badge: TrustBadge, index: number) => {
    if (variant === "minimal") {
      return (
        <div
          key={index}
          className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]"
        >
          <CheckIcon className="w-4 h-4 text-[var(--accent-emerald)] flex-shrink-0" />
          <span>{badge.text}</span>
        </div>
      );
    }

    if (variant === "detailed") {
      return (
        <div
          key={index}
          className="flex items-start gap-4 p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] transition-colors"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
            {badge.icon ? (
              <span className="text-xl">{badge.icon}</span>
            ) : (
              <CheckIcon className="w-5 h-5 text-[var(--accent-emerald)]" />
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-1">{badge.text}</h3>
            {badge.description && (
              <p className="text-sm text-[var(--foreground-muted)]">{badge.description}</p>
            )}
          </div>
        </div>
      );
    }

    // Default variant
    return (
      <div
        key={index}
        className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] transition-colors"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
          {badge.icon ? (
            <span className="text-lg">{badge.icon}</span>
          ) : (
            <CheckIcon className="w-4 h-4 text-[var(--accent-emerald)]" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{badge.text}</p>
          {badge.description && (
            <p className="text-xs text-[var(--foreground-muted)]">{badge.description}</p>
          )}
        </div>
      </div>
    );
  };

  const layoutClass =
    layout === "grid"
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      : variant === "minimal"
      ? "flex flex-wrap items-center justify-center gap-6"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4";

  return (
    <section
      className={`section ${spacingMap[spacing]}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container mx-auto">
        {heading && (
          <h2 className="heading-lg text-center mb-8">{heading}</h2>
        )}

        <div className={layoutClass}>
          {badges.map((badge, index) => renderBadge(badge, index))}
        </div>
      </div>
    </section>
  );
}

export default TrustBadges;
