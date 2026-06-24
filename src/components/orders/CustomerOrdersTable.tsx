"use client";

import Link from "next/link";

export default function CustomerOrdersTable({ orders }: any) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
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
            <tr key={order.id} className="border-t">
              <td className="p-3">{order.orderNumber}</td>

              <td className="p-3">
                {order.createdAt?.seconds
                  ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                  : "-"}
              </td>

              <td className="p-3">LKR {order.total}</td>

              <td className="p-3">{order.status}</td>

              <td className="p-3">
                <Link
                  href={`/my-orders/${order.id}`}
                  className="bg-pink-600 text-white px-3 py-1 rounded"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}