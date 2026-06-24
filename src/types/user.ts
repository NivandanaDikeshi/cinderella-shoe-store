export type UserRole = "owner" | "staff";

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}