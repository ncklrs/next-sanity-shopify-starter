"use client";

import Badge from "../../ui/Badge";
import {
  getSpacingClass,
  getBackgroundClass,
  renderIcon,
  splitTextWithGradient,
} from "./utils";

interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
  link?: { text: string; url?: string; href?: string };
}

interface FeaturesIconCardsProps {
  badge?: string;
  heading: string;
  headingHighlight?: string;
  subheading?: string;
  features?: FeatureItem[];
  spacing?: string;
  backgroundColor?: string;
}

export default function FeaturesIconCards({
  badge,
  heading,
  headingHighlight,
  subheading,
  features = [],
  spacing = "lg",
  backgroundColor = "default",
}: FeaturesIconCardsProps) {
  const { beforeGradient, gradientPart, afterGradient } = splitTextWithGradient(
    heading,
    headingHighlight
  );

  return (
    <section className={`section ${getSpacingClass(spacing)} ${getBackgroundClass(backgroundColor)}`}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          {badge && (
            <Badge variant="gradient" className="mb-4">
              {badge}
            </Badge>
          )}
          <h2 className="heading-lg mb-4">
            {beforeGradient}
            {gradientPart && <span className="text-[var(--gold)]">{gradientPart}</span>}
            {afterGradient}
          </h2>
          {subheading && <p className="body-lg">{subheading}</p>}
        </div>

        {/* Icon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative feature-card p-8 hover:shadow-elevated transition-all duration-500 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Large Icon */}
              {feature.icon && (
                <div className="mb-6 w-16 h-16 bg-[var(--gold-light)] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  {renderIcon(feature.icon, {
                    className: "w-8 h-8 text-[var(--gold)]",
                    "aria-hidden": "true",
                  })}
                </div>
              )}

              {/* Content */}
              <h3 className="heading-md mb-3 text-[var(--foreground)] transition-all duration-300">
                {feature.title}
              </h3>
              <p className="body-lg mb-4">{feature.description}</p>

              {/* Optional Link */}
              {feature.link && (
                <a
                  href={feature.link.url || feature.link.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold)] hover:text-[var(--gold-dark)] transition-colors"
                >
                  <span>{feature.link.text}</span>
                </a>
              )}

              {/* Gold accent line on top - hover reveal */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--gold)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
