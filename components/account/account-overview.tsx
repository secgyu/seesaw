"use client";

import type { Order } from "@/types";

interface AccountOverviewProps {
  userName: string;
  userEmail: string;
  orders: Order[];
  ordersLoading: boolean;
  onViewAllOrders: () => void;
}

export function AccountOverview({
  userName,
  userEmail,
  orders,
  ordersLoading,
  onViewAllOrders,
}: AccountOverviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-border p-6">
          <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-4">
            Account Details
          </h3>
          <p className="text-sm font-light mb-1">{userName}</p>
          <p className="text-sm text-muted-foreground font-light">{userEmail}</p>
        </div>
        <div className="border border-border p-6">
          <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-4">
            Default Address
          </h3>
          <p className="text-sm text-muted-foreground font-light">No default address set</p>
          <button className="text-xs font-light underline underline-offset-4 mt-2 hover:no-underline">
            Add Address
          </button>
        </div>
      </div>

      <div className="border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[11px] font-light tracking-[0.15em] uppercase text-muted-foreground">
            Recent Orders
          </h3>
          <button
            onClick={onViewAllOrders}
            className="text-xs font-light underline underline-offset-4 hover:no-underline"
          >
            View All
          </button>
        </div>
        {ordersLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border animate-pulse"
              >
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
                <div className="text-right space-y-1">
                  <div className="h-4 w-16 bg-muted rounded" />
                  <div className="h-3 w-12 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.slice(0, 2).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-light">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-light">${order.total}</p>
                  <p className="text-xs text-muted-foreground capitalize">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground font-light">No orders yet</p>
        )}
      </div>
    </div>
  );
}
