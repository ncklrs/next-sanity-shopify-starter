"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, Heart, LogOut, Settings } from "lucide-react";

/**
 * Account Layout
 *
 * Provides:
 * - Auth guard (redirects to login if not authenticated)
 * - Sidebar navigation for account pages
 * - Consistent layout wrapper
 */
export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, customer, logout } = useAuth();
  const pathname = usePathname();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  // Allow access to login page without auth
  if (pathname === "/account/login") {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Use window.location for client-side redirect
    if (typeof window !== "undefined") {
      window.location.href = `/account/login?returnTo=${encodeURIComponent(pathname)}`;
    }
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  const navItems = [
    { href: "/account", label: "Dashboard", icon: User },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
    { href: "/account/profile", label: "Settings", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/account") {
      return pathname === "/account";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 sm:pt-20 sm:pb-16 lg:px-8 lg:pt-32 lg:pb-24">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav className="space-y-1">
            {/* User Info */}
            <div className="mb-8 border-b border-[var(--border-light)] pb-6">
              <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Welcome back
              </p>
              <p className="mt-1 font-serif text-xl text-[var(--foreground)]">
                {customer?.firstName || customer?.email || "Customer"}
              </p>
            </div>

            {/* Navigation Links */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-all duration-300 ${
                    active
                      ? "bg-[var(--surface)] text-[var(--foreground)] border-l-2 border-[var(--foreground)]"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm tracking-wide text-[var(--foreground-muted)] transition-all duration-300 hover:text-[var(--accent-red)] hover:bg-[var(--surface)]"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="mt-12 lg:col-span-9 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
