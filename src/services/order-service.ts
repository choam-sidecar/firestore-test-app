import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  Order,
  OrderItem,
  OrderStatus,
  createOrderSchema,
} from "../models/order";
import { getProduct, updateProductStock } from "./product-service";

const db = getFirestore();
const ordersCollection = db.collection("orders");

export async function createOrder(
  userId: string,
  data: unknown
): Promise<Order> {
  const validated = createOrderSchema.parse(data);

  // Resolve product details and calculate prices
  const items: OrderItem[] = await Promise.all(
    validated.items.map(async (item) => {
      const product = await getProduct(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const variant = product.variants.find((v) => v.sku === item.sku);
      if (!variant) throw new Error(`Variant ${item.sku} not found`);

      return {
        productId: item.productId,
        productName: product.name,
        sku: item.sku,
        quantity: item.quantity,
        unitPriceInCents: variant.priceInCents,
        totalPriceInCents: variant.priceInCents * item.quantity,
      };
    })
  );

  const subtotalInCents = items.reduce(
    (sum, item) => sum + item.totalPriceInCents,
    0
  );
  const taxInCents = Math.round(subtotalInCents * 0.08);
  const shippingCostInCents = subtotalInCents >= 5000 ? 0 : 999;

  const docRef = ordersCollection.doc();
  const order: Order = {
    id: docRef.id,
    userId,
    items,
    subtotalInCents,
    taxInCents,
    shippingCostInCents,
    totalInCents: subtotalInCents + taxInCents + shippingCostInCents,
    status: "pending",
    shipping: {
      ...validated.shipping,
      trackingNumber: null,
      carrier: null,
    },
    paymentIntentId: "",
    notes: validated.notes,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await docRef.set(order);

  // Decrement stock for each item
  for (const item of items) {
    await updateProductStock(item.productId, item.sku, -item.quantity);
  }

  return order;
}

export async function getOrder(orderId: string): Promise<Order | null> {
  const doc = await ordersCollection.doc(orderId).get();
  if (!doc.exists) return null;
  return doc.data() as Order;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  carrier?: string
): Promise<void> {
  const updates: Record<string, unknown> = {
    status,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (trackingNumber) {
    updates["shipping.trackingNumber"] = trackingNumber;
  }
  if (carrier) {
    updates["shipping.carrier"] = carrier;
  }

  await ordersCollection.doc(orderId).update(updates);
}

export async function getUserOrders(
  userId: string,
  limit: number = 20
): Promise<Order[]> {
  const snapshot = await ordersCollection
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as Order);
}

export async function cancelOrder(orderId: string): Promise<void> {
  const order = await getOrder(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.status !== "pending" && order.status !== "confirmed") {
    throw new Error(`Cannot cancel order in status: ${order.status}`);
  }

  // Restore stock
  for (const item of order.items) {
    await updateProductStock(item.productId, item.sku, item.quantity);
  }

  await updateOrderStatus(orderId, "cancelled");
}
