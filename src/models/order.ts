import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";

// ─── Firestore Document Types ────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPriceInCents: number;
  totalPriceInCents: number;
}

export interface ShippingInfo {
  recipientName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  trackingNumber: string | null;
  carrier: string | null;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotalInCents: number;
  taxInCents: number;
  shippingCostInCents: number;
  totalInCents: number;
  status: OrderStatus;
  shipping: ShippingInfo;
  paymentIntentId: string;
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Zod Validation Schemas ──────────────────────────────────────────────────

export const orderItemSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const shippingInfoSchema = z.object({
  recipientName: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.string().default("US"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shipping: shippingInfoSchema,
  notes: z.string().nullable().default(null),
});
