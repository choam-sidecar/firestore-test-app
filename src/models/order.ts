import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export type OrderStatus = "placed" | "preparing" | "fulfilled" | "cancelled";
export type OrderChannel = "pos" | "app" | "delivery";

export interface RawOrder {
  id: string;
  customer_id: string;
  store_id: string;
  subtotal: number;
  tax_paid: number;
  order_total: number;
  ordered_at: Timestamp;
  status: OrderStatus;
  channel: OrderChannel;
  notes: string | null;
  updated_at: Timestamp;
}

export interface RawItem {
  id: string;
  order_id: string;
  sku: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  updated_at: Timestamp;
}

// Each inbound order line is expanded against the product catalog at write time.
export const orderLineInputSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive(),
});

// The API accepts business inputs only; derived money fields are computed server-side.
export const createOrderSchema = z.object({
  id: z.string().min(1).optional(),
  customer_id: z.string().min(1),
  store_id: z.string().min(1),
  channel: z.enum(["pos", "app", "delivery"]).default("app"),
  notes: z.string().max(1000).nullable().default(null),
  items: z.array(orderLineInputSchema).min(1),
});

// Status updates are intentionally narrow to keep the mock workflow deterministic.
export const updateOrderStatusSchema = z.object({
  status: z.enum(["placed", "preparing", "fulfilled", "cancelled"]),
});
