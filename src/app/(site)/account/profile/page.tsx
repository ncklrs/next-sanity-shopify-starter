"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";

/**
 * Profile Page
 * Edit customer profile information
 */
export default function ProfilePage() {
  const { customer, isLoading, updateCustomer } = useAuth();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    phone: customer?.phone || "",
    acceptsMarketing: customer?.acceptsMarketing || false,
  });

  // Update form when customer data loads
  if (customer && !formData.firstName && customer.firstName) {
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName || "",
      phone: customer.phone || "",
      acceptsMarketing: customer.acceptsMarketing,
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update profile");
      }

      const data = await res.json();
      updateCustomer(data.customer);
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="display-md">Profile Settings</h1>
        <p className="mt-2 text-[var(--foreground-muted)]">
          Update your personal information
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-3 border border-green-200 bg-green-50 p-4">
          <Check className="h-5 w-5 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            Profile updated successfully
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 border border-[var(--accent-red)] bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-[var(--accent-red)]" />
          <p className="text-sm font-medium text-[var(--accent-red)]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="border border-[var(--border-light)] bg-[var(--surface)] p-6">
          <h2 className="font-serif text-lg text-[var(--foreground)]">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            This information will be used for your orders
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First name
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                }
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                }
                className="input"
              />
            </div>

            <div className="form-group sm:col-span-2">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={customer?.email || ""}
                disabled
                className="input bg-[var(--background-warm)] text-[var(--foreground-muted)] cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-[var(--foreground-muted)]">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <div className="form-group sm:col-span-2">
              <label htmlFor="phone" className="form-label">
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+1 (555) 000-0000"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Communication Preferences */}
        <div className="border border-[var(--border-light)] bg-[var(--surface)] p-6">
          <h2 className="font-serif text-lg text-[var(--foreground)]">
            Communication Preferences
          </h2>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Manage how we contact you
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="marketing"
                checked={formData.acceptsMarketing}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    acceptsMarketing: e.target.checked,
                  }))
                }
                className="mt-1 h-4 w-4 border-[var(--border-light)] text-[var(--foreground)] focus:ring-[var(--foreground)]"
              />
              <label htmlFor="marketing" className="text-sm">
                <span className="font-medium text-[var(--foreground)]">
                  Marketing emails
                </span>
                <p className="text-[var(--foreground-muted)]">
                  Receive emails about new products, sales, and special offers
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="border border-[var(--border-light)] bg-[var(--surface)] p-6">
          <h2 className="font-serif text-lg text-[var(--foreground)]">
            Account Information
          </h2>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Account created
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {customer?.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Last login
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {customer?.lastLoginAt
                  ? new Date(customer.lastLoginAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Total orders
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">{customer?.totalOrders || 0}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
                Total spent
              </dt>
              <dd className="mt-1 text-[var(--foreground)]">
                {customer?.totalSpent
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(customer.totalSpent / 100)
                  : "$0.00"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
