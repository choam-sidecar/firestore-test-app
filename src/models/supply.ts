import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export interface RawSupply {
  cost: number;
  id: string;
  name: string;
  perishable: boolean;
  quantity_on_hand: number;
  sku: string;
  updated_at: Timestamp;
  vendor: string;
}

export const createSupplySchema = z.object({
  id: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1).max(160),
  cost: z.number().int().nonnegative(),
  perishable: z.boolean(),
  vendor: z.string().min(1).max(160),
  quantity_on_hand: z.number().int().nonnegative().default(0),
});
