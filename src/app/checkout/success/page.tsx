import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="bg-white max-w-lg w-full p-10 rounded-2xl shadow-lg text-center">

        {/* Success Icon */}

        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-green-600 mt-6">
          Order Successful!
        </h1>

        <p className="mt-4 text-gray-600">
          Thank you for shopping with
          <span className="font-semibold">
            {" "}
            Cinderella Shoe Store
          </span>
          .
        </p>

        <p className="text-gray-500 mt-2">
          Your order has been placed successfully and
          is now being processed.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/my-orders"
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            View My Orders
          </Link>

          <Link
            href="/shop"
            className="border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}