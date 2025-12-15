import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  decryptToken,
  isTokenExpired,
  AUTH_COOKIE_NAME,
} from "@/lib/shopify/customer-auth";
import { getCustomer, updateCustomer } from "@/lib/shopify/customer-api";
import { writeClient as client } from "../../../../../sanity/lib/client";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  customerId: string;
}

/**
 * GET /api/customer/profile
 *
 * Fetch customer profile from Shopify
 */
export async function GET(request: NextRequest) {
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

    if (isTokenExpired(authData.expiresAt)) {
      return NextResponse.json(
        { error: "Token expired", requiresRefresh: true },
        { status: 401 }
      );
    }

    const customer = await getCustomer(authData.accessToken);

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/customer/profile
 *
 * Update customer profile in Shopify and sync to Sanity
 */
export async function PUT(request: NextRequest) {
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

    if (isTokenExpired(authData.expiresAt)) {
      return NextResponse.json(
        { error: "Token expired", requiresRefresh: true },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, phone, acceptsMarketing } = body;

    // Update in Shopify
    const updatedCustomer = await updateCustomer(authData.accessToken, {
      firstName,
      lastName,
      phone,
      acceptsMarketing,
    });

    // Sync to Sanity
    if (updatedCustomer) {
      const sanityCustomer = await client.fetch(
        `*[_type == "customer" && shopifyCustomerId == $shopifyId][0]`,
        { shopifyId: authData.customerId }
      );

      if (sanityCustomer) {
        await client
          .patch(sanityCustomer._id)
          .set({
            firstName: updatedCustomer.firstName,
            lastName: updatedCustomer.lastName,
            phone: updatedCustomer.phone,
            acceptsMarketing: updatedCustomer.acceptsMarketing,
          })
          .commit();
      }
    }

    // Return updated Sanity customer data
    const sanityCustomer = await client.fetch(
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

    return NextResponse.json({ customer: sanityCustomer });
  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500 }
    );
  }
}
