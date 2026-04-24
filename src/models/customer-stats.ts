import { Timestamp } from "firebase-admin/firestore";

export interface CustomerStats {
  customer_id: string;
  avg_order_value: number;
  count_lifetime_orders: number;
  first_ordered_at: Timestamp | null;
  last_ordered_at: Timestamp | null;
  last_channel: "pos" | "app" | "delivery" | null;
  lifetime_spend_pretax: number;
  lifetime_tax_paid: number;
  lifetime_spend: number;
  customer_type: "new" | "returning";
  updated_at: Timestamp;
}
