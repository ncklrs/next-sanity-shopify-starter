"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";

interface OrdersResponse {
  orders: Array<{
    id: string;
    name: string;
    processedAt: string;
    fulfillmentStatus: string;
    totalPrice: {
      amount: string;
      currencyCode: string;
    };
  }>;
  pageInfo: {
    hasNextPage: boolean;
  };
}

/**
 * Account Dashboard
 *
 * Shows:
 * - Customer overview
 * - Recent orders
 * - Quick links to other sections
 */
export default function AccountDashboard() {
  const { customer, isLoading } = useAuth();
  const [ordersData, setOrdersData] = useState<OrdersResponse | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch recent orders from API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/customer/orders?limit=3");
        if (res.ok) {
          const data: OrdersResponse = await res.json();
          setOrdersData(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (customer) {
      fetchOrders();
    } else {
      setLoadingOrders(false);
    }
  }, [customer]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div>
        <h1 className="display-md">Account Overview</h1>
        <p className="mt-2 text-[var(--foreground-muted)]">
          Welcome back, {customer?.firstName || "there"}. Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="border border-[var(--border-light)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-[var(--background-warm)]">
              <Package className="h-5 w-5 text-[var(--foreground)]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Recent Orders
              </p>
              <p className="mt-1 font-serif text-2xl text-[var(--foreground)]">
                {ordersData?.orders?.length ?? "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-[var(--border-light)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-[var(--background-warm)]">
              <MapPin className="h-5 w-5 text-[var(--foreground)]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Saved Addresses
              </p>
              <p className="mt-1 font-serif text-2xl text-[var(--foreground)]">—</p>
            </div>
          </div>
        </div>

        <div className="border border-[var(--border-light)] bg-[var(--surface)] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center bg-[var(--background-warm)]">
              <Heart className="h-5 w-5 text-[var(--foreground)]" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Wishlist Items
              </p>
              <p className="mt-1 font-serif text-2xl text-[var(--foreground)]">
                {customer?.wishlist?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="border border-[var(--border-light)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-6 py-4">
          <h2 className="font-serif text-lg text-[var(--foreground)]">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-300"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loadingOrders ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--foreground-muted)] border-t-transparent" />
          </div>
        ) : ordersData?.orders && ordersData.orders.length > 0 ? (
          <div className="divide-y divide-[var(--border-light)]">
            {ordersData.orders.map((order) => {
              const formattedDate = new Date(order.processedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const formattedAmount = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: order.totalPrice.currencyCode,
              }).format(parseFloat(order.totalPrice.amount));
              const formattedStatus = order.fulfillmentStatus
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/^\w/, (c) => c.toUpperCase());

              return (
                <div key={order.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{order.name}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">{formattedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[var(--foreground)]">{formattedAmount}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">{formattedStatus}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-[var(--foreground-muted)] opacity-40" />
            <p className="mt-4 text-[var(--foreground-muted)]">No orders yet</p>
            <Link href="/products" className="btn btn-primary mt-6">
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Account Details */}
      <div className="border border-[var(--border-light)] bg-[var(--surface)]">
        <div className="flex items-center justify-between border-b border-[var(--border-light)] px-6 py-4">
          <h2 className="font-serif text-lg text-[var(--foreground)]">Account Details</h2>
          <Link
            href="/account/profile"
            className="text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-300"
          >
            Edit
          </Link>
        </div>
        <div className="px-6 py-6">
          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Name
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {[customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
                  "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Email
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">{customer?.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Phone
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">{customer?.phone || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Marketing
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {customer?.acceptsMarketing ? "Subscribed" : "Not subscribed"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
