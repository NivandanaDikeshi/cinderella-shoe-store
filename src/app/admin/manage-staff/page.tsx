"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Edit, Trash2 } from "lucide-react";

/* =========================================================
   Secondary Firebase app
   Used to create staff accounts without logging out admin
========================================================= */
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

/* =========================================================
   Types
========================================================= */
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

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  selectedRoleName: "",
};

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
      alert("Failed to load staff data.");
    } finally {
      setPageLoading(false);
    }
  };

  /* =========================================================
     ADD STAFF
  ========================================================= */
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManageStaff) {
      alert("Permission Denied: You cannot add staff members.");
      return;
    }

    if (!name.trim() || !email.trim() || !password.trim() || !selectedRoleName) {
      alert("Please fill all fields.");
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
        alert("Permission Denied: Admins cannot create Master Admin accounts.");
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

      alert("Staff member added successfully!");
      resetForm();
      await fetchData();
    } catch (error: any) {
      console.error("Add staff error:", error);
      alert(error?.message || "Error adding staff.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     START EDIT
  ========================================================= */
  const handleEditClick = (user: StaffUser) => {
    if (!canManageStaff) {
      alert("Permission Denied.");
      return;
    }

    // Admin cannot edit Master Admin
    if (roleCode === 1 && user.roleCode === 0) {
      alert("Permission Denied: Admin cannot edit Master Admin.");
      return;
    }

    // Staff cannot edit anyone
    if (roleCode === 2) {
      alert("Permission Denied: Staff cannot edit staff members.");
      return;
    }

    setEditingUser(user);
    setName(user.displayName || "");
    setEmail(user.email || "");
    setPassword("");
    setSelectedRoleName(user.roleName || "");
  };

  /* =========================================================
     UPDATE STAFF
  ========================================================= */
  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    if (!canManageStaff) {
      alert("Permission Denied.");
      return;
    }

    if (!name.trim() || !email.trim() || !selectedRoleName) {
      alert("Please fill all required fields.");
      return;
    }

    // Admin cannot update Master Admin
    if (roleCode === 1 && editingUser.roleCode === 0) {
      alert("Permission Denied: Admin cannot update Master Admin.");
      return;
    }

    // Staff cannot update anyone
    if (roleCode === 2) {
      alert("Permission Denied: Staff cannot update staff members.");
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
        alert("Permission Denied: Admin cannot assign Master Admin role.");
        setLoading(false);
        return;
      }

      await updateDoc(doc(db, "users", editingUser.id), {
        displayName: name.trim(),
        email: email.trim(),
        roleName: roleData.name,
        roleCode: roleData.level,
      });

      // NOTE:
      // Updating Firebase Auth email/password for another user cannot be done securely
      // from the client without Admin SDK / backend.
      // So here we update Firestore only.
      // If you want, I can build a secure admin API route for full email/password updates.

      alert("Staff member updated successfully!");
      resetForm();
      await fetchData();
    } catch (error: any) {
      console.error("Update staff error:", error);
      alert(error?.message || "Error updating staff.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     DELETE STAFF
  ========================================================= */
  const handleDeleteStaff = async (userToDelete: StaffUser) => {
    if (!canManageStaff) {
      alert("Permission Denied.");
      return;
    }

    // Only Master Admin can delete Master Admin
    if (userToDelete.roleCode === 0 && roleCode !== 0) {
      alert("Permission Denied: Only Master Admin can delete another Master Admin.");
      return;
    }

    // Staff cannot delete
    if (roleCode === 2) {
      alert("Permission Denied: Staff cannot delete staff members.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${userToDelete.displayName} (${userToDelete.roleName})?`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      await deleteDoc(doc(db, "users", userToDelete.id));

      // NOTE:
      // This only deletes the Firestore user record.
      // It does NOT delete the Firebase Authentication account.
      // For that, you need Firebase Admin SDK on the server.
      // If you want, I can build that too.

      alert("Staff member removed successfully!");
      await fetchData();
    } catch (error: any) {
      console.error("Delete staff error:", error);
      alert(error?.message || "Error deleting staff.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ACCESS CONTROL
  ========================================================= */
  if (!canManageStaff && roleCode !== 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto mt-10 text-center text-red-600 font-bold text-2xl">
        Access Denied: You do not have permission to manage staff.
      </div>
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */
  if (pageLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#E0DDD6] rounded-2xl p-8 shadow-sm">
          <p className="text-slate-500">Loading staff management...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1
        className="text-3xl font-extrabold text-[#1C1C1E] mb-8 tracking-tight"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Manage Staff
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT FORM */}
        <div className="bg-white border border-[#E0DDD6] rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6 text-[#1C1C1E]">
            {editingUser ? "Edit Staff Member" : "Add Staff Member"}
          </h2>

          <form
            onSubmit={editingUser ? handleUpdateStaff : handleAddStaff}
            className="space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF9F7] border border-[#E0DDD6] rounded-xl p-3 outline-none focus:border-[#EC4899] transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF9F7] border border-[#E0DDD6] rounded-xl p-3 outline-none focus:border-[#EC4899] transition"
              />
            </div>

            {/* Password only for new user */}
            {!editingUser && (
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F7] border border-[#E0DDD6] rounded-xl p-3 outline-none focus:border-[#EC4899] transition"
                />
              </div>
            )}

            {/* Role */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Assigned Role
              </label>
              <select
                required
                value={selectedRoleName}
                onChange={(e) => setSelectedRoleName(e.target.value)}
                className="w-full bg-[#FAF9F7] border border-[#E0DDD6] rounded-xl p-3 outline-none focus:border-[#EC4899] transition"
              >
                <option value="">Select...</option>
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
              className={`w-full font-bold py-3.5 rounded-xl shadow-md transition mt-6 ${
                editingUser
                  ? "bg-[#1C1C1E] text-[#EC4899] hover:bg-[#2A2A2E]"
                  : "bg-[#EC4899] text-[#1C1C1E] hover:bg-[#F4D6B3]"
              }`}
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
                className="w-full bg-[#FAF9F7] text-slate-600 border border-[#E0DDD6] font-bold py-3.5 rounded-xl hover:bg-[#E0DDD6] transition mt-2"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* RIGHT TABLE */}
        <div className="lg:col-span-2 bg-white border border-[#E0DDD6] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-[#FAF9F7] border-b border-[#E0DDD6]">
                <tr>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E0DDD6]">
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No staff members found.
                    </td>
                  </tr>
                ) : (
                  staff.map((user) => (
                    <tr key={user.id} className="hover:bg-[#FAF9F7] transition">
                      <td className="p-5 font-bold text-[#1C1C1E]">
                        {user.displayName || "Unknown"}
                      </td>

                      <td className="p-5 text-slate-500 text-sm">
                        {user.email}
                      </td>

                      <td className="p-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            user.roleCode === 0
                              ? "bg-[#1C1C1E] text-[#EC4899]"
                              : user.roleCode === 1
                              ? "bg-slate-100 text-slate-700 border border-slate-200"
                              : "bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20"
                          }`}
                        >
                          {user.roleName || `Level ${user.roleCode}`}
                        </span>
                      </td>

                      <td className="p-5">
                        {user.roleCode === 0 && roleCode !== 0 ? (
                          <span className="text-xs italic text-[#EC4899]">
                            Master Admin
                          </span>
                        ) : (
                          <div className="flex gap-3 text-slate-400">
                            {(roleCode === 0 ||
                              (roleCode === 1 && hasPermission("manage staff"))) && (
                              <>
                                <button
                                  onClick={() => handleEditClick(user)}
                                  className="hover:text-[#EC4899] p-2 bg-white border border-[#E0DDD6] rounded-lg hover:bg-[#1C1C1E] transition"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>

                                <button
                                  onClick={() => handleDeleteStaff(user)}
                                  className="hover:text-[#EC4899] p-2 bg-white border border-[#E0DDD6] rounded-lg hover:bg-[#1C1C1E] transition"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}