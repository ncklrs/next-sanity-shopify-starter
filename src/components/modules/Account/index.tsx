"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShoppingBag, Lock, Loader2, Check } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface AccountLoginProps {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  showBenefits?: boolean;
  benefits?: string[];
  benefitsHeading?: string;
  securityNote?: string;
  returnTo?: string;
  layout?: "centered" | "card" | "split";
  image?: {
    src: string;
    alt: string;
  };
  imagePosition?: "left" | "right";
  spacing?: "small" | "medium" | "large";
  backgroundColor?: "default" | "muted" | "accent";
}

// ============================================================================
// SPACING UTILITY
// ============================================================================

function getSpacingClasses(spacing: string = "medium"): string {
  switch (spacing) {
    case "small":
      return "py-12 md:py-16";
    case "large":
      return "py-24 md:py-32";
    default:
      return "py-16 md:py-24";
  }
}

function getBackgroundClasses(bg: string = "default"): string {
  switch (bg) {
    case "muted":
      return "bg-[var(--background-secondary)]";
    case "accent":
      return "bg-gradient-to-br from-[var(--accent-cyan)]/5 via-[var(--accent-violet)]/5 to-[var(--accent-pink)]/5";
    default:
      return "bg-[var(--background)]";
  }
}

// ============================================================================
// ACCOUNT LOGIN - CENTERED LAYOUT
// ============================================================================

function AccountLoginCentered({
  heading = "Sign in to your account",
  subheading = "Access your orders, wishlist, and account settings",
  buttonText = "Continue with Shopify",
  showBenefits = true,
  benefits = [],
  benefitsHeading = "Benefits of signing in",
  securityNote,
  returnTo = "/account",
  spacing = "medium",
  backgroundColor = "default",
}: AccountLoginProps) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

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
      <section className={`${getSpacingClasses(spacing)} ${getBackgroundClasses(backgroundColor)}`}>
        <div className="container">
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-violet)]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${getSpacingClasses(spacing)} ${getBackgroundClasses(backgroundColor)}`}>
      <div className="container">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-violet)]/10">
              <ShoppingBag className="h-8 w-8 text-[var(--accent-violet)]" />
            </div>
            <h2 className="mt-6 heading-lg">{heading}</h2>
            {subheading && (
              <p className="mt-2 body-lg text-[var(--text-secondary)]">
                {subheading}
              </p>
            )}
          </div>

          {/* Login Button */}
          <div>
            <button
              onClick={handleLogin}
              className="btn btn-primary w-full flex items-center justify-center gap-3"
            >
              <Lock className="h-5 w-5" />
              {buttonText}
            </button>
          </div>

          {/* Benefits */}
          {showBenefits && benefits && benefits.length > 0 && (
            <div className="border-t border-[var(--border)] pt-8">
              <h3 className="text-center body-sm font-medium text-[var(--text-primary)] mb-4">
                {benefitsHeading}
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="body-sm text-[var(--text-secondary)]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Note */}
          {securityNote && (
            <p className="text-center caption text-[var(--text-tertiary)]">
              {securityNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ACCOUNT LOGIN - CARD LAYOUT
// ============================================================================

function AccountLoginCard({
  heading = "Sign in to your account",
  subheading = "Access your orders, wishlist, and account settings",
  buttonText = "Continue with Shopify",
  showBenefits = true,
  benefits = [],
  benefitsHeading = "Benefits of signing in",
  securityNote,
  returnTo = "/account",
  spacing = "medium",
  backgroundColor = "default",
}: AccountLoginProps) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

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
      <section className={`${getSpacingClasses(spacing)} ${getBackgroundClasses(backgroundColor)}`}>
        <div className="container">
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-violet)]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${getSpacingClasses(spacing)} ${getBackgroundClasses(backgroundColor)}`}>
      <div className="container">
        <div className="max-w-lg mx-auto">
          <div className="card p-8 space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-violet)]/10">
                <ShoppingBag className="h-7 w-7 text-[var(--accent-violet)]" />
              </div>
              <h2 className="mt-4 heading-md">{heading}</h2>
              {subheading && (
                <p className="mt-2 body-base text-[var(--text-secondary)]">
                  {subheading}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="btn btn-primary w-full flex items-center justify-center gap-3"
            >
              <Lock className="h-5 w-5" />
              {buttonText}
            </button>

            {/* Benefits */}
            {showBenefits && benefits && benefits.length > 0 && (
              <div className="border-t border-[var(--border)] pt-6">
                <h3 className="body-sm font-medium text-[var(--text-primary)] mb-3">
                  {benefitsHeading}
                </h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="body-sm text-[var(--text-secondary)]">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Security Note */}
            {securityNote && (
              <p className="text-center caption text-[var(--text-tertiary)] border-t border-[var(--border)] pt-4">
                {securityNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ACCOUNT LOGIN - SPLIT LAYOUT
// ============================================================================

function AccountLoginSplit({
  heading = "Sign in to your account",
  subheading = "Access your orders, wishlist, and account settings",
  buttonText = "Continue with Shopify",
  showBenefits = true,
  benefits = [],
  benefitsHeading = "Benefits of signing in",
  securityNote,
  returnTo = "/account",
  image,
  imagePosition = "right",
  spacing = "medium",
  backgroundColor = "default",
}: AccountLoginProps) {
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

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
      <section className={`${getSpacingClasses(spacing)} ${getBackgroundClasses(backgroundColor)}`}>
        <div className="container">
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-violet)]" />
          </div>
        </div>
      </section>
    );
  }

  const ContentSection = () => (
    <div className="flex flex-col justify-center space-y-8">
      {/* Header */}
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-violet)]/10 mb-6">
          <ShoppingBag className="h-7 w-7 text-[var(--accent-violet)]" />
        </div>
        <h2 className="heading-lg">{heading}</h2>
        {subheading && (
          <p className="mt-2 body-lg text-[var(--text-secondary)]">
            {subheading}
          </p>
        )}
      </div>

      {/* Login Button */}
      <div>
        <button
          onClick={handleLogin}
          className="btn btn-primary flex items-center justify-center gap-3"
        >
          <Lock className="h-5 w-5" />
          {buttonText}
        </button>
      </div>

      {/* Benefits */}
      {showBenefits && benefits && benefits.length > 0 && (
        <div className="pt-4">
          <h3 className="body-sm font-medium text-[var(--text-primary)] mb-4">
            {benefitsHeading}
          </h3>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <span className="body-sm text-[var(--text-secondary)]">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Security Note */}
      {securityNote && (
        <p className="caption text-[var(--text-tertiary)]">
          {securityNote}
        </p>
      )}
    </div>
  );

  const ImageSection = () => (
    <div className="relative overflow-hidden rounded-2xl hidden lg:block">
      {image?.src ? (
        <img
          src={image.src}
          alt={image.alt || "Login illustration"}
          className="w-full h-full object-cover min-h-[500px]"
        />
      ) : (
        <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-[var(--accent-cyan)]/20 via-[var(--accent-violet)]/20 to-[var(--accent-pink)]/20 flex items-center justify-center">
          <ShoppingBag className="h-24 w-24 text-[var(--accent-violet)]/30" />
        </div>
      )}
    </div>
  );

  return (
    <section className={`${getSpacingClasses(spacing)} ${getBackgroundClasses(backgroundColor)}`}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {imagePosition === "left" ? (
            <>
              <ImageSection />
              <ContentSection />
            </>
          ) : (
            <>
              <ContentSection />
              <ImageSection />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export function AccountLogin(props: AccountLoginProps) {
  const { layout = "centered" } = props;

  switch (layout) {
    case "card":
      return <AccountLoginCard {...props} />;
    case "split":
      return <AccountLoginSplit {...props} />;
    default:
      return <AccountLoginCentered {...props} />;
  }
}

export default AccountLogin;
