/**
 * Breadcrumbs Component
 * Visual breadcrumb navigation with integrated JSON-LD structured data
 *
 * Features:
 * - Responsive design (truncates on mobile)
 * - Automatic JSON-LD generation
 * - Accessible navigation
 * - Customizable styling
 */

import { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbJsonLd, type BreadcrumbItem } from '@/lib/seo/breadcrumb-jsonld';
import { BreadcrumbJsonLd } from './JsonLd';
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  maxMobileItems?: number;
  baseUrl?: string;
  includeJsonLd?: boolean;
}

/**
 * Breadcrumbs navigation component
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { name: 'Home', href: '/' },
 *     { name: 'Products', href: '/products' },
 *     { name: 'Sneakers', href: '/products/sneakers' }
 *   ]}
 * />
 * ```
 */
export function Breadcrumbs({
  items,
  className,
  showHome = true,
  maxMobileItems = 2,
  baseUrl,
  includeJsonLd = true,
}: BreadcrumbsProps) {
  // Filter out home if showHome is false
  const breadcrumbs = showHome ? items : items.slice(1);

  if (breadcrumbs.length === 0) {
    return null;
  }

  // Generate JSON-LD for SEO
  const jsonLd = includeJsonLd
    ? generateBreadcrumbJsonLd(breadcrumbs, { baseUrl })
    : null;

  // For mobile: show first item ... last item
  const shouldTruncate = breadcrumbs.length > maxMobileItems;
  const mobileItems = shouldTruncate
    ? [breadcrumbs[0], breadcrumbs[breadcrumbs.length - 1]]
    : breadcrumbs;

  return (
    <>
      {jsonLd && <BreadcrumbJsonLd data={jsonLd} />}

      <nav
        aria-label="Breadcrumb"
        className={cn('w-full', className)}
      >
        {/* Desktop breadcrumbs */}
        <ol className="hidden sm:flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem
              key={`${item.href}-${index}`}
              item={item}
              isLast={index === breadcrumbs.length - 1}
              showSeparator={index < breadcrumbs.length - 1}
            />
          ))}
        </ol>

        {/* Mobile breadcrumbs */}
        <ol className="flex sm:hidden items-center space-x-2 text-sm">
          {mobileItems.map((item, index) => (
            <Fragment key={`mobile-${item.href}-${index}`}>
              {shouldTruncate && index === 1 && (
                <li className="flex items-center space-x-2 text-[var(--foreground-muted)]">
                  <span>...</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </li>
              )}
              <BreadcrumbItem
                item={item}
                isLast={index === mobileItems.length - 1 || index === breadcrumbs.length - 1}
                showSeparator={index < mobileItems.length - 1 && !(shouldTruncate && index === 0)}
              />
            </Fragment>
          ))}
        </ol>
      </nav>
    </>
  );
}

interface BreadcrumbItemProps {
  item: BreadcrumbItem;
  isLast: boolean;
  showSeparator: boolean;
}

function BreadcrumbItem({ item, isLast, showSeparator }: BreadcrumbItemProps) {
  const isHome = item.href === '/';

  return (
    <li className="flex items-center space-x-2">
      {isLast ? (
        <span
          className="text-[var(--foreground)] font-medium truncate max-w-[200px] sm:max-w-none"
          aria-current="page"
        >
          {isHome ? (
            <Home className="h-4 w-4" aria-label={item.name} />
          ) : (
            item.name
          )}
        </span>
      ) : (
        <Link
          href={item.href}
          className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors truncate max-w-[150px] sm:max-w-none"
        >
          {isHome ? (
            <Home className="h-4 w-4" aria-label={item.name} />
          ) : (
            item.name
          )}
        </Link>
      )}

      {showSeparator && (
        <ChevronRight
          className="h-4 w-4 text-[var(--foreground-muted)]"
          aria-hidden="true"
        />
      )}
    </li>
  );
}

/**
 * Simplified breadcrumbs without JSON-LD (useful when you want to add JSON-LD separately)
 */
export function BreadcrumbsSimple({
  items,
  className,
  showHome = true,
}: Omit<BreadcrumbsProps, 'includeJsonLd' | 'baseUrl'>) {
  return (
    <Breadcrumbs
      items={items}
      className={className}
      showHome={showHome}
      includeJsonLd={false}
    />
  );
}

/**
 * Compact breadcrumbs for tight spaces (mobile-first)
 */
export function BreadcrumbsCompact({
  items,
  className,
}: Pick<BreadcrumbsProps, 'items' | 'className'>) {
  if (items.length === 0) {
    return null;
  }

  const lastItem = items[items.length - 1];
  const previousItem = items.length > 1 ? items[items.length - 2] : null;

  return (
    <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
      <ol className="flex items-center space-x-2 text-sm">
        {previousItem && (
          <>
            <li>
              <Link
                href={previousItem.href}
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors flex items-center"
              >
                <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                {previousItem.name}
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4 text-[var(--foreground-muted)]" aria-hidden="true" />
            </li>
          </>
        )}
        <li>
          <span className="text-[var(--foreground)] font-medium" aria-current="page">
            {lastItem.name}
          </span>
        </li>
      </ol>
    </nav>
  );
}
