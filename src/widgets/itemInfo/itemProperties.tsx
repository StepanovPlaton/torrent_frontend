import { ItemCreateType, ItemType } from "@/entities/item";
import { ItemService } from "@/entities/item/item";
import { ItemPropertiesDescriptionType } from "@/entities/item/types";
import { RequiredFrom } from "@/shared/utils/types";
import clsx from "clsx";
import {
  useFormContext,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

export const ItemProperties = <
  T extends ItemType | RequiredFrom<ItemCreateType>
>({
  item,
  editable,
}: {
  item: T; // Init values
  editable: boolean;
}) => {
  const { register, setValue, watch } = useFormContext<ItemCreateType>();

  const watchedData = watch();

  return (
    <div
      className={clsx(
        "w-full flex justify-between pt-4",
        !editable && "cursor-default"
      )}
    >
      {(
        ItemService.itemsConfiguration[item.type]
          .propertiesDescription as ItemPropertiesDescriptionType<ItemCreateType>
      ).map((section, i) => (
        <ul key={i} className="w-[48%] bg-bg1 rounded-lg py-1 px-4">
          {section.map((req) => (
            <li key={req.name} className="text-sm lp:text-md py-1">
              <span className="font-bold">{req.name + ": "}</span>
              <span className="relative">
                <span
                  className={clsx(
                    "text-fg4 opacity-0 absolute -z-10 text-xs",
                    (watchedData[req.key] === undefined ||
                      watchedData[req.key] === null ||
                      (watchedData[req.key] as string) === "") &&
                      "opacity-100 relative !z-10 text-base",
                    "transition-opacity "
                  )}
                >
                  Не известно
                </span>
                <span
                  className={clsx(
                    "outline-none",
                    !editable && "cursor-default",
                    (watchedData[req.key] === undefined ||
                      watchedData[req.key] === null ||
                      (watchedData[req.key] as string) === "") &&
                      "opacity-100 absolute left-0 top-0 inline-block min-w-10 z-10"
                  )}
                  {...register(req.key, {
                    value: req.value
                      ? req.value(item as ItemCreateType)
                      : undefined ??
                        ((item as ItemCreateType)[req.key] as string),
                  })}
                  contentEditable={editable && (req.editable ?? true)}
                  suppressContentEditableWarning={true}
                  onInput={(e) => {
                    setValue(req.key, e.currentTarget.innerText, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                >
                  {req.value
                    ? req.value(item as ItemCreateType)
                    : undefined ??
                      ((item as ItemCreateType)[req.key] as string)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
};
