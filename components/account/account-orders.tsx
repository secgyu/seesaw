"use client";

import Link from "next/link";

import type { Order } from "@/types";
import { ChevronRight, Package } from "lucide-react";

import { OrderSkeleton } from "@/components/ui/skeleton";

interface AccountOrdersProps {
  orders: Order[];
  ordersLoading: boolean;
}

export function AccountOrders({ orders, ordersLoading }: AccountOrdersProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "delivered":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-extralight tracking-wide mb-6">Order History</h2>
      {ordersLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-light mb-1">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block px-3 py-1 text-[10px] tracking-wider uppercase ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-light">${order.total}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-[10px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-3">
                  Items ({order.items.length})
                </p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm font-light">
                      <span>
                        {item.name} × {item.quantity}
                        <span className="text-muted-foreground ml-2">({item.size})</span>
                      </span>
                      <span>${item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="text-[10px] font-light tracking-[0.15em] uppercase text-muted-foreground mb-2">
                  Shipping Address
                </p>
                <p className="text-sm font-light text-muted-foreground">
                  {order.shipping_address.firstName} {order.shipping_address.lastName}
                  <br />
                  {order.shipping_address.address}
                  <br />
                  {order.shipping_address.city}, {order.shipping_address.postalCode}
                  <br />
                  {order.shipping_address.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-border">
          <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground font-light mb-4">No orders yet</p>
          <Link
            href="/collection"
            className="inline-flex items-center gap-2 text-xs font-light tracking-[0.15em] uppercase underline underline-offset-4 hover:no-underline"
          >
            Start Shopping <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
