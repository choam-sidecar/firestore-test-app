import { Timestamp } from "firebase-admin/firestore";
import { seededCustomers, seededProducts, seededStores, seededSupplies } from "../mock-data/jaffle-shop";
import { collections } from "../utils/collection-refs";
import { createOrder } from "./order-service";

export async function seedJaffleShopData(): Promise<{ success: true }> {
  const batch = collections.db.batch();

  const [customers, stores, products, supplies, orders, items, stats] = await Promise.all([
    collections.rawCustomers.get(),
    collections.rawStores.get(),
    collections.rawProducts.get(),
    collections.rawSupplies.get(),
    collections.rawOrders.get(),
    collections.rawItems.get(),
    collections.customerStats.get(),
  ]);

  for (const snapshot of [customers, stores, products, supplies, orders, items, stats]) {
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
    }
  }

  for (const customer of seededCustomers) {
    batch.set(collections.rawCustomers.doc(customer.id), customer);
  }

  for (const store of seededStores) {
    batch.set(collections.rawStores.doc(store.id), store);
  }

  for (const product of seededProducts) {
    batch.set(collections.rawProducts.doc(product.sku), product);
  }

  for (const supply of seededSupplies) {
    batch.set(collections.rawSupplies.doc(`${supply.id}_${supply.sku}`), supply);
  }

  batch.set(collections.appState.doc("seed"), {
    last_seeded_at: Timestamp.now(),
    source_repo: "choam-sidecar/dbt_snowflake",
    source_domain: "jaffle_shop raw ecom entities",
  });

  await batch.commit();

  await createOrder({
    id: "1001",
    customer_id: "1",
    store_id: "1",
    channel: "app",
    notes: "Breakfast rush order",
    items: [
      { sku: "JAFFLE_CLASSIC", quantity: 4 },
      { sku: "BEV_COFFEE", quantity: 3 },
    ],
  });

  await createOrder({
    id: "1002",
    customer_id: "2",
    store_id: "2",
    channel: "delivery",
    notes: null,
    items: [
      { sku: "JAFFLE_DELUXE", quantity: 2 },
      { sku: "SIDE_HASH", quantity: 1 },
      { sku: "SIDE_HASH", quantity: 2 },
    ],
  });

  return { success: true };
}
