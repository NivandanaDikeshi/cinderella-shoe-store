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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-pink-500">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Update your personal information and avatar
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-gray-200 bg-white/75 p-5 shadow-xl backdrop-blur-xl sm:p-8">
          {/* AVATAR SECTION */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="group relative">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-pink-200 object-cover shadow-md transition group-hover:scale-105 sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-pink-200 bg-pink-100 sm:h-28 sm:w-28">
                  <UserIcon className="text-pink-500" size={40} />
                </div>
              )}

              <div className="absolute bottom-1 right-1 rounded-full bg-pink-600 p-2 shadow-lg sm:bottom-2 sm:right-2">
                <Camera size={14} className="text-white" />
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              {name || "Your Name"}
            </h2>

            <p className="max-w-full break-all text-sm text-gray-500">
              {user?.email}
            </p>
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
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
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
                className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-pink-400"
                placeholder="Paste image URL (Cloudinary or Firebase)"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Address
              </label>

              <div className="mt-2 flex items-center gap-2 break-all rounded-xl bg-gray-100 px-4 py-3 text-gray-700">
                <Mail size={16} className="shrink-0 text-pink-500" />
                <span className="break-all">{user?.email}</span>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
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