"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User } from "lucide-react";
import { Button, NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui";
import { MenuIcon, XIcon, AuroraLogo, ChevronDownIcon, ChevronUpIcon, ArrowRightIcon } from "@/components/icons";
import { CartButton } from "@/components/CartButton";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { urlFor } from "@/lib/sanity";

const BUTTON_VARIANT_CLASSES: Record<string, string> = {
  primary: "btn btn-primary",
  secondary: "btn btn-secondary",
  ghost: "btn btn-ghost",
  outline: "btn border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--surface)]",
};

const BUTTON_SIZE_CLASSES: Record<string, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

interface BaseNavLink {
  label: string;
  linkType: "internal" | "external" | "anchor";
  internalLink?: { slug: { current: string } };
  externalUrl?: string;
  anchor?: string;
  description?: string;
  icon?: string;
}

interface NavColumn {
  title?: string;
  links?: BaseNavLink[];
}

interface FeaturedItem {
  title?: string;
  description?: string;
  image?: any;
  link?: BaseNavLink;
}

interface NavLink extends BaseNavLink {
  dropdownStyle?: "simple" | "columns";
  children?: BaseNavLink[];
  columns?: NavColumn[];
  featuredItem?: FeaturedItem;
}

interface CtaButton {
  label: string;
  linkType: "internal" | "external";
  internalLink?: { slug: { current: string } };
  externalUrl?: string;
  openInNewTab?: boolean;
  variant: "primary" | "secondary" | "ghost" | "outline";
  size: "sm" | "md" | "lg";
  icon?: string;
}

interface HeaderNavigation {
  logo?: any;
  navLinks?: NavLink[];
  ctaButtons?: CtaButton[];
  showCta?: boolean;
}

export interface NavigationProps {
  settings?: {
    title?: string;
    headerNavigation?: HeaderNavigation;
    logo?: any;
    mainNavigation?: NavLink[];
  };
}

function getNavHref(item: BaseNavLink) {
  switch (item.linkType) {
    case "internal":
      return item.internalLink?.slug?.current ? `/${item.internalLink.slug.current}` : "/";
    case "external":
      return item.externalUrl || "#";
    case "anchor":
      return item.anchor || "#";
    default:
      return "#";
  }
}

function getCtaHref(button: CtaButton) {
  if (button.linkType === "internal") {
    return button.internalLink?.slug?.current ? `/${button.internalLink.slug.current}` : "/";
  }
  return button.externalUrl || "#";
}

function hasDropdown(item: NavLink): boolean {
  if (item.dropdownStyle === "columns") {
    return (item.columns && item.columns.length > 0) || false;
  }
  return (item.children && item.children.length > 0) || false;
}

// Simple dropdown link item
function DropdownLinkItem({ item, onClick }: { item: BaseNavLink; onClick?: () => void }) {
  const href = getNavHref(item);
  const isExternal = item.linkType === "external";

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={onClick}
      className="group block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-[var(--surface)] focus:bg-[var(--surface)]"
    >
      <div className="flex items-start gap-3">
        {item.icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--primary)] group-hover:bg-[var(--primary)]/10 transition-colors">
            <span className="text-lg">{item.icon}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
            {item.label}
          </div>
          {item.description && (
            <p className="mt-1 text-sm leading-snug text-[var(--foreground-muted)] line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// Column-based mega menu content
function MegaMenuContent({ item }: { item: NavLink }) {
  const columns = item.columns || [];
  const featured = item.featuredItem;
  const hasFeature = featured?.title || featured?.image;

  // Calculate grid columns based on content
  const columnCount = columns.length + (hasFeature ? 1 : 0);
  const gridCols = columnCount <= 2 ? "md:grid-cols-2" : columnCount <= 3 ? "md:grid-cols-3" : "md:grid-cols-4";

  return (
    <div className={`grid gap-4 p-6 w-[90vw] max-w-[900px] ${gridCols}`}>
      {/* Featured Item - First */}
      {hasFeature && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--primary)]/10 via-[var(--surface)] to-[var(--surface)] border border-[var(--border)]">
          {featured.image && (
            <div className="aspect-[16/9] relative overflow-hidden">
              <Image
                src={urlFor(featured.image).width(400).height(225).url()}
                alt={featured.title || "Featured"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] to-transparent" />
            </div>
          )}
          <div className="p-4">
            {featured.title && (
              <h4 className="font-semibold text-[var(--foreground)]">{featured.title}</h4>
            )}
            {featured.description && (
              <p className="mt-1 text-sm text-[var(--foreground-muted)] line-clamp-2">
                {featured.description}
              </p>
            )}
            {featured.link && (
              <Link
                href={getNavHref(featured.link)}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
              >
                {featured.link.label || "Learn more"}
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Navigation Columns */}
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="space-y-3">
          {column.title && (
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] px-3">
              {column.title}
            </h3>
          )}
          <div className="space-y-1">
            {column.links?.map((link, linkIndex) => (
              <Link
                key={linkIndex}
                href={getNavHref(link)}
                target={link.linkType === "external" ? "_blank" : undefined}
                className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-[var(--surface)]"
              >
                {link.icon && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--surface)] text-[var(--primary)] group-hover:bg-[var(--primary)]/10 transition-colors">
                    <span className="text-base">{link.icon}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {link.label}
                  </div>
                  {link.description && (
                    <p className="mt-0.5 text-xs leading-snug text-[var(--foreground-muted)] line-clamp-2">
                      {link.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Simple dropdown content - single column list
function SimpleDropdownContent({ children }: { children: BaseNavLink[] }) {
  return (
    <div className="flex flex-col gap-1 p-4 w-[320px]">
      {children.map((child, childIndex) => (
        <DropdownLinkItem key={childIndex} item={child} />
      ))}
    </div>
  );
}

// Mobile column section
function MobileColumnSection({
  column,
  onLinkClick
}: {
  column: NavColumn;
  onLinkClick: () => void;
}) {
  return (
    <div className="space-y-2">
      {column.title && (
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)] px-3 pt-2">
          {column.title}
        </h4>
      )}
      {column.links?.map((link, linkIndex) => (
        <Link
          key={linkIndex}
          href={getNavHref(link)}
          className="block py-2 px-3 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
          onClick={onLinkClick}
          target={link.linkType === "external" ? "_blank" : undefined}
        >
          <div className="flex items-center gap-3">
            {link.icon && (
              <span className="text-[var(--primary)]">{link.icon}</span>
            )}
            <div>
              <div className="font-medium text-sm">{link.label}</div>
              {link.description && (
                <div className="text-xs text-[var(--foreground-muted)] mt-0.5 line-clamp-1">
                  {link.description}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function Navigation({ settings }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { totalQuantity } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    setMobileMenuOpen(false);
    setExpandedItems(new Set());
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setExpandedItems(new Set());
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const toggleExpanded = useCallback((index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const isActiveLink = (item: BaseNavLink): boolean => {
    const href = getNavHref(item);
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const headerNav = settings?.headerNavigation;
  const logo = headerNav?.logo || settings?.logo;
  const navItems = headerNav?.navLinks || settings?.mainNavigation || [];
  const ctaButtons = headerNav?.ctaButtons || [];
  const showCta = headerNav?.showCta !== false;

  return (
    <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-container">
        <Link href="/" className="flex items-center">
          {logo ? (
            <Image
              src={urlFor(logo).width(120).url()}
              alt={settings?.title || "Logo"}
              width={120}
              height={32}
            />
          ) : (
            <AuroraLogo />
          )}
        </Link>

        {/* Desktop Navigation + CTA + Cart */}
        <div className="nav-show-desktop items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  {hasDropdown(item) ? (
                    <>
                      <NavigationMenuTrigger className="nav-link">
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        {item.dropdownStyle === "columns" ? (
                          <MegaMenuContent item={item} />
                        ) : (
                          <SimpleDropdownContent children={item.children || []} />
                        )}
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={getNavHref(item)}
                        className={`${navigationMenuTriggerStyle()} ${isActiveLink(item) ? "text-[var(--foreground)] bg-[var(--surface)]/50" : ""}`}
                        target={item.linkType === "external" ? "_blank" : undefined}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          {showCta && ctaButtons.length > 0 && (
            <div className="flex items-center gap-3">
              {ctaButtons.map((button, index) => (
                <Link
                  key={index}
                  href={getCtaHref(button)}
                  target={button.openInNewTab ? "_blank" : undefined}
                  rel={button.openInNewTab ? "noopener noreferrer" : undefined}
                  className={`${BUTTON_VARIANT_CLASSES[button.variant] || BUTTON_VARIANT_CLASSES.primary} ${BUTTON_SIZE_CLASSES[button.size] || ""}`}
                >
                  {button.label}
                </Link>
              ))}
            </div>
          )}

          {/* Account/Login Button */}
          <Link
            href={isAuthenticated ? "/account" : "/account/login"}
            className="flex items-center gap-2 text-sm font-medium text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <User className="h-5 w-5" />
            <span className={authLoading ? "opacity-50" : ""}>
              {isAuthenticated ? "My Account" : "Login"}
            </span>
          </Link>

          {/* Cart Button - visible when items in cart */}
          {totalQuantity > 0 && (
            <div className="border-l border-[var(--border-light)] pl-4">
              <CartButton onOpen={() => setCartDrawerOpen(true)} />
            </div>
          )}
        </div>

        {/* Mobile Cart + Account + Menu Buttons */}
        <div className="nav-show-mobile items-center gap-2">
          <Link
            href={isAuthenticated ? "/account" : "/account/login"}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            aria-label={isAuthenticated ? "My Account" : "Login"}
          >
            <User className="h-5 w-5" />
          </Link>
          {totalQuantity > 0 && (
            <CartButton onOpen={() => setCartDrawerOpen(true)} />
          )}
          <button
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Submenu Support */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--background)] border-b border-[var(--border)] shadow-xl max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col p-4">
            {navItems.map((item, index) => (
              <div key={index} className="border-b border-[var(--border)]/50 last:border-b-0">
                {hasDropdown(item) ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(index)}
                      className="flex items-center justify-between w-full py-3 px-2 text-left text-[var(--foreground)] font-medium hover:bg-[var(--surface)] rounded-lg transition-colors"
                      aria-expanded={expandedItems.has(index)}
                    >
                      <span>{item.label}</span>
                      {expandedItems.has(index) ? (
                        <ChevronUpIcon className="w-4 h-4 text-[var(--foreground-muted)]" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-[var(--foreground-muted)]" />
                      )}
                    </button>

                    {/* Submenu items with smooth expand animation */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ease-out ${
                        expandedItems.has(index) ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-2 pb-2 space-y-1">
                        {item.dropdownStyle === "columns" ? (
                          // Render columns for mobile
                          <>
                            {item.columns?.map((column, colIndex) => (
                              <MobileColumnSection
                                key={colIndex}
                                column={column}
                                onLinkClick={closeMobileMenu}
                              />
                            ))}
                            {/* Featured item in mobile */}
                            {(item.featuredItem?.title || item.featuredItem?.image) && (
                              <div className="mt-3 pt-3 border-t border-[var(--border)]/50">
                                <Link
                                  href={item.featuredItem.link ? getNavHref(item.featuredItem.link) : "#"}
                                  className="block rounded-lg overflow-hidden bg-gradient-to-r from-[var(--primary)]/10 to-transparent hover:from-[var(--primary)]/20 transition-colors"
                                  onClick={closeMobileMenu}
                                >
                                  {item.featuredItem.image && (
                                    <div className="aspect-[16/9] relative overflow-hidden">
                                      <Image
                                        src={urlFor(item.featuredItem.image).width(400).height(225).url()}
                                        alt={item.featuredItem.title || "Featured"}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="p-3">
                                    {item.featuredItem.title && (
                                      <div className="font-medium text-sm text-[var(--foreground)]">
                                        {item.featuredItem.title}
                                      </div>
                                    )}
                                    {item.featuredItem.description && (
                                      <div className="text-xs text-[var(--foreground-muted)] mt-0.5 line-clamp-2">
                                        {item.featuredItem.description}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              </div>
                            )}
                          </>
                        ) : (
                          // Render simple children for mobile
                          item.children?.map((child, childIndex) => (
                            <Link
                              key={childIndex}
                              href={getNavHref(child)}
                              className="block py-2.5 px-3 rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                              onClick={closeMobileMenu}
                              target={child.linkType === "external" ? "_blank" : undefined}
                            >
                              <div className="flex items-center gap-3">
                                {child.icon && (
                                  <span className="text-[var(--primary)]">{child.icon}</span>
                                )}
                                <div>
                                  <div className="font-medium text-sm">{child.label}</div>
                                  {child.description && (
                                    <div className="text-xs text-[var(--foreground-muted)] mt-0.5">
                                      {child.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={getNavHref(item)}
                    className={`block py-3 px-2 rounded-lg font-medium transition-colors ${
                      isActiveLink(item)
                        ? "text-[var(--primary)] bg-[var(--surface)]"
                        : "text-[var(--foreground)] hover:bg-[var(--surface)]"
                    }`}
                    onClick={closeMobileMenu}
                    aria-current={isActiveLink(item) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile CTA Buttons */}
            {showCta && (
              <div className="pt-4 mt-4 border-t border-[var(--border)] flex flex-col gap-2">
                {ctaButtons.length > 0 ? (
                  ctaButtons.map((button, index) => (
                    <Link
                      key={index}
                      href={getCtaHref(button)}
                      target={button.openInNewTab ? "_blank" : undefined}
                      rel={button.openInNewTab ? "noopener noreferrer" : undefined}
                      onClick={closeMobileMenu}
                      className={`${BUTTON_VARIANT_CLASSES[button.variant] || BUTTON_VARIANT_CLASSES.primary} w-full justify-center`}
                    >
                      {button.label}
                    </Link>
                  ))
                ) : (
                  <Link
                    href={isAuthenticated ? "/account" : "/account/login"}
                    onClick={closeMobileMenu}
                    className="btn btn-primary w-full justify-center"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {isAuthenticated ? "My Account" : "Login"}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </nav>
  );
}

export default Navigation;
