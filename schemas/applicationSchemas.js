import { z } from "zod";
export const applySchema = z.object({
  resumeURL:   z.string().url("Resume URL required"),
  coverLetter: z.string().optional(),
});
export const updateStatusSchema = z.object({
  status:       z.enum(["pending","reviewed","shortlisted","interview","rejected","hired"]),
  employerNote: z.string().optional(),
});
