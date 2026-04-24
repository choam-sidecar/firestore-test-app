import { Timestamp } from "firebase-admin/firestore";

export type OrderStatus = "placed" | "preparing" | "fulfilled" | "cancelled";
export type OrderChannel = "pos" | "app" | "delivery";

export interface RawOrder {
  id: string;
  customer_id: string;
  store_id: string;
  subtotal: number;
  tax_paid: number;
  order_total: number;
  ordered_at: Timestamp;
  status: OrderStatus;
  channel: OrderChannel;
  notes: string | null;
  updated_at: Timestamp;
}

export interface RawItem {
  id: string;
  order_id: string;
  sku: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  updated_at: Timestamp;
}
