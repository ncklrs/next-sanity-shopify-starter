import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  decryptToken,
  isTokenExpired,
  AUTH_COOKIE_NAME,
} from "@/lib/shopify/customer-auth";
import { getOrders } from "@/lib/shopify/customer-api";

interface AuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  customerId: string;
}

/**
 * GET /api/customer/orders
 *
 * Fetch customer orders from Shopify
 * Supports pagination with cursor
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

    // Check if token is expired
    if (isTokenExpired(authData.expiresAt)) {
      return NextResponse.json(
        { error: "Token expired", requiresRefresh: true },
        { status: 401 }
      );
    }

    // Get pagination parameters
    const cursor = request.nextUrl.searchParams.get("cursor") || undefined;
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10", 10);

    // Fetch orders from Shopify
    const { orders, pageInfo } = await getOrders(authData.accessToken, limit, cursor);

    // Transform orders for the frontend
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      name: order.name,
      orderNumber: order.orderNumber,
      processedAt: order.processedAt,
      financialStatus: order.financialStatus,
      fulfillmentStatus: order.fulfillmentStatus,
      totalPrice: order.currentTotalPrice,
      statusUrl: order.statusUrl,
      lineItems: order.lineItems.edges.map((edge) => ({
        title: edge.node.title,
        quantity: edge.node.quantity,
        image: edge.node.variant?.image?.url,
      })),
    }));

    return NextResponse.json({
      orders: transformedOrders,
      pageInfo,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
