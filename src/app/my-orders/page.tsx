"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { Package, ShoppingBag, XCircle, ChevronRight } from "lucide-react";
import CustomerOrdersTable from "@/components/orders/CustomerOrdersTable";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-[#FDF3D9]", text: "text-[#8A6A1A]", dot: "bg-[#D4A017]" },
  processing: { bg: "bg-[#E4EAFB]", text: "text-[#3D4F9E]", dot: "bg-[#5468C4]" },
  shipped: { bg: "bg-[#F1E6FB]", text: "text-[#6B3FA0]", dot: "bg-[#8B5CC7]" },
  delivered: { bg: "bg-[#E3F5EA]", text: "text-[#237A4E]", dot: "bg-[#2FAE6C]" },
  cancelled: { bg: "bg-[#FBE4E4]", text: "text-[#A23B3B]", dot: "bg-[#D24B4B]" },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [cancellingId, setCancellingId] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setOrders(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleCancelClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      setCancellingId(selectedOrderId);

      await updateDoc(doc(db, "orders", selectedOrderId), {
        status: "Cancelled",
        cancelledAt: serverTimestamp(),
      });

      setShowCancelModal(false);
      setSelectedOrderId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingId("");
    }
  };

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
          <p className="text-sm text-[#8C6169] font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-body text-[#2B1620] px-4 py-8 sm:px-6 sm:py-10"
      style={{
        background:
          "linear-gradient(135deg, #FADCE9 0%, #FCE9F0 35%, #FDF3F6 65%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 sm:mb-10">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#B33B5E] font-semibold">
            Account
          </p>

          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#211016] mt-2 flex items-center gap-2.5 sm:gap-3">
            <Package className="text-[#B33B5E]" size={28} />
            My Orders
          </h1>

          <p className="text-[#8C6169] mt-2 text-sm max-w-md">
            Track, manage and review your purchase history in one place.
          </p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#F2DEE0] shadow-sm p-10 sm:p-16 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-[#FFF0F3] flex items-center justify-center">
              <ShoppingBag className="text-[#B33B5E]" size={24} />
            </div>

            <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#211016] mt-5">
              No orders yet
            </h2>

            <p className="text-[#8C6169] mt-2 text-sm max-w-md mx-auto leading-relaxed">
              You haven't placed any orders yet. Once you shop with us, your
              order history will appear here.
            </p>

            <button
              onClick={() => (window.location.href = "/shop")}
              className="mt-6 px-6 py-3 rounded-full bg-[#B33B5E] text-white text-sm font-semibold hover:bg-[#9A3251] active:scale-[0.98] transition shadow-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#F2DEE0] shadow-sm overflow-hidden">
            {/* TOP BAR */}
            <div className="px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#F2DEE0] bg-[#FFF6F4]">
              <div>
                <h2 className="font-display font-extrabold text-sm sm:text-base text-[#211016]">
                  Order History
                </h2>
                <p className="text-xs text-[#B99499] mt-0.5">
                  {orders.length} order{orders.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* DESKTOP: table */}
            <div className="hidden md:block">
              <CustomerOrdersTable
                orders={orders}
                onCancelOrder={handleCancelClick}
              />
            </div>

            {/* MOBILE: stacked cards */}
            <div className="md:hidden divide-y divide-[#F2DEE0]">
              {orders.map((order) => {
                const statusKey = (order.status || "pending").toLowerCase();
                const status = STATUS_STYLES[statusKey] || {
                  bg: "bg-[#F2DEE0]",
                  text: "text-[#8C6169]",
                  dot: "bg-[#B99499]",
                };
                const itemCount = order.items?.length || 0;
                const canCancel = !["cancelled", "delivered"].includes(statusKey);

                return (
                  <div key={order.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-[#211016] truncate">
                          #{order.orderNumber || order.id}
                        </p>
                        <p className="text-xs text-[#8C6169] mt-0.5">
                          {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${status.bg} ${status.text}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {order.status || "pending"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="font-display font-extrabold text-base text-[#B33B5E]">
                        Rs. {Number(order.total || 0).toLocaleString()}
                      </p>

                      <div className="flex items-center gap-2">
                        {canCancel && (
                          <button
                            onClick={() => handleCancelClick(order.id)}
                            className="px-3 py-1.5 rounded-full bg-[#FBE4E4] text-[#A23B3B] text-xs font-semibold active:scale-95 transition"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={() => (window.location.href = `/my-orders/${order.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFF6F4] text-[#2B1620] text-xs font-semibold active:scale-95 transition"
                        >
                          View
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-[#2B1620]/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 px-0 sm:px-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-xl border border-[#F2DEE0] p-6 animate-in fade-in zoom-in">
            <div className="sm:hidden mx-auto mb-4 h-1.5 w-10 rounded-full bg-[#F2DEE0]" />

            <div className="flex items-center gap-2 text-[#B3413E]">
              <XCircle size={20} />
              <h2 className="font-display font-extrabold text-lg text-[#211016]">
                Cancel Order
              </h2>
            </div>

            <p className="text-[#8C6169] mt-3 text-sm leading-relaxed">
              Are you sure you want to cancel this order? This action cannot
              be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-full bg-[#FFF6F4] hover:bg-[#F2DEE0] text-sm font-medium text-[#2B1620] transition"
              >
                Keep Order
              </button>

              <button
                onClick={confirmCancelOrder}
                disabled={cancellingId === selectedOrderId}
                className="px-4 py-2.5 rounded-full bg-[#B3413E] text-white text-sm font-semibold hover:bg-[#9A3634] disabled:opacity-50 transition"
              >
                {cancellingId === selectedOrderId
                  ? "Cancelling..."
                  : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}