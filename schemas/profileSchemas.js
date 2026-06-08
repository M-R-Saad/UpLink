import { z } from "zod";
export const updateProfileSchema = z.object({
  headline:          z.string().optional(),
  bio:               z.string().optional(),
  phone:             z.string().optional(),
  location:          z.string().optional(),
  skills:            z.array(z.string()).optional(),
  isOpenToWork:      z.boolean().optional(),
  preferredJobTypes: z.array(z.string()).optional(),
  links: z.object({
    github:    z.string().optional(),
    linkedin:  z.string().optional(),
    portfolio: z.string().optional(),
    other:     z.string().optional(),
  }).optional(),
});
