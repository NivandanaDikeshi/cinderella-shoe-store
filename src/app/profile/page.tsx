"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { User as UserIcon, Mail, Save, Camera } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");
        setPhoto(currentUser.photoURL || "");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    if (!auth.currentUser) return;

    setLoading(true);

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });

      await auth.currentUser.reload();
      setUser(auth.currentUser);

      alert("Profile updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">

      <div className="w-full max-w-2xl">

        {/* HEADER */}
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-pink-500 font-semibold">
            Account Settings
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Update your personal information and avatar
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8">

          {/* AVATAR SECTION */}
          <div className="flex flex-col items-center mb-8">

            <div className="relative group">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-pink-200 shadow-md group-hover:scale-105 transition"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-pink-100 flex items-center justify-center border-4 border-pink-200">
                  <UserIcon className="text-pink-500" size={40} />
                </div>
              )}

              <div className="absolute bottom-2 right-2 bg-pink-600 p-2 rounded-full shadow-lg">
                <Camera size={14} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-4 text-gray-900">
              {name || "Your Name"}
            </h2>

            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* FORM */}
          <div className="space-y-5">

            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                placeholder="Enter your full name"
              />
            </div>

            {/* PHOTO */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Profile Photo URL
              </label>

              <input
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                placeholder="Paste image URL (Cloudinary or Firebase)"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>

              <div className="flex items-center gap-2 mt-2 px-4 py-3 rounded-xl bg-gray-100 text-gray-700">
                <Mail size={16} className="text-pink-500" />
                {user?.email}
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold shadow-md hover:scale-[1.02] transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}