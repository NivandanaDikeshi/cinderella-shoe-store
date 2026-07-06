"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/config";
import { onAuthStateChanged, updateProfile, User } from "firebase/auth";
import { User as UserIcon, Mail, Save, Camera, Check } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

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
    setSaved(false);

    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });

      await auth.currentUser.reload();
      setUser(auth.currentUser);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen font-body text-[#2B1620] px-4 py-8 sm:px-6 sm:py-10 lg:px-8"
      style={{
        background:
          "linear-gradient(135deg, #FADCE9 0%, #FCE9F0 35%, #FDF3F6 65%, #FFFFFF 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-3xl">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 text-center">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#B33B5E]">
            Account Settings
          </p>

          <h1 className="mt-2 font-display font-black text-3xl sm:text-4xl text-[#211016]">
            My Profile
          </h1>

          <p className="mt-2 text-sm sm:text-base text-[#8C6169]">
            Update your personal information and avatar
          </p>
        </div>

        {/* CARD */}
        <div className="rounded-3xl border border-[#F2DEE0] bg-white/80 p-5 shadow-xl backdrop-blur-xl sm:p-8">
          {/* AVATAR SECTION */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="group relative">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-[#F2DEE0] object-cover shadow-md transition group-hover:scale-105 sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#F2DEE0] bg-[#FFF0F3] sm:h-28 sm:w-28">
                  <UserIcon className="text-[#df2d60]" size={40} />
                </div>
              )}

              <div className="absolute bottom-1 right-1 rounded-full bg-[#df2d60] p-2 shadow-lg sm:bottom-2 sm:right-2">
                <Camera size={14} className="text-white" />
              </div>
            </div>

            <h2 className="mt-4 font-display font-extrabold text-xl sm:text-2xl text-[#211016]">
              {name || "Your Name"}
            </h2>

            <p className="max-w-full break-all text-sm text-[#8C6169]">
              {user?.email}
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-5">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium text-[#8C6169]">
                Full Name
              </label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#F2DEE0] bg-white px-4 py-3 text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-[#B33B5E]/20 focus:border-[#B33B5E]/40"
                placeholder="Enter your full name"
              />
            </div>

            {/* PHOTO */}
            <div>
              <label className="text-sm font-medium text-[#8C6169]">
                Profile Photo URL
              </label>

              <input
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#F2DEE0] bg-white px-4 py-3 text-sm sm:text-base transition focus:outline-none focus:ring-2 focus:ring-[#B33B5E]/20 focus:border-[#B33B5E]/40"
                placeholder="Paste image URL (Cloudinary or Firebase)"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-[#8C6169]">
                Email Address
              </label>

              <div className="mt-2 flex items-center gap-2 break-all rounded-xl bg-[#FFF6F4] border border-[#F2DEE0]/70 px-4 py-3 text-sm sm:text-base text-[#2B1620]">
                <Mail size={16} className="shrink-0 text-[#B33B5E]" />
                <span className="break-all">{user?.email}</span>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={handleUpdate}
              disabled={loading}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm sm:text-base font-semibold text-white shadow-md transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                saved ? "bg-[#2FAE6C]" : "bg-[#E60076] hover:bg-[#C6005C]"
              }`}
            >
              {saved ? (
                <>
                  <Check size={18} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={18} />
                  {loading ? "Saving..." : "Save Changes"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}