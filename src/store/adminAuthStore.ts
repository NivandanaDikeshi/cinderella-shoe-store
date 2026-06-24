import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "firebase/auth";

type Role = "admin" | "user" | null;

interface AdminAuthStore {
  user: User | null;
  role: Role;
  roleCode: number | null;
  permissions: string[];

  loading: boolean;

  setAdminData: (
    user: User | null,
    role: Role,
    roleCode?: number | null,
    permissions?: string[]
  ) => void;

  clearAdminData: () => void;
  setLoading: (value: boolean) => void;

  isAdmin: () => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      roleCode: null,
      permissions: [],
      loading: true,

      setAdminData: (
        user,
        role,
        roleCode = 1,
        permissions = []
      ) =>
        set({
          user,
          role,
          roleCode,
          permissions,
          loading: false,
        }),

      clearAdminData: () =>
        set({
          user: null,
          role: null,
          roleCode: null,
          permissions: [],
          loading: false,
        }),

      setLoading: (value) => set({ loading: value }),

      isAdmin: () => get().role === "admin",

      hasPermission: (permission: string) => {
        const state = get();
        return state.roleCode === 0 || state.permissions.includes(permission);
      },
    }),
    {
      name: "cinderella-admin-auth",
      partialize: (state) => ({
        role: state.role,
        roleCode: state.roleCode,
        permissions: state.permissions,
      }),
    }
  )
);