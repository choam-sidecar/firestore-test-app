import * as functions from "firebase-functions";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { Order } from "../models/order";

const db = getFirestore();

/**
 * When an order status changes, update user stats
 * and send appropriate notifications.
 */
export const onOrderStatusChanged = functions.firestore
  .document("orders/{orderId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data() as Order;
    const after = change.after.data() as Order;

    if (before.status === after.status) return;

    const orderId = context.params.orderId;
    functions.logger.info(
      `Order ${orderId} status changed: ${before.status} -> ${after.status}`
    );

    // Update user stats when order is delivered
    if (after.status === "delivered") {
      const userStatsRef = db.collection("user_stats").doc(after.userId);
      await userStatsRef.update({
        totalOrders: FieldValue.increment(1),
        totalSpentInCents: FieldValue.increment(after.totalInCents),
        lastOrderAt: after.updatedAt,
        updatedAt: FieldValue.serverTimestamp(),
      });

      // Recalculate average
      const statsDoc = await userStatsRef.get();
      const stats = statsDoc.data();
      if (stats && stats.totalOrders > 0) {
        await userStatsRef.update({
          averageOrderValueInCents: Math.round(
            stats.totalSpentInCents / stats.totalOrders
          ),
        });
      }
    }

    // Create a notification for the user
    await db.collection("notifications").add({
      userId: after.userId,
      type: "order_status_update",
      title: `Order ${orderId} ${after.status}`,
      body: getStatusMessage(after.status, orderId),
      orderId,
      isRead: false,
      createdAt: FieldValue.serverTimestamp(),
    });
  });

function getStatusMessage(status: string, orderId: string): string {
  switch (status) {
    case "confirmed":
      return `Your order ${orderId} has been confirmed and is being prepared.`;
    case "shipped":
      return `Your order ${orderId} has been shipped!`;
    case "delivered":
      return `Your order ${orderId} has been delivered. Enjoy!`;
    case "cancelled":
      return `Your order ${orderId} has been cancelled.`;
    case "refunded":
      return `Your refund for order ${orderId} has been processed.`;
    default:
      return `Your order ${orderId} status has been updated to ${status}.`;
  }
}
