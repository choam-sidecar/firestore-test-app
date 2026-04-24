import { Timestamp } from "firebase-admin/firestore";
import { RawCustomer, createCustomerSchema } from "../models";
import { collections } from "../utils/collection-refs";

export async function createCustomer(data: unknown): Promise<RawCustomer> {
  const validated = createCustomerSchema.parse(data);
  const now = Timestamp.now();

  const customer: RawCustomer = {
    ...validated,
    created_at: now,
    updated_at: now,
  };

  await collections.rawCustomers.doc(customer.id).set(customer);
  return customer;
}

export async function listCustomers(): Promise<RawCustomer[]> {
  const snapshot = await collections.rawCustomers.orderBy("id", "asc").get();
  return snapshot.docs.map((doc) => doc.data() as RawCustomer);
}

export async function getCustomer(customerId: string): Promise<RawCustomer | null> {
  const snapshot = await collections.rawCustomers.doc(customerId).get();
  if (!snapshot.exists) {
    return null;
  }

  return snapshot.data() as RawCustomer;
}
