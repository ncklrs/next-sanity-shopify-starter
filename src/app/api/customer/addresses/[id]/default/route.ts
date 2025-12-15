import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  decryptToken,
  isTokenExpired,
  AUTH_COOKIE_NAME,
} from "@/lib/shopify/customer-auth";
import { setDefaultAddress } from "@/lib/shopify/customer-api";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  customerId: string;
}

/**
 * POST /api/customer/addresses/[id]/default
 *
 * Set an address as the default
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const address = await setDefaultAddress(authData.accessToken, id);

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Failed to set default address:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to set default address" },
      { status: 500 }
    );
  }
}
