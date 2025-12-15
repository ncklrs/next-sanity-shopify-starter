import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, STATE_COOKIE_NAME } from "@/lib/shopify/customer-auth";

/**
 * POST /api/auth/shopify/logout
 *
 * Log out the customer:
 * 1. Clear all auth-related cookies
 * 2. Return success response
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    // Clear auth cookies
    cookieStore.delete(AUTH_COOKIE_NAME);
    cookieStore.delete(STATE_COOKIE_NAME);

    // Get optional redirect URL
    const body = await request.json().catch(() => ({}));
    const redirectTo = body.redirectTo || "/";

    return NextResponse.json({
      success: true,
      redirectTo,
    });
  } catch (error) {
    console.error("Logout failed:", error);

    // Still try to clear cookies even if there's an error
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    cookieStore.delete(STATE_COOKIE_NAME);

    return NextResponse.json({
      success: true,
      message: "Logged out with warnings",
    });
  }
}
