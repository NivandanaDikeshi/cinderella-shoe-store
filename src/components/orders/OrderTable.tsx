"use client";

import Link from "next/link";

interface Props {
  orders: any[];
  onStatusChange: (id: string, status: string) => void;
}

export default function OrderTable({ orders, onStatusChange }: Props) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
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
            <tr key={order.id} className="border-t">
              <td className="p-3">{order.orderNumber}</td>
              <td className="p-3">{order.customerName}</td>
              <td className="p-3">{order.phone}</td>
              <td className="p-3">LKR {order.total}</td>

              <td className="p-3">
                <select
                  value={order.status || "Pending"}
                  onChange={(e) =>
                    onStatusChange(order.id, e.target.value)
                  }
                  className="border rounded px-2 py-1"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>

              <td className="p-3">
                <Link
                  href={`/my-orders/${order.id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
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