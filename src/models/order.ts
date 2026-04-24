import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export type OrderStatus = "placed" | "preparing" | "fulfilled" | "cancelled";
export type OrderChannel = "pos" | "app" | "delivery";

export interface RawOrder {
  id: string;
  channel: OrderChannel;
  customer_id: string;
  notes: string | null;
  order_total: number;
  ordered_at: Timestamp;
  status: OrderStatus;
  store_id: string;
  subtotal: number;
  tax_paid: number;
  updated_at: Timestamp;
}

export interface RawItem {
  id: string;
  line_total: number;
  order_id: string;
  quantity: number;
  sku: string;
  unit_price: number;
  updated_at: Timestamp;
}

export const orderLineInputSchema = z.object({
  sku: z.string().min(1),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  id: z.string().min(1).optional(),
  customer_id: z.string().min(1),
  store_id: z.string().min(1),
  channel: z.enum(["pos", "app", "delivery"]).default("app"),
  notes: z.string().max(1000).nullable().default(null),
  items: z.array(orderLineInputSchema).min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["placed", "preparing", "fulfilled", "cancelled"]),
});
