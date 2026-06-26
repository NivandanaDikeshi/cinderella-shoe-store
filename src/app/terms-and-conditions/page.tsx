import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="mb-4">
        Please read these terms and conditions carefully before using our website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Website</h2>
      <p className="mb-4">
        You agree to use this website only for lawful purposes.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Orders</h2>
      <p className="mb-4">
        All orders are subject to availability and confirmation.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Pricing</h2>
      <p className="mb-4">
        We reserve the right to change prices at any time without notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Changes</h2>
      <p className="mb-4">
        We may update these terms at any time.
      </p>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}