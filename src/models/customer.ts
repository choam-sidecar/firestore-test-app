import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";

export interface RawCustomer {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export const createCustomerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  is_active: z.boolean().default(true),
});
