import { z } from "zod";

export const userSchema = z.object({
  id: z.number().positive(),
  username: z.string().min(3),
  email: z.string().min(3),
});
export type User = z.infer<typeof userSchema>;
