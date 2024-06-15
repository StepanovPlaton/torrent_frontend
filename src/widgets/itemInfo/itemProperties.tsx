import { ItemCreateType, ItemType } from "@/entities/item";
import { ItemService } from "@/entities/item/item";
import clsx from "clsx";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

export const ItemProperties = <T extends ItemType | ItemCreateType>({
  item,
  watchedFormData: watchedData,
  editable,
  setFormValue: setValue,
  registerFormField: register,
}: {
  item: T; // Init values
  watchedFormData: T; // Updated values
  editable: boolean;
  setFormValue: UseFormSetValue<ItemType | ItemCreateType>;
  registerFormField: UseFormRegister<ItemType | ItemCreateType>;
}) => {
  return (
    <div
      className={clsx(
        "w-full flex justify-between pt-4",
        !editable && "cursor-default"
      )}
    >
      {(ItemService.GetPropertiesDescriptionForItem(item) ?? []).map(
        (section, i) => (
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
                    {...register(req.key as keyof ItemType, {
                      value: req.value
                        ? req.value(item)
                        : undefined ?? (item[req.key] as string),
                    })}
                    contentEditable={editable && (req.editable ?? true)}
                    suppressContentEditableWarning={true}
                    onInput={(e) => {
                      setValue(
                        req.key as keyof ItemType,
                        e.currentTarget.innerText,
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        }
                      );
                    }}
                  >
                    {req.value
                      ? req.value(item)
                      : undefined ?? (item[req.key] as string)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
};
