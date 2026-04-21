import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { UserProfile } from "../models/user";
import { Product } from "../models/product";
import { Order } from "../models/order";

/**
 * Generic Firestore data converter that provides type safety
 * when reading/writing documents.
 */
function createConverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T) {
      return data as Record<string, unknown>;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return snapshot.data() as T;
    },
  };
}

export const userConverter = createConverter<UserProfile>();
export const productConverter = createConverter<Product>();
export const orderConverter = createConverter<Order>();
