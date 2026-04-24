import { z } from "zod";

export const createCustomerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  email: z.string().email(),
  is_active: z.boolean().default(true),
});
