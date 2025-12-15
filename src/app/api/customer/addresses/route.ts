import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  decryptToken,
  isTokenExpired,
  AUTH_COOKIE_NAME,
} from "@/lib/shopify/customer-auth";
import { getAddresses, createAddress } from "@/lib/shopify/customer-api";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  customerId: string;
}

/**
 * GET /api/customer/addresses
 *
 * Fetch customer addresses from Shopify
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

    const { addresses, defaultAddressId } = await getAddresses(authData.accessToken);

    // Mark which address is default
    const addressesWithDefault = addresses.map((address) => ({
      ...address,
      isDefault: address.id === defaultAddressId,
    }));

    return NextResponse.json({ addresses: addressesWithDefault });
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customer/addresses
 *
 * Create a new address
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

    if (isTokenExpired(authData.expiresAt)) {
      return NextResponse.json(
        { error: "Token expired", requiresRefresh: true },
        { status: 401 }
      );
    }

    const body = await request.json();
    const address = await createAddress(authData.accessToken, body);

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Failed to create address:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create address" },
      { status: 500 }
    );
  }
}
