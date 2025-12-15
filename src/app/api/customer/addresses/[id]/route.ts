import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  decryptToken,
  isTokenExpired,
  AUTH_COOKIE_NAME,
} from "@/lib/shopify/customer-auth";
import { updateAddress, deleteAddress } from "@/lib/shopify/customer-api";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  customerId: string;
}

/**
 * PUT /api/customer/addresses/[id]
 *
 * Update an existing address
 */
export async function PUT(
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
    const body = await request.json();
    const address = await updateAddress(authData.accessToken, id, body);

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Failed to update address:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update address" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/customer/addresses/[id]
 *
 * Delete an address
 */
export async function DELETE(
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
    const deletedId = await deleteAddress(authData.accessToken, id);

    return NextResponse.json({ deletedId });
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete address" },
      { status: 500 }
    );
  }
}
