"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Lock, Check } from "lucide-react";

/**
 * Login Page Content Component
 * Separated for Suspense boundary
 */
function LoginContent() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const returnTo = searchParams.get("returnTo") || "/account";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(returnTo);
    }
  }, [isAuthenticated, isLoading, router, returnTo]);

  const handleLogin = () => {
    login(returnTo);
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 pt-16 pb-12 sm:pt-20 sm:pb-16 lg:pt-32 lg:pb-24">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <h1 className="display-md">Sign In</h1>
          <p className="mt-3 text-[var(--foreground-muted)]">
            Access your orders, wishlist, and account settings
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-8 border border-[var(--accent-red)] bg-red-50 p-4">
            <p className="text-sm font-medium text-[var(--accent-red)]">
              {errorDescription || getErrorMessage(error)}
            </p>
          </div>
        )}

        {/* Login Button */}
        <div className="mt-10">
          <button onClick={handleLogin} className="btn btn-primary w-full py-4">
            <Lock className="mr-2 h-4 w-4" />
            Continue with Shopify
          </button>
        </div>

        {/* Benefits */}
        <div className="mt-12 border-t border-[var(--border-light)] pt-10">
          <h2 className="text-center text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
            Benefits of signing in
          </h2>
          <ul className="mt-6 space-y-4">
            {[
              "Track your orders and view order history",
              "Save items to your wishlist",
              "Faster checkout with saved addresses",
              "Exclusive member offers and early access",
            ].map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--gold)]" />
                <span className="text-sm text-[var(--foreground-muted)]">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security Note */}
        <p className="mt-10 text-center text-xs text-[var(--foreground-muted)]">
          Your account is securely managed by Shopify.
          <br />
          We never store your password.
        </p>
      </div>
    </div>
  );
}

/**
 * Login Page
 * Initiates OAuth flow with Shopify Customer Account API
 */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

/**
 * Get user-friendly error message
 */
function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    login_failed: "Could not initiate login. Please try again.",
    invalid_request: "Invalid login request. Please try again.",
    callback_failed: "Login callback failed. Please try again.",
    access_denied: "Access was denied. Please try again.",
    server_error: "A server error occurred. Please try again later.",
  };

  return messages[error] || "An unknown error occurred. Please try again.";
}
