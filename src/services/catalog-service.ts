import { Timestamp } from "firebase-admin/firestore";
import {
  RawProduct,
  RawStore,
  RawSupply,
  createProductSchema,
  createStoreSchema,
  createSupplySchema,
} from "../models";
import { collections } from "../utils/collection-refs";

export async function createStore(data: unknown): Promise<RawStore> {
  const parsedStore = createStoreSchema.parse(data);
  const store: RawStore = {
    ...parsedStore,
    opened_at: Timestamp.now(),
    updated_at: Timestamp.now(),
  };

  await collections.rawStores.doc(store.id).set(store);
  return store;
}

export async function listStores(): Promise<RawStore[]> {
  const snapshot = await collections.rawStores.orderBy("id", "asc").get();
  return snapshot.docs.map((doc) => doc.data() as RawStore);
}

export async function getStore(storeId: string): Promise<RawStore | null> {
  const snapshot = await collections.rawStores.doc(storeId).get();
  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as RawStore;
}

export async function createProduct(data: unknown): Promise<RawProduct> {
  const parsedProduct = createProductSchema.parse(data);
  const product: RawProduct = {
    ...parsedProduct,
    updated_at: Timestamp.now(),
  };

  await collections.rawProducts.doc(product.sku).set(product);
  return product;
}

export async function listProducts(): Promise<RawProduct[]> {
  const snapshot = await collections.rawProducts.orderBy("sku", "asc").get();
  return snapshot.docs.map((doc) => doc.data() as RawProduct);
}

export async function getProduct(sku: string): Promise<RawProduct | null> {
  const snapshot = await collections.rawProducts.doc(sku).get();
  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as RawProduct;
}

export async function createSupply(data: unknown): Promise<RawSupply> {
  const parsedSupply = createSupplySchema.parse(data);
  const supply: RawSupply = {
    ...parsedSupply,
    updated_at: Timestamp.now(),
  };

  await collections.rawSupplies.doc(`${supply.id}_${supply.sku}`).set(supply);
  return supply;
}

export async function listSupplies(): Promise<RawSupply[]> {
  const snapshot = await collections.rawSupplies.orderBy("id", "asc").get();
  return snapshot.docs.map((doc) => doc.data() as RawSupply);
}
