"use client";

import { X } from "lucide-react";
import OrderTrackingTimeline from "./OrderTrackingTimeline";

export default function OrderDetailsModal({
  order,
  onClose,
}: any) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>

        {/* HEADER */}
        <h2 className="text-2xl font-bold">
          Order #{order.orderNumber || order.id.slice(-6)}
        </h2>

        <p className="text-gray-500 mt-1">
          Status: {order.status}
        </p>

        {/* TRACKING */}
        <OrderTrackingTimeline status={order.status} />

        {/* ITEMS */}
        <div className="mt-6 space-y-3">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between border-b pb-2">
              <p>{item.name}</p>
              <p className="text-gray-500">
                {item.quantity} × LKR {item.price}
              </p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-pink-600">
            LKR {order.totalAmount}
          </span>
        </div>

        {/* RATE BUTTON */}
        <button className="w-full mt-6 bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700">
          Rate Your Products ⭐
        </button>

      </div>
    </div>
  );
}