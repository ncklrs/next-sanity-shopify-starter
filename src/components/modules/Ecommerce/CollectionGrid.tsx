"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ArrowRightIcon } from "@/components/icons";

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

interface Collection {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  productCount?: number;
}

interface CollectionGridProps {
  badge?: string;
  heading?: string;
  subheading?: string;
  collections: Collection[];
  columns?: 2 | 3 | 4;
  spacing?: "sm" | "md" | "lg" | "xl";
  backgroundColor?: string;
  onCollectionClick?: (collection: Collection) => void;
}

function CollectionCard({
  collection,
}: {
  collection: Collection;
}) {
  const collectionUrl = `/collections/${collection.slug}`;

  return (
    <Link
      href={collectionUrl}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 hover:border-[var(--border-hover)] hover:shadow-2xl hover:-translate-y-1 block"
    >
      {/* Collection Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {collection.image ? (
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            width={collection.image.width || 600}
            height={collection.image.height || 450}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-[var(--surface-elevated)] flex items-center justify-center">
            <span className="text-[var(--foreground-muted)]">No image</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="heading-md text-white mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">
            {collection.name}
          </h3>

          {collection.description && (
            <p className="text-white/80 text-sm mb-3 line-clamp-2">
              {collection.description}
            </p>
          )}

          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2 text-white group-hover:text-[var(--accent-cyan)] transition-colors">
              <span className="text-sm font-medium">Shop Collection</span>
              <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CollectionGrid({
  badge,
  heading,
  subheading,
  collections,
  columns = 3,
  spacing = "xl",
  backgroundColor,
  onCollectionClick,
}: CollectionGridProps) {
  const spacingMap = {
    sm: "py-12 px-4",
    md: "py-16 px-6",
    lg: "py-20 px-6",
    xl: "py-24 px-6",
  };

  const columnMap = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section
      className={`section ${spacingMap[spacing]}`}
      style={getBackgroundStyle(backgroundColor)}
    >
      <div className="container mx-auto">
        {/* Section Header */}
        {(heading || subheading) && (
          <div className="section-header text-center max-w-3xl mx-auto mb-16">
            {badge && (
              <Badge variant="gradient" className="mb-4">
                {badge}
              </Badge>
            )}
            {heading && <h2 className="display-lg mb-4">{heading}</h2>}
            {subheading && (
              <p className="body-lg text-[var(--foreground-muted)]">{subheading}</p>
            )}
          </div>
        )}

        {/* Collections Grid */}
        <div className={`grid ${columnMap[columns]} gap-8`}>
          {collections.map((collection) => (
            <CollectionCard
              key={collection._id}
              collection={collection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CollectionGrid;
