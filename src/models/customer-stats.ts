import { Timestamp } from "firebase-admin/firestore";

export interface CustomerStats {
  customer_id: string;
  count_lifetime_orders: number;
  first_ordered_at: Timestamp | null;
  last_ordered_at: Timestamp | null;
  lifetime_spend_pretax: number;
  lifetime_tax_paid: number;
  lifetime_spend: number;
  customer_type: "new" | "returning";
  updated_at: Timestamp;
}
