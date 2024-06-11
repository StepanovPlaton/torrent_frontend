"use client";

import {
  LoginForm,
  loginFormFieldNames,
  loginFormSchema,
} from "@/entities/user";
import { UserService } from "@/entities/user/user";
import { Modal } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginFormSchema) });

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const userInfo = await UserService.Login(data);
    mutate("user", userInfo);
    router.back();
  };

  return (
    <Modal>
      <div className="">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-evenly"
        >
          <h2 className="pb-4 text-4xl">.Torrent</h2>
          {(["username", "password"] as (keyof LoginForm)[]).map((field) => (
            <label
              className="flex flex-col items-start relative w-64 py-1"
              key={field}
            >
              <input
                {...register(field)}
                className="peer/search w-full rounded-lg bg-bg4 px-2 h-10"
                placeholder=" "
                autoComplete="off"
              />
              <span
                className="peer-focus/search:opacity-0 
                  				peer-[:not(:placeholder-shown)]/search:opacity-0 
                  				transition-opacity h-0 flex items-center relative bottom-5 left-4
								text-lg"
              >
                {loginFormFieldNames[field]}
              </span>
              <p className="text-sm text-err w-full text-center">
                {errors[field]?.message}
              </p>
            </label>
          ))}

          <input
            type="submit"
            value="Войти"
            className="bg-ac0 mt-2 p-1 px-4 rounded-lg"
          />
        </form>
      </div>
    </Modal>
  );
}
