export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Dispatched"
  | "Completed"
  | "Cancelled";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

export type PaymentMethod =
  | "Cash on Delivery"
  | "Card Payment"
  | "Bank Transfer"
  | "Online Payment";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;

  image?: string;
  size?: string;
  color?: string;
  sku?: string;

  // optional calculated item subtotal
  subtotal?: number;
}

export interface ShippingAddress {
  fullName?: string;
  phone?: string;

  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  country?: string;
}

export interface Order {
  id: string;

  /* ---------- Order Identity ---------- */
  orderNumber?: string;

  /* ---------- User / Customer ---------- */
  userId?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;

  /* ---------- Shipping ---------- */
  shippingAddress?: string | ShippingAddress;

  /* ---------- Payment ---------- */
  paymentMethod?: PaymentMethod | string;
  paymentStatus?: PaymentStatus | string;

  /* ---------- Pricing ---------- */
  subtotalAmount?: number;
  deliveryCharge?: number;
  discountAmount?: number;
  totalAmount?: number;

  /* ---------- Order State ---------- */
  status?: OrderStatus | string;
  notes?: string;

  /* ---------- Items ---------- */
  items?: OrderItem[];

  /* ---------- Timestamps ---------- */
  createdAt?: any;
  updatedAt?: any;
}