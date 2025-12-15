import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  refreshAccessToken,
  encryptToken,
  decryptToken,
  isTokenExpired,
  AUTH_COOKIE_NAME,
  cookieOptions,
} from "@/lib/shopify/customer-auth";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  customerId: string;
}

/**
 * POST /api/auth/shopify/refresh
 *
 * Refresh the access token if expired:
 * 1. Check if current token is expired
 * 2. Use refresh token to get new access token
 * 3. Update auth cookie with new tokens
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!authCookie) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const authData: AuthData = JSON.parse(decryptToken(authCookie.value));

    // Check if token needs refresh
    if (!isTokenExpired(authData.expiresAt)) {
      return NextResponse.json({
        refreshed: false,
        message: "Token is still valid",
      });
    }

    // Refresh the token
    const newTokens = await refreshAccessToken(authData.refreshToken);

    // Update the auth cookie with new tokens
    const newAuthData: AuthData = {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
      expiresAt: newTokens.expiresAt,
      customerId: authData.customerId,
    };

    cookieStore.set(
      AUTH_COOKIE_NAME,
      encryptToken(JSON.stringify(newAuthData)),
      cookieOptions
    );

    return NextResponse.json({
      refreshed: true,
      expiresAt: newTokens.expiresAt,
    });
  } catch (error) {
    console.error("Token refresh failed:", error);

    // If refresh fails, clear the auth cookie
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);

    return NextResponse.json(
      { error: "Token refresh failed", requiresLogin: true },
      { status: 401 }
    );
  }
}
