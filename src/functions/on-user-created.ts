import * as functions from "firebase-functions";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const db = getFirestore();

/**
 * When a new user document is created, initialize their
 * associated collections and aggregation counters.
 */
export const onUserCreated = functions.firestore
  .document("users/{userId}")
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    const userData = snapshot.data();

    // Create a user_stats document to track aggregate metrics
    await db
      .collection("user_stats")
      .doc(userId)
      .set({
        userId,
        totalOrders: 0,
        totalSpentInCents: 0,
        averageOrderValueInCents: 0,
        lastOrderAt: null,
        memberSince: userData.createdAt,
        updatedAt: Timestamp.now(),
      });

    // Create a wishlist document
    await db.collection("wishlists").doc(userId).set({
      userId,
      productIds: [],
      updatedAt: Timestamp.now(),
    });

    functions.logger.info(`Initialized collections for new user ${userId}`);
  });
