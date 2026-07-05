"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  CalendarDays,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
} from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notAllowed, setNotAllowed] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const unsub = onSnapshot(
        doc(db, "orders", id),
        (snap) => {
          if (!snap.exists()) {
            setOrder(null);
            setLoading(false);
            return;
          }

          const data = { id: snap.id, ...snap.data() } as any;

          if (data.userId !== user.uid) {
            setNotAllowed(true);
            setLoading(false);
            return;
          }

          setOrder(data);
          setLoading(false);
        },
        (error) => {
          console.error("Order fetch error:", error);
          setLoading(false);
        }
      );

      return () => unsub();
    });

    return () => unsubscribeAuth();
  }, [id]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";

    try {
      const date =
        typeof timestamp?.toDate === "function"
          ? timestamp.toDate()
          : new Date(timestamp?.seconds ? timestamp.seconds * 1000 : timestamp);

      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400 text-lg">
          Loading order details...
        </div>
      </div>
    );
  }

  if (notAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-3xl shadow-lg border p-10 text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-500">Access denied</h2>
          <p className="text-gray-500 mt-3">
            You are not allowed to view this order.
          </p>
          <Link
            href="/orders"
            className="inline-block mt-6 bg-pink-600 hover:bg-pink-700 transition text-white px-6 py-3 rounded-xl"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Order not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {order.orderNumber || `Order #${order.id.slice(-6)}`}
              </h1>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {formatDate(order.createdAt)}
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  {order.paymentMethod || "N/A"}
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
                {order.status || "Pending"}
              </span>

              <p className="mt-3 text-3xl font-bold text-pink-600">
                LKR {Number(order.totalAmount || order.total || 0).toLocaleString()}
              </p>
            </div>

          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ITEMS */}
          <div className="lg:col-span-2 bg-white rounded-3xl border shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package size={18} /> Items
            </h2>

            <div className="space-y-4">
              {order.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-4 border rounded-2xl p-4 hover:shadow-sm transition"
                >
                  <img
                    src={item.image || item.images?.[0] || "/placeholder.png"}
                    className="w-24 h-24 object-cover rounded-xl border"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Size: {item.size || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Color: {item.color || "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="font-bold text-pink-600">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* CUSTOMER */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-5">Customer</h2>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex gap-2 items-center">
                  <User size={16} /> {order.customerName || "N/A"}
                </div>
                <div className="flex gap-2 items-center">
                  <Mail size={16} /> {order.email || "N/A"}
                </div>
                <div className="flex gap-2 items-center">
                  <Phone size={16} /> {order.phone || "N/A"}
                </div>
                <div className="flex gap-2 items-center">
                  <MapPin size={16} />
                  {order.address || "N/A"}, {order.city || ""}
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div className="bg-white rounded-3xl border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-5">Summary</h2>

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>LKR {order.subtotal || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>LKR {order.shipping || 0}</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-pink-600">
                    LKR {order.totalAmount || order.total || 0}
                  </span>
                </div>
              </div>

              <Link
                href="/orders"
                className="block mt-6 text-center bg-black hover:bg-gray-800 text-white py-3 rounded-xl transition"
              >
                Back to Orders
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}