import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import {
  Product,
  ProductReview,
  createProductSchema,
  createReviewSchema,
} from "../models/product";

const db = getFirestore();
const productsCollection = db.collection("products");

export async function createProduct(
  sellerId: string,
  data: unknown
): Promise<Product> {
  const validated = createProductSchema.parse(data);
  const docRef = productsCollection.doc();

  const product: Product = {
    id: docRef.id,
    name: validated.name,
    description: validated.description,
    category: validated.category,
    tags: validated.tags,
    basePrice: validated.basePrice,
    variants: validated.variants,
    imageUrls: validated.imageUrls,
    isPublished: false,
    sellerId,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await docRef.set(product);
  return product;
}

export async function getProduct(productId: string): Promise<Product | null> {
  const doc = await productsCollection.doc(productId).get();
  if (!doc.exists) return null;
  return doc.data() as Product;
}

export async function updateProductStock(
  productId: string,
  sku: string,
  quantityChange: number
): Promise<void> {
  const productRef = productsCollection.doc(productId);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(productRef);
    if (!doc.exists) throw new Error(`Product ${productId} not found`);

    const product = doc.data() as Product;
    const variantIndex = product.variants.findIndex((v) => v.sku === sku);
    if (variantIndex === -1) throw new Error(`Variant ${sku} not found`);

    const newStock = product.variants[variantIndex].stockCount + quantityChange;
    if (newStock < 0) throw new Error("Insufficient stock");

    product.variants[variantIndex].stockCount = newStock;
    transaction.update(productRef, {
      variants: product.variants,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
}

export async function publishProduct(productId: string): Promise<void> {
  await productsCollection.doc(productId).update({
    isPublished: true,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function addProductReview(
  productId: string,
  userId: string,
  data: unknown
): Promise<ProductReview> {
  const validated = createReviewSchema.parse(data);
  const reviewRef = productsCollection
    .doc(productId)
    .collection("reviews")
    .doc();

  const review: ProductReview = {
    id: reviewRef.id,
    userId,
    rating: validated.rating,
    title: validated.title,
    body: validated.body,
    helpfulCount: 0,
    createdAt: Timestamp.now(),
  };

  await reviewRef.set(review);
  return review;
}

export async function getProductReviews(
  productId: string,
  limit: number = 20
): Promise<ProductReview[]> {
  const snapshot = await productsCollection
    .doc(productId)
    .collection("reviews")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as ProductReview);
}

export async function searchProductsByCategory(
  category: string,
  limit: number = 20
): Promise<Product[]> {
  const snapshot = await productsCollection
    .where("category", "==", category)
    .where("isPublished", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as Product);
}
