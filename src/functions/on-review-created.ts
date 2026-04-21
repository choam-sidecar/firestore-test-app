import * as functions from "firebase-functions";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const db = getFirestore();

/**
 * When a new review is added to a product, update the product's
 * aggregate rating stats.
 */
export const onReviewCreated = functions.firestore
  .document("products/{productId}/reviews/{reviewId}")
  .onCreate(async (snapshot, context) => {
    const productId = context.params.productId;
    const reviewData = snapshot.data();

    const productRef = db.collection("products").doc(productId);

    await db.runTransaction(async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists) return;

      const product = productDoc.data()!;
      const currentCount = product.reviewCount || 0;
      const currentTotal = product.ratingTotal || 0;

      const newCount = currentCount + 1;
      const newTotal = currentTotal + reviewData.rating;

      transaction.update(productRef, {
        reviewCount: newCount,
        ratingTotal: newTotal,
        averageRating: Math.round((newTotal / newCount) * 10) / 10,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    functions.logger.info(
      `Updated rating for product ${productId} after new review`
    );
  });
