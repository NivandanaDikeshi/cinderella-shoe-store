import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Welcome to our Privacy Policy page. Your privacy is important to us.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We collect personal information such as name, email, and order details to
        improve your shopping experience.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Information</h2>
      <p className="mb-4">
        We use your information to process orders, provide support, and improve our services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Protection</h2>
      <p className="mb-4">
        Your data is securely stored and never sold to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact Us</h2>
      <p>
        If you have any questions, contact us anytime.
      </p>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}