"use client";

import { useEffect, useState, useCallback } from "react";
import { MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-md">Addresses</h1>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Manage your shipping and billing addresses
          </p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="border border-dashed border-[var(--border-light)] bg-[var(--surface)] py-16 text-center">
          <MapPin className="mx-auto h-12 w-12 text-[var(--foreground-muted)] opacity-40" />
          <h3 className="mt-4 font-serif text-lg text-[var(--foreground)]">
            No addresses saved
          </h3>
          <p className="mt-2 text-[var(--foreground-muted)]">
            Add an address for faster checkout
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary mt-6"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
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

      {/* Add/Edit Address Modal */}
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
    <div className="relative border border-[var(--border-light)] bg-[var(--surface)] p-6">
      {address.isDefault && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 bg-[var(--background-warm)] px-2.5 py-1 text-xs uppercase tracking-wider text-[var(--foreground)]">
          <Check className="h-3 w-3" />
          Default
        </span>
      )}

      <div className="space-y-1 text-sm">
        {fullName && <p className="font-medium text-[var(--foreground)]">{fullName}</p>}
        {address.company && <p className="text-[var(--foreground-muted)]">{address.company}</p>}
        {address.address1 && <p className="text-[var(--foreground-muted)]">{address.address1}</p>}
        {address.address2 && <p className="text-[var(--foreground-muted)]">{address.address2}</p>}
        <p className="text-[var(--foreground-muted)]">
          {[address.city, address.province, address.zip].filter(Boolean).join(", ")}
        </p>
        {address.country && <p className="text-[var(--foreground-muted)]">{address.country}</p>}
        {address.phone && <p className="mt-2 text-[var(--foreground-muted)]">{address.phone}</p>}
      </div>

      <div className="mt-6 flex items-center gap-4 border-t border-[var(--border-light)] pt-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-300"
        >
          <Pencil className="h-4 w-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 text-sm text-[var(--foreground-muted)] hover:text-[var(--accent-red)] transition-colors duration-300"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
        {!address.isDefault && (
          <button
            onClick={onSetDefault}
            className="ml-auto text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors duration-300"
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
      <div className="w-full max-w-lg bg-[var(--background)] p-8">
        <h2 className="font-serif text-xl text-[var(--foreground)]">
          {address ? "Edit Address" : "Add New Address"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">First name</label>
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
              <label htmlFor="lastName" className="form-label">Last name</label>
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
          </div>

          <div className="form-group">
            <label htmlFor="company" className="form-label">Company (optional)</label>
            <input
              type="text"
              id="company"
              value={formData.company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address1" className="form-label">Address</label>
            <input
              type="text"
              id="address1"
              value={formData.address1}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address1: e.target.value }))
              }
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address2" className="form-label">Apartment, suite, etc. (optional)</label>
            <input
              type="text"
              id="address2"
              value={formData.address2}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address2: e.target.value }))
              }
              className="input"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="form-group">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                required
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="province" className="form-label">State / Province</label>
              <input
                type="text"
                id="province"
                value={formData.province}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, province: e.target.value }))
                }
                className="input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="zip" className="form-label">ZIP Code</label>
              <input
                type="text"
                id="zip"
                value={formData.zip}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, zip: e.target.value }))
                }
                required
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country" className="form-label">Country</label>
            <input
              type="text"
              id="country"
              value={formData.country}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, country: e.target.value }))
              }
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone (optional)</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="input"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
