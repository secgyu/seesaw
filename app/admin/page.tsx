"use client";

import { useEffect, useState } from "react";

import { ArrowDown, ArrowUp, DollarSign, Package, ShoppingBag, Users } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: Array<{
    order_number: string;
    email: string;
    total: number;
    status: string;
    created_at: string;
  }>;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down";
  trendValue?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-neutral-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="text-2xl font-light mt-1">{value}</p>
          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 mt-2 text-xs ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className="p-3 bg-neutral-100 rounded-lg">
          <Icon className="w-5 h-5 text-neutral-600" />
        </div>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case "paid":
      return "bg-blue-100 text-blue-700";
    case "processing":
      return "bg-yellow-100 text-yellow-700";
    case "shipped":
      return "bg-purple-100 text-purple-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();

      const { data: orders } = await supabase.from("orders").select("*");

      const { count: productCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const totalOrders = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const pendingOrders =
        orders?.filter((o) => o.status === "paid" || o.status === "processing").length || 0;

      const recentOrders =
        orders
          ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5) || [];

      setStats({
        totalOrders,
        totalRevenue,
        totalProducts: productCount || 0,
        pendingOrders,
        recentOrders,
      });
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-light">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} />
        <StatCard title="Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} />
        <StatCard title="Products" value={stats.totalProducts} icon={Package} />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Users} />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-light">Recent Orders</h2>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="px-6 py-12 text-center text-neutral-500">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-neutral-500 uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order.order_number} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 text-sm font-medium">{order.order_number}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">{order.email}</td>
                    <td className="px-6 py-4 text-sm">{formatCurrency(order.total)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
