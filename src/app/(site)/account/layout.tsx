"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, Heart, LogOut, Loader2 } from "lucide-react";

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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const navItems = [
    { href: "/account", label: "Dashboard", icon: User },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/addresses", label: "Addresses", icon: MapPin },
    { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  ];

  const isActive = (href: string) => {
    if (href === "/account") {
      return pathname === "/account";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav className="space-y-1">
            {/* User Info */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold text-gray-900">
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
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="mt-8 lg:col-span-9 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
