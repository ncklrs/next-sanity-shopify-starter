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
    console.log("Fetching orders for customer:", authData.customerId);
    const { orders, pageInfo } = await getOrders(authData.accessToken, limit, cursor);
    console.log("Orders fetched:", orders.length, "hasNextPage:", pageInfo.hasNextPage);

    // Transform orders for the frontend with full details
    const transformedOrders = orders.map((order) => {
      // Derive fulfillment status from fulfillments
      const fulfillmentEdges = order.fulfillments?.edges || [];
      let fulfillmentStatus = "UNFULFILLED";
      if (fulfillmentEdges.length > 0) {
        const statuses = fulfillmentEdges.map((f) => f.node.status);
        if (statuses.every((s) => s === "SUCCESS")) {
          fulfillmentStatus = "FULFILLED";
        } else if (statuses.some((s) => s === "SUCCESS")) {
          fulfillmentStatus = "PARTIALLY_FULFILLED";
        } else if (statuses.some((s) => s === "IN_PROGRESS" || s === "PENDING")) {
          fulfillmentStatus = "IN_PROGRESS";
        }
      }

      // Transform fulfillments with tracking info
      const fulfillments = fulfillmentEdges.map((f) => ({
        id: f.node.id,
        status: f.node.status,
        createdAt: f.node.createdAt,
        estimatedDeliveryAt: f.node.estimatedDeliveryAt,
        latestShipmentStatus: f.node.latestShipmentStatus,
        tracking: f.node.trackingInformation?.map((t) => ({
          company: t.company,
          number: t.number,
          url: t.url,
        })) || [],
      }));

      // Transform address for display
      const formatAddress = (addr: typeof order.shippingAddress) => {
        if (!addr) return null;
        return {
          name: [addr.firstName, addr.lastName].filter(Boolean).join(" "),
          company: addr.company,
          address1: addr.address1,
          address2: addr.address2,
          city: addr.city,
          zone: addr.zoneCode,
          zip: addr.zip,
          phone: addr.phoneNumber,
          formatted: addr.formatted,
        };
      };

      return {
        id: order.id,
        name: order.name,
        orderNumber: order.number,
        processedAt: order.processedAt,
        financialStatus: order.financialStatus,
        fulfillmentStatus,
        totalPrice: order.totalPrice,
        subtotal: order.subtotal,
        totalTax: order.totalTax,
        totalShipping: order.totalShipping,
        shippingAddress: formatAddress(order.shippingAddress),
        billingAddress: formatAddress(order.billingAddress),
        fulfillments,
        lineItems: order.lineItems.edges.map((edge) => ({
          id: edge.node.id,
          title: edge.node.title,
          quantity: edge.node.quantity,
          price: edge.node.price,
          totalPrice: edge.node.totalPrice,
          image: edge.node.image?.url,
        })),
      };
    });

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
