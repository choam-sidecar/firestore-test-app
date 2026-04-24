import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import {
  CustomerStats,
  RawCustomer,
  RawItem,
  RawOrder,
  RawProduct,
  RawStore,
  RawSupply,
} from "../models";

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

export const rawCustomerConverter = createConverter<RawCustomer>();
export const rawStoreConverter = createConverter<RawStore>();
export const rawProductConverter = createConverter<RawProduct>();
export const rawSupplyConverter = createConverter<RawSupply>();
export const rawOrderConverter = createConverter<RawOrder>();
export const rawItemConverter = createConverter<RawItem>();
export const customerStatsConverter = createConverter<CustomerStats>();
