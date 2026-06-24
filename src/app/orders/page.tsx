"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  orderNumber?: string;
  totalAmount?: number;
  paymentMethod?: string;
  status?: string;
  items?: OrderItem[];
  createdAt?: any;
}

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          router.push("/login");
          return;
        }

        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";

    try {
      const date =
        typeof timestamp?.toDate === "function"
          ? timestamp.toDate()
          : new Date(timestamp);

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700";
      case "Processing":
        return "bg-blue-50 text-blue-700";
      case "Dispatched":
        return "bg-purple-50 text-purple-700";
      case "Completed":
        return "bg-emerald-50 text-emerald-700";
      case "Cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 py-12">

      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-12">
          <p className="text-xs tracking-[0.3em] uppercase text-pink-500 font-semibold">
            Account
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Track your purchases and delivery progress
          </p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-16 text-center">

            <ShoppingBag size={52} className="mx-auto text-gray-300 mb-4" />

            <h2 className="text-xl font-bold text-gray-800">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2">
              Your order history will appear here
            </p>

            <button
              onClick={() => router.push("/shop")}
              className="mt-6 px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 transition"
            >
              Start Shopping
            </button>

          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-sm hover:shadow-md transition p-6"
              >

                <div className="flex flex-col lg:flex-row justify-between gap-6">

                  {/* LEFT */}
                  <div className="flex-1">

                    {/* TOP ROW */}
                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center">
                        <Package className="text-pink-500" size={20} />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                          Order
                        </p>

                        <h3 className="font-bold text-gray-900">
                          {order.orderNumber || `#${order.id.slice(-8)}`}
                        </h3>
                      </div>

                      <span
                        className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>

                    </div>

                    {/* DETAILS */}
                    <div className="grid sm:grid-cols-3 gap-6 mt-6 text-sm">

                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Date
                        </p>
                        <p className="font-medium text-gray-800 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Payment
                        </p>
                        <p className="font-medium text-gray-800 mt-1">
                          {order.paymentMethod || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider">
                          Total
                        </p>
                        <p className="font-bold text-pink-600 mt-1">
                          LKR {Number(order.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-black transition font-semibold"
                    >
                      View Details <ChevronRight size={16} />
                    </button>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}