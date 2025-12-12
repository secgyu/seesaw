"use client";

import { useEffect, useMemo, useState } from "react";

import { Edit2, Plus, Search, Trash2, X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  used_count: number;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface CouponFormData {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses: string;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
}

const initialFormData: CouponFormData = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: 10,
  min_order_amount: 0,
  max_uses: "",
  starts_at: new Date().toISOString().split("T")[0],
  expires_at: "",
  is_active: true,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const supabase = createClient();

  const filteredCoupons = useMemo(() => {
    if (!searchQuery) return coupons;
    const query = searchQuery.toLowerCase();
    return coupons.filter(
      (c) => c.code.toLowerCase().includes(query) || c.description?.toLowerCase().includes(query)
    );
  }, [coupons, searchQuery]);

  useEffect(() => {
    let isMounted = true;

    const fetchCoupons = async () => {
      const { data } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (isMounted) {
        setCoupons(data || []);
        setIsLoading(false);
      }
    };

    fetchCoupons();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount,
      max_uses: coupon.max_uses?.toString() || "",
      starts_at: coupon.starts_at.split("T")[0],
      expires_at: coupon.expires_at?.split("T")[0] || "",
      is_active: coupon.is_active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const couponData = {
      code: formData.code.toUpperCase(),
      description: formData.description || null,
      discount_type: formData.discount_type,
      discount_value: formData.discount_value,
      min_order_amount: formData.min_order_amount,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      starts_at: formData.starts_at,
      expires_at: formData.expires_at || null,
      is_active: formData.is_active,
    };

    if (editingCoupon) {
      const { data } = await supabase
        .from("coupons")
        .update(couponData)
        .eq("id", editingCoupon.id)
        .select()
        .single();

      if (data) {
        setCoupons((prev) => prev.map((c) => (c.id === editingCoupon.id ? data : c)));
      }
    } else {
      const { data } = await supabase.from("coupons").insert(couponData).select().single();

      if (data) {
        setCoupons((prev) => [data, ...prev]);
      }
    }

    closeModal();
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("coupons").delete().eq("id", id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = async (coupon: Coupon) => {
    const { data } = await supabase
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", coupon.id)
      .select()
      .single();

    if (data) {
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? data : c)));
    }
  };

  const isExpired = (coupon: Coupon) => {
    if (!coupon.expires_at) return false;
    return new Date(coupon.expires_at) < new Date();
  };

  const isUsedUp = (coupon: Coupon) => {
    if (!coupon.max_uses) return false;
    return coupon.used_count >= coupon.max_uses;
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-32" />
          <div className="h-12 bg-neutral-200 rounded" />
          <div className="h-96 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-light">Coupons</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage discount codes</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white text-sm rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {filteredCoupons.length === 0 ? (
          <div className="px-6 py-12 text-center text-neutral-500">
            {coupons.length === 0 ? "No coupons yet" : "No coupons match your search"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50">
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Discount</th>
                  <th className="px-6 py-3 font-medium">Usage</th>
                  <th className="px-6 py-3 font-medium">Valid Period</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-mono font-medium">{coupon.code}</p>
                        {coupon.description && (
                          <p className="text-xs text-neutral-500 mt-0.5">{coupon.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : formatCurrency(coupon.discount_value)}
                      {coupon.min_order_amount > 0 && (
                        <p className="text-xs text-neutral-500">
                          Min: {formatCurrency(coupon.min_order_amount)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {coupon.max_uses
                        ? `${coupon.used_count} / ${coupon.max_uses}`
                        : `${coupon.used_count} used`}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      <p>{formatDate(coupon.starts_at)}</p>
                      {coupon.expires_at && <p>~ {formatDate(coupon.expires_at)}</p>}
                    </td>
                    <td className="px-6 py-4">
                      {isExpired(coupon) ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                          Expired
                        </span>
                      ) : isUsedUp(coupon) ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                          Used Up
                        </span>
                      ) : coupon.is_active ? (
                        <button
                          onClick={() => toggleActive(coupon)}
                          className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          Active
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleActive(coupon)}
                          className="px-2 py-1 text-xs rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
                        >
                          Inactive
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(coupon.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <h2 className="text-lg font-medium">
                {editingCoupon ? "Edit Coupon" : "Add Coupon"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="SUMMER20"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summer sale 20% off"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₩)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Value {formData.discount_type === "percentage" ? "(%)" : "(₩)"}
                  </label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({ ...formData, discount_value: Number(e.target.value) })
                    }
                    required
                    min="0"
                    max={formData.discount_type === "percentage" ? 100 : undefined}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Min Order (₩)</label>
                  <input
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, min_order_amount: Number(e.target.value) })
                    }
                    min="0"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    min="1"
                    placeholder="Unlimited"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.starts_at}
                    onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 bg-neutral-900 text-white rounded-lg text-sm hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : editingCoupon ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-2">Delete Coupon?</h3>
            <p className="text-sm text-neutral-500 mb-6">
              This action cannot be undone. The coupon will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-lg text-sm hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
