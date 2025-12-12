"use client";

import { useMemo, useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Eye, Search, X } from "lucide-react";

import { formatCurrency, formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  order_number: string;
  email: string;
  total: number;
  subtotal: number;
  shipping_cost: number;
  status: string;
  shipping_address: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  items: Array<{
    name: string;
    size: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  created_at: string;
}

const ORDER_STATUSES = [
  { value: "paid", label: "Paid", color: "bg-blue-100 text-blue-700" },
  { value: "processing", label: "Processing", color: "bg-yellow-100 text-yellow-700" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-700" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

function getStatusColor(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status)?.color || "bg-neutral-100 text-neutral-700";
}

async function fetchOrders(): Promise<Order[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

async function updateOrderStatusApi({ orderId, status }: { orderId: string; status: string }) {
  const response = await fetch("/api/order/update-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, status }),
  });
  if (!response.ok) throw new Error("Failed to update status");
  return { orderId, status };
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: fetchOrders,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: ({ orderId, status }) => {
      queryClient.setQueryData<Order[]>(["admin", "orders"], (old) =>
        old?.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }

      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });

  const filteredOrders = useMemo(() => {
    let result = orders;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.order_number.toLowerCase().includes(query) ||
          order.email.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    return result;
  }, [orders, searchQuery, statusFilter]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
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
      <div className="mb-6">
        <h1 className="text-2xl font-light">Orders</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by order number or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
        >
          <option value="all">All Status</option>
          {ORDER_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-neutral-500">
            {orders.length === 0 ? "No orders yet" : "No orders match your filters"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider bg-neutral-50">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-sm font-medium">{order.order_number}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{order.email}</td>
                    <td className="px-6 py-4 text-sm">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updateStatusMutation.isPending}
                          className={`appearance-none px-3 py-1.5 pr-8 text-xs rounded-full cursor-pointer focus:outline-none ${getStatusColor(order.status)} ${updateStatusMutation.isPending ? "opacity-50" : ""}`}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {formatDate(order.created_at, { includeTime: true })}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
              <div>
                <h2 className="text-lg font-medium">Order Details</h2>
                <p className="text-sm text-neutral-500">{selectedOrder.order_number}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}
                >
                  {selectedOrder.status}
                </span>
                <span className="text-sm text-neutral-500">
                  {formatDate(selectedOrder.created_at)}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Customer</h3>
                <p className="text-sm text-neutral-600">{selectedOrder.email}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Shipping Address</h3>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>
                    {selectedOrder.shipping_address?.firstName}{" "}
                    {selectedOrder.shipping_address?.lastName}
                  </p>
                  <p>{selectedOrder.shipping_address?.address}</p>
                  <p>
                    {selectedOrder.shipping_address?.city},{" "}
                    {selectedOrder.shipping_address?.postalCode}
                  </p>
                  <p>{selectedOrder.shipping_address?.country}</p>
                  {selectedOrder.shipping_address?.phone && (
                    <p>{selectedOrder.shipping_address.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-neutral-50 rounded-lg"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-neutral-500">
                          Size: {item.size} · Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Shipping</span>
                  <span>
                    {selectedOrder.shipping_cost === 0
                      ? "Free"
                      : formatCurrency(selectedOrder.shipping_cost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-sm font-medium mb-3">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => updateOrderStatus(selectedOrder.id, status.value)}
                      disabled={
                        selectedOrder.status === status.value || updateStatusMutation.isPending
                      }
                      className={`px-4 py-2 text-xs rounded-lg transition-colors ${
                        selectedOrder.status === status.value
                          ? status.color
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  * Changing to &quot;Shipped&quot; or &quot;Delivered&quot; will send an email
                  notification
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
