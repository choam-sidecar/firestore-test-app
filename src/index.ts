import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";
import express from "express";
import { createUser, getUser, updateUser, listActiveUsers } from "./services/user-service";
import { createProduct, getProduct, searchProductsByCategory, addProductReview, publishProduct } from "./services/product-service";
import { createOrder, getOrder, getUserOrders, updateOrderStatus, cancelOrder } from "./services/order-service";

// Initialize Firebase Admin
initializeApp();

const app = express();
app.use(express.json());

// ─── User Routes ─────────────────────────────────────────────────────────────

app.post("/users/:uid", async (req, res) => {
  try {
    const user = await createUser(req.params.uid, req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users/:uid", async (req, res) => {
  const user = await getUser(req.params.uid);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.patch("/users/:uid", async (req, res) => {
  try {
    await updateUser(req.params.uid, req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const users = await listActiveUsers(limit, req.query.startAfter as string);
  res.json(users);
});

// ─── Product Routes ──────────────────────────────────────────────────────────

app.post("/products", async (req, res) => {
  try {
    const product = await createProduct(req.body.sellerId, req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/products/:id", async (req, res) => {
  const product = await getProduct(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.get("/products/category/:category", async (req, res) => {
  const products = await searchProductsByCategory(req.params.category);
  res.json(products);
});

app.post("/products/:id/publish", async (req, res) => {
  try {
    await publishProduct(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/products/:id/reviews", async (req, res) => {
  try {
    const review = await addProductReview(
      req.params.id,
      req.body.userId,
      req.body
    );
    res.status(201).json(review);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ─── Order Routes ────────────────────────────────────────────────────────────

app.post("/orders", async (req, res) => {
  try {
    const order = await createOrder(req.body.userId, req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/orders/:id", async (req, res) => {
  const order = await getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

app.get("/users/:uid/orders", async (req, res) => {
  const orders = await getUserOrders(req.params.uid);
  res.json(orders);
});

app.patch("/orders/:id/status", async (req, res) => {
  try {
    await updateOrderStatus(
      req.params.id,
      req.body.status,
      req.body.trackingNumber,
      req.body.carrier
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/orders/:id/cancel", async (req, res) => {
  try {
    await cancelOrder(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ─── Export as Firebase Cloud Function ────────────────────────────────────────

export const api = functions.https.onRequest(app);

// ─── Firestore Triggers ──────────────────────────────────────────────────────

export { onUserCreated } from "./functions/on-user-created";
export { onOrderStatusChanged } from "./functions/on-order-status-changed";
export { onReviewCreated } from "./functions/on-review-created";
