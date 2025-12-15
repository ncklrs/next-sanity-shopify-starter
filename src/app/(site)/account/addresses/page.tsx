"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Plus, Pencil, Trash2, Loader2, Check } from "lucide-react";

interface Address {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
  isDefault: boolean;
}

/**
 * Addresses Page
 * Manage customer addresses with CRUD operations
 */
export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/addresses");
      if (!res.ok) throw new Error("Failed to fetch addresses");
      const data = await res.json();
      setAddresses(data.addresses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await fetch(`/api/customer/addresses/${addressId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete address");

      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await fetch(`/api/customer/addresses/${addressId}/default`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to set default address");

      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to set default address");
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Addresses</h1>
          <p className="mt-1 text-gray-600">
            Manage your shipping and billing addresses
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No addresses saved
          </h3>
          <p className="mt-2 text-gray-500">
            Add an address for faster checkout
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setEditingId(address.id)}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Address Modal would go here */}
      {(showAddForm || editingId) && (
        <AddressFormModal
          address={editingId ? addresses.find((a) => a.id === editingId) : undefined}
          onClose={() => {
            setShowAddForm(false);
            setEditingId(null);
          }}
          onSave={() => {
            setShowAddForm(false);
            setEditingId(null);
            fetchAddresses();
          }}
        />
      )}
    </div>
  );
}

/**
 * Address Card Component
 */
function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}) {
  const fullName = [address.firstName, address.lastName].filter(Boolean).join(" ");

  return (
    <div className="relative rounded-lg border border-gray-200 bg-white p-6">
      {address.isDefault && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
          <Check className="h-3 w-3" />
          Default
        </span>
      )}

      <div className="space-y-1">
        {fullName && <p className="font-medium text-gray-900">{fullName}</p>}
        {address.company && <p className="text-gray-600">{address.company}</p>}
        {address.address1 && <p className="text-gray-600">{address.address1}</p>}
        {address.address2 && <p className="text-gray-600">{address.address2}</p>}
        <p className="text-gray-600">
          {[address.city, address.province, address.zip].filter(Boolean).join(", ")}
        </p>
        {address.country && <p className="text-gray-600">{address.country}</p>}
        {address.phone && <p className="mt-2 text-gray-600">{address.phone}</p>}
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        {!address.isDefault && (
          <button
            onClick={onSetDefault}
            className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Set as default
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Address Form Modal Component
 */
function AddressFormModal({
  address,
  onClose,
  onSave,
}: {
  address?: Address;
  onClose: () => void;
  onSave: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: address?.firstName || "",
    lastName: address?.lastName || "",
    company: address?.company || "",
    address1: address?.address1 || "",
    address2: address?.address2 || "",
    city: address?.city || "",
    province: address?.province || "",
    country: address?.country || "United States",
    zip: address?.zip || "",
    phone: address?.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = address
        ? `/api/customer/addresses/${address.id}`
        : "/api/customer/addresses";
      const method = address ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save address");

      onSave();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {address ? "Edit address" : "Add new address"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <input
            type="text"
            placeholder="Company (optional)"
            value={formData.company}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, company: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <input
            type="text"
            placeholder="Address"
            value={formData.address1}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address1: e.target.value }))
            }
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <input
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            value={formData.address2}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address2: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, city: e.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="State/Province"
              value={formData.province}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, province: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="ZIP code"
              value={formData.zip}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, zip: e.target.value }))
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <input
            type="text"
            placeholder="Country"
            value={formData.country}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, country: e.target.value }))
            }
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <input
            type="tel"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
