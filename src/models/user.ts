import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";

// ─── Firestore Document Types ────────────────────────────────────────────────

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  phone: string | null;
  address: Address | null;
  role: "customer" | "admin" | "support";
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Zod Validation Schemas ──────────────────────────────────────────────────

export const addressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.string().default("US"),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2).max(100),
  phone: z.string().nullable().default(null),
  address: addressSchema.nullable().default(null),
});

export const updateUserSchema = createUserSchema.partial();
