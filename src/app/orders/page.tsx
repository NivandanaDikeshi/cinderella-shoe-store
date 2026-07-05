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
import { Package, ChevronRight, ShoppingBag, AlertCircle } from "lucide-react";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          router.push("/login");
          return;
        }

        try {
          // Preferred: server-side sort (needs a composite index on userId + createdAt)
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
        } catch (indexErr: any) {
          // Fallback: if the composite index isn't built yet, fetch without
          // orderBy and sort client-side instead of breaking the page.
          if (indexErr?.code === "failed-precondition") {
            const fallbackQ = query(
              collection(db, "orders"),
              where("userId", "==", user.uid)
            );

            const snap = await getDocs(fallbackQ);
            const data = snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Order[];

            data.sort((a, b) => {
              const aTime = a.createdAt?.toMillis?.() || 0;
              const bTime = b.createdAt?.toMillis?.() || 0;
              return bTime - aTime;
            });

            setOrders(data);
          } else {
            throw indexErr;
          }
        }
      } catch (err) {
        console.error(err);
        setError("We couldn't load your orders right now. Please try again.");
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-white to-pink-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-pink-100 border-t-pink-500 animate-spin" />
          <p className="text-sm text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8 sm:mb-12">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-pink-500 font-semibold">
            Account
          </p>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Track your purchases and delivery progress
          </p>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={17} className="shrink-0 mt-0.5" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-10 sm:p-16 text-center">
            <ShoppingBag size={44} className="mx-auto text-gray-300 mb-4 sm:hidden" />
            <ShoppingBag size={52} className="mx-auto text-gray-300 mb-4 hidden sm:block" />

            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Your order history will appear here
            </p>

            <button
              onClick={() => router.push("/shop")}
              className="mt-6 px-6 py-3 rounded-xl bg-pink-600 text-white font-semibold hover:bg-pink-700 active:scale-[0.98] transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-md transition p-4 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:gap-6">
                  {/* LEFT */}
                  <div className="flex-1 min-w-0">
                    {/* TOP ROW */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-pink-50 flex items-center justify-center shrink-0">
                        <Package className="text-pink-500" size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">
                          Order
                        </p>

                        <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                          {order.orderNumber || `#${order.id.slice(-8)}`}
                        </h3>
                      </div>

                      <span
                        className={`ml-auto shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-5 sm:mt-6 text-xs sm:text-sm">
                      <div>
                        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">
                          Date
                        </p>
                        <p className="font-medium text-gray-800 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">
                          Payment
                        </p>
                        <p className="font-medium text-gray-800 mt-1 truncate">
                          {order.paymentMethod || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wider">
                          Total
                        </p>
                        <p className="font-bold text-pink-600 mt-1">
                          LKR {Number(order.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center lg:shrink-0">
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="flex w-full lg:w-auto items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-900 text-white hover:bg-black active:scale-[0.98] transition font-semibold text-sm sm:text-base"
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