import { z } from "zod";
import { userSchema } from "./user";

export const loginFormSchema = z.object({
  username: z.string().min(3, "Логин слишком короткий"),
  password: z.string().min(3, "Пароль слишком короткий"),
});
export const loginFormFieldNames = {
  username: "Логин",
  password: "Пароль",
};
export type LoginForm = z.infer<typeof loginFormSchema>;

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
