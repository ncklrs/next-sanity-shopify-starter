"use client";

import { useEffect, useRef, useState } from "react";
import Badge from "../../ui/Badge";
import { urlFor } from "@/lib/sanity";
import {
  getSpacingClass,
  getBackgroundClass,
  renderIcon,
  splitTextWithGradient,
} from "./utils";

interface AlternatingFeature {
  heading: string;
  description: string;
  bullets?: string[];
  image?: { src?: string; alt?: string; asset?: any };
  features?: string[];
}

function getImageUrl(image?: { src?: string; asset?: any }): string {
  if (!image) return "";
  if (image.src) return image.src;
  if (image.asset) return urlFor(image).width(800).url();
  return "";
}

interface FeaturesAlternatingProps {
  badge?: string;
  heading: string;
  headingHighlight?: string;
  subheading?: string;
  items?: AlternatingFeature[];
  spacing?: string;
  backgroundColor?: string;
}

export default function FeaturesAlternating({
  badge,
  heading,
  headingHighlight,
  subheading,
  items,
  spacing = "lg",
  backgroundColor = "default",
}: FeaturesAlternatingProps) {
  const { beforeGradient, gradientPart, afterGradient } = splitTextWithGradient(
    heading,
    headingHighlight
  );

  const features = items || [];

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

        {/* Alternating Features */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <FeatureRow key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  feature,
  index,
}: {
  feature: AlternatingFeature;
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const isReversed = index % 2 !== 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => {
      if (rowRef.current) {
        observer.unobserve(rowRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={rowRef}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Content Side */}
      <div className={`${isReversed ? "lg:order-2" : ""}`}>
        <h3 className="heading-md mb-4 text-[var(--foreground)]">{feature.heading}</h3>
        <p className="body-lg mb-6">{feature.description}</p>

        {/* Bullet List - supports both 'bullets' and 'features' field names from Sanity */}
        {((feature.bullets && feature.bullets.length > 0) || (feature.features && feature.features.length > 0)) && (
          <ul className="space-y-3">
            {(feature.bullets || feature.features || []).map((bullet, bulletIndex) => (
              <li key={bulletIndex} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-[var(--gold-light)] flex items-center justify-center">
                  {renderIcon("check", {
                    className: "w-3 h-3 text-[var(--gold-dark)]",
                    "aria-hidden": "true",
                  })}
                </div>
                <span className="text-[var(--foreground-muted)] leading-relaxed">
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Image Side */}
      <div className={`relative ${isReversed ? "lg:order-1" : ""}`}>
        <div className="relative overflow-hidden border border-[var(--border-hairline)] shadow-elevated">
          {feature.image && (
            <img
              src={getImageUrl(feature.image)}
              alt={feature.image.alt || ""}
              className="w-full h-auto"
              loading="lazy"
            />
          )}
        </div>
      </div>
    </div>
  );
}
