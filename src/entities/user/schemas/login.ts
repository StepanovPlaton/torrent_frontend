import { z } from "zod";

export const loginFormSchema = z.object({
  username: z.string().min(3, "Логин слишком короткий"),
  password: z.string().min(3, "Пароль слишком короткий"),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;
export type LoginFormFieldsType = keyof LoginFormType;

export const loginFormFieldNames: { [key in LoginFormFieldsType]: string } = {
  username: "Логин",
  password: "Пароль",
};
