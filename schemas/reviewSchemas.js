import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Rating must be 1–5").max(5, "Rating must be 1–5"),
  title: z.string().max(100, "Title too long").optional().default(""),
  comment: z.string().min(10, "Review must be at least 10 characters").max(2000, "Review too long"),
  pros: z.string().max(500).optional().default(""),
  cons: z.string().max(500).optional().default(""),
  isCurrentEmployee: z.boolean().optional().default(false),
  employmentType: z.enum(["full-time", "part-time", "contract", "intern"]).optional().default("full-time"),
  isAnonymous: z.boolean().optional().default(false),
});
