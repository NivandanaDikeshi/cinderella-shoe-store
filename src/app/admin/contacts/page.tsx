"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Mail, User, MessageCircle, Clock } from "lucide-react";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return "Just now";
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Contact Messages
        </h1>
        <p className="text-gray-500 mt-1">
          Manage customer inquiries and support requests
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white border border-pink-100 p-6 rounded-2xl shadow-sm"
            >
              <div className="h-4 bg-pink-100 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-pink-100 shadow-sm">

          <Mail className="mx-auto text-pink-300" size={44} />

          <h2 className="text-2xl font-semibold mt-4 text-gray-900">
            No Messages Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Customer inquiries will appear here automatically
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className="group bg-white border border-pink-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300"
            >

              {/* NAME */}
              <div className="flex items-center gap-2 mb-3">
                <User className="text-pink-500" size={18} />
                <p className="font-semibold text-gray-900">
                  {msg.name}
                </p>
              </div>

              {/* EMAIL */}
              <div className="flex items-center gap-2 mb-4 text-gray-600">
                <Mail size={16} className="text-gray-400" />
                <p className="text-sm break-all">
                  {msg.email}
                </p>
              </div>

              {/* MESSAGE */}
              <div className="flex items-start gap-2 mb-5">
                <MessageCircle className="text-pink-400 mt-1" size={16} />
                <p className="text-gray-700 leading-relaxed text-sm">
                  {msg.message}
                </p>
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-between text-xs text-gray-400 border-t pt-3 border-pink-50">

                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{formatDate(msg.createdAt)}</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 font-medium">
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