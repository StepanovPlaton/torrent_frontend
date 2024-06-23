"use client";

import {
  isAudiobook,
  isGame,
  isMovie,
  ItemCreateType,
  ItemType,
} from "@/entities/item";
import { UserService } from "@/entities/user";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemCover } from "./itemCover";
import { ItemService } from "@/entities/item/item";
import { ItemProperties } from "./itemProperties";
import { ItemTrailer } from "./itemTrailer";
import { ItemTorrent } from "./itemTorrent";
import { ItemDetails } from "./itemDetails";
import { ItemFragment } from "./itemFragment";
import { EraseCacheByTag } from "@/shared/utils/http";

export const ItemInfo = <T extends ItemType | ItemCreateType>({
  item: init_item,
}: {
  item: T;
}) => {
  const [item, changeItem] = useState<T>(init_item);

  const { data: me } = useSWR("user", () => UserService.IdentifyYourself());
  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    if (me) {
      if (ItemService.isExistingItem(item))
        setEditable(me.id === item.owner_id);
      else setEditable(true);
    }
  }, [me, item]);

  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<ItemType | ItemCreateType>({
    defaultValues: init_item,
    resolver: zodResolver(
      ItemService.itemsConfiguration[item.type].formResolver
    ),
  });

  useEffect(() => {
    register("torrent_file", { value: item.torrent_file });
    register("cover", { value: item.cover });
    if (isAudiobook(item)) register("fragment", { value: item.fragment });
  }, [item.cover, item.torrent_file, register]);

  const [savedTimeout, changeSavedTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const watchedData = watch();

  const [formData, changeFormData] = useState<T | null>(null);

  useEffect(() => {
    if (!Object.keys(dirtyFields).length) return;
    if (JSON.stringify(watchedData) === JSON.stringify(formData)) return;
    changeFormData(watchedData as T);
    if (savedTimeout) clearTimeout(savedTimeout);
    changeSavedTimeout(
      setTimeout(() => {
        if (formRef.current) formRef.current.requestSubmit();
      }, 3000)
    );
  }, [watchedData]);

  const onSubmit = async (formData: ItemCreateType) => {
    const updatedItem = ItemService.isExistingItem(item)
      ? await ItemService.ChangeItem(item.id, formData)
      : await ItemService.AddItem(formData);
    changeSavedTimeout(null);
    if (updatedItem) {
      changeItem(updatedItem as T);
      reset({}, { keepValues: true });
    } else {
      setError("root", { message: "Ошибка сервера" });
    }
  };

  useEffect(() => console.log(errors), [errors]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-4 flex flex-col lp:block"
      ref={formRef}
    >
      <ItemCover
        cover={watchedData.cover}
        editable={editable}
        setFormValue={setValue}
      />

      <ItemDetails
        title={{
          title: watchedData.title,
          default_title: item.title,
          error: errors.title?.message,
        }}
        description={{
          description: watchedData.description,
          default_description: item.description,
        }}
        editable={editable}
        state={
          savedTimeout
            ? Object.keys(errors).length > 0
              ? "error"
              : "editing"
            : "saved"
        }
        registerFormField={register}
        setFormValue={setValue}
      />

      <ItemProperties
        item={item}
        watchedFormData={watchedData}
        editable={editable}
        setFormValue={setValue}
        registerFormField={register}
      />

      {(isGame(item) || isMovie(item)) &&
        (isGame(watchedData) || isMovie(watchedData)) && (
          <ItemTrailer
            default_trailer={item.trailer}
            trailer={watchedData.trailer}
            editable={editable}
            registerFormField={register}
            setFormValue={setValue}
          />
        )}

      {isAudiobook(watchedData) && (
        <ItemFragment
          fragment={watchedData.fragment}
          editable={editable}
          registerFormField={register}
          setFormValue={setValue}
        />
      )}

      <ItemTorrent
        title={watchedData.title}
        torrent_file={watchedData.torrent_file}
        editable={editable}
        error={errors.torrent_file?.message}
        setFormValue={setValue}
      />

      <input type="submit" className="hidden" />
    </form>
  );
};
