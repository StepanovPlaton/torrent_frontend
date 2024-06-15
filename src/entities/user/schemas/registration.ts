import { z } from "zod";

export const registrationFormSchema = z.object({
  email: z
    .string()
    .min(3, "Почта слишком короткий")
    .email("Это не адрес электронной почты"),
  name: z.string().min(3, "Логин слишком короткий"),
  password: z.string().min(3, "Пароль слишком короткий"),
});
export type RegistrationFormType = z.infer<typeof registrationFormSchema>;
export type RegistrationFormFields = keyof RegistrationFormType;

export const registrationFormFieldNames: {
  [key in RegistrationFormFields]: string;
} = {
  email: "E-mail",
  name: "Логин",
  password: "Пароль",
};
