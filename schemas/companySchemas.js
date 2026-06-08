import { z } from "zod";
export const createCompanySchema = z.object({
  name:        z.string().min(2, "Company name required"),
  description: z.string().optional(),
  industry:    z.string().min(1, "Industry required"),
  size:        z.enum(["1-10","11-50","51-200","201-500","501-1000","1000+"]).optional(),
  founded:     z.number().optional(),
  website:     z.string().url("Invalid URL").optional().or(z.literal("")),
  location:    z.string().optional(),
  socialLinks: z.object({
    linkedin:  z.string().optional(),
    twitter:   z.string().optional(),
    facebook:  z.string().optional(),
  }).optional(),
});
