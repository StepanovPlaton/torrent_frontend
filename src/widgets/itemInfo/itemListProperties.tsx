import { isGenre, ItemCreateType, ItemListPropertyType } from "@/entities/item";
import { CrossIcon } from "@/shared/assets/icons";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FieldArrayPath, useFieldArray, useFormContext } from "react-hook-form";

export const ItemListProperties = <T extends ItemListPropertyType>({
  propertyName,
  editable,
  getAllTags,
  createTag,
}: {
  propertyName: FieldArrayPath<ItemCreateType>;
  propertyList: T[] | null | undefined;
  editable: boolean;
  getAllTags: () => Promise<T[] | null>;
  createTag: (property: string) => Promise<T | null>;
}) => {
  const { watch } = useFormContext<ItemCreateType>();

  const watched_property = watch(propertyName);

  const { fields, append, replace, remove } = useFieldArray<ItemCreateType>({
    name: propertyName,
  });

  const [allTags, setAllTags] = useState<T[] | null>();
  const [searchTags, setSearchTags] = useState<T[] | null>();
  const [addition, changeAdditionState] = useState<boolean>(false);

  const getTagValue = (tag: T) => (isGenre(tag) ? tag.genre : tag.actor);
  const getTagsByQuery = (query: string) =>
    allTags
      ?.filter((t) => getTagValue(t).includes(query))
      .filter((t) => !watched_property?.map((tag) => tag.id).includes(t.id));

  const [searchField, changeSearchField] = useState<string>("");

  useEffect(() => setSearchTags(getTagsByQuery(searchField)), [searchField]);
  useEffect(
    () => console.log(fields, watched_property),
    [fields, watched_property]
  );

  return (
    <span>
      <div className="flex items-start justify-start p-2 flex-wrap">
        {fields.map((field, i) => (
          <div
            className="px-2 py-1 bg-bg1 rounded-lg m-1 relative group cursor-default"
            key={field.id}
          >
            {watched_property && (
              <span>{getTagValue(watched_property[i] as T)}</span>
            )}
            {editable && (
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity 
            cursor-pointer absolute -top-1 -right-1 rounded-full bg-bg4 w-4 h-4"
                onClick={() => remove(i)}
              >
                <CrossIcon />
              </button>
            )}
          </div>
        ))}
        {editable && (
          <>
            <button
              className={clsx(
                "px-2 py-1 bg-bg1 rounded-lg m-1 cursor-pointer transition-opacity",
                addition && "opacity-0"
              )}
              onClick={async () => {
                changeAdditionState(editable);
                setAllTags(await getAllTags());
              }}
            >
              +
            </button>
            <div
              className={clsx(
                "px-2 py-1 bg-bg1 rounded-lg m-1 opacity-0 transition-all relative",
                !addition && "w-0 h-0 overflow-hidden",
                addition && "opacity-100 !h-fit"
              )}
            >
              <input
                className="w-24 outline-none"
                onChange={(e) => changeSearchField(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    const tag = await createTag(searchField);
                    if (tag) replace([...(watched_property ?? []), tag]);
                    changeAdditionState(false);
                  }
                }}
              ></input>
              <div
                className={clsx(
                  "static w-28 bg-bg1 top-0 left-0 px-2 opacity-0",
                  "transition-opacity rounded-b-lg",
                  searchTags && "opacity-100"
                )}
              >
                {searchTags?.map((tag) => (
                  <div
                    key={tag.id}
                    className="w-full py-1 cursor-pointer overflow-hidden text-ellipsis"
                    onClick={() => {
                      append(tag);
                      console.log("updated");
                      changeAdditionState(false);
                    }}
                  >
                    {getTagValue(tag)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </span>
  );
};
