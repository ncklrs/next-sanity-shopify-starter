"use client";

import { type ReactNode } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ArrowRightIcon, CheckIcon, PlayIcon } from "@/components/icons";
import Image from "next/image";

/**
 * Renders a heading with optional highlighted text.
 * Uses gold accent color for highlights - consistent with MAISON luxury aesthetic.
 * Handles two patterns:
 * 1. highlightText is a substring of heading → splits and highlights that portion
 * 2. highlightText is separate text → concatenates heading + highlightText with highlight
 */
function renderHeadingWithHighlight(heading: string, highlightText?: string): ReactNode {
  if (!highlightText) return heading;

  // Pattern 1: highlightText is within heading - split and highlight
  if (heading.includes(highlightText)) {
    const parts = heading.split(highlightText);
    return (
      <>
        {parts[0]}
        <span className="text-[var(--gold)]">{highlightText}</span>
        {parts[1]}
      </>
    );
  }

  // Pattern 2: highlightText is separate - concatenate with highlight
  return (
    <>
      {heading}{heading && highlightText ? " " : ""}
      <span className="text-[var(--gold)]">{highlightText}</span>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface CTAButton {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
}

interface Company {
  name: string;
  logo: string;
  width?: number;
  height?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO DEFAULT
// ═══════════════════════════════════════════════════════════════════════════

// Sanity button structure
interface SanityButton {
  text?: string;
  link?: string;
  variant?: "primary" | "secondary" | "outline";
}

export interface HeroDefaultProps {
  badge?: {
    text: string;
    variant?: "default" | "gradient" | "success" | "new";
  };
  heading?: string;
  headingHighlight?: string;
  headingGradientText?: string;
  subheading?: string;
  // Support both naming conventions
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
  primaryButton?: SanityButton;
  secondaryButton?: SanityButton;
  backgroundStyle?: "default" | "gradient-orbs" | "grid" | "particles";
  alignment?: "center" | "left";
}

export function HeroDefault({
  badge,
  heading = "",
  headingHighlight,
  headingGradientText,
  subheading = "",
  primaryCTA,
  secondaryCTA,
  primaryButton,
  secondaryButton,
  backgroundStyle = "default",
  alignment = "center",
}: HeroDefaultProps) {
  // Map Sanity fields to component fields
  const highlightText = headingGradientText || headingHighlight;
  const primary = primaryCTA || (primaryButton?.text ? {
    label: primaryButton.text,
    href: primaryButton.link,
    variant: primaryButton.variant as CTAButton["variant"],
  } : undefined);
  const secondary = secondaryCTA || (secondaryButton?.text ? {
    label: secondaryButton.text,
    href: secondaryButton.link,
    variant: secondaryButton.variant as CTAButton["variant"],
  } : undefined);
  const isCenter = alignment === "center";

  // Background style classes - MAISON luxury aesthetic
  const getBackgroundClass = () => {
    switch (backgroundStyle) {
      case "gradient-orbs":
        return "bg-[var(--background-warm)]";
      case "grid":
        return "bg-[var(--background-cream)]";
      case "particles":
        return "bg-[var(--background)]";
      default:
        return "bg-[var(--background)]";
    }
  };

  return (
    <section className={`hero ${getBackgroundClass()}`}>
      {/* Subtle grain texture overlay - MAISON signature */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
           style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      {/* Content */}
      <div className="container">
        <div
          className={`max-w-5xl ${isCenter ? "mx-auto text-center" : ""}`}
        >
          {badge && (
            <div
              className={`animate-fade-in ${isCenter ? "flex justify-center" : ""}`}
            >
              <Badge variant={badge.variant || "gradient"}>
                {badge.text}
              </Badge>
            </div>
          )}

          <h1
            className="display-xl mt-6 mb-6 animate-fade-in-up animate-delay-100"
          >
            {renderHeadingWithHighlight(heading, highlightText)}
          </h1>

          <p
            className="body-lg max-w-3xl mb-10 animate-fade-in-up animate-delay-200"
            style={{ marginLeft: isCenter ? "auto" : "0", marginRight: isCenter ? "auto" : "0" }}
          >
            {subheading}
          </p>

          <div
            className={`flex flex-wrap gap-4 animate-fade-in-up animate-delay-300 ${
              isCenter ? "justify-center" : ""
            }`}
          >
            {primary && (
              <Button
                variant={primary.variant || "primary"}
                size="lg"
                onClick={primary.onClick}
                rightIcon={primary.icon || <ArrowRightIcon className="w-4 h-4" />}
              >
                {primary.label}
              </Button>
            )}
            {secondary && (
              <Button
                variant={secondary.variant || "secondary"}
                size="lg"
                onClick={secondary.onClick}
                rightIcon={secondary.icon}
              >
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO CENTERED
// ═══════════════════════════════════════════════════════════════════════════

export interface HeroCenteredProps {
  badge?: {
    text: string;
    variant?: "default" | "gradient" | "success" | "new";
  };
  heading?: string;
  headingHighlight?: string;
  headingGradientText?: string;
  subheading?: string;
  buttons?: (CTAButton | SanityButton)[];
  companies?: Company[];
  companiesHeading?: string;
  trustedByText?: string;
  trustedByLogos?: Array<{ asset?: any; alt?: string; companyName?: string }>;
}

export function HeroCentered({
  badge,
  heading = "",
  headingHighlight,
  headingGradientText,
  subheading = "",
  buttons,
  companies,
  companiesHeading = "Trusted by leading companies",
  trustedByText,
  trustedByLogos,
}: HeroCenteredProps) {
  // Handle null values from Sanity
  const safeButtons = buttons ?? [];
  const safeCompanies = companies ?? [];
  const safeLogos = trustedByLogos ?? [];

  // Map Sanity fields
  const highlightText = headingGradientText || headingHighlight;
  const displayCompaniesHeading = trustedByText || companiesHeading;

  // Map buttons to consistent format
  const mappedButtons: CTAButton[] = safeButtons.map((btn) => {
    if ('label' in btn) return btn as CTAButton;
    const sanityBtn = btn as SanityButton;
    return {
      label: sanityBtn.text || "",
      href: sanityBtn.link,
      variant: sanityBtn.variant as CTAButton["variant"],
    };
  }).filter(btn => btn.label);
  return (
    <section className="hero bg-[var(--background-warm)]">
      {/* Subtle grain texture overlay - MAISON signature */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
           style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      {/* Content */}
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <div className="animate-fade-in flex justify-center">
              <Badge variant={badge.variant || "gradient"}>
                {badge.text}
              </Badge>
            </div>
          )}

          <h1
            className="display-xl mt-6 mb-6 animate-fade-in-up animate-delay-100"
          >
            {renderHeadingWithHighlight(heading, highlightText)}
          </h1>

          <p
            className="body-lg max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200"
          >
            {subheading}
          </p>

          {mappedButtons.length > 0 && (
            <div
              className="flex flex-wrap gap-4 justify-center mb-16 animate-fade-in-up animate-delay-300"
            >
              {mappedButtons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant || (index === 0 ? "primary" : "secondary")}
                  size="lg"
                  onClick={button.onClick}
                  rightIcon={button.icon || (index === 0 ? <ArrowRightIcon className="w-4 h-4" /> : undefined)}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          )}

          {/* Logo Cloud */}
          {(safeCompanies.length > 0 || safeLogos.length > 0) && (
            <div
              className="animate-fade-in-up animate-delay-400"
            >
              <p className="body-sm mb-8 uppercase tracking-wider">
                {displayCompaniesHeading}
              </p>
              <div className="logo-cloud">
                {safeCompanies.map((company, index) => (
                  <Image
                    key={index}
                    src={company.logo}
                    alt={company.name}
                    width={company.width || 120}
                    height={company.height || 40}
                    className="opacity-50 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300"
                  />
                ))}
                {safeLogos.filter(logo => logo.asset?.url).map((logo, index) => (
                  <Image
                    key={`sanity-${index}`}
                    src={logo.asset.url}
                    alt={logo.alt || logo.companyName || "Company logo"}
                    width={120}
                    height={40}
                    className="opacity-50 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO SPLIT
// ═══════════════════════════════════════════════════════════════════════════

export interface HeroSplitProps {
  badge?: {
    text: string;
    variant?: "default" | "gradient" | "success" | "new";
  };
  heading?: string;
  headingHighlight?: string;
  headingGradientText?: string;
  subheading?: string;
  features?: Array<{
    icon?: ReactNode | string;
    text: string;
  }>;
  buttons?: (CTAButton | SanityButton)[];
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
  primaryButton?: SanityButton;
  secondaryButton?: SanityButton;
  image?: {
    src?: string;
    alt?: string;
    asset?: any;
    width?: number;
    height?: number;
  };
  imagePosition?: "left" | "right";
}

export function HeroSplit({
  badge,
  heading = "",
  headingHighlight,
  headingGradientText,
  subheading = "",
  features = [],
  buttons = [],
  primaryCTA,
  secondaryCTA,
  primaryButton,
  secondaryButton,
  image,
  imagePosition = "right",
}: HeroSplitProps) {
  // Map Sanity fields
  const highlightText = headingGradientText || headingHighlight;

  // Map buttons - support both array and individual buttons
  let primary = primaryCTA || (primaryButton?.text ? {
    label: primaryButton.text,
    href: primaryButton.link,
    variant: primaryButton.variant as CTAButton["variant"],
  } : undefined);
  let secondary = secondaryCTA || (secondaryButton?.text ? {
    label: secondaryButton.text,
    href: secondaryButton.link,
    variant: secondaryButton.variant as CTAButton["variant"],
  } : undefined);

  // If buttons array is provided, use first two as primary/secondary
  if (buttons.length > 0 && !primary) {
    const mappedButtons = buttons.map((btn) => {
      if ('label' in btn) return btn as CTAButton;
      const sanityBtn = btn as SanityButton;
      return {
        label: sanityBtn.text || "",
        href: sanityBtn.link,
        variant: sanityBtn.variant as CTAButton["variant"],
      };
    }).filter(btn => btn.label);
    primary = mappedButtons[0];
    secondary = mappedButtons[1];
  }

  const imageOnLeft = imagePosition === "left";

  return (
    <section className="section min-h-screen flex items-center relative overflow-hidden bg-[var(--background-cream)]">
      {/* Subtle grain texture overlay - MAISON signature */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
           style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      <div className="container">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${imageOnLeft ? "lg:flex-row-reverse" : ""}`}>
          {/* Content Side */}
          <div className={`${imageOnLeft ? "lg:order-2" : ""}`}>
            {badge && (
              <div className="animate-fade-in">
                <Badge variant={badge.variant || "gradient"}>
                  {badge.text}
                </Badge>
              </div>
            )}

            <h1
              className="display-lg mt-6 mb-6 animate-fade-in-up animate-delay-100"
            >
              {renderHeadingWithHighlight(heading, highlightText)}
            </h1>

            <p
              className="body-lg mb-8 animate-fade-in-up animate-delay-200"
            >
              {subheading}
            </p>

            {features.length > 0 && (
              <ul
                className="space-y-4 mb-10 animate-fade-in-up animate-delay-300"
              >
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold-dark)] mt-0.5">
                      {feature.icon || <CheckIcon className="w-3.5 h-3.5" />}
                    </span>
                    <span className="text-[var(--foreground)] text-lg">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div
              className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-400"
            >
              {primary && (
                <Button
                  variant={primary.variant || "primary"}
                  size="lg"
                  onClick={primary.onClick}
                  rightIcon={primary.icon || <ArrowRightIcon className="w-4 h-4" />}
                >
                  {primary.label}
                </Button>
              )}
              {secondary && (
                <Button
                  variant={secondary.variant || "secondary"}
                  size="lg"
                  onClick={secondary.onClick}
                  rightIcon={secondary.icon}
                >
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>

          {/* Image Side */}
          {image && (image.src || image.asset) && (
            <div
              className={`relative animate-fade-in-up animate-delay-200 ${imageOnLeft ? "lg:order-1" : ""}`}
            >
              <div className="relative overflow-hidden border border-[var(--border-hairline)]">
                <Image
                  src={image.src || (image.asset?.url) || ""}
                  alt={image.alt || ""}
                  width={image.width || 800}
                  height={image.height || 600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO VIDEO
// ═══════════════════════════════════════════════════════════════════════════

export interface HeroVideoProps {
  badge?: {
    text: string;
    variant?: "default" | "gradient" | "success" | "new";
  };
  heading?: string;
  headingHighlight?: string;
  headingGradientText?: string;
  subheading?: string;
  // Support both naming conventions
  primaryCTA?: CTAButton;
  secondaryCTA?: CTAButton;
  buttons?: (CTAButton | SanityButton)[];
  // Component format
  video?: {
    src: string;
    poster?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
  };
  // Sanity format
  videoUrl?: string;
  videoPoster?: { asset?: any; alt?: string };
  overlay?: boolean;
  overlayOpacity?: number;
}

export function HeroVideo({
  badge,
  heading = "",
  headingHighlight,
  headingGradientText,
  subheading = "",
  primaryCTA,
  secondaryCTA,
  buttons = [],
  video,
  videoUrl,
  videoPoster,
  overlay = true,
  overlayOpacity = 0.6,
}: HeroVideoProps) {
  // Map Sanity fields
  const highlightText = headingGradientText || headingHighlight;

  // Map video fields
  const videoSrc = video?.src || videoUrl || "";
  const videoPosterUrl = video?.poster || videoPoster?.asset?.url || "";
  const showOverlay = overlay !== false;

  // Map buttons - support both array and individual buttons
  let primary = primaryCTA;
  let secondary = secondaryCTA;

  if (buttons.length > 0 && !primary) {
    const mappedButtons = buttons.map((btn) => {
      if ('label' in btn) return btn as CTAButton;
      const sanityBtn = btn as SanityButton;
      return {
        label: sanityBtn.text || "",
        href: sanityBtn.link,
        variant: sanityBtn.variant as CTAButton["variant"],
      };
    }).filter(btn => btn.label);
    primary = mappedButtons[0];
    secondary = mappedButtons[1];
  }
  return (
    <section className="hero relative">
      {/* Video Background */}
      <div className="absolute inset-0">
        {videoSrc && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoSrc}
            poster={videoPosterUrl || undefined}
            autoPlay={video?.autoplay !== false}
            loop={video?.loop !== false}
            muted={video?.muted !== false}
            playsInline
          />
        )}
        {/* Dark Overlay - MAISON elegant dark layer */}
        {showOverlay && (
          <div
            className="absolute inset-0 bg-[var(--foreground)]"
            style={{ opacity: overlayOpacity }}
          />
        )}
        {/* Subtle grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 theme-on-dark">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <div className="animate-fade-in flex justify-center">
              <Badge variant={badge.variant || "default"}>
                {badge.text}
              </Badge>
            </div>
          )}

          <h1
            className="display-xl mt-6 mb-6 animate-fade-in-up animate-delay-100 text-[var(--background)]"
          >
            {renderHeadingWithHighlight(heading, highlightText)}
          </h1>

          <p
            className="body-lg max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200 text-[var(--background)]/80"
          >
            {subheading}
          </p>

          <div
            className="flex flex-wrap gap-4 justify-center animate-fade-in-up animate-delay-300"
          >
            {primary && (
              <a
                href={primary.href || "#"}
                className="btn btn-white btn-lg"
                onClick={(e) => {
                  if (primary.onClick) {
                    e.preventDefault();
                    primary.onClick();
                  }
                }}
              >
                {primary.label}
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            )}
            {secondary && (
              <a
                href={secondary.href || "#"}
                className="btn btn-lg border border-[var(--background)]/30 text-[var(--background)] hover:bg-[var(--background)]/10"
                onClick={(e) => {
                  if (secondary.onClick) {
                    e.preventDefault();
                    secondary.onClick();
                  }
                }}
              >
                <PlayIcon className="w-4 h-4" />
                {secondary.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO MINIMAL
// ═══════════════════════════════════════════════════════════════════════════

export interface HeroMinimalProps {
  announcement?: {
    text: string;
    // Support both formats
    link?: string | {
      label: string;
      href: string;
    };
  };
  heading?: string;
  headingHighlight?: string;
  headingGradientText?: string;
  subheading?: string;
  // Support both naming conventions
  cta?: CTAButton;
  singleButton?: SanityButton;
  showBackground?: boolean;
}

export function HeroMinimal({
  announcement,
  heading = "",
  headingHighlight,
  headingGradientText,
  subheading = "",
  cta,
  singleButton,
  showBackground = true,
}: HeroMinimalProps) {
  // Map Sanity fields
  const highlightText = headingGradientText || headingHighlight;

  // Map CTA button
  const ctaButton = cta || (singleButton?.text ? {
    label: singleButton.text,
    href: singleButton.link,
    variant: singleButton.variant as CTAButton["variant"],
  } : undefined);

  // Map announcement link (Sanity uses string, component expects object)
  const announcementLink = announcement?.link
    ? (typeof announcement.link === 'string'
        ? { label: "Learn more", href: announcement.link }
        : announcement.link)
    : undefined;
  return (
    <section className="hero bg-[var(--background)]">
      {/* Subtle grain texture overlay - MAISON signature */}
      {showBackground && (
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
             style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      )}

      {/* Content */}
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {announcement && (
            <div
              className="animate-fade-in flex justify-center mb-8"
            >
              <div className="px-6 py-3 inline-flex items-center gap-3 border border-[var(--border-hairline)] bg-[var(--background-paper)]">
                <span className="text-sm text-[var(--foreground-muted)]">
                  {announcement.text}
                </span>
                {announcementLink && (
                  <>
                    <span className="w-px h-4 bg-[var(--border-light)]" />
                    <a
                      href={announcementLink.href}
                      className="text-sm font-medium text-[var(--gold)] hover:text-[var(--gold-dark)] transition-colors inline-flex items-center gap-1"
                    >
                      {announcementLink.label}
                      <ArrowRightIcon className="w-3 h-3" />
                    </a>
                  </>
                )}
              </div>
            </div>
          )}

          <h1
            className="display-xl mb-6 animate-fade-in-up animate-delay-100"
          >
            {renderHeadingWithHighlight(heading, highlightText)}
          </h1>

          <p
            className="body-lg max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200"
          >
            {subheading}
          </p>

          {ctaButton && (
            <div
              className="animate-fade-in-up animate-delay-300 flex justify-center"
            >
              <Button
                variant={ctaButton.variant || "primary"}
                size="lg"
                onClick={ctaButton.onClick}
                rightIcon={ctaButton.icon || <ArrowRightIcon className="w-4 h-4" />}
              >
                {ctaButton.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

// All components are already exported inline above
