import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export type ProductType = "jaffle" | "beverage" | "side";

export interface RawProduct {
  description: string;
  is_active: boolean;
  name: string;
  price: number;
  sku: string;
  type: ProductType;
  updated_at: Timestamp;
}

export const createProductSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1).max(160),
  type: z.enum(["jaffle", "beverage", "side"]),
  description: z.string().min(1).max(1000),
  price: z.number().int().positive(),
  is_active: z.boolean().default(true),
});
