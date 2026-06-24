"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      setName("");
      setEmail("");
      setMessage("");
      setSuccess("Message sent successfully! We will get back to you soon.");
    } catch (error) {
      console.error(error);
      setSuccess("");
      alert("Failed to send message");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE - INFO */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold text-gray-900">
            Get in Touch 💬
          </h1>

          <p className="text-gray-600 mt-4 text-lg leading-relaxed">
            We’re here to help you with orders, support, and anything about
            <span className="text-pink-600 font-semibold">
              {" "}Cinderella Shoes
            </span>.
          </p>

          <div className="mt-8 space-y-4 text-gray-700">
            <p>📍 Colombo, Sri Lanka</p>
            <p>📞 +94 77 123 4567</p>
            <p>✉ info@cinderellashoes.com</p>
          </div>

          <div className="mt-10 p-5 bg-white/70 backdrop-blur-md rounded-2xl border border-pink-100 shadow-sm">
            <p className="text-sm text-gray-500">
              💡 Tip: We usually respond within 24 hours.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="bg-white/80 backdrop-blur-lg border border-pink-100 shadow-2xl rounded-3xl p-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Send us a message
          </h2>

          {success && (
            <div className="mb-4 text-green-600 bg-green-50 border border-green-200 px-4 py-3 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />

            <textarea
              rows={5}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Message ✉️"
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}