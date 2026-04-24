import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export interface RawStore {
  id: string;
  is_active: boolean;
  name: string;
  opened_at: Timestamp;
  region: string;
  tax_rate: number;
  updated_at: Timestamp;
}

export const createStoreSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  tax_rate: z.number().min(0).max(0.2),
  region: z.string().min(1).max(80),
  is_active: z.boolean().default(true),
});
