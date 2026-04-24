import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export interface RawSupply {
  id: string;
  sku: string;
  name: string;
  cost: number;
  perishable: boolean;
  vendor: string;
  quantity_on_hand: number;
  updated_at: Timestamp;
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
