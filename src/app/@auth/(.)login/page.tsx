"use client";

import {
  LoginFormType,
  loginFormFieldNames,
  loginFormSchema,
} from "@/entities/user";
import { UserService } from "@/entities/user/user";
import { Modal } from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { mutate } from "swr";

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormType>({ resolver: zodResolver(loginFormSchema) });

  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    const userInfo = await UserService.Login(data);
    mutate("user", userInfo);
    if (userInfo) router.back();
    else setError("root", { message: "Неверный логин или пароль" });
  };

  return (
    <Modal>
      <div className="">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-evenly"
        >
          <h2 className="pb-4 text-4xl">.Torrent</h2>
          {(["username", "password"] as (keyof LoginFormType)[]).map(
            (field) => (
              <label
                className="flex flex-col items-start relative w-64 py-1"
                key={field}
              >
                <input
                  {...register(field)}
                  className="peer/search w-full rounded-lg bg-bg4 px-2 h-10 outline-none"
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
            )
          )}
          {errors.root && (
            <p className="text-sm text-err w-full text-center">
              {errors.root.message}
            </p>
          )}

          <input
            type="submit"
            value="Войти"
            className="bg-ac0 mt-2 p-1 px-4 rounded-lg"
          />
          <Link href="/registration" replace={true} className="text-xs pt-2">
            Или <span className="hover:underline">создать аккаунт</span>
          </Link>
        </form>
      </div>
    </Modal>
  );
}
