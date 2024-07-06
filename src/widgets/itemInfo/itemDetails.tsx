import { ItemCreateType, ItemType } from "@/entities/item";
import {
  useFormContext,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import clsx from "clsx";
import { SpinnerIcon } from "@/shared/assets/icons";

export const ItemDetails = ({
  title,
  description,
  editable,
  state,
}: {
  title: string;
  description: string | null | undefined;
  editable: boolean;
  state: "saved" | "editing" | "error";
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ItemCreateType>();

  const watched_title = watch("title");
  const watched_description = watch("description");

  return (
    <span>
      <span className="flex items-end justify-between relative pt-2">
        {editable && (
          <span
            className={clsx(
              "text-fg4 text-2xl absolute -z-10 opacity-0",
              watched_title === "" && "opacity-100",
              "transition-opacity cursor-text"
            )}
          >
            Введите название
          </span>
        )}
        <h1
          className={clsx(
            "text-4xl outline-none max-w-[80%] cursor-text",
            !editable && "cursor-default"
          )}
          suppressContentEditableWarning={true}
          contentEditable={editable}
          {...register("title", { value: title })}
          onInput={(e) => {
            setValue("title", e.currentTarget.innerText, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        >
          {title}
        </h1>

        {editable && (
          <span className="text-sm text-fg4 flex items-center cursor-default">
            {}
            {state === "editing" && (
              <>
                <SpinnerIcon className="mr-2" />
                Редактируется
              </>
            )}
            {state === "error" && (
              <span className="text-err text-right">Некорректные данные</span>
            )}
            {state === "saved" && "Сохранено"}
          </span>
        )}
      </span>
      <div className="text-err text-xs w-full h-2">{errors.title?.message}</div>
      {(description || editable) && (
        <span className="relative">
          {editable && (
            <span
              className={clsx(
                "text-fg4 text-md absolute -z-10 opacity-0",
                (watched_description === "" || description === undefined) &&
                  "opacity-100",
                "transition-opacity mt-2"
              )}
            >
              Введите описание
            </span>
          )}
          <div
            contentEditable={editable}
            suppressContentEditableWarning={true}
            className={clsx(
              "text-md text-justify",
              "text-fg4 pt-2 outline-none",
              !editable && "cursor-default"
            )}
            {...register("description", {
              value: description,
            })}
            onInput={(e) => {
              setValue("description", e.currentTarget.innerText, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            {description}
          </div>
        </span>
      )}
    </span>
  );
};
