export type CustomerStatus =
  | "active"
  | "inactive"
  | "blocked";

export interface CustomerAddress {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
}

export interface Customer {
  id: string;

  // auth / identity
  uid?: string;
  name?: string;
  email?: string;
  phone?: string;
  photoURL?: string;

  // profile
  firstName?: string;
  lastName?: string;
  gender?: string;
  dateOfBirth?: string;

  // address
  address?: string | CustomerAddress;

  // account
  role?: string;
  status?: CustomerStatus | string;

  // shopping info
  totalOrders?: number;
  totalSpent?: number;
  wishlistCount?: number;

  // timestamps
  createdAt?: any;
  updatedAt?: any;
}