"use client";

import { useState } from "react";
import Link from "next/link";

interface Props {
  orders: any[];
  onStatusChange: (id: string, status: string) => Promise<void> | void;
  onCancelOrder?: (id: string) => Promise<void> | void;
}

export default function OrderTable({
  orders,
  onStatusChange,
  onCancelOrder,
}: Props) {
  const [loadingId, setLoadingId] = useState<string>("");

  const handleStatusChange = async (id: string, status: string) => {
    try {
      setLoadingId(id);
      await onStatusChange(id, status);
    } finally {
      setLoadingId("");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setLoadingId(id);
      if (onCancelOrder) {
        await onCancelOrder(id);
      }
    } finally {
      setLoadingId("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3 text-left">Order No</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">
              {/* Order No */}
              <td className="p-3 font-medium">
                {order.orderNumber}
              </td>

              {/* Customer */}
              <td className="p-3">{order.customerName}</td>

              {/* Phone */}
              <td className="p-3">{order.phone}</td>

              {/* Total */}
              <td className="p-3">
                LKR {Number(order.total || 0).toFixed(2)}
              </td>

              {/* Status */}
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 flex items-center gap-2">
                {/* Status dropdown */}
                <select
                  value={order.status || "Pending"}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value)
                  }
                  disabled={loadingId === order.id}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Dispatched</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>

                {/* View button */}
                <Link
                  href={`/my-orders/${order.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  View
                </Link>

                {/* Cancel button (only if allowed) */}
                {order.status !== "Delivered" &&
                  order.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={loadingId === order.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="text-center p-6 text-gray-500"
              >
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}