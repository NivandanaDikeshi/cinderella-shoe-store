"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { Edit, Trash2, ShieldCheck, ShieldPlus, KeyRound } from "lucide-react";

type Permission =
  | "view dashboard"
  | "manage orders"
  | "manage products"
  | "manage staff"
  | "manage roles"
  | "manage contacts"
  | "manage reviews"
  | "manage settings";

interface Role {
  id: string;
  name: string;
  level: number;
  permissions: Permission[];
}

const AVAILABLE_PERMS: Permission[] = [
  "view dashboard",
  "manage orders",
  "manage products",
  "manage staff",
  "manage roles",
  "manage contacts",
  "manage reviews",
  "manage settings",
];

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

// A rotating set of green tones so permission chips are visually
// distinguishable from one another while reading clearly as "active/granted".
const PERM_TONES = [
  { bg: "#065F46", text: "#FFFFFF", border: "#065F46" }, // emerald-800
  { bg: "#047857", text: "#FFFFFF", border: "#047857" }, // emerald-700
  { bg: "#059669", text: "#FFFFFF", border: "#059669" }, // emerald-600
  { bg: "#10B981", text: "#FFFFFF", border: "#10B981" }, // emerald-500
  { bg: "#6EE7B7", text: "#065F46", border: "#34D399" }, // emerald-300
  { bg: "#D1FAE5", text: "#065F46", border: "#6EE7B7" }, // emerald-100
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const levelBadgeClasses = (level: number) => {
  if (level === 0) {
    // Master Admin — deepest tone, highest emphasis
    return "bg-[#1C1C1E] text-white border border-[#1C1C1E]";
  }
  if (level === 1) {
    // Admin — one step lighter, still solid
    return "bg-[#3F3F46] text-white border border-[#3F3F46]";
  }
  // Everything else — quiet ash tone
  return "bg-[#F4F4F5] text-[#52525B] border border-[#D6D6D6]";
};

const levelIconClasses = (level: number) => {
  if (level === 0) return "bg-[#1C1C1E]";
  if (level === 1) return "bg-[#3F3F46]";
  return "bg-[#71717A]";
};

const permBadgeStyle = (perm: Permission) => {
  const idx = AVAILABLE_PERMS.indexOf(perm);
  const tone = PERM_TONES[idx % PERM_TONES.length];
  return {
    backgroundColor: tone.bg,
    color: tone.text,
    borderColor: tone.border,
  };
};

export default function RolesPage() {
  const { roleCode, hasPermission } = useAdminAuthStore();

  const [roles, setRoles] = useState<Role[]>([]);
  const [roleName, setRoleName] = useState("");
  const [level, setLevel] = useState("2");
  const [selectedPerms, setSelectedPerms] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const canManageRoles = useMemo(() => {
    if (roleCode === 0) return true;
    if (typeof hasPermission === "function") {
      return hasPermission("manage roles");
    }
    return false;
  }, [roleCode, hasPermission]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setFetching(true);
    try {
      const snapshot = await getDocs(collection(db, "roles"));
      const data = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          name: data.name || "",
          level: Number(data.level ?? 2),
          permissions: Array.isArray(data.permissions)
            ? (data.permissions as Permission[])
            : [],
        } as Role;
      });

      data.sort((a, b) => a.level - b.level);
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      alert("Failed to fetch roles.");
    } finally {
      setFetching(false);
    }
  };

  const resetForm = () => {
    setRoleName("");
    setLevel("2");
    setSelectedPerms([]);
    setEditingRole(null);
  };

  const handleTogglePerm = (perm: Permission) => {
    setSelectedPerms((prev) =>
      prev.includes(perm)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm]
    );
  };

  const validateRoleForm = () => {
    if (!roleName.trim()) {
      alert("Please enter a role name.");
      return false;
    }

    if (selectedPerms.length === 0) {
      alert("Please select at least one permission.");
      return false;
    }

    return true;
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManageRoles) {
      alert("Permission Denied: Only authorized admins can manage roles.");
      return;
    }

    if (!validateRoleForm()) return;

    // Prevent non-master admin from creating level 0 role
    if (roleCode !== 0 && Number(level) === 0) {
      alert("Only Master Admin can create a Level 0 role.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "roles"), {
        name: roleName.trim(),
        level: Number(level),
        permissions: selectedPerms,
      });

      alert("Role created successfully!");
      resetForm();
      await fetchRoles();
    } catch (error) {
      console.error("Error creating role:", error);
      alert("Failed to create role.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoleClick = (role: Role) => {
    if (!canManageRoles) {
      alert("Permission Denied: Only authorized admins can manage roles.");
      return;
    }

    // Non-master admin cannot edit level 0 role
    if (role.level === 0 && roleCode !== 0) {
      alert("Only Master Admin can edit a Level 0 role.");
      return;
    }

    setEditingRole(role);
    setRoleName(role.name);
    setLevel(String(role.level));
    setSelectedPerms(role.permissions || []);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canManageRoles) {
      alert("Permission Denied: Only authorized admins can manage roles.");
      return;
    }

    if (!editingRole) return;
    if (!validateRoleForm()) return;

    // Non-master admin cannot edit/create level 0 role
    if (roleCode !== 0 && (editingRole.level === 0 || Number(level) === 0)) {
      alert("Only Master Admin can manage Level 0 roles.");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "roles", editingRole.id), {
        name: roleName.trim(),
        level: Number(level),
        permissions: selectedPerms,
      });

      alert("Role updated successfully!");
      resetForm();
      await fetchRoles();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (
    roleId: string,
    roleName: string,
    roleLevel: number
  ) => {
    if (!canManageRoles) {
      alert("Permission Denied: Only authorized admins can manage roles.");
      return;
    }

    if (roleLevel === 0 || roleLevel === 1) {
      alert("Cannot delete core admin roles (Level 0 or Level 1).");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the role "${roleName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "roles", roleId));

      if (editingRole?.id === roleId) {
        resetForm();
      }

      alert("Role deleted successfully!");
      await fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role.");
    } finally {
      setLoading(false);
    }
  };

  if (!canManageRoles) {
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
            You do not have permission to manage roles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight">
              System Roles & Permissions
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Define hierarchy levels and control what each role can access.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white border border-[#D6D6D6] rounded-xl px-4 py-2.5 shadow-sm">
            <KeyRound size={16} className="text-[#71717A]" />
            <span className="text-sm font-bold text-[#1C1C1E]">
              {roles.length}
            </span>
            <span className="text-sm text-slate-500">
              {roles.length === 1 ? "role" : "roles"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT FORM */}
          <div className="bg-white border border-[#D6D6D6] rounded-2xl p-6 shadow-sm h-fit lg:sticky lg:top-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-lg bg-[#F4F4F5] border border-[#D6D6D6] flex items-center justify-center shrink-0">
                {editingRole ? (
                  <Edit size={16} className="text-[#1C1C1E]" />
                ) : (
                  <ShieldPlus size={16} className="text-[#1C1C1E]" />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1C1C1E] leading-tight">
                  {editingRole ? "Edit Role" : "Create Custom Role"}
                </h2>
                {editingRole && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Editing {editingRole.name}
                  </p>
                )}
              </div>
            </div>

            <form
              onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Role Name
                </label>
                <input
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Cashier"
                  className="w-full bg-[#F4F4F5] border border-[#D6D6D6] rounded-xl p-3 text-sm text-[#1C1C1E] placeholder:text-slate-400 outline-none focus:border-[#1C1C1E] focus:ring-1 focus:ring-[#1C1C1E] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Hierarchy Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-[#F4F4F5] border border-[#D6D6D6] rounded-xl p-3 text-sm text-[#1C1C1E] outline-none focus:border-[#1C1C1E] focus:ring-1 focus:ring-[#1C1C1E] transition"
                >
                  <option value="0">Master Admin (Level 0)</option>
                  <option value="1">Admin (Level 1)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                  Granted Permissions
                </label>
                <div className="h-52 overflow-y-auto border border-[#D6D6D6] rounded-xl p-4 space-y-3 bg-[#F4F4F5]">
                  {AVAILABLE_PERMS.map((perm) => {
                    const tone = PERM_TONES[AVAILABLE_PERMS.indexOf(perm) % PERM_TONES.length];
                    const checked = selectedPerms.includes(perm);
                    return (
                      <label
                        key={perm}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleTogglePerm(perm)}
                          className="w-4 h-4 accent-[#1C1C1E] text-[#1C1C1E] border-[#D6D6D6] rounded focus:ring-[#1C1C1E]"
                        />
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: tone.border }}
                        />
                        <span className="text-sm font-semibold text-[#1C1C1E] capitalize group-hover:text-[#2A2A2E] transition">
                          {perm}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full font-bold text-sm text-white py-3.5 rounded-xl shadow-sm transition mt-6 bg-[#1C1C1E] hover:bg-[#2A2A2E] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving..."
                  : editingRole
                  ? "Update Role"
                  : "+ Create Role"}
              </button>

              {editingRole && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="w-full bg-white text-slate-600 border border-[#D6D6D6] font-bold text-sm py-3.5 rounded-xl hover:bg-[#F4F4F5] transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      Role
                    </th>
                    <th className="p-5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="p-5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        Active Permissions
                      </span>
                    </th>
                    <th className="p-5 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#D6D6D6]">
                  {fetching ? (
                    <tr>
                      <td colSpan={4} className="p-10 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-[#D6D6D6] border-t-[#1C1C1E] rounded-full animate-spin" />
                          <span className="text-slate-500 text-sm font-medium">
                            Loading roles...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : roles.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-11 h-11 rounded-full bg-[#F4F4F5] border border-[#D6D6D6] flex items-center justify-center">
                            <ShieldCheck size={18} className="text-slate-500" />
                          </div>
                          <p className="text-slate-600 font-semibold text-sm">
                            No roles found
                          </p>
                          <p className="text-slate-500 text-xs">
                            Create your first role using the form.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    roles.map((role) => (
                      <tr
                        key={role.id}
                        className="hover:bg-[#F4F4F5]/60 transition"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full text-white flex items-center justify-center shrink-0 ${levelIconClasses(
                                role.level
                              )}`}
                            >
                              <ShieldCheck size={15} />
                            </div>
                            <span className="font-bold text-[#1C1C1E] text-sm">
                              {role.name}
                            </span>
                          </div>
                        </td>

                        <td className="p-5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${levelBadgeClasses(
                              role.level
                            )}`}
                          >
                            Lvl {role.level}
                          </span>
                        </td>

                        <td className="p-5">
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.length > 0 ? (
                              role.permissions.map((p) => (
                                <span
                                  key={p}
                                  className="px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase border"
                                  style={permBadgeStyle(p)}
                                >
                                  {p}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-sm">
                                No permissions
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-5">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditRoleClick(role)}
                              className="p-2 bg-white border border-[#D6D6D6] rounded-lg text-slate-500 hover:text-white hover:bg-[#1C1C1E] hover:border-[#1C1C1E] transition"
                              title="Edit role"
                            >
                              <Edit size={15} />
                            </button>

                            {role.level !== 0 && role.level !== 1 && (
                              <button
                                onClick={() =>
                                  handleDeleteRole(
                                    role.id,
                                    role.name,
                                    role.level
                                  )
                                }
                                className="p-2 bg-white border border-[#D6D6D6] rounded-lg text-slate-500 hover:text-white hover:bg-[#1C1C1E] hover:border-[#1C1C1E] transition"
                                title="Delete role"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
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
    </div>
  );
}