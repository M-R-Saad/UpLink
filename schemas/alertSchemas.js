import { z } from "zod";
export const createAlertSchema = z.object({
  label:       z.string().min(1, "Label required"),
  keywords:    z.array(z.string()).default([]),
  categories:  z.array(z.string()).default([]),
  jobTypes:    z.array(z.string()).default([]),
  locationType:z.enum(["any","remote","onsite","hybrid"]).default("any"),
  locations:   z.array(z.string()).default([]),
  frequency:   z.enum(["instant","daily","weekly"]).default("instant"),
});
