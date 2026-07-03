"use client";

import Link from "next/link";

interface Props {
  orders: any[];
  onCancelOrder: (orderId: string) => void;
}

export default function CustomerOrdersTable({
  orders,
  onCancelOrder,
}: Props) {
  const canCancel = (status: string) => status === "Pending";

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">Order No</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order: any) => (
            <tr key={order.id} className="border-t hover:bg-gray-50">

              {/* ORDER NO */}
              <td className="p-3 font-medium">
                {order.orderNumber || order.id}
              </td>

              {/* DATE */}
              <td className="p-3 text-gray-600">
                {order.createdAt?.seconds
                  ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                  : "-"}
              </td>

              {/* TOTAL */}
              <td className="p-3 font-medium text-gray-700">
                LKR {Number(order.total || 0).toLocaleString()}
              </td>

              {/* STATUS */}
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Processing"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "Shipped"
                      ? "bg-purple-100 text-purple-700"
                      : order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </td>

              {/* ACTION */}
              <td className="p-3 flex gap-2 items-center">

                {/* VIEW */}
                <Link
                  href={`/my-orders/${order.id}`}
                  className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition"
                >
                  View
                </Link>

                {/* CANCEL */}
                {canCancel(order.status) && (
                  <button
                    onClick={() => onCancelOrder(order.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                )}

              </td>
            </tr>
          ))}

          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-6 text-gray-500">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}