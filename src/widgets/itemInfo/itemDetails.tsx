import { ItemCreateType, ItemType } from "@/entities/item";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import clsx from "clsx";
import { SpinnerIcon } from "@/shared/assets/icons";

export const ItemDetails = ({
  title,
  description,
  editable,
  state,
  registerFormField: register,
  setFormValue: setValue,
}: {
  title: {
    title: string;
    default_title: string;
    error: string | undefined;
  };
  description: {
    description: string | null | undefined;
    default_description: string | null | undefined;
  };
  editable: boolean;
  state: "saved" | "editing" | "error";
  registerFormField: UseFormRegister<ItemType | ItemCreateType>;
  setFormValue: UseFormSetValue<ItemType | ItemCreateType>;
}) => {
  return (
    <span>
      <span className="flex items-end justify-between relative pt-2">
        {editable && (
          <span
            className={clsx(
              "text-fg4 text-2xl absolute -z-10 opacity-0",
              title.title === "" && "opacity-100",
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
          {...register("title", { value: title.default_title })}
          onInput={(e) => {
            setValue("title", e.currentTarget.innerText, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        >
          {title.default_title}
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
      <div className="text-err text-xs w-full h-2">{title.error}</div>
      {(description.default_description || editable) && (
        <span className="relative">
          {editable && (
            <span
              className={clsx(
                "text-fg4 text-md absolute -z-10 opacity-0",
                (description.description === "" || description === undefined) &&
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
              value: description.default_description,
            })}
            onInput={(e) => {
              setValue("description", e.currentTarget.innerText, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            {description.default_description}
          </div>
        </span>
      )}
    </span>
  );
};
