import { z } from "zod";
export const createCategorySchema = z.object({
  name:        z.string().min(2, "Name required"),
  icon:        z.string().default("💼"),
  description: z.string().optional(),
});
