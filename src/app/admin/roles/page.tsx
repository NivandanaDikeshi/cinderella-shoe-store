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
import { Edit, Trash2 } from "lucide-react";

type Permission =
  | "view dashboard"
  | "manage orders"
  | "manage products"
  | "manage staff"
  | "manage roles";

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
];

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
      <div className="p-8 max-w-7xl mx-auto mt-10 text-center text-red-600 font-bold text-2xl">
        Access Denied: You do not have permission to manage roles.
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1
        className="text-3xl font-extrabold text-[#1C1C1E] mb-8 tracking-tight"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        System Roles & Permissions
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT FORM */}
        <div className="bg-white border border-[#E0DDD6] rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6 text-[#1C1C1E]">
            {editingRole ? "Edit Role" : "Create Custom Role"}
          </h2>

          <form
            onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Role Name
              </label>
              <input
                required
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="w-full bg-[#FAF9F7] border border-[#E0DDD6] rounded-xl p-3 outline-none focus:border-[#EC4899] transition"
                placeholder="e.g. Cashier"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Hierarchy Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-[#FAF9F7] border border-[#E0DDD6] rounded-xl p-3 outline-none focus:border-[#EC4899] transition"
              >
                <option value="0">Master Admin (Level 0)</option>
                <option value="1">Admin (Level 1)</option>
                <option value="2">Staff / Cashier (Level 2)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                Granted Permissions
              </label>
              <div className="h-48 overflow-y-auto border border-[#E0DDD6] rounded-xl p-4 space-y-3 bg-[#FAF9F7]">
                {AVAILABLE_PERMS.map((perm) => (
                  <label
                    key={perm}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPerms.includes(perm)}
                      onChange={() => handleTogglePerm(perm)}
                      className="w-4 h-4 text-[#EC4899] border-[#E0DDD6] rounded focus:ring-[#EC4899]"
                    />
                    <span className="text-sm font-semibold text-[#1C1C1E] capitalize group-hover:text-[#EC4899] transition">
                      {perm}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3.5 rounded-xl shadow-md transition mt-6 ${
                editingRole
                  ? "bg-[#1C1C1E] text-[#EC4899] hover:bg-[#2A2A2E]"
                  : "bg-[#EC4899] text-[#1C1C1E] hover:bg-[#F4D6B3]"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
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
                className="w-full bg-[#FAF9F7] text-slate-600 border border-[#E0DDD6] font-bold py-3.5 rounded-xl hover:bg-[#EDE8DE] transition mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* RIGHT TABLE */}
        <div className="lg:col-span-2 bg-white border border-[#E0DDD6] rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FAF9F7] border-b border-[#E0DDD6]">
              <tr>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Active Permissions
                </th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E0DDD6]">
              {fetching ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Loading roles...
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No roles found.
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-[#FAF9F7] transition">
                    <td className="p-5 font-bold text-[#1C1C1E]">{role.name}</td>

                    <td className="p-5">
                      <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Lvl {role.level}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.length > 0 ? (
                          role.permissions.map((p) => (
                            <span
                              key={p}
                              className="bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20 px-2 py-1 rounded text-[10px] font-bold tracking-wide uppercase"
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
                      <div className="flex gap-3 justify-end text-slate-400">
                        <button
                          onClick={() => handleEditRoleClick(role)}
                          className="hover:text-[#EC4899] p-2 bg-white border border-[#E0DDD6] rounded-lg hover:bg-[#1C1C1E] transition"
                          title="Edit role"
                        >
                          <Edit size={16} />
                        </button>

                        {role.level !== 0 && role.level !== 1 && (
                          <button
                            onClick={() =>
                              handleDeleteRole(role.id, role.name, role.level)
                            }
                            className="hover:text-red-600 p-2 bg-white border border-[#E0DDD6] rounded-lg hover:bg-red-50 transition"
                            title="Delete role"
                          >
                            <Trash2 size={16} />
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
  );
}