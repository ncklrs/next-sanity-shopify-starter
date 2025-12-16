import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  exchangeCodeForTokens,
  encryptToken,
  decryptToken,
  AUTH_COOKIE_NAME,
  STATE_COOKIE_NAME,
  cookieOptions,
  customerApiRequest,
} from "@/lib/shopify/customer-auth";
import type { OAuthState } from "@/lib/shopify/customer-types";
import { writeClient as client } from "../../../../../../sanity/lib/client";

// Minimal customer data needed for login
interface CustomerLoginData {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

// GraphQL query to fetch customer data after successful auth
// Uses Customer Account API schema (different from Admin/Storefront APIs)
// Note: createdAt and numberOfOrders are NOT available in Customer Account API
const CUSTOMER_QUERY = `
  query CustomerInfo {
    customer {
      id
      emailAddress {
        emailAddress
      }
      firstName
      lastName
      phoneNumber {
        phoneNumber
      }
    }
  }
`;

/**
 * GET /api/auth/shopify/callback
 *
 * OAuth callback handler:
 * 1. Validate state parameter (CSRF protection)
 * 2. Exchange authorization code for tokens
 * 3. Fetch customer data from Shopify
 * 4. Create/update customer in Sanity
 * 5. Set auth cookie and redirect
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Use APP_URL for all redirects to ensure correct domain
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  // Handle OAuth errors from Shopify
  if (error) {
    console.error("OAuth error:", error, errorDescription);
    const errorUrl = new URL("/account/login", baseUrl);
    errorUrl.searchParams.set("error", error);
    if (errorDescription) {
      errorUrl.searchParams.set("error_description", errorDescription);
    }
    return NextResponse.redirect(errorUrl);
  }

  // Verify required parameters
  if (!code || !state) {
    console.error("Missing code or state parameter");
    const errorUrl = new URL("/account/login", baseUrl);
    errorUrl.searchParams.set("error", "invalid_request");
    return NextResponse.redirect(errorUrl);
  }

  try {
    // Retrieve and validate the stored state
    const cookieStore = await cookies();
    const stateCookie = cookieStore.get(STATE_COOKIE_NAME);

    if (!stateCookie) {
      throw new Error("State cookie not found - session may have expired");
    }

    const storedState: OAuthState = JSON.parse(decryptToken(stateCookie.value));

    // Verify state matches (CSRF protection)
    if (storedState.state !== state) {
      throw new Error("State mismatch - possible CSRF attack");
    }

    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code, storedState.codeVerifier);

    // Fetch customer data from Shopify
    const response = await customerApiRequest<{
      customer: {
        id: string;
        emailAddress?: { emailAddress: string };
        firstName?: string;
        lastName?: string;
        phoneNumber?: { phoneNumber: string };
      };
    }>(tokens.accessToken, CUSTOMER_QUERY);

    if (!response.customer) {
      throw new Error("Failed to fetch customer data");
    }

    // Transform the Customer Account API response to our format
    const customer: CustomerLoginData = {
      id: response.customer.id,
      email: response.customer.emailAddress?.emailAddress || "",
      firstName: response.customer.firstName || null,
      lastName: response.customer.lastName || null,
      phone: response.customer.phoneNumber?.phoneNumber || null,
    };

    // Upsert customer in Sanity (create or update)
    await upsertSanityCustomer(customer);

    // Clear the state cookie
    cookieStore.delete(STATE_COOKIE_NAME);

    // Set the auth cookie with encrypted tokens
    const authData = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt: tokens.expiresAt,
      customerId: customer.id,
    };

    cookieStore.set(
      AUTH_COOKIE_NAME,
      encryptToken(JSON.stringify(authData)),
      cookieOptions
    );

    // Redirect to the returnTo URL or account page
    const redirectUrl = storedState.returnTo || "/account";

    // Debug logging
    console.log("=== CALLBACK REDIRECT DEBUG ===");
    console.log("returnTo:", redirectUrl);
    console.log("request.nextUrl.origin:", request.nextUrl.origin);
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
    console.log("================================");

    // Use APP_URL for redirect to ensure correct domain
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    return NextResponse.redirect(new URL(redirectUrl, appUrl));
  } catch (error) {
    console.error("OAuth callback failed:", error);

    // Clear any partial state
    const cookieStore = await cookies();
    cookieStore.delete(STATE_COOKIE_NAME);

    const errorUrl = new URL("/account/login", baseUrl);
    errorUrl.searchParams.set("error", "callback_failed");
    return NextResponse.redirect(errorUrl);
  }
}

/**
 * Create or update customer record in Sanity
 */
async function upsertSanityCustomer(shopifyCustomer: CustomerLoginData) {
  const existingCustomer = await client.fetch(
    `*[_type == "customer" && shopifyCustomerId == $shopifyId][0]`,
    { shopifyId: shopifyCustomer.id }
  );

  const customerData = {
    _type: "customer",
    shopifyCustomerId: shopifyCustomer.id,
    email: shopifyCustomer.email,
    firstName: shopifyCustomer.firstName,
    lastName: shopifyCustomer.lastName,
    phone: shopifyCustomer.phone,
    acceptsMarketing: false, // Will be updated when full profile is fetched
    lastLoginAt: new Date().toISOString(),
  };

  if (existingCustomer) {
    // Update existing customer
    await client
      .patch(existingCustomer._id)
      .set({
        ...customerData,
        // Preserve existing wishlist and preferences
        wishlist: existingCustomer.wishlist || [],
        recentlyViewed: existingCustomer.recentlyViewed || [],
        preferences: existingCustomer.preferences || {},
      })
      .commit();
  } else {
    // Create new customer
    await client.create({
      ...customerData,
      wishlist: [],
      recentlyViewed: [],
      preferences: {},
      totalSpent: 0,
    });
  }
}
