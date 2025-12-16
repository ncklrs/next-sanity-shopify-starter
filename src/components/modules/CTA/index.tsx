"use client";

import { type ReactNode, type FormEvent } from "react";
import Button from "@/components/ui/Button";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface BaseButtonConfig {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

interface BaseSpacing {
  removeTopSpacing?: boolean;
  removeBottomSpacing?: boolean;
}

type BackgroundColor = "default" | "gradient" | "transparent" | "secondary";

// ============================================================================
// CTA DEFAULT
// ============================================================================

export interface CTADefaultProps extends BaseSpacing {
  heading: string;
  headingGradient?: string; // Word or phrase to highlight with gradient
  subheading?: string;
  buttons?: BaseButtonConfig[];
  note?: string;
  backgroundColor?: BackgroundColor;
}

export function CTADefault({
  heading,
  headingGradient,
  subheading,
  buttons = [],
  note,
  backgroundColor = "default",
  removeTopSpacing = false,
  removeBottomSpacing = false,
}: CTADefaultProps) {
  const renderHeading = () => {
    if (!headingGradient) {
      return <h2 className="display-lg mb-6">{heading}</h2>;
    }

    const parts = heading.split(headingGradient);
    if (parts.length === 1) {
      return <h2 className="display-lg mb-6">{heading}</h2>;
    }

    // Use gold accent for highlighted text - MAISON luxury aesthetic
    return (
      <h2 className="display-lg mb-6">
        {parts[0]}
        <span className="text-[var(--gold)]">{headingGradient}</span>
        {parts[1]}
      </h2>
    );
  };

  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case "gradient":
        return "cta-section";
      case "transparent":
        return "bg-transparent";
      case "secondary":
        return "bg-[var(--background-secondary)] border-t border-b border-[var(--border)]";
      default:
        return "cta-section";
    }
  };

  return (
    <section
      className={`${getBackgroundClass()} ${
        removeTopSpacing ? "pt-0" : ""
      } ${removeBottomSpacing ? "pb-0" : ""}`}
    >
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {renderHeading()}

          {subheading && (
            <p className="body-lg mb-8 max-w-2xl mx-auto">
              {subheading}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              {buttons.map((button, index) => (
                button.href ? (
                  <a
                    key={index}
                    href={button.href}
                    className={`btn ${
                      button.variant === "secondary"
                        ? "btn-secondary"
                        : button.variant === "ghost"
                        ? "btn-ghost"
                        : button.variant === "outline"
                        ? "btn-outline"
                        : "btn-primary"
                    } ${
                      button.size === "lg"
                        ? "btn-lg"
                        : button.size === "sm"
                        ? "btn-sm"
                        : ""
                    }`}
                  >
                    {button.label}
                  </a>
                ) : (
                  <Button
                    key={index}
                    variant={button.variant || "primary"}
                    size={button.size || "md"}
                    onClick={button.onClick}
                  >
                    {button.label}
                  </Button>
                )
              ))}
            </div>
          )}

          {note && (
            <p className="body-sm mt-4">
              {note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA NEWSLETTER
// ============================================================================

export interface CTANewsletterProps extends BaseSpacing {
  heading: string;
  subheading?: string;
  inputPlaceholder?: string;
  buttonLabel?: string;
  privacyNote?: string;
  onSubmit?: (email: string) => void | Promise<void>;
  backgroundColor?: BackgroundColor;
}

export function CTANewsletter({
  heading,
  subheading,
  inputPlaceholder = "Enter your email",
  buttonLabel = "Subscribe",
  privacyNote,
  onSubmit,
  backgroundColor = "default",
  removeTopSpacing = false,
  removeBottomSpacing = false,
}: CTANewsletterProps) {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    if (onSubmit && email) {
      await onSubmit(email);
      e.currentTarget.reset();
    }
  };

  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case "gradient":
        return "cta-section";
      case "transparent":
        return "bg-transparent";
      case "secondary":
        return "bg-[var(--background-secondary)] border-t border-b border-[var(--border)]";
      default:
        return "cta-section";
    }
  };

  return (
    <section
      className={`${getBackgroundClass()} ${
        removeTopSpacing ? "pt-0" : ""
      } ${removeBottomSpacing ? "pb-0" : ""}`}
    >
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="display-lg mb-6">{heading}</h2>

          {subheading && (
            <p className="body-lg mb-8">
              {subheading}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mb-4">
            <div className="input-group max-w-lg mx-auto">
              <input
                type="email"
                name="email"
                placeholder={inputPlaceholder}
                required
                className="input"
              />
              <button type="submit" className="btn btn-primary">
                {buttonLabel}
              </button>
            </div>
          </form>

          {privacyNote && (
            <p className="body-sm">
              {privacyNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SPLIT
// ============================================================================

export interface CTASplitProps extends BaseSpacing {
  heading: string;
  subheading?: string;
  buttons?: BaseButtonConfig[];
  image: {
    src: string;
    alt: string;
  };
  imagePosition?: "left" | "right";
  imageOverlay?: boolean;
  backgroundColor?: BackgroundColor;
}

export function CTASplit({
  heading,
  subheading,
  buttons = [],
  image,
  imagePosition = "right",
  imageOverlay = false,
  backgroundColor = "default",
  removeTopSpacing = false,
  removeBottomSpacing = false,
}: CTASplitProps) {
  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case "gradient":
        return "cta-section";
      case "transparent":
        return "bg-transparent";
      case "secondary":
        return "bg-[var(--background-secondary)] border-t border-b border-[var(--border)]";
      default:
        return "cta-section";
    }
  };

  const ContentSection = () => (
    <div className="flex flex-col justify-center">
      <h2 className="display-lg mb-6">{heading}</h2>

      {subheading && (
        <p className="body-lg mb-8">
          {subheading}
        </p>
      )}

      {buttons.length > 0 && (
        <div className="flex flex-wrap items-center gap-4">
          {buttons.map((button, index) => (
            button.href ? (
              <a
                key={index}
                href={button.href}
                className={`btn ${
                  button.variant === "secondary"
                    ? "btn-secondary"
                    : button.variant === "ghost"
                    ? "btn-ghost"
                    : button.variant === "outline"
                    ? "btn-outline"
                    : "btn-primary"
                } ${
                  button.size === "lg"
                    ? "btn-lg"
                    : button.size === "sm"
                    ? "btn-sm"
                    : ""
                }`}
              >
                {button.label}
              </a>
            ) : (
              <Button
                key={index}
                variant={button.variant || "primary"}
                size={button.size || "md"}
                onClick={button.onClick}
              >
                {button.label}
              </Button>
            )
          ))}
        </div>
      )}
    </div>
  );

  const ImageSection = () => (
    <div className="relative overflow-hidden">
      <img
        src={image.src}
        alt={image.alt}
        className="w-full h-full object-cover min-h-[400px] max-h-[600px]"
      />
      {imageOverlay && (
        <div
          className="absolute inset-0 bg-[var(--foreground)] opacity-10"
        />
      )}
    </div>
  );

  return (
    <section
      className={`${getBackgroundClass()} ${
        removeTopSpacing ? "pt-0" : ""
      } ${removeBottomSpacing ? "pb-0" : ""}`}
    >
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {imagePosition === "left" ? (
            <>
              <ImageSection />
              <ContentSection />
            </>
          ) : (
            <>
              <ContentSection />
              <ImageSection />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA BANNER
// ============================================================================

export interface CTABannerProps {
  // Component props
  heading?: string;
  button?: BaseButtonConfig;
  background?: "gradient" | "solid" | "image";
  backgroundImage?: string;
  overlay?: boolean;
  // Sanity field names
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  dismissible?: boolean;
  backgroundColor?: string;
}

export function CTABanner({
  heading,
  button,
  background = "gradient",
  backgroundImage,
  overlay = true,
  // Sanity fields
  text,
  buttonText,
  buttonLink,
  backgroundColor,
}: CTABannerProps) {
  // Use Sanity fields as fallbacks
  const displayHeading = heading || text || "";
  const displayButton = button || {
    label: buttonText || "Learn More",
    href: buttonLink,
  };
  const getBackgroundStyle = () => {
    if (background === "image" && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {};
  };

  const getBackgroundClass = () => {
    switch (background) {
      case "gradient":
        return "bg-[var(--foreground)]"; // MAISON dark elegant
      case "solid":
        return "bg-[var(--foreground)]";
      case "image":
        return "";
      default:
        return "bg-[var(--foreground)]";
    }
  };

  return (
    <section
      className={`relative overflow-hidden ${getBackgroundClass()}`}
      style={getBackgroundStyle()}
    >
      {background === "image" && overlay && (
        <div
          className="absolute inset-0 bg-[var(--foreground)] opacity-80"
        />
      )}
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 md:py-12">
          <h2 className="heading-lg text-center md:text-left text-[var(--background)] flex-1">
            {displayHeading}
          </h2>

          {displayButton.label && (
            <div className="flex-shrink-0">
              {displayButton.href ? (
                <a
                  href={displayButton.href}
                  className={`btn ${
                    displayButton.variant === "secondary"
                      ? "btn-secondary"
                      : displayButton.variant === "ghost"
                      ? "btn-ghost"
                      : displayButton.variant === "outline"
                      ? "border border-[var(--background)] bg-transparent text-[var(--background)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                      : "btn-white"
                  } ${
                    displayButton.size === "lg"
                      ? "btn-lg"
                      : displayButton.size === "sm"
                      ? "btn-sm"
                      : ""
                  }`}
                >
                  {displayButton.label}
                </a>
              ) : (
                <Button
                  variant={displayButton.variant || "primary"}
                  size={displayButton.size || "md"}
                  onClick={displayButton.onClick}
                  className="btn-white"
                >
                  {displayButton.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA STATS
// ============================================================================

export interface StatItem {
  value: string;
  label: string;
}

export interface CTAStatsProps extends BaseSpacing {
  stats: StatItem[];
  heading: string;
  subheading?: string;
  buttons?: BaseButtonConfig[];
  backgroundColor?: BackgroundColor;
}

export function CTAStats({
  stats,
  heading,
  subheading,
  buttons = [],
  backgroundColor = "default",
  removeTopSpacing = false,
  removeBottomSpacing = false,
}: CTAStatsProps) {
  const getBackgroundClass = () => {
    switch (backgroundColor) {
      case "gradient":
        return "cta-section";
      case "transparent":
        return "bg-transparent";
      case "secondary":
        return "bg-[var(--background-secondary)] border-t border-b border-[var(--border)]";
      default:
        return "cta-section";
    }
  };

  return (
    <section
      className={`${getBackgroundClass()} ${
        removeTopSpacing ? "pt-0" : ""
      } ${removeBottomSpacing ? "pb-0" : ""}`}
    >
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="stat-value mb-2">
                  {stat.value}
                </div>
                <div className="stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="text-center">
            <h2 className="display-lg mb-6">{heading}</h2>

            {subheading && (
              <p className="body-lg mb-8">
                {subheading}
              </p>
            )}

            {buttons.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-4">
                {buttons.map((button, index) => (
                  button.href ? (
                    <a
                      key={index}
                      href={button.href}
                      className={`btn ${
                        button.variant === "secondary"
                          ? "btn-secondary"
                          : button.variant === "ghost"
                          ? "btn-ghost"
                          : button.variant === "outline"
                          ? "btn-outline"
                          : "btn-primary"
                      } ${
                        button.size === "lg"
                          ? "btn-lg"
                          : button.size === "sm"
                          ? "btn-sm"
                          : ""
                      }`}
                    >
                      {button.label}
                    </a>
                  ) : (
                    <Button
                      key={index}
                      variant={button.variant || "primary"}
                      size={button.size || "md"}
                      onClick={button.onClick}
                    >
                      {button.label}
                    </Button>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  Default: CTADefault,
  Newsletter: CTANewsletter,
  Split: CTASplit,
  Banner: CTABanner,
  Stats: CTAStats,
};
