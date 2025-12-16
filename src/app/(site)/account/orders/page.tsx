"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  MapPin,
  CreditCard,
} from "lucide-react";

interface Money {
  amount: string;
  currencyCode: string;
}

interface LineItem {
  id: string;
  title: string;
  quantity: number;
  price: Money;
  totalPrice: Money;
  image?: string;
}

interface TrackingInfo {
  company: string | null;
  number: string | null;
  url: string | null;
}

interface Fulfillment {
  id: string;
  status: string;
  createdAt: string;
  estimatedDeliveryAt: string | null;
  latestShipmentStatus: string | null;
  tracking: TrackingInfo[];
}

interface Address {
  name: string;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zone: string | null;
  zip: string | null;
  phone: string | null;
  formatted: string[];
}

interface Order {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: Money;
  subtotal: Money;
  totalTax: Money;
  totalShipping: Money;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  fulfillments: Fulfillment[];
  lineItems: LineItem[];
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
 * Shows paginated list of customer orders with full details
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (cursor?: string) => {
    const url = cursor
      ? `/api/customer/orders?cursor=${cursor}`
      : "/api/customer/orders";
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch orders");
    }

    return res.json() as Promise<OrdersResponse>;
  }, []);

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
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-[var(--accent-red)] bg-red-50 p-6 text-center">
        <p className="text-[var(--accent-red)]">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm font-medium text-[var(--accent-red)] underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display-md">Order History</h1>
        <p className="mt-2 text-[var(--foreground-muted)]">View and track your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="border border-dashed border-[var(--border-light)] bg-[var(--surface)] py-16 text-center">
          <Package className="mx-auto h-12 w-12 text-[var(--foreground-muted)] opacity-40" />
          <h3 className="mt-4 font-serif text-lg text-[var(--foreground)]">
            No orders yet
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            When you place orders, they&apos;ll appear here.
          </p>
          <Link href="/products" className="btn btn-primary mt-6">
            Start Shopping
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
                className="btn btn-secondary"
              >
                {loadingMore ? "Loading..." : "Load More Orders"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Expandable Order Card Component
 */
function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatMoney = (money: Money) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: money.currencyCode,
    }).format(parseFloat(money.amount));

  const formatStatus = (status: string) =>
    status
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <div className="border border-[var(--border-light)] bg-[var(--surface)] overflow-hidden">
      {/* Order Header - Always Visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 hover:bg-[var(--background-warm)] transition-colors duration-300">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">Order</p>
              <p className="font-medium text-[var(--foreground)]">{order.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">Date</p>
              <p className="font-medium text-[var(--foreground)]">
                {formatDate(order.processedAt)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">Total</p>
              <p className="font-medium text-[var(--foreground)]">
                {formatMoney(order.totalPrice)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StatusBadge status={order.fulfillmentStatus} />
            <StatusBadge status={order.financialStatus} variant="financial" />
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-[var(--foreground-muted)]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[var(--foreground-muted)]" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-[var(--border-light)]">
          {/* Line Items */}
          <div className="px-6 py-6">
            <h4 className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-4">Items</h4>
            <div className="space-y-4">
              {order.lineItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 object-cover bg-[var(--background-warm)]"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center bg-[var(--background-warm)]">
                      <Package className="h-6 w-6 text-[var(--foreground-muted)]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">
                      {item.title}
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Qty: {item.quantity} × {formatMoney(item.price)}
                    </p>
                  </div>
                  <p className="font-medium text-[var(--foreground)]">
                    {formatMoney(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-[var(--border-light)] px-6 py-6 bg-[var(--background-warm)]">
            <div className="max-w-xs ml-auto space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--foreground-muted)]">Subtotal</span>
                <span className="text-[var(--foreground)]">
                  {formatMoney(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--foreground-muted)]">Shipping</span>
                <span className="text-[var(--foreground)]">
                  {formatMoney(order.totalShipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--foreground-muted)]">Tax</span>
                <span className="text-[var(--foreground)]">
                  {formatMoney(order.totalTax)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-[var(--border-light)]">
                <span className="text-[var(--foreground)]">Total</span>
                <span className="text-[var(--foreground)]">
                  {formatMoney(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Fulfillment & Tracking */}
          {order.fulfillments.length > 0 && (
            <div className="border-t border-[var(--border-light)] px-6 py-6">
              <h4 className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-4 flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping & Tracking
              </h4>
              <div className="space-y-4">
                {order.fulfillments.map((fulfillment) => (
                  <div
                    key={fulfillment.id}
                    className="border border-[var(--border-light)] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StatusBadge status={fulfillment.status} />
                      {fulfillment.latestShipmentStatus && (
                        <span className="text-sm text-[var(--foreground-muted)]">
                          {formatStatus(fulfillment.latestShipmentStatus)}
                        </span>
                      )}
                    </div>
                    {fulfillment.estimatedDeliveryAt && (
                      <p className="text-sm text-[var(--foreground-muted)] mb-2">
                        Estimated delivery:{" "}
                        {formatDate(fulfillment.estimatedDeliveryAt)}
                      </p>
                    )}
                    {fulfillment.tracking.length > 0 && (
                      <div className="space-y-2">
                        {fulfillment.tracking.map((track, idx) => (
                          <div key={idx} className="text-sm">
                            {track.company && (
                              <span className="text-[var(--foreground-muted)]">
                                {track.company}:{" "}
                              </span>
                            )}
                            {track.url ? (
                              <a
                                href={track.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--foreground)] underline hover:no-underline"
                              >
                                {track.number || "Track package"}
                              </a>
                            ) : (
                              <span className="text-[var(--foreground)]">
                                {track.number}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Addresses */}
          <div className="border-t border-[var(--border-light)] px-6 py-6">
            <div className="grid gap-8 sm:grid-cols-2">
              {order.shippingAddress && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h4>
                  <AddressDisplay address={order.shippingAddress} />
                </div>
              )}
              {order.billingAddress && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Billing Address
                  </h4>
                  <AddressDisplay address={order.billingAddress} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Address Display Component
 */
function AddressDisplay({ address }: { address: Address }) {
  // Use formatted array if available, otherwise build from parts
  if (address.formatted && address.formatted.length > 0) {
    return (
      <div className="text-sm text-[var(--foreground-muted)] space-y-0.5">
        {address.formatted.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    );
  }

  return (
    <div className="text-sm text-[var(--foreground-muted)] space-y-0.5">
      {address.name && <p className="font-medium text-[var(--foreground)]">{address.name}</p>}
      {address.company && <p>{address.company}</p>}
      {address.address1 && <p>{address.address1}</p>}
      {address.address2 && <p>{address.address2}</p>}
      <p>
        {[address.city, address.zone, address.zip].filter(Boolean).join(", ")}
      </p>
      {address.phone && <p>{address.phone}</p>}
    </div>
  );
}

/**
 * Status Badge Component
 */
function StatusBadge({
  status,
  variant = "fulfillment",
}: {
  status: string;
  variant?: "fulfillment" | "financial";
}) {
  const getStatusStyle = () => {
    const statusLower = status.toLowerCase();

    if (
      statusLower.includes("fulfilled") ||
      statusLower === "paid" ||
      statusLower === "success"
    ) {
      return "bg-green-50 text-green-800 border-green-200";
    }
    if (
      statusLower.includes("pending") ||
      statusLower === "unfulfilled" ||
      statusLower === "authorized"
    ) {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    if (statusLower.includes("cancel") || statusLower.includes("refund")) {
      return "bg-red-50 text-red-800 border-red-200";
    }
    if (statusLower.includes("progress")) {
      return "bg-blue-50 text-blue-800 border-blue-200";
    }
    return "bg-[var(--background-warm)] text-[var(--foreground)] border-[var(--border-light)]";
  };

  const formatStatus = (s: string) =>
    s
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center border px-2.5 py-0.5 text-xs font-medium ${getStatusStyle()}`}
    >
      {formatStatus(status)}
    </span>
  );
}
