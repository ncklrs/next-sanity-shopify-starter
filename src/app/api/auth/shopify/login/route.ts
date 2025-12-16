import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  getAuthorizationUrl,
  encryptToken,
  STATE_COOKIE_NAME,
  stateCookieOptions,
} from "@/lib/shopify/customer-auth";

/**
 * GET /api/auth/shopify/login
 *
 * Initiates the OAuth 2.0 + PKCE flow:
 * 1. Generate PKCE code verifier and challenge
 * 2. Generate state for CSRF protection
 * 3. Store state in encrypted cookie
 * 4. Redirect to Shopify authorization endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Get optional returnTo parameter for post-login redirect
    const returnTo = request.nextUrl.searchParams.get("returnTo") || "/account";

    // Generate authorization URL with PKCE
    const { url, state } = await getAuthorizationUrl(returnTo);

    // Debug logging
    console.log("=== LOGIN DEBUG ===");
    console.log("Authorization URL:", url);
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
    console.log("===================");

    // Store the state (including code verifier) in an encrypted cookie
    const cookieStore = await cookies();
    cookieStore.set(
      STATE_COOKIE_NAME,
      encryptToken(JSON.stringify(state)),
      stateCookieOptions
    );

    // Redirect to Shopify's authorization endpoint
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Login initiation failed:", error);

    // Redirect to login page with error
    const errorUrl = new URL("/account/login", request.nextUrl.origin);
    errorUrl.searchParams.set("error", "login_failed");
    return NextResponse.redirect(errorUrl);
  }
}
