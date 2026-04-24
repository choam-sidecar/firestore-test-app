import { Timestamp } from "firebase-admin/firestore";
import {
  RawCustomer,
  RawProduct,
  RawStore,
  RawSupply,
} from "../models";

const baseTime = new Date("2026-01-15T18:30:00.000Z");

function ts(daysOffset: number): Timestamp {
  return Timestamp.fromDate(new Date(baseTime.getTime() + daysOffset * 86400000));
}

export const seededCustomers: RawCustomer[] = [
  {
    id: "1",
    name: "Ada Lovelace",
    email: "ada@jaffleshop.dev",
    is_active: true,
    created_at: ts(-30),
    updated_at: ts(-1),
  },
  {
    id: "2",
    name: "Grace Hopper",
    email: "grace@jaffleshop.dev",
    is_active: true,
    created_at: ts(-25),
    updated_at: ts(-2),
  },
  {
    id: "3",
    name: "Margaret Hamilton",
    email: "margaret@jaffleshop.dev",
    is_active: true,
    created_at: ts(-20),
    updated_at: ts(-3),
  },
];

export const seededStores: RawStore[] = [
  {
    id: "1",
    name: "Downtown Jaffle Shop",
    tax_rate: 0.08875,
    opened_at: ts(-365),
    region: "west",
    is_active: true,
    updated_at: ts(-5),
  },
  {
    id: "2",
    name: "Mission District Jaffle Shop",
    tax_rate: 0.0925,
    opened_at: ts(-220),
    region: "west",
    is_active: true,
    updated_at: ts(-8),
  },
];

export const seededProducts: RawProduct[] = [
  {
    sku: "JAFFLE_CLASSIC",
    name: "Classic Jaffle",
    type: "jaffle",
    description: "Cheese-forward toasted jaffle.",
    price: 900,
    is_active: true,
    updated_at: ts(-3),
  },
  {
    sku: "JAFFLE_DELUXE",
    name: "Deluxe Jaffle",
    type: "jaffle",
    description: "Deluxe jaffle with tomato and herbs.",
    price: 1200,
    is_active: true,
    updated_at: ts(-3),
  },
  {
    sku: "BEV_COFFEE",
    name: "Filter Coffee",
    type: "beverage",
    description: "Freshly brewed house coffee.",
    price: 350,
    is_active: true,
    updated_at: ts(-4),
  },
  {
    sku: "SIDE_HASH",
    name: "Hash Browns",
    type: "side",
    description: "Crispy potato side.",
    price: 500,
    is_active: true,
    updated_at: ts(-4),
  },
];

export const seededSupplies: RawSupply[] = [
  {
    id: "100",
    sku: "JAFFLE_CLASSIC",
    name: "Sourdough Bread",
    cost: 180,
    perishable: true,
    vendor: "Bay Bread Co",
    quantity_on_hand: 120,
    updated_at: ts(-2),
  },
  {
    id: "101",
    sku: "JAFFLE_CLASSIC",
    name: "Cheddar Slices",
    cost: 95,
    perishable: true,
    vendor: "Golden State Dairy",
    quantity_on_hand: 240,
    updated_at: ts(-2),
  },
  {
    id: "102",
    sku: "BEV_COFFEE",
    name: "Coffee Beans",
    cost: 140,
    perishable: false,
    vendor: "Mission Roasters",
    quantity_on_hand: 90,
    updated_at: ts(-1),
  },
  {
    id: "103",
    sku: "SIDE_HASH",
    name: "Shredded Potatoes",
    cost: 110,
    perishable: true,
    vendor: "Farmhouse Produce",
    quantity_on_hand: 60,
    updated_at: ts(-1),
  },
];
