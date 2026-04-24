import { Timestamp } from "firebase-admin/firestore";

export interface RawCustomer {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}
