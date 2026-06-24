"use client";

import { use, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import OrderTracking from "@/components/orders/OrderTracking";

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export default function OrderPage({ params }: OrderPageProps) {
  const { id } = use(params);

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "orders", id), (snap) => {
      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() });
      } else {
        setOrder(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading order...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">Order not found</p>
      </div>
    );
  }

  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      
      <div className="max-w-5xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Order #{order.orderNumber || order.id}
            </h1>
            <p className="text-sm text-gray-500">
              Track your order details and status
            </p>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              statusColors[order.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {order.status || "pending"}
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="md:col-span-2 space-y-6">

            {/* ITEMS CARD */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>

              <div className="space-y-3">
                {order.items?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-gray-800">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TRACKING CARD */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Order Progress</h2>
              <OrderTracking status={order.status || "pending"} />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* CUSTOMER */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-3">Customer</h2>

              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-medium text-gray-800">
                  {order.customerName}
                </p>
                <p>{order.phone}</p>
                <p>{order.address}</p>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-3">Payment</h2>

              <div className="space-y-2 text-sm">
                <p>
                  Method:{" "}
                  <span className="font-medium">
                    {order.paymentMethod}
                  </span>
                </p>

                <div className="pt-3 border-t">
                  <p className="text-gray-500 text-xs">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">
                    Rs. {order.total}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}