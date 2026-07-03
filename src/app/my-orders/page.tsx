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
import { Package, ShoppingBag, XCircle } from "lucide-react";
import CustomerOrdersTable from "@/components/orders/CustomerOrdersTable";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 animate-pulse text-sm">
          Loading your orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-pink-500 font-semibold">
            Account
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2 flex items-center gap-3">
            <Package className="text-pink-500" />
            My Orders
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Track, manage and review your purchase history in one place.
          </p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-50 flex items-center justify-center">
              <ShoppingBag className="text-pink-500" size={26} />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mt-5">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
              You haven’t placed any orders yet. Once you shop with us, your
              order history will appear here.
            </p>

            <button
              onClick={() => (window.location.href = "/shop")}
              className="mt-6 px-6 py-3 rounded-xl bg-pink-600 text-white font-medium hover:bg-pink-700 transition shadow-sm"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            
            {/* TOP BAR */}
            <div className="px-6 py-4 flex items-center justify-between border-b bg-gray-50">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Order History
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {orders.length} order(s)
                </p>
              </div>
            </div>

            {/* TABLE */}
            <CustomerOrdersTable
              orders={orders}
              onCancelOrder={handleCancelClick}
            />
          </div>
        )}
      </div>

      {/* MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-6 animate-in fade-in zoom-in">

            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={20} />
              <h2 className="text-lg font-semibold">Cancel Order</h2>
            </div>

            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm"
              >
                Keep Order
              </button>

              <button
                onClick={confirmCancelOrder}
                disabled={cancellingId === selectedOrderId}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
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