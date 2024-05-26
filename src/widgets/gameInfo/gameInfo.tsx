"use client";

import {
  gameCreateSchema,
  GameCreateType,
  GameService,
  GameType,
} from "@/entities/game";
import clsx from "clsx";
import Link from "next/link";
import { getYouTubeID } from "@/shared/utils";
import { UserService } from "@/entities/user";
import useSWR from "swr";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Img } from "@/shared/ui";
import { useDropzone } from "react-dropzone";
import { FilesService } from "@/entities/files";
import { SpinnerIcon } from "@/shared/assets/icons";

const propertyUnknownText = "Не известно";

export const GameInfo = ({ game }: { game: GameType }) => {
  const { data: me } = useSWR("user", () => UserService.IdentifyYourself());
  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => setEditable(me?.id === game.owner_id), [me, game]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { dirtyFields, errors },
  } = useForm<GameCreateType>({
    resolver: zodResolver(gameCreateSchema),
  });

  useEffect(() => {
    register("torrent_file", { value: game.torrent_file });
    register("cover", { value: game.cover });
  }, []);

  const [savedTimeout, changeSavedTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const watchedData = watch();
  const [formData, changeFormData] = useState<GameCreateType | null>(null);
  useEffect(() => {
    if (!Object.keys(dirtyFields).length) return;
    if (JSON.stringify(watchedData) === JSON.stringify(formData)) return;
    console.log(dirtyFields);
    changeFormData(watchedData);
    if (savedTimeout) clearTimeout(savedTimeout);
    changeSavedTimeout(
      setTimeout(() => {
        if (formRef.current) formRef.current.requestSubmit();
      }, 5000)
    );
  }, [watchedData]);

  const onSubmit = async (formData: GameCreateType) => {
    changeSavedTimeout(null);
    const updatedGame = await GameService.changeGame(game.id, formData);
    console.log(updatedGame);
  };

  const [cover, setCover] = useState<string | undefined>(game.cover);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const coverName = await FilesService.UploadCover(file);
      if (coverName) {
        setCover(coverName);
        setValue("cover", coverName);
      }
    };
    fileReader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 flex flex-col lp:block"
      ref={formRef}
    >
      {cover && (
        <div
          className="lp:w-[60%] lp:px-4 lp:pl-0 pt-2 float-left"
          {...(editable ? getRootProps() : {})}
        >
          <Img
            src={cover}
            preview={false}
            className="transition-all rounded-lg w-full object-contain"
            width={1280}
            height={720}
          />
          {editable && (
            <>
              <input {...getInputProps()} />
              <span className="flex items-center ju w-full p-1">
                {isDragActive ? (
                  <p>Изменить обложку...</p>
                ) : (
                  <span className="text-sm w-full flex justify-around">
                    Для редактирования нажмите или перетащите новую обложку
                    поверх старой
                  </span>
                )}
              </span>
            </>
          )}
        </div>
      )}
      <span className="lp:max-w-[40%]">
        <span className="flex items-end justify-between">
          <h1
            className={clsx(
              "text-4xl outline-none max-w-[80%]",
              !editable && "cursor-default"
            )}
            suppressContentEditableWarning={true}
            contentEditable={editable}
            {...register("title", { value: game.title })}
            onInput={(e) => {
              setValue("title", e.currentTarget.innerText, {
                shouldValidate: true,
                shouldDirty: true,
              });
              console.log();
            }}
          >
            {game.title}
          </h1>
          <span className="text-sm text-fg4 flex items-center">
            {savedTimeout && (
              <>
                <SpinnerIcon className="mr-2" />
                Редактируется
              </>
            )}
            {!savedTimeout && "Сохранено"}
          </span>
        </span>

        {game.description && (
          <div
            contentEditable={editable}
            suppressContentEditableWarning={true}
            className={clsx(
              "text-md text-justify",
              "text-fg4 pt-2 outline-none",
              !editable && "cursor-default"
            )}
            {...register("description", { value: game.description })}
            onInput={(e) => {
              setValue("description", e.currentTarget.innerText, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            {game.description}
          </div>
        )}
      </span>
      <div
        className={clsx(
          "w-full flex justify-between pt-4",
          !editable && "cursor-default"
        )}
      >
        {(
          [
            [
              { name: "Система", key: "system" },
              { name: "Процессор", key: "processor" },
              { name: "Оперативная память", key: "memory" },
              { name: "Видеокарта", key: "graphics" },
              { name: "Место на диске", key: "storage" },
            ],
            [
              { name: "Версия игры", key: "version" },
              {
                name: "Дата обновления раздачи",
                key: "update_date",
                value: game.update_date.toLocaleDateString("ru-ru"),
              },
              { name: "Язык", key: "language" },
              { name: "Разработчик", key: "developer" },
              {
                name: "Год выхода",
                key: "release_date",
                value: game.release_date.toLocaleDateString("en-us", {
                  year: "numeric",
                }),
              },
              { name: "Объём загрузки", key: "download_size" },
            ],
          ] as { name: string; key: keyof GameCreateType; value?: string }[][]
        ).map((section, i) => (
          <ul key={i} className="w-[48%] bg-bg1 rounded-lg py-1 px-4">
            {section.map((req) => (
              <li key={req.name} className="font-bold text-sm lp:text-md py-1">
                {req.name + ": "}
                <input
                  readOnly={!editable}
                  className={clsx(
                    "font-normal outline-none bg-bg1",
                    req.value === undefined &&
                      (game[req.key] === undefined ||
                        game[req.key] === propertyUnknownText) &&
                      "text-fg4",
                    !editable && "cursor-default"
                  )}
                  {...register(req.key, {
                    value:
                      req.value ??
                      (game[req.key] as string) ??
                      propertyUnknownText,
                  })}
                  defaultValue={
                    req.value ??
                    (game[req.key] as string) ??
                    propertyUnknownText
                  }
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      e.target.value = propertyUnknownText;
                    }
                  }}
                ></input>
              </li>
            ))}
          </ul>
        ))}
      </div>
      {game.trailer && getYouTubeID(game.trailer) && (
        <iframe
          src={"https://youtube.com/embed/" + getYouTubeID(game.trailer)}
          className="w-full aspect-video rounded-lg mt-4"
          allowFullScreen
        />
      )}
      <div className="relative w-full flex items-center justify-around pt-4">
        <Link
          href={process.env.NEXT_PUBLIC_CONTENT_URL + "/" + game.torrent_file}
          className="p-4 bg-ac0 text-fg1 text-2xl rounded-lg"
        >
          Скачать {game.title}
        </Link>
      </div>
      <div className="w-full flex justify-end">
        <Link
          className="text-right text-sm relative top-4 lp:-top-4"
          href="/how_to_download"
        >
          Как скачать игру
          <br /> с помощью .torrent файла?
        </Link>
      </div>
      <input type="submit" className="hidden" />
    </form>
  );
};
