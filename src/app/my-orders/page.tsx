"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { Package, ShoppingBag } from "lucide-react";
import CustomerOrdersTable from "@/components/orders/CustomerOrdersTable";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setOrders(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 px-4 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-pink-500 font-semibold">
            Account
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2 flex items-center gap-2">
            <Package className="text-pink-500" />
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Track all your purchases and order history in one place.
          </p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-14 text-center border border-gray-100">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-50 flex items-center justify-center mb-4">
              <ShoppingBag className="text-pink-500" size={26} />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2">
              You haven’t placed any orders. Start shopping to see your history here.
            </p>

            <button
              onClick={() => (window.location.href = "/shop")}
              className="mt-6 px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
            >
              Start Shopping
            </button>

          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

            {/* TABLE HEADER SECTION */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="font-semibold text-gray-700">
                Order History
              </h2>
              <p className="text-sm text-gray-500">
                You have {orders.length} order(s)
              </p>
            </div>

            {/* TABLE */}
            <CustomerOrdersTable orders={orders} />

          </div>
        )}

      </div>
    </div>
  );
}