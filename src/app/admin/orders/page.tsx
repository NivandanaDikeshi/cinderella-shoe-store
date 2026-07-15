"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Search,
  Eye,
  X,
  MapPin,
  Package,
  CreditCard,
  Calendar,
  User,
  Phone,
  Mail,
  ClipboardList,
  CircleDollarSign,
  ShoppingBag,
} from "lucide-react";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import AccessDenied from "@/components/admin/AccessDenied";

interface OrderItem {
  id?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
  images?: string[];
  size?: string;
  color?: string;
}

interface Order {
  id: string;
  orderNumber?: string;
  userId?: string;

  // old fields
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  subtotalAmount?: number;
  deliveryCharge?: number;
  totalAmount?: number;

  // new fields
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  subtotal?: number;
  shipping?: number;
  total?: number;

  paymentMethod?: string;
  paymentStatus?: string;
  status?: string;
  items?: OrderItem[];
  createdAt?: any;
  updatedAt?: any;
}

const STATUS_TABS = [
  "All",
  "Pending",
  "Processing",
  "Dispatched",
  "Completed",
  "Cancelled",
];

export default function OrderManagementPage() {
  const { roleCode, hasPermission, loading: authLoading } = useAdminAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const fetchedOrders = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Order[];

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HELPERS
  // =========================
  const getCustomerName = (order: Order) =>
    order.customerName || order.name || "N/A";

  const getCustomerEmail = (order: Order) =>
    order.customerEmail || order.email || "N/A";

  const getCustomerPhone = (order: Order) =>
    order.customerPhone || order.phone || "N/A";

  const getShippingAddress = (order: Order) =>
    order.shippingAddress ||
    [order.address, order.city].filter(Boolean).join(", ") ||
    "N/A";

  const getSubtotal = (order: Order) =>
    Number(order.subtotalAmount ?? order.subtotal ?? 0);

  const getShippingCharge = (order: Order) =>
    Number(order.deliveryCharge ?? order.shipping ?? 0);

  const getOrderTotal = (order: Order) =>
    Number(order.totalAmount ?? order.total ?? 0);

  const getItemsCount = (order: Order) =>
    (order.items || []).reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";

    try {
      const date =
        typeof timestamp?.toDate === "function"
          ? timestamp.toDate()
          : timestamp?.seconds
          ? new Date(timestamp.seconds * 1000)
          : new Date(timestamp);

      if (isNaN(date.getTime())) return "N/A";

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

  const getStatusClasses = (status?: string) => {
    const s = (status || "Pending").toLowerCase();

    if (s === "pending")
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (s === "processing")
      return "bg-blue-50 text-blue-700 border-blue-200";
    if (s === "dispatched" || s === "shipped")
      return "bg-purple-50 text-purple-700 border-purple-200";
    if (s === "completed" || s === "delivered")
      return "bg-green-50 text-green-700 border-green-200";
    if (s === "cancelled")
      return "bg-red-50 text-red-700 border-red-200";

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : prev
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  // =========================
  // FILTERS
  // =========================
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab =
        activeTab === "All" || (order.status || "Pending") === activeTab;

      const searchLower = searchQuery.toLowerCase().trim();

      const matchesSearch =
        (order.id || "").toLowerCase().includes(searchLower) ||
        (order.orderNumber || "").toLowerCase().includes(searchLower) ||
        getCustomerName(order).toLowerCase().includes(searchLower) ||
        getCustomerEmail(order).toLowerCase().includes(searchLower) ||
        getCustomerPhone(order).toLowerCase().includes(searchLower);

      return matchesTab && matchesSearch;
    });
  }, [orders, searchQuery, activeTab]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // =========================
  // STATS
  // =========================
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const pending = orders.filter(
      (o) => (o.status || "Pending") === "Pending"
    ).length;
    const processing = orders.filter(
      (o) => (o.status || "") === "Processing"
    ).length;
    const revenue = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);

    return { totalOrders, pending, processing, revenue };
  }, [orders]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 font-semibold">
        Loading orders...
      </div>
    );
  }

  const canManage = roleCode === 0 || (typeof hasPermission === "function" && hasPermission("manage orders"));
  if (!canManage) {
    return <AccessDenied />;
  }

  return (
    <div className="max-w-[1500px] mx-auto p-6 md:p-8 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Order Management
        </h1>
        <p className="text-slate-500">
          Track, manage, and update customer orders in one place.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center">
              <ShoppingBag className="text-gray-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">
            {stats.totalOrders}
          </h3>
          <p className="text-sm text-slate-500 mt-1">All orders</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center">
              <ClipboardList className="text-amber-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Pending
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{stats.pending}</h3>
          <p className="text-sm text-slate-500 mt-1">Awaiting action</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Package className="text-blue-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Processing
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">
            {stats.processing}
          </h3>
          <p className="text-sm text-slate-500 mt-1">Currently active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-green-50 flex items-center justify-center">
              <CircleDollarSign className="text-green-600" size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Revenue
            </span>
          </div>
          <h3 className="text-3xl font-bold text-slate-900">
            LKR {stats.revenue.toLocaleString()}
          </h3>
          <p className="text-sm text-slate-500 mt-1">Total order value</p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-4 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab
                  ? "bg-slate-900 text-white border border-slate-500"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full xl:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search order ID, customer, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-slate-400 focus:bg-white transition"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-5">Order</th>
                <th className="p-5">Customer</th>
                <th className="p-5">Items</th>
                <th className="p-5">Total</th>
                <th className="p-5">Payment</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 text-sm">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    {/* ORDER */}
                    <td className="p-5 align-middle">
                      <div className="font-bold text-slate-900 uppercase tracking-wider">
                        #{order.orderNumber || order.id.slice(-8)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {formatDate(order.createdAt)}
                      </div>
                    </td>

                    {/* CUSTOMER */}
                    <td className="p-5 align-middle">
                      <div className="font-semibold text-slate-900">
                        {getCustomerName(order)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {getCustomerPhone(order)}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {getCustomerEmail(order)}
                      </div>
                    </td>

                    {/* ITEMS */}
                    <td className="p-5 align-middle">
                      <div className="font-semibold text-slate-900">
                        {getItemsCount(order)} item(s)
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {(order.items || []).length} product row(s)
                      </div>
                    </td>

                    {/* TOTAL */}
                    <td className="p-5 align-middle">
                      <div className="font-bold text-slate-900">
                        LKR {getOrderTotal(order).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Shipping:{" "}
                        {getShippingCharge(order) === 0
                          ? "FREE"
                          : `LKR ${getShippingCharge(order).toLocaleString()}`}
                      </div>
                    </td>

                    {/* PAYMENT */}
                    <td className="p-5 align-middle">
                      <div className="font-medium text-slate-900">
                        {order.paymentMethod || "N/A"}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {order.paymentStatus || "Unpaid"}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-5 align-middle w-52">
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer transition ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* ACTION */}
                    <td className="p-5 align-middle text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-900 hover:text-slate-500 text-slate-900 border border-slate-200 text-xs font-bold rounded-xl transition"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between p-4 border-t border-slate-200 bg-white gap-4">
            <span className="text-xs font-semibold text-slate-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </span>

            <div className="flex gap-2 items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-900 transition"
              >
                Previous
              </button>

              <div className="flex gap-1 items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition ${
                        currentPage === page
                          ? "bg-slate-900 text-white border border-slate-500"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-slate-900 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-slate-50">
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-600">
                  Order Details
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                  #{selectedOrder.orderNumber || selectedOrder.id.slice(-8)}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 shadow-sm transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
              {/* TOP INFO CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* CUSTOMER */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={18} className="text-slate-600" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                      Customer
                    </h3>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex gap-3">
                      <User size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-500">Name</p>
                        <p className="font-medium text-slate-900">
                          {getCustomerName(selectedOrder)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-500">Phone</p>
                        <p className="font-medium text-slate-900">
                          {getCustomerPhone(selectedOrder)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Mail size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-500">Email</p>
                        <p className="font-medium text-slate-900 break-all">
                          {getCustomerEmail(selectedOrder)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <MapPin size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-slate-500">Address</p>
                        <p className="font-medium text-slate-900">
                          {getShippingAddress(selectedOrder)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ORDER META */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar size={18} className="text-slate-600" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                      Order Info
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4 pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Order ID</span>
                      <span className="font-medium text-slate-900 break-all text-right">
                        {selectedOrder.id}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Order Number</span>
                      <span className="font-medium text-slate-900 text-right">
                        {selectedOrder.orderNumber || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Date Placed</span>
                      <span className="font-medium text-slate-900 text-right">
                        {formatDate(selectedOrder.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 pb-3 border-b border-slate-200">
                      <span className="text-slate-500">Payment Method</span>
                      <span className="font-medium text-slate-900 text-right flex items-center gap-1">
                        <CreditCard size={14} />
                        {selectedOrder.paymentMethod || "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">Status</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusClasses(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* TOTALS */}
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CircleDollarSign size={18} className="text-slate-600" />
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                      Payment Summary
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium text-slate-900">
                        LKR {getSubtotal(selectedOrder).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Shipping</span>
                      <span className="font-medium text-slate-900">
                        {getShippingCharge(selectedOrder) === 0
                          ? "FREE"
                          : `LKR ${getShippingCharge(
                              selectedOrder
                            ).toLocaleString()}`}
                      </span>
                    </div>

                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                      <span className="font-bold uppercase tracking-wider text-slate-900">
                        Grand Total
                      </span>
                      <span className="text-2xl font-bold text-slate-900">
                        LKR {getOrderTotal(selectedOrder).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEMS TABLE */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Package size={18} className="text-slate-600" />
                  <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900">
                    Purchased Items
                  </h3>
                </div>

                <div className="border border-slate-200 rounded-3xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                      <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                        <tr>
                          <th className="p-4">Product</th>
                          <th className="p-4">Variant</th>
                          <th className="p-4 text-center">Qty</th>
                          <th className="p-4 text-right">Unit Price</th>
                          <th className="p-4 text-right">Total</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200">
                        {(selectedOrder.items || []).length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-slate-400"
                            >
                              No items found for this order.
                            </td>
                          </tr>
                        ) : (
                          (selectedOrder.items || []).map((item, idx) => {
                            const image =
                              item.image ||
                              item.images?.[0] ||
                              "/placeholder.png";

                            const qty = Number(item.quantity || 0);
                            const price = Number(item.price || 0);

                            return (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-4">
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={image}
                                      alt={item.name || "Product"}
                                      className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                                    />
                                    <div>
                                      <p className="font-semibold text-slate-900">
                                        {item.name || "Unnamed Product"}
                                      </p>
                                      <p className="text-xs text-slate-500 mt-1">
                                        Product ID: {item.id || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-4">
                                  <div className="text-sm text-slate-700 space-y-1">
                                    <p>
                                      <span className="font-medium">Size:</span>{" "}
                                      {item.size || "-"}
                                    </p>
                                    <p>
                                      <span className="font-medium">Color:</span>{" "}
                                      {item.color || "-"}
                                    </p>
                                  </div>
                                </td>

                                <td className="p-4 text-center font-medium text-slate-700">
                                  {qty}
                                </td>

                                <td className="p-4 text-right font-medium text-slate-900">
                                  LKR {price.toLocaleString()}
                                </td>

                                <td className="p-4 text-right font-bold text-slate-900">
                                  LKR {(qty * price).toLocaleString()}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* STATUS UPDATE INSIDE MODAL */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-200 pt-6">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    Update Order Status
                  </h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Change the current progress of this order.
                  </p>
                </div>

                <div className="w-full md:w-72">
                  <select
                    value={selectedOrder.status || "Pending"}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder.id, e.target.value)
                    }
                    className={`w-full border rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-wider outline-none cursor-pointer transition ${getStatusClasses(
                      selectedOrder.status
                    )}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}