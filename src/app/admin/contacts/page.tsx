"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import {
  Mail,
  User,
  MessageCircle,
  Clock,
  Phone,
  MessageSquare,
} from "lucide-react";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const q = query(
        collection(db, "contacts"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORMAT PHONE NUMBER
  // =========================
  const formatPhone = (phone: string) => {
    if (!phone) return "";

    let cleaned = phone.replace(/\D/g, "");

    // Sri Lanka format fix
    if (cleaned.startsWith("0")) {
      cleaned = "94" + cleaned.substring(1);
    }

    return cleaned;
  };

  // =========================
  // WHATSAPP LINK
  // =========================
  const createWhatsAppLink = (
    phone: string,
    name: string,
    message: string
  ) => {
    const formattedPhone = formatPhone(phone);

    const text = `Hello ${name} 👋\n\nWe received your message:\n\n"${message}"\n\nHow can we help you?`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "Just now";
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Contact Inbox
        </h1>
        <p className="text-gray-500 mt-1">
          Manage customer messages and reply via WhatsApp instantly
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-gray-500 animate-pulse">
          Loading messages...
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-gray-500">
          No messages found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300"
            >

              {/* NAME */}
              <div className="flex items-center gap-2 mb-3">
                <User size={16} className="text-slate-600" />
                <p className="font-semibold text-gray-900">
                  {msg.name}
                </p>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Mail size={14} />
                {msg.email}
              </div>

              {/* PHONE */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Phone size={14} />
                {msg.phone || "No phone number"}
              </div>

              {/* MESSAGE */}
              <div className="flex items-start gap-2 text-sm text-gray-700 mb-4">
                <MessageCircle size={14} className="mt-1 text-gray-400" />
                <p className="leading-relaxed">
                  {msg.message}
                </p>
              </div>

              {/* WHATSAPP BUTTON */}
              {msg.phone && (
                <a
                  href={createWhatsAppLink(
                    msg.phone,
                    msg.name,
                    msg.message
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2.5 rounded-xl shadow-sm transition"
                >
                  <MessageSquare size={16} />
                  Reply on WhatsApp
                </a>
              )}

              {/* FOOTER */}
              <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">

                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(msg.createdAt)}
                </div>

                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                  New
                </span>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}