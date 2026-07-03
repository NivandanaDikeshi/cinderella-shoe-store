"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // ✅ Custom validation (NO browser popup)
    if (!name || !email || !phone || !message) {
      setError("⚠️ Please fill in all fields before sending your message.");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "contacts"), {
        name,
        email,
        phone,
        message,
        createdAt: serverTimestamp(),
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      setSuccess("✨ Message sent successfully! We will get back to you soon.");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:gap-10">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Get in Touch 💬
          </h1>

          <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            We’re here to help you with orders, support, and anything about{" "}
            <span className="font-semibold text-pink-600">
              Cinderella Shoes
            </span>.
          </p>

          <div className="mt-8 space-y-3 text-sm text-gray-700 sm:text-base">
            <p>📍 Colombo, Sri Lanka</p>
            <p>📞 +94 77 123 4567</p>
            <p>✉ info@cinderellashoes.com</p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="rounded-3xl border border-pink-100 bg-white/80 p-5 shadow-2xl backdrop-blur-lg sm:p-8">

          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Send us a message
          </h2>

          {/* ✅ ERROR MESSAGE */}
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
              {error}
            </div>
          )}

          {/* ✅ SUCCESS MESSAGE */}
          {success && (
            <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600 shadow-sm animate-pulse">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* NAME */}
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* EMAIL */}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* PHONE */}
            <input
              type="tel"
              placeholder="Contact Number (e.g. +94 77 123 4567)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* MESSAGE */}
            <textarea
              rows={5}
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message ✉️"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}