"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";

import useCartStore from "@/store/cartStore";
import { createOrder } from "@/services/checkoutService";
import { reduceInventory } from "@/services/inventoryService";
import { auth } from "@/lib/firebase/config";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const subtotal = getTotal();
  const shipping = 500;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (
      !form.customerName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city
    ) {
      alert("Please fill all fields");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // IMPORTANT: require logged in user
    const currentUser = auth.currentUser;

    if (!currentUser) {
      alert("Please login before placing an order.");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const orderNumber = `ORD-${Date.now()}`;

      const orderData = {
        orderNumber,

        // customer info
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,

        // USER OWNERSHIP (VERY IMPORTANT)
        userId: currentUser.uid,
        customerEmail: currentUser.email || form.email,

        // order details
        items,
        subtotal,
        shipping,
        total,
        status: "Pending",
        paymentMethod,
        paymentStatus:
          paymentMethod === "PAYHERE"
            ? "Pending"
            : "Cash On Delivery",
        createdAt: new Date(),
      };

      const orderId = await createOrder(orderData);

      await reduceInventory(items);

      clearCart();

      router.push(`/orders/${orderId}`);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-8">
              Customer Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="relative">
                <User className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.customerName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customerName: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl pl-12 pr-4 py-3"
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl pl-12 pr-4 py-3"
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl pl-12 pr-4 py-3"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      city: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl pl-12 pr-4 py-3"
                />
              </div>
            </div>

            <textarea
              placeholder="Delivery Address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              rows={4}
              className="w-full border rounded-xl p-4 mt-5"
            />

            <div className="mt-8">
              <h3 className="font-semibold mb-4">Payment Method</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <label
                  className={`border rounded-xl p-4 cursor-pointer ${
                    paymentMethod === "COD"
                      ? "border-pink-600 bg-pink-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard />
                    <div>
                      <h4 className="font-medium">Cash On Delivery</h4>
                      <p className="text-sm text-gray-500">
                        Pay when order arrives
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`border rounded-xl p-4 cursor-pointer ${
                    paymentMethod === "PAYHERE"
                      ? "border-pink-600 bg-pink-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    value="PAYHERE"
                    checked={paymentMethod === "PAYHERE"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <CreditCard />
                    <div>
                      <h4 className="font-medium">Pay Online</h4>
                      <p className="text-sm text-gray-500">
                        Secure PayHere Payment
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-3xl shadow-lg p-8 h-fit">
            <h2 className="text-2xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              {items.map((item: any) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex justify-between border-b pb-4"
                >
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      Size: {item.size}
                    </p>
                    <p className="text-sm text-gray-500">
                      Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="font-semibold">
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>LKR {shipping.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-xl font-bold border-t pt-4">
                <span>Total</span>
                <span className="text-pink-600">
                  LKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full mt-8 bg-pink-600 hover:bg-pink-700 text-white py-4 rounded-xl font-semibold transition"
            >
              {loading
                ? "Processing..."
                : paymentMethod === "PAYHERE"
                ? "Pay Now"
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}