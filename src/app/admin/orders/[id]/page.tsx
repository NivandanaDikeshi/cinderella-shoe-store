"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  User,
  Package,
  CircleDollarSign,
  ClipboardList,
} from "lucide-react";

import orderService from "@/services/orderService";

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value: any) => {
    if (!value) return "N/A";

    if (value?.seconds) {
      return new Date(value.seconds * 1000).toLocaleString();
    }

    try {
      return new Date(value).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (status: string) => {
    const s = (status || "").toLowerCase();

    if (s === "delivered")
      return "bg-green-100 text-green-700 border-green-200";
    if (s === "processing")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "shipped")
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (s === "cancelled")
      return "bg-red-100 text-red-700 border-red-200";

    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-sm border p-10 text-center">
          <p className="text-lg font-medium text-gray-600">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-sm border p-10 text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Order not found
          </h2>
          <p className="text-gray-500 mt-2">
            We couldn’t find this order.
          </p>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 mt-6 bg-black text-white px-5 py-3 rounded-xl"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const items = order.items || [];
  const subtotal = Number(order.subtotal || 0);
  const shipping = Number(order.shipping || 0);
  const total = Number(order.total || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-3"
            >
              <ArrowLeft size={16} />
              Back to Orders
            </Link>

            <h1 className="text-3xl font-bold text-gray-900">
              Order Details
            </h1>

            <p className="text-gray-500 mt-2">
              Review customer details, ordered items, payment info, and order summary.
            </p>
          </div>

          <div className="bg-white border shadow-sm rounded-2xl px-5 py-4 text-right">
            <p className="text-sm text-gray-500">Order Number</p>
            <h2 className="text-xl font-bold text-gray-900">
              {order.orderNumber || order.id || "N/A"}
            </h2>
          </div>
        </div>

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-sm border p-6">
          <div className="grid md:grid-cols-4 gap-5">
            <div className="rounded-2xl border bg-gray-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <ClipboardList className="text-gray-600" size={20} />
                <h3 className="font-semibold text-gray-900">Status</h3>
              </div>

              <span
                className={`inline-flex px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status || "Pending"}
              </span>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <CircleDollarSign className="text-gray-600" size={20} />
                <h3 className="font-semibold text-gray-900">Total</h3>
              </div>
              <p className="text-2xl font-bold text-gray-600">
                LKR {total.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="text-gray-600" size={20} />
                <h3 className="font-semibold text-gray-900">Payment</h3>
              </div>
              <p className="font-medium text-gray-900">
                {order.paymentMethod || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {order.paymentStatus || "N/A"}
              </p>
            </div>

            <div className="rounded-2xl border bg-gray-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="text-gray-600" size={20} />
                <h3 className="font-semibold text-gray-900">Created</h3>
              </div>
              <p className="font-medium text-gray-900">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="xl:col-span-2 space-y-6">
            {/* ORDER ITEMS */}
            <div className="bg-white rounded-3xl shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <Package className="text-gray-600" size={22} />
                <h2 className="text-xl font-bold text-gray-900">
                  Ordered Items
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="border rounded-2xl p-8 text-center text-gray-500">
                  No items found for this order.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item: any, index: number) => {
                    const itemImage =
                      item.image ||
                      item.images?.[0] ||
                      "/placeholder.png";

                    return (
                      <div
                        key={`${item.id}-${item.size}-${item.color}-${index}`}
                        className="border rounded-2xl p-4 flex flex-col md:flex-row gap-4"
                      >
                        <img
                          src={itemImage}
                          alt={item.name || "Product"}
                          className="w-full md:w-28 h-28 object-cover rounded-xl border"
                        />

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name || "Unnamed Product"}
                          </h3>

                          <div className="grid sm:grid-cols-2 gap-2 mt-3 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Size:</span>{" "}
                              {item.size || "-"}
                            </p>
                            <p>
                              <span className="font-medium">Color:</span>{" "}
                              {item.color || "-"}
                            </p>
                            <p>
                              <span className="font-medium">Qty:</span>{" "}
                              {item.quantity || 1}
                            </p>
                            <p>
                              <span className="font-medium">Unit Price:</span>{" "}
                              LKR {Number(item.price || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-sm text-gray-500 mb-1">
                            Item Total
                          </p>
                          <p className="text-lg font-bold text-gray-600">
                            LKR{" "}
                            {(
                              Number(item.price || 0) *
                              Number(item.quantity || 1)
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ORDER NOTES / RAW INFO CARD */}
            <div className="bg-white rounded-3xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Additional Order Info
              </h2>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-gray-500 mb-1">Order ID</p>
                  <p className="font-medium break-all">{order.id || id}</p>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-gray-500 mb-1">Customer UID</p>
                  <p className="font-medium break-all">
                    {order.userId || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-gray-500 mb-1">Customer Email (Auth)</p>
                  <p className="font-medium break-all">
                    {order.customerEmail || order.email || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl border bg-gray-50 p-4">
                  <p className="text-gray-500 mb-1">Updated At</p>
                  <p className="font-medium">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* CUSTOMER DETAILS */}
            <div className="bg-white rounded-3xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Customer Details
              </h2>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <User className="text-gray-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-gray-500">Customer Name</p>
                    <p className="font-medium">
                      {order.customerName || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-gray-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium break-all">
                      {order.email || order.customerEmail || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-gray-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{order.phone || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-600 mt-0.5" size={18} />
                  <div>
                    <p className="text-gray-500">Delivery Address</p>
                    <p className="font-medium">
                      {order.address || "N/A"}
                      {order.city ? `, ${order.city}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white rounded-3xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    LKR {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    LKR {shipping.toLocaleString()}
                  </span>
                </div>

                <div className="border-t pt-4 flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-gray-600">
                    LKR {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* QUICK ACTION */}
            <div className="bg-white rounded-3xl shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Quick Action
              </h2>

              <Link
                href="/admin/orders"
                className="w-full inline-flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
              >
                <ArrowLeft size={18} />
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}