import * as functions from "firebase-functions";
import { Timestamp } from "firebase-admin/firestore";
import { CustomerStats, RawOrder } from "../models";
import { collections } from "../utils/collection-refs";

export const onOrderWritten = functions.firestore
  .document("raw_orders/{orderId}")
  .onWrite(async (_change, context) => {
    const orderId = context.params.orderId;
    const orderSnapshot = await collections.rawOrders.doc(orderId).get();
    if (!orderSnapshot.exists) {
      return;
    }

    const order = orderSnapshot.data() as RawOrder;
    const ordersSnapshot = await collections.rawOrders
      .where("customer_id", "==", order.customer_id)
      .get();
    const orders = ordersSnapshot.docs.map((doc) => doc.data() as RawOrder);

    const sortedOrders = orders
      .filter((candidate) => candidate.status !== "cancelled")
      .sort((left, right) => left.ordered_at.toMillis() - right.ordered_at.toMillis());

    const stats: CustomerStats = {
      customer_id: order.customer_id,
      count_lifetime_orders: sortedOrders.length,
      first_ordered_at: sortedOrders[0]?.ordered_at ?? null,
      last_ordered_at: sortedOrders.at(-1)?.ordered_at ?? null,
      lifetime_spend_pretax: sortedOrders.reduce((sum, candidate) => sum + candidate.subtotal, 0),
      lifetime_tax_paid: sortedOrders.reduce((sum, candidate) => sum + candidate.tax_paid, 0),
      lifetime_spend: sortedOrders.reduce((sum, candidate) => sum + candidate.order_total, 0),
      customer_type: sortedOrders.length > 1 ? "returning" : "new",
      updated_at: Timestamp.now(),
    };

    await collections.customerStats.doc(order.customer_id).set(stats);
  });
