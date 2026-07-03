"use client";

export default function CartSummary({
  total,
}: {
  total: number;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-4">
        Cart Summary
      </h2>

      <div className="flex justify-between mb-3">
        <span>Total</span>

        <span>
          LKR {total}
        </span>
      </div>

      <a
        href="/checkout"
        className="block text-center bg-gray-600 text-white py-3 rounded-lg"
      >
        Proceed To Checkout
      </a>

    </div>
  );
}