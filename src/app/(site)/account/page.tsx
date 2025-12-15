"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, Heart, ChevronRight, Loader2 } from "lucide-react";

interface OrderSummary {
  total: number;
  recent: Array<{
    id: string;
    name: string;
    date: string;
    status: string;
    amount: string;
  }>;
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
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch recent orders from API
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/customer/orders?limit=3");
        if (res.ok) {
          const data = await res.json();
          setOrderSummary(data);
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Welcome back, {customer?.firstName || "there"}! Here's an overview of your account.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-indigo-100 p-3">
              <Package className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {customer?.totalOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Saved Addresses</p>
              <p className="text-2xl font-bold text-gray-900">-</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-pink-100 p-3">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wishlist Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {customer?.wishlist?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {loadingOrders ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : orderSummary?.recent && orderSummary.recent.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {orderSummary.recent.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">{order.name}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.amount}</p>
                  <p className="text-sm text-gray-500">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No orders yet</p>
            <Link
              href="/products"
              className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Start shopping
            </Link>
          </div>
        )}
      </div>

      {/* Account Details */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
          <Link
            href="/account/profile"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Edit
          </Link>
        </div>
        <div className="px-6 py-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="mt-1 text-gray-900">
                {[customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
                  "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="mt-1 text-gray-900">{customer?.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Phone</dt>
              <dd className="mt-1 text-gray-900">{customer?.phone || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Marketing</dt>
              <dd className="mt-1 text-gray-900">
                {customer?.acceptsMarketing ? "Subscribed" : "Not subscribed"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
