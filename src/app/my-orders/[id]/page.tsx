"use client";

import { use, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import OrderTracking from "@/components/orders/OrderTracking";
import { Package, User, CreditCard, MapPin, Phone } from "lucide-react";

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-[#FDF3D9]", text: "text-[#8A6A1A]", dot: "bg-[#D4A017]" },
  processing: { bg: "bg-[#E4EAFB]", text: "text-[#3D4F9E]", dot: "bg-[#5468C4]" },
  shipped: { bg: "bg-[#F1E6FB]", text: "text-[#6B3FA0]", dot: "bg-[#8B5CC7]" },
  delivered: { bg: "bg-[#E3F5EA]", text: "text-[#237A4E]", dot: "bg-[#2FAE6C]" },
  cancelled: { bg: "bg-[#FBE4E4]", text: "text-[#A23B3B]", dot: "bg-[#D24B4B]" },
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #FADCE9 0%, #FCE9F0 35%, #FDF3F6 65%, #FFFFFF 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-[#F2DEE0] border-t-[#B33B5E] animate-spin" />
          <p className="text-sm text-[#8C6169] font-medium">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-5"
        style={{
          background:
            "linear-gradient(135deg, #FADCE9 0%, #FCE9F0 35%, #FDF3F6 65%, #FFFFFF 100%)",
        }}
      >
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FBE4E4]">
            <Package size={22} className="text-[#A23B3B]" />
          </div>
          <p className="mt-4 font-display font-extrabold text-xl text-[#211016]">
            Order not found
          </p>
          <p className="mt-1 text-sm text-[#8C6169]">
            Check the order link and try again.
          </p>
        </div>
      </div>
    );
  }

  const status = STATUS_STYLES[order.status] || {
    bg: "bg-[#F2DEE0]",
    text: "text-[#8C6169]",
    dot: "bg-[#B99499]",
  };

  return (
    <div
      className="min-h-screen font-body text-[#2B1620] px-4 py-6 sm:p-8"
      style={{
        background:
          "linear-gradient(135deg, #FADCE9 0%, #FCE9F0 35%, #FDF3F6 65%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F2DEE0] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#B33B5E] font-semibold mb-1.5">
              Order details
            </p>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#211016] leading-tight">
              #{order.orderNumber || order.id}
            </h1>
            <p className="text-sm text-[#8C6169] mt-1">
              Track your order details and status
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${status.bg} ${status.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {order.status || "pending"}
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* LEFT SIDE */}
          <div className="md:col-span-2 space-y-5 sm:space-y-6">
            {/* ITEMS CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#F2DEE0] p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package size={16} className="text-[#B33B5E]" />
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#211016]">
                  Order Items
                </h2>
              </div>

              <div className="space-y-2.5">
                {order.items?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#FFF6F4] border border-[#F2DEE0]/70"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-[#2B1620] truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#8C6169] mt-0.5">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-sm text-[#B33B5E] whitespace-nowrap">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* TRACKING CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#F2DEE0] p-5 sm:p-6">
              <h2 className="font-display font-extrabold text-base sm:text-lg text-[#211016] mb-4">
                Order Progress
              </h2>
              <OrderTracking status={order.status || "pending"} />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-5 sm:space-y-6">
            {/* CUSTOMER */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#F2DEE0] p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3.5">
                <User size={16} className="text-[#B33B5E]" />
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#211016]">
                  Customer
                </h2>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium text-[#2B1620]">
                  {order.customerName}
                </p>
                <div className="flex items-center gap-1.5 text-[#8C6169]">
                  <Phone size={13} className="shrink-0" />
                  <span>{order.phone}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[#8C6169]">
                  <MapPin size={13} className="shrink-0 mt-0.5" />
                  <span>{order.address}</span>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#F2DEE0] p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3.5">
                <CreditCard size={16} className="text-[#B33B5E]" />
                <h2 className="font-display font-extrabold text-base sm:text-lg text-[#211016]">
                  Payment
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <p className="text-[#8C6169]">
                  Method:{" "}
                  <span className="font-medium text-[#2B1620]">
                    {order.paymentMethod}
                  </span>
                </p>

                <div className="pt-3 border-t border-[#F2DEE0]">
                  <p className="text-[#B99499] text-[11px] uppercase tracking-wide font-medium">
                    Total Amount
                  </p>
                  <p className="mt-1 font-display font-black text-2xl sm:text-3xl text-[#B33B5E]">
                    Rs. {Number(order.total).toLocaleString()}
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