import { z } from "zod";

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
