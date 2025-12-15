"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { ShoppingBag, Lock, Loader2 } from "lucide-react";

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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h1>
          <p className="mt-2 text-gray-600">
            Access your orders, wishlist, and account settings
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Sign in failed
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {errorDescription || getErrorMessage(error)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Button */}
        <div>
          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Lock className="h-5 w-5" />
            Continue with Shopify
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <h2 className="text-center text-sm font-medium text-gray-900">
            Benefits of signing in
          </h2>
          <ul className="mt-4 space-y-3">
            {[
              "Track your orders and view order history",
              "Save items to your wishlist",
              "Faster checkout with saved addresses",
              "Exclusive member offers and early access",
            ].map((benefit, index) => (
              <li key={index} className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-gray-500">
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
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
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
