"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
} from "firebase/auth";
import {
  getApps,
  getApp,
  initializeApp,
} from "firebase/app";
import { auth, db } from "@/lib/firebase/config";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import {
  Edit,
  Trash2,
  UserPlus,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const secondaryApp =
  getApps().find((app) => app.name === "SecondaryAuth") ||
  initializeApp(firebaseConfig, "SecondaryAuth");

const secondaryAuth = getAuth(secondaryApp);

/* ------------------------------------------------------------------ */
/* Design tokens — a "colorful gray" palette                           */
/* Every tone below is grayscale, but each is a distinct step so       */
/* different elements read apart from one another instead of one flat  */
/* gray everywhere.                                                     */
/* ------------------------------------------------------------------ */
const GRAY = {
  ink: "#1C1C1E", // Primary Black
  charcoal: "#2A2A2E", // Dark Gray
  graphite: "#3F3F46", // zinc-700
  slateDeep: "#52525B", // zinc-600
  slateMid: "#71717A", // zinc-500
  slateSoft: "#A1A1AA", // zinc-400
  mist: "#D4D4D8", // zinc-300
  ash: "#F4F4F5", // Ash Background
  ashBorder: "#D6D6D6", // Light Ash Border
};

/* Types */
type Role = {
  id: string;
  name: string;
  level: number;
  permissions?: string[];
};

type StaffUser = {
  id: string;
  uid?: string;
  email: string;
  displayName: string;
  roleName: string;
  roleCode: number;
  createdAt?: any;
};

type ToastType = "success" | "error" | "info";

type Toast = {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
};

type ConfirmState = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
} | null;

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  selectedRoleName: "",
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const getInitials = (name: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "");
  return initials.join("") || "?";
};

// Distinct tonal step per role level, instead of just 2-3 flat shades.
const roleBadgeClasses = (roleCode: number) => {
  if (roleCode === 0) {
    // Master Admin — deepest tone, solid, highest emphasis
    return "bg-[#1C1C1E] text-white border border-[#1C1C1E]";
  }
  if (roleCode === 1) {
    // Admin — one step lighter, still solid
    return "bg-[#3F3F46] text-white border border-[#3F3F46]";
  }
  if (roleCode === 2) {
    // Staff — mid slate outline
    return "bg-white text-[#52525B] border border-[#A1A1AA]";
  }
  if (roleCode === 3) {
    // Manager — soft slate outline
    return "bg-white text-[#71717A] border border-[#D4D4D8]";
  }
  if (roleCode === 4) {
    // Support — mist tone
    return "bg-[#D4D4D8] text-[#2A2A2E] border border-[#A1A1AA]";
  }
  if (roleCode === 5) {
    // Viewer — quietest, read-only feel
    return "bg-[#F4F4F5] text-[#71717A] border border-[#D6D6D6]";
  }
  // Anything else — quiet ash tone
  return "bg-[#F4F4F5] text-slate-600 border border-[#D6D6D6]";
};

// Matching tonal step for the avatar circle in the table.
const avatarClasses = (roleCode: number) => {
  if (roleCode === 0) return "bg-[#1C1C1E]";
  if (roleCode === 1) return "bg-[#3F3F46]";
  if (roleCode === 2) return "bg-[#71717A]";
  if (roleCode === 3) return "bg-[#A1A1AA]";
  if (roleCode === 4) return "bg-[#94949B]";
  if (roleCode === 5) return "bg-[#B4B4BA]";
  return "bg-[#A1A1AA]";
};

/* ------------------------------------------------------------------ */
/* Toast notification system                                          */
/* Self-contained: no external deps beyond lucide-react (already used) */
/* ------------------------------------------------------------------ */
const TOAST_ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const TOAST_ACCENT: Record<ToastType, string> = {
  success: "#1C1C1E",
  error: "#3F3F46",
  info: "#71717A",
};

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      className="fixed top-5 right-5 z-[100] flex flex-col gap-3 w-[92vw] max-w-sm"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const Icon = TOAST_ICONS[toast.type];
        const accent = TOAST_ACCENT[toast.type];
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto bg-white border border-[#D6D6D6] rounded-2xl shadow-lg overflow-hidden animate-[toastIn_0.25s_ease-out]"
          >
            <div className="flex items-start gap-3 p-4 pr-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${accent}14` }}
              >
                <Icon size={17} style={{ color: accent }} strokeWidth={2.4} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-bold text-[#1C1C1E] leading-tight">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-[#1C1C1E] transition p-1 -m-1 rounded-md shrink-0"
                aria-label="Dismiss notification"
              >
                <X size={15} />
              </button>
            </div>
            <div className="h-[3px] bg-[#F4F4F5]">
              <div
                className="h-full animate-[toastShrink_4.2s_linear_forwards]"
                style={{ backgroundColor: accent }}
              />
            </div>
          </div>
        );
      })}

      <style jsx global>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateX(16px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes toastShrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

/* Confirm dialog — replaces window.confirm() with something on-brand */
function ConfirmDialog({
  state,
  onCancel,
}: {
  state: ConfirmState;
  onCancel: () => void;
}) {
  if (!state?.open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#1C1C1E]/40 backdrop-blur-[2px] animate-[fadeIn_0.15s_ease-out]">
      <div className="bg-white rounded-2xl border border-[#D6D6D6] shadow-xl max-w-sm w-full p-6 animate-[popIn_0.18s_ease-out]">
        <div className="w-11 h-11 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-4">
          <AlertTriangle size={19} className="text-red-600" />
        </div>
        <h3 className="text-base font-bold text-[#1C1C1E] mb-1.5">
          {state.title}
        </h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          {state.description}
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 bg-white text-slate-600 border border-[#D6D6D6] font-bold text-sm py-2.5 rounded-xl hover:bg-[#F4F4F5] transition"
          >
            Cancel
          </button>
          <button
            onClick={state.onConfirm}
            className="flex-1 bg-red-600 text-white font-bold text-sm py-2.5 rounded-xl hover:bg-red-700 transition"
          >
            {state.confirmLabel}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default function ManageStaffPage() {
  const { roleCode, hasPermission } = useAdminAuthStore();

  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);

  const [name, setName] = useState(EMPTY_FORM.name);
  const [email, setEmail] = useState(EMPTY_FORM.email);
  const [password, setPassword] = useState(EMPTY_FORM.password);
  const [selectedRoleName, setSelectedRoleName] = useState(
    EMPTY_FORM.selectedRoleName
  );

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  /* Toasts */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>(
    {}
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (toastTimers.current[id]) {
      clearTimeout(toastTimers.current[id]);
      delete toastTimers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, title, message }]);
      toastTimers.current[id] = setTimeout(() => dismissToast(id), 4200);
    },
    [dismissToast]
  );

  useEffect(() => {
    return () => {
      Object.values(toastTimers.current).forEach(clearTimeout);
    };
  }, []);

  /* Confirm dialog */
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);

  const closeConfirm = useCallback(() => setConfirmState(null), []);

  const canManageStaff = useMemo(() => {
    return roleCode === 0 || hasPermission("manage staff");
  }, [roleCode, hasPermission]);

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setSelectedRoleName("");
  };

  const fetchData = async () => {
    try {
      setPageLoading(true);

      // Fetch roles
      const rolesSnap = await getDocs(collection(db, "roles"));
      const roleList: Role[] = rolesSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Role, "id">),
      }));
      setRoles(roleList);

      // Fetch users
      const usersSnap = await getDocs(collection(db, "users"));
      const userList: StaffUser[] = usersSnap.docs
        .map((d) => ({
          id: d.id,
          ...(d.data() as Omit<StaffUser, "id">),
        }))
        .filter((u) => u.roleCode !== 99); // exclude customers

      setStaff(userList);
    } catch (error) {
      console.error("Error fetching staff/roles:", error);
      showToast(
        "error",
        "Couldn't load staff",
        "Refresh the page to try again."
      );
    } finally {
      setPageLoading(false);
    }
  };

  /*ADD STAFF*/
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManageStaff) {
      showToast(
        "error",
        "Permission denied",
        "You can't add staff members."
      );
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim() || !selectedRoleName) {
      showToast("info", "Missing details", "Fill in every field to continue.");
      return;
    }

    setLoading(true);

    try {
      const roleData = roles.find((r) => r.name === selectedRoleName);

      if (!roleData) {
        throw new Error("Selected role not found.");
      }

      // Admin (role 1) cannot create Master Admin (role 0)
      if (roleCode === 1 && roleData.level === 0) {
        showToast(
          "error",
          "Permission denied",
          "Admins can't create Master Admin accounts."
        );
        setLoading(false);
        return;
      }

      // Create user in Firebase Auth using secondary auth
      const credential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email.trim(),
        password
      );

      const user = credential.user;

      // Save user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name.trim(),
        roleName: roleData.name,
        roleCode: roleData.level,
        createdAt: new Date(),
      });

      showToast("success", "Staff member added", `${name.trim()} is on the team.`);
      resetForm();
      await fetchData();
    } catch (error: any) {
      console.error("Add staff error:", error);
      showToast("error", "Couldn't add staff member", error?.message);
    } finally {
      setLoading(false);
    }
  };

  /* START EDIT */
  const handleEditClick = (user: StaffUser) => {
    if (!canManageStaff) {
      showToast("error", "Permission denied");
      return;
    }

    // Admin cannot edit Master Admin
    if (roleCode === 1 && user.roleCode === 0) {
      showToast(
        "error",
        "Permission denied",
        "Admins can't edit the Master Admin."
      );
      return;
    }

    // Staff cannot edit anyone
    if (roleCode === 2) {
      showToast(
        "error",
        "Permission denied",
        "Staff can't edit staff members."
      );
      return;
    }

    setEditingUser(user);
    setName(user.displayName || "");
    setEmail(user.email || "");
    setPassword("");
    setSelectedRoleName(user.roleName || "");
  };

  /* UPDATE STAFF */
  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    if (!canManageStaff) {
      showToast("error", "Permission denied");
      return;
    }

    if (!name.trim() || !email.trim() || !selectedRoleName) {
      showToast(
        "info",
        "Missing details",
        "Fill in every required field to continue."
      );
      return;
    }

    // Admin cannot update Master Admin
    if (roleCode === 1 && editingUser.roleCode === 0) {
      showToast(
        "error",
        "Permission denied",
        "Admins can't update the Master Admin."
      );
      return;
    }

    // Staff cannot update anyone
    if (roleCode === 2) {
      showToast(
        "error",
        "Permission denied",
        "Staff can't update staff members."
      );
      return;
    }

    setLoading(true);

    try {
      const roleData = roles.find((r) => r.name === selectedRoleName);

      if (!roleData) {
        throw new Error("Selected role not found.");
      }

      // Admin cannot promote to Master Admin
      if (roleCode === 1 && roleData.level === 0) {
        showToast(
          "error",
          "Permission denied",
          "Admins can't assign the Master Admin role."
        );
        setLoading(false);
        return;
      }

      await updateDoc(doc(db, "users", editingUser.id), {
        displayName: name.trim(),
        email: email.trim(),
        roleName: roleData.name,
        roleCode: roleData.level,
      });

      showToast("success", "Staff member updated", `${name.trim()}'s details are saved.`);
      resetForm();
      await fetchData();
    } catch (error: any) {
      console.error("Update staff error:", error);
      showToast("error", "Couldn't update staff member", error?.message);
    } finally {
      setLoading(false);
    }
  };

  /* DELETE STAFF */
  const performDelete = async (userToDelete: StaffUser) => {
    closeConfirm();
    setLoading(true);

    try {
      await deleteDoc(doc(db, "users", userToDelete.id));
      showToast(
        "success",
        "Staff member removed",
        `${userToDelete.displayName} no longer has access.`
      );
      await fetchData();
    } catch (error: any) {
      console.error("Delete staff error:", error);
      showToast("error", "Couldn't remove staff member", error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = (userToDelete: StaffUser) => {
    if (!canManageStaff) {
      showToast("error", "Permission denied");
      return;
    }

    // Only Master Admin can delete Master Admin
    if (userToDelete.roleCode === 0 && roleCode !== 0) {
      showToast(
        "error",
        "Permission denied",
        "Only the Master Admin can remove another Master Admin."
      );
      return;
    }

    // Staff cannot delete
    if (roleCode === 2) {
      showToast(
        "error",
        "Permission denied",
        "Staff can't remove staff members."
      );
      return;
    }

    setConfirmState({
      open: true,
      title: "Remove staff member?",
      description: `${userToDelete.displayName} (${userToDelete.roleName}) will lose access immediately. This can't be undone.`,
      confirmLabel: "Remove",
      onConfirm: () => performDelete(userToDelete),
    });
  };

  /* ACCESS CONTROL */
  if (!canManageStaff && roleCode !== 0) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-8">
        <div className="bg-white border border-[#D6D6D6] rounded-2xl p-10 shadow-sm max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#F4F4F5] border border-[#D6D6D6] flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={24} className="text-[#1C1C1E]" />
          </div>
          <h2 className="text-xl font-bold text-[#1C1C1E] mb-2">
            Access Denied
          </h2>
          <p className="text-slate-500 text-sm">
            You do not have permission to manage staff.
          </p>
        </div>
      </div>
    );
  }

  /* LOADING */
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-[#D6D6D6] rounded-2xl p-10 shadow-sm flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#D6D6D6] border-t-[#1C1C1E] rounded-full animate-spin" />
            <p className="text-slate-500 text-sm font-medium">
              Loading staff management...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* UI */
  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      <ConfirmDialog state={confirmState} onCancel={closeConfirm} />

      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight">
              Manage Staff
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Add, edit, and manage staff accounts and their access levels.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white border border-[#D6D6D6] rounded-xl px-4 py-2.5 shadow-sm">
            <Users size={16} className="text-[#71717A]" />
            <span className="text-sm font-bold text-[#1C1C1E]">
              {staff.length}
            </span>
            <span className="text-sm text-slate-500">
              {staff.length === 1 ? "member" : "members"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT FORM */}
          <div className="bg-white border border-[#D6D6D6] rounded-2xl p-6 shadow-sm h-fit lg:sticky lg:top-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#F4F4F5] border border-[#D6D6D6] flex items-center justify-center shrink-0">
                {editingUser ? (
                  <Edit size={16} className="text-[#1C1C1E]" />
                ) : (
                  <UserPlus size={16} className="text-[#1C1C1E]" />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1C1C1E] leading-tight">
                  {editingUser ? "Edit Staff Member" : "Add Staff Member"}
                </h2>
                {editingUser && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Editing {editingUser.displayName}
                  </p>
                )}
              </div>
            </div>

            <form
              onSubmit={editingUser ? handleUpdateStaff : handleAddStaff}
              className="space-y-4"
            >
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Smith"
                  className="w-full bg-[#F4F4F5] border border-[#D6D6D6] rounded-xl p-3 text-sm text-[#1C1C1E] placeholder:text-slate-400 outline-none focus:border-[#1C1C1E] focus:ring-1 focus:ring-[#1C1C1E] transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#F4F4F5] border border-[#D6D6D6] rounded-xl p-3 text-sm text-[#1C1C1E] placeholder:text-slate-400 outline-none focus:border-[#1C1C1E] focus:ring-1 focus:ring-[#1C1C1E] transition"
                />
              </div>

              {/* Password only for new user */}
              {!editingUser && (
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full bg-[#F4F4F5] border border-[#D6D6D6] rounded-xl p-3 text-sm text-[#1C1C1E] placeholder:text-slate-400 outline-none focus:border-[#1C1C1E] focus:ring-1 focus:ring-[#1C1C1E] transition"
                  />
                </div>
              )}

              {/* Role */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Assigned Role
                </label>
                <select
                  required
                  value={selectedRoleName}
                  onChange={(e) => setSelectedRoleName(e.target.value)}
                  className="w-full bg-[#F4F4F5] border border-[#D6D6D6] rounded-xl p-3 text-sm text-[#1C1C1E] outline-none focus:border-[#1C1C1E] focus:ring-1 focus:ring-[#1C1C1E] transition"
                >
                  <option value="">Select a role...</option>
                  {roles.map((r) => (
                    <option
                      key={r.id}
                      value={r.name}
                      disabled={roleCode === 1 && r.level === 0}
                    >
                      {r.name} (Level {r.level})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold text-sm text-white py-3.5 rounded-xl shadow-sm transition mt-6 bg-[#1C1C1E] hover:bg-[#2A2A2E] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? editingUser
                    ? "Updating..."
                    : "Adding..."
                  : editingUser
                  ? "Update Member"
                  : "Add Member"}
              </button>

              {editingUser && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="w-full bg-white text-slate-600 border border-[#D6D6D6] font-bold text-sm py-3.5 rounded-xl hover:bg-[#F4F4F5] transition mt-2"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          {/* RIGHT TABLE */}
          <div className="lg:col-span-2 bg-white border border-[#D6D6D6] rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-[#F4F4F5] border-b border-[#D6D6D6]">
                  <tr>
                    <th className="p-5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="p-5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="p-5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="p-5 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#D6D6D6]">
                  {staff.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-11 h-11 rounded-full bg-[#F4F4F5] border border-[#D6D6D6] flex items-center justify-center">
                            <Users size={18} className="text-slate-500" />
                          </div>
                          <p className="text-slate-600 font-semibold text-sm">
                            No staff members yet
                          </p>
                          <p className="text-slate-500 text-xs">
                            Add your first staff member using the form.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    staff.map((user) => {
                      const canEditOrDelete =
                        !(user.roleCode === 0 && roleCode !== 0) &&
                        (roleCode === 0 ||
                          (roleCode === 1 && hasPermission("manage staff")));

                      return (
                        <tr
                          key={user.id}
                          className="hover:bg-[#F4F4F5]/60 transition"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-full text-white flex items-center justify-center text-xs font-bold shrink-0 ${avatarClasses(
                                  user.roleCode
                                )}`}
                              >
                                {getInitials(user.displayName)}
                              </div>
                              <span className="font-bold text-[#1C1C1E] text-sm">
                                {user.displayName || "Unknown"}
                              </span>
                            </div>
                          </td>

                          <td className="p-5 text-slate-500 text-sm">
                            {user.email}
                          </td>

                          <td className="p-5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBadgeClasses(
                                user.roleCode
                              )}`}
                            >
                              {user.roleName || `Level ${user.roleCode}`}
                            </span>
                          </td>

                          <td className="p-5">
                            {user.roleCode === 0 && roleCode !== 0 ? (
                              <div className="flex justify-end">
                                <span className="text-xs italic text-slate-500">
                                  Master Admin
                                </span>
                              </div>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                {canEditOrDelete && (
                                  <>
                                    <button
                                      onClick={() => handleEditClick(user)}
                                      className="p-2 bg-white border border-[#D6D6D6] rounded-lg text-slate-500 hover:text-white hover:bg-[#1C1C1E] hover:border-[#1C1C1E] transition"
                                      title="Edit"
                                    >
                                      <Edit size={15} />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteStaff(user)}
                                      className="p-2 bg-white border border-[#D6D6D6] rounded-lg text-red-500 hover:text-white hover:bg-red-600 hover:border-red-600 transition"
                                      title="Delete"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}