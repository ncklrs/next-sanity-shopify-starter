import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  decryptToken,
  isTokenExpired,
  AUTH_COOKIE_NAME,
  customerApiRequest,
} from "@/lib/shopify/customer-auth";
import type { SanityCustomer } from "@/lib/shopify/customer-types";
import { client } from "../../../../../../sanity/lib/client";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  customerId: string;
}

/**
 * GET /api/auth/shopify/session
 *
 * Get the current authentication session:
 * 1. Check for auth cookie
 * 2. Validate token is not expired
 * 3. Return customer data from Sanity (faster than Shopify API)
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

    if (!authCookie) {
      return NextResponse.json({
        isAuthenticated: false,
        customer: null,
      });
    }

    let authData: AuthData;
    try {
      authData = JSON.parse(decryptToken(authCookie.value));
    } catch {
      // Invalid cookie data
      return NextResponse.json({
        isAuthenticated: false,
        customer: null,
        requiresLogin: true,
      });
    }

    // Check if token needs refresh
    const needsRefresh = isTokenExpired(authData.expiresAt);

    // Fetch customer from Sanity (faster than Shopify API)
    const customer: SanityCustomer | null = await client.fetch(
      `*[_type == "customer" && shopifyCustomerId == $shopifyId][0]{
        _id,
        _type,
        shopifyCustomerId,
        email,
        firstName,
        lastName,
        phone,
        acceptsMarketing,
        wishlist,
        recentlyViewed,
        preferences,
        totalOrders,
        totalSpent,
        createdAt,
        lastLoginAt
      }`,
      { shopifyId: authData.customerId }
    );

    if (!customer) {
      // Customer exists in Shopify but not Sanity - this shouldn't happen
      // but handle it gracefully
      return NextResponse.json({
        isAuthenticated: true,
        customer: null,
        needsRefresh,
        customerId: authData.customerId,
      });
    }

    return NextResponse.json({
      isAuthenticated: true,
      customer,
      needsRefresh,
      expiresAt: authData.expiresAt,
    });
  } catch (error) {
    console.error("Session check failed:", error);

    return NextResponse.json({
      isAuthenticated: false,
      customer: null,
      error: "Session check failed",
    });
  }
}
