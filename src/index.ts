import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";
import express from "express";
import {
  createCustomer,
  getCustomer,
  listCustomers,
} from "./services/customer-service";
import {
  createProduct,
  createStore,
  createSupply,
  getProduct,
  getStore,
  listProducts,
  listStores,
  listSupplies,
} from "./services/catalog-service";
import {
  createOrder,
  getOrder,
  listOrders,
  updateOrderStatus,
} from "./services/order-service";
import { seedJaffleShopData } from "./services/seed-service";

// Initialize Firebase Admin
initializeApp();

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "firestore-jaffle-upstream-mock" });
});

app.post("/seed/jaffle-shop", async (_req, res) => {
  try {
    const result = await seedJaffleShopData();
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/customers", async (req, res) => {
  try {
    const customer = await createCustomer(req.body);
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/customers", async (_req, res) => {
  res.json(await listCustomers());
});

app.get("/customers/:id", async (req, res) => {
  const customer = await getCustomer(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.json(customer);
});

app.post("/stores", async (req, res) => {
  try {
    const store = await createStore(req.body);
    res.status(201).json(store);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/stores", async (_req, res) => {
  res.json(await listStores());
});

app.get("/stores/:id", async (req, res) => {
  const store = await getStore(req.params.id);
  if (!store) {
    return res.status(404).json({ error: "Store not found" });
  }

  res.json(store);
});

app.post("/products", async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/products", async (_req, res) => {
  res.json(await listProducts());
});

app.get("/products/:sku", async (req, res) => {
  const product = await getProduct(req.params.sku);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

app.post("/supplies", async (req, res) => {
  try {
    const supply = await createSupply(req.body);
    res.status(201).json(supply);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/supplies", async (_req, res) => {
  res.json(await listSupplies());
});

app.post("/orders", async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/orders", async (_req, res) => {
  res.json(await listOrders());
});

app.get("/orders/:id", async (req, res) => {
  const order = await getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  res.json(order);
});

app.patch("/orders/:id/status", async (req, res) => {
  try {
    await updateOrderStatus(req.params.id, req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ─── Export as Firebase Cloud Function ────────────────────────────────────────

export const api = functions.https.onRequest(app);

export { onOrderWritten } from "./functions/on-order-written";
