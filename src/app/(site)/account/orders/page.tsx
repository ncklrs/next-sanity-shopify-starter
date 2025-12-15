"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Package, ChevronRight, Loader2, ExternalLink } from "lucide-react";

interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  statusUrl: string;
  lineItems: Array<{
    title: string;
    quantity: number;
    image?: string;
  }>;
}

interface OrdersResponse {
  orders: Order[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}

/**
 * Orders Page
 * Shows paginated list of customer orders with status
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (cursor?: string) => {
    try {
      const url = cursor
        ? `/api/customer/orders?cursor=${cursor}`
        : "/api/customer/orders";
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data: OrdersResponse = await res.json();
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  // Initial load
  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await fetchOrders();
        setOrders(data.orders);
        setHasNextPage(data.pageInfo.hasNextPage);
        setEndCursor(data.pageInfo.endCursor);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [fetchOrders]);

  // Load more orders
  const loadMore = async () => {
    if (!endCursor || loadingMore) return;

    setLoadingMore(true);
    try {
      const data = await fetchOrders(endCursor);
      setOrders((prev) => [...prev, ...data.orders]);
      setHasNextPage(data.pageInfo.hasNextPage);
      setEndCursor(data.pageInfo.endCursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more orders");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-medium text-red-600 hover:text-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
        <p className="mt-1 text-gray-600">
          View and track your orders
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
          <p className="mt-2 text-gray-500">
            When you place orders, they'll appear here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more orders"
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Order Card Component
 */
function OrderCard({ order }: { order: Order }) {
  const formattedDate = new Date(order.processedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: order.totalPrice.currencyCode,
  }).format(parseFloat(order.totalPrice.amount));

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* Order Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <p className="text-sm text-gray-500">Order number</p>
            <p className="font-medium text-gray-900">{order.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date placed</p>
            <p className="font-medium text-gray-900">{formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-medium text-gray-900">{formattedTotal}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <StatusBadge status={order.fulfillmentStatus} type="fulfillment" />
          <a
            href={order.statusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View details
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Order Items */}
      <div className="divide-y divide-gray-200 px-6">
        {order.lineItems.slice(0, 3).map((item, index) => (
          <div key={index} className="flex items-center gap-4 py-4">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
          </div>
        ))}
        {order.lineItems.length > 3 && (
          <p className="py-4 text-sm text-gray-500">
            + {order.lineItems.length - 3} more items
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Status Badge Component
 */
function StatusBadge({
  status,
  type,
}: {
  status: string;
  type: "fulfillment" | "financial";
}) {
  const getStatusStyle = () => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("fulfilled") || statusLower === "paid") {
      return "bg-green-100 text-green-800";
    }
    if (statusLower.includes("pending") || statusLower === "unfulfilled") {
      return "bg-yellow-100 text-yellow-800";
    }
    if (statusLower.includes("cancel") || statusLower.includes("refund")) {
      return "bg-red-100 text-red-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const formatStatus = (s: string) => {
    return s.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle()}`}
    >
      {formatStatus(status)}
    </span>
  );
}
