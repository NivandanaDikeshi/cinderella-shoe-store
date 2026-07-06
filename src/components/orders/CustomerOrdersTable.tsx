"use client";

import Link from "next/link";

interface Order {
  id: string;
  orderNumber?: string;
  status?: string;
  total?: number;
  createdAt?: { seconds?: number };
}

interface Props {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  cancellingId?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[#FDF3D9] text-[#8A6A1A]",
  processing: "bg-[#E4EAFB] text-[#3D4F9E]",
  shipped: "bg-[#F1E6FB] text-[#6B3FA0]",
  delivered: "bg-[#E3F5EA] text-[#237A4E]",
  cancelled: "bg-[#FBE4E4] text-[#A23B3B]",
};

export default function CustomerOrdersTable({
  orders,
  onCancelOrder,
  cancellingId,
}: Props) {
  const getStatusKey = (status?: string) => (status || "pending").toLowerCase();

  const canCancel = (status?: string) => {
    const key = getStatusKey(status);
    return !["cancelled", "delivered"].includes(key);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-[#FFF6F4] text-[#8C6169]">
          <tr>
            <th className="p-3 text-left font-semibold">Order No</th>
            <th className="p-3 text-left font-semibold">Date</th>
            <th className="p-3 text-left font-semibold">Total</th>
            <th className="p-3 text-left font-semibold">Status</th>
            <th className="p-3 text-left font-semibold">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const statusKey = getStatusKey(order.status);
            const badgeClass =
              STATUS_STYLES[statusKey] || "bg-[#F2DEE0] text-[#8C6169]";
            const isCancelling = cancellingId === order.id;

            return (
              <tr
                key={order.id}
                className="border-t border-[#F2DEE0] hover:bg-[#FFF9F8] transition-colors"
              >
                {/* ORDER NO */}
                <td className="p-3 font-medium text-[#211016]">
                  #{order.orderNumber || order.id}
                </td>

                {/* DATE */}
                <td className="p-3 text-[#8C6169]">
                  {order.createdAt?.seconds
                    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" }
                      )
                    : "-"}
                </td>

                {/* TOTAL */}
                <td className="p-3 font-semibold text-[#B33B5E]">
                  Rs. {Number(order.total || 0).toLocaleString()}
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${badgeClass}`}
                  >
                    {statusKey}
                  </span>
                </td>

                {/* ACTION */}
                <td className="p-3">
                  <div className="flex gap-2 items-center">
                    <Link
                      href={`/my-orders/${order.id}`}
                      className="px-3 py-1.5 rounded-full bg-[#FFF6F4] text-[#2B1620] text-xs font-semibold hover:bg-[#F2DEE0] transition"
                    >
                      View
                    </Link>

                    {canCancel(order.status) && (
                      <button
                        onClick={() => onCancelOrder(order.id)}
                        disabled={isCancelling}
                        className="px-3 py-1.5 rounded-full bg-[#FBE4E4] text-[#A23B3B] text-xs font-semibold hover:bg-[#F5D0D0] transition disabled:opacity-50"
                      >
                        {isCancelling ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {orders.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-6 text-[#8C6169]">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}