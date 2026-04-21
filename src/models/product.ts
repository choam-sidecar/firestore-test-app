import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";

// ─── Firestore Document Types ────────────────────────────────────────────────

export interface ProductVariant {
  sku: string;
  color: string;
  size: string;
  priceInCents: number;
  stockCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  basePrice: number;
  variants: ProductVariant[];
  imageUrls: string[];
  isPublished: boolean;
  sellerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Subcollection: Product Reviews ──────────────────────────────────────────

export interface ProductReview {
  id: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  helpfulCount: number;
  createdAt: Timestamp;
}

// ─── Zod Validation Schemas ──────────────────────────────────────────────────

export const productVariantSchema = z.object({
  sku: z.string().min(1),
  color: z.string(),
  size: z.string(),
  priceInCents: z.number().int().positive(),
  stockCount: z.number().int().nonnegative(),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  basePrice: z.number().positive(),
  variants: z.array(productVariantSchema).min(1),
  imageUrls: z.array(z.string().url()).default([]),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(200),
  body: z.string().max(2000),
});
