import { z } from "zod";

export const ownerSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(3),
  email: z.string().min(3),
});
