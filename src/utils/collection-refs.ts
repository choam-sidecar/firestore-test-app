import { getFirestore } from "firebase-admin/firestore";
import {
  customerStatsConverter,
  rawCustomerConverter,
  rawItemConverter,
  rawOrderConverter,
  rawProductConverter,
  rawStoreConverter,
  rawSupplyConverter,
} from "./firestore-converter";

export const db = getFirestore();

/**
 * Typed collection references for consistent access across the app.
 */
export const collections = {
  db,
  rawCustomers: db.collection("raw_customers").withConverter(rawCustomerConverter),
  rawStores: db.collection("raw_stores").withConverter(rawStoreConverter),
  rawProducts: db.collection("raw_products").withConverter(rawProductConverter),
  rawSupplies: db.collection("raw_supplies").withConverter(rawSupplyConverter),
  rawOrders: db.collection("raw_orders").withConverter(rawOrderConverter),
  rawItems: db.collection("raw_items").withConverter(rawItemConverter),
  customerStats: db.collection("customer_stats").withConverter(customerStatsConverter),
  appState: db.collection("app_state"),
  apiRequestLog: db.collection("api_request_log"),
} as const;

export function rawItemsByOrder(orderId: string) {
  return collections.rawItems.where("order_id", "==", orderId).orderBy("id", "asc");
}
