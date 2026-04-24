import { Timestamp } from "firebase-admin/firestore";
import {
  RawItem,
  RawOrder,
  createOrderSchema,
  updateOrderStatusSchema,
} from "../models";
import { collections, rawItemsByOrder } from "../utils/collection-refs";
import { getCustomer } from "./customer-service";
import { getProduct, getStore } from "./catalog-service";

interface OrderWithItems {
  order: RawOrder;
  items: RawItem[];
}

export async function createOrder(data: unknown): Promise<OrderWithItems> {
  const validated = createOrderSchema.parse(data);
  const customer = await getCustomer(validated.customer_id);
  if (!customer || !customer.is_active) {
    throw new Error(`Active customer ${validated.customer_id} not found`);
  }

  const store = await getStore(validated.location_id);
  if (!store || !store.is_active) {
    throw new Error(`Active store ${validated.location_id} not found`);
  }

  const now = Timestamp.now();
  const orderId = validated.id ?? collections.rawOrders.doc().id;
  const items: RawItem[] = [];
  let subtotal = 0;

  for (let index = 0; index < validated.items.length; index += 1) {
    const input = validated.items[index];
    const product = await getProduct(input.sku);

    if (!product || !product.is_active) {
      throw new Error(`Active product ${input.sku} not found`);
    }

    const line_total = product.price * input.quantity;
    subtotal += line_total;

    items.push({
      id: `${orderId}_${index + 1}`,
      order_id: orderId,
      sku: input.sku,
      quantity: input.quantity,
      unit_price: product.price,
      line_total,
      updated_at: now,
    });
  }

  const tax_paid = Math.round(subtotal * store.tax_rate);
  const order_total = subtotal + tax_paid;

  const order: RawOrder = {
    id: orderId,
    customer_id: validated.customer_id,
    location_id: validated.location_id,
    subtotal,
    tax_paid,
    order_total,
    ordered_at: now,
    status: "placed",
    channel: validated.channel,
    notes: validated.notes,
    updated_at: now,
  };

  const batch = collections.db.batch();
  batch.set(collections.rawOrders.doc(order.id), order);
  for (const item of items) {
    batch.set(collections.rawItems.doc(item.id), item);
  }
  await batch.commit();

  return { order, items };
}

export async function getOrder(orderId: string): Promise<OrderWithItems | null> {
  const orderSnapshot = await collections.rawOrders.doc(orderId).get();
  if (!orderSnapshot.exists) {
    return null;
  }

  const itemSnapshot = await rawItemsByOrder(orderId).get();
  return {
    order: orderSnapshot.data() as RawOrder,
    items: itemSnapshot.docs.map((doc) => doc.data() as RawItem),
  };
}

export async function listOrders(): Promise<RawOrder[]> {
  const snapshot = await collections.rawOrders.orderBy("ordered_at", "desc").get();
  return snapshot.docs.map((doc) => doc.data() as RawOrder);
}

export async function updateOrderStatus(
  orderId: string,
  data: unknown
): Promise<void> {
  const validated = updateOrderStatusSchema.parse(data);
  await collections.rawOrders.doc(orderId).update({
    status: validated.status,
    updated_at: Timestamp.now(),
  });
}
