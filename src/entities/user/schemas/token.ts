import { z } from "zod";
import { userSchema } from "./user";

export const tokenResponseSchema = z
  .object({
    access_token: z.string(),
    token_type: z.string(),
  })
  .transform((tokenResponse) => tokenResponse.access_token);
export type TokenResponse = z.infer<typeof tokenResponseSchema>;

export const tokenDataSchema = userSchema.merge(
  z.object({
    expire: z
      .string()
      .min(1)
      .transform((d) => new Date(d)),
  })
);
export type TokenData = z.infer<typeof tokenDataSchema>;
