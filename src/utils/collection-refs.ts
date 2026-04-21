import { getFirestore } from "firebase-admin/firestore";
import { userConverter, productConverter, orderConverter } from "./firestore-converter";

const db = getFirestore();

/**
 * Typed collection references for consistent access across the app.
 */
export const collections = {
  users: db.collection("users").withConverter(userConverter),
  products: db.collection("products").withConverter(productConverter),
  orders: db.collection("orders").withConverter(orderConverter),
  userStats: db.collection("user_stats"),
  wishlists: db.collection("wishlists"),
  notifications: db.collection("notifications"),
} as const;

/**
 * Subcollection references.
 */
export function productReviews(productId: string) {
  return db.collection("products").doc(productId).collection("reviews");
}
