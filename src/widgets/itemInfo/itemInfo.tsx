"use client";

import {
  isAudiobook,
  isGame,
  isMovie,
  ItemCreateType,
  ItemType,
  MovieService,
} from "@/entities/item";
import { UserService } from "@/entities/user";
import useSWR from "swr";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemCover } from "./itemCover";
import { ItemService as IS } from "@/entities/item/item";
import { ItemProperties } from "./itemProperties";
import { ItemTrailer } from "./itemTrailer";
import { ItemTorrent } from "./itemTorrent";
import { ItemDetails } from "./itemDetails";
import { ItemFragment } from "./itemFragment";
import { ItemListProperties } from "./itemListProperties";
import { RequiredFrom } from "@/shared/utils/types";

export const ItemInfo = <T extends ItemType | RequiredFrom<ItemCreateType>>({
  item: init_item,
}: {
  item: T;
}) => {
  const [item, changeItem] = useState<T>(init_item);

  const { data: me } = useSWR("user", () => UserService.IdentifyYourself());
  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    if (me) {
      if (IS.isExistingItem(item)) setEditable(me.id === item.owner.id);
      else setEditable(true);
    }
  }, [me, item]);

  const formRef = useRef<HTMLFormElement>(null);
  const form = useForm<ItemCreateType>({
    defaultValues: init_item,
    resolver: zodResolver(IS.itemsConfiguration[item.type].formResolver),
  });

  const [savedTimeout, changeSavedTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const watch = form.watch();

  const [formData, changeFormData] = useState<T | null>(null);

  useEffect(() => {
    if (!Object.keys(form.formState.dirtyFields).length) return;
    if (JSON.stringify(watch) === JSON.stringify(formData)) return;
    changeFormData(watch as T);
    if (savedTimeout) clearTimeout(savedTimeout);
    changeSavedTimeout(
      setTimeout(() => {
        if (formRef.current) formRef.current.requestSubmit();
      }, 3000)
    );
  }, [watch]);

  const onSubmit = async (formData: ItemCreateType) => {
    const updatedItem = IS.isExistingItem(item)
      ? await IS.ChangeItem(item.id, formData)
      : await IS.AddItem(formData);
    changeSavedTimeout(null);
    if (updatedItem) {
      changeItem(updatedItem as T);
      form.reset({}, { keepValues: true });
    } else {
      form.setError("root", { message: "Ошибка сервера" });
    }
  };

  useEffect(() => console.log(form.formState.errors), [form.formState.errors]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="m-4 flex flex-col lp:block"
        ref={formRef}
      >
        <ItemCover
          cover={IS.isExistingItem(item) ? item.cover : null}
          editable={editable}
        />

        <ItemDetails
          title={item.title}
          description={IS.isExistingItem(item) ? item.description : null}
          editable={editable}
          state={
            savedTimeout
              ? Object.keys(form.formState.errors).length > 0
                ? "error"
                : "editing"
              : "saved"
          }
        />

        <ItemListProperties
          propertyName="genres"
          propertyList={IS.isExistingItem(item) ? item.genres : null}
          editable={editable}
          getAllTags={async () =>
            await IS.itemsConfiguration[item.type].service.GetGenres()
          }
          createTag={async (property: string) =>
            await IS.itemsConfiguration[item.type].service.CreateGenre({
              genre: property,
            })
          }
        />

        <ItemProperties item={item} editable={editable} />

        {isMovie(item) && (
          <ItemListProperties
            propertyName="actors"
            propertyList={IS.isExistingItem(item) ? item.actors : null}
            editable={editable}
            getAllTags={async () => await MovieService.GetActors()}
            createTag={async (property: string) =>
              await MovieService.CreateActor({ actor: property })
            }
          />
        )}

        {((isGame(item) && isGame(watch)) ||
          (isMovie(item) && isMovie(watch))) && (
          <ItemTrailer default_trailer={item.trailer} editable={editable} />
        )}

        {isAudiobook(item) && isAudiobook(watch) && (
          <ItemFragment fragment={item.fragment} editable={editable} />
        )}

        <ItemTorrent torrent_file={item.torrent_file} editable={editable} />

        <input type="submit" className="hidden" />
      </form>
    </FormProvider>
  );
};
