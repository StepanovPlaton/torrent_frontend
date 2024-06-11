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
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Img } from "@/shared/ui";
import { useDropzone } from "react-dropzone";
import { FilesService } from "@/entities/files";
import { SpinnerIcon } from "@/shared/assets/icons";

const isExistingGame = (game: GameCreateType | GameType): game is GameType => {
  return (game as GameType).id !== undefined;
};

export const GameInfo = ({
  game: init_game,
}: {
  game: GameCreateType | GameType;
}) => {
  const [game, changeGame] = useState<GameCreateType | GameType>(init_game);

  const { data: me } = useSWR("user", () => UserService.IdentifyYourself());
  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    if (me) {
      if (isExistingGame(game)) setEditable(me.id === game.owner_id);
      else setEditable(true);
    }
  }, [me, game]);

  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<GameCreateType>({
    defaultValues: game,
    resolver: zodResolver(gameCreateSchema),
  });

  useEffect(() => {
    register("torrent_file", { value: game.torrent_file });
    register("cover", { value: game.cover });
  }, [game.cover, game.torrent_file, register]);

  const [savedTimeout, changeSavedTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const watchedData = watch();
  const [formData, changeFormData] = useState<GameCreateType | null>(null);
  useEffect(() => {
    console.log(watchedData);
    if (!Object.keys(dirtyFields).length) return;
    if (JSON.stringify(watchedData) === JSON.stringify(formData)) return;
    console.log(dirtyFields);
    changeFormData(watchedData);
    if (savedTimeout) clearTimeout(savedTimeout);
    changeSavedTimeout(
      setTimeout(() => {
        console.log("call", formRef.current);
        if (formRef.current) formRef.current.requestSubmit();
      }, 3000)
    );
  }, [watchedData]);

  const onSubmit = async (formData: GameCreateType) => {
    changeSavedTimeout(null);
    if (isExistingGame(game)) {
      const updatedGame = await GameService.ChangeGame(game.id, formData);
      if (updatedGame) {
        changeGame(updatedGame);
        reset({}, { keepValues: true });
      }
    } else {
      const addedGame = await GameService.AddGame(formData);
      if (addedGame) {
        changeGame(addedGame);
        reset({}, { keepValues: true });
      }
    }
  };

  const onCoverDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const coverName = await FilesService.UploadCover(file);
        if (coverName) {
          setValue("cover", coverName, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      };
      fileReader.readAsDataURL(file);
    },
    [setValue]
  );

  const {
    getRootProps: getCoverDropRootProps,
    getInputProps: getCoverDropInputProps,
    isDragActive: isCoverDragActive,
  } = useDropzone({ onDrop: onCoverDrop });

  const onTorrentDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const torrentName = await FilesService.UploadTorrent(file);
        if (torrentName) {
          setValue("torrent_file", torrentName, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      };
      fileReader.readAsDataURL(file);
    },
    [setValue]
  );

  useEffect(() => console.log(errors), [errors]);

  const {
    getRootProps: getTorrentDropRootProps,
    getInputProps: getTorrentDropInputProps,
    isDragActive: isTorrentDragActive,
  } = useDropzone({ onDrop: onTorrentDrop });

  const [trailer, setTrailer] = useState<string | undefined>(game.trailer);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-4 flex flex-col lp:block"
      ref={formRef}
    >
      {(watchedData.cover || editable) && (
        <div className="lp:w-[60%] lp:px-4 lp:pl-0 pt-2 pb-4 float-left relative">
          {watchedData.cover && (
            <Img
              src={watchedData.cover}
              preview={false}
              className="transition-all rounded-lg w-full object-contain"
              width={1280}
              height={720}
            />
          )}
          {!watchedData.cover && editable && (
            <div className="w-full aspect-video border-dashed border-2 border-bg1 rounded-lg"></div>
          )}

          {editable && (
            <div
              className="absolute h-full w-full mt-1 left-0 top-0 z-20 flex items-end"
              {...(editable ? getCoverDropRootProps() : {})}
            >
              <input {...getCoverDropInputProps()} />
              <span className="flex items-center ju w-full">
                {isCoverDragActive ? (
                  <p className="w-full text-sm pl-2">Изменить обложку...</p>
                ) : (
                  <>
                    <span className="hidden lp:flex text-sm w-full justify-around text-fg4">
                      Для редактирования нажмите или перетащите новую обложку
                      поверх старой
                    </span>
                    <span className="text-xs lp:hidden w-full flex justify-around text-fg4">
                      Для редактирования нажмите на обложку и выберите фото
                    </span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      )}
      <span>
        <span className="flex items-end justify-between relative pt-2">
          <span
            className={clsx(
              "text-fg4 text-2xl absolute -z-10 opacity-0",
              watchedData.title === "" && "opacity-100",
              "transition-opacity cursor-text"
            )}
          >
            Введите название
          </span>
          <h1
            className={clsx(
              "text-4xl outline-none max-w-[80%] cursor-text",
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
            }}
          >
            {game.title}
          </h1>

          {editable && (
            <span className="text-sm text-fg4 flex items-center cursor-default">
              {savedTimeout && Object.keys(errors).length === 0 && (
                <>
                  <SpinnerIcon className="mr-2" />
                  Редактируется
                </>
              )}
              {savedTimeout && Object.keys(errors).length > 0 && (
                <span className="text-err text-right">Некорректные данные</span>
              )}
              {!savedTimeout && "Сохранено"}
            </span>
          )}
        </span>
        <div className="text-err text-xs w-full h-2">
          {errors.title?.message}
        </div>
        {(game.description || editable) && (
          <span className="relative">
            <span
              className={clsx(
                "text-fg4 text-md absolute -z-10 opacity-0",
                (watchedData.description === "" ||
                  watchedData.description === undefined) &&
                  "opacity-100",
                "transition-opacity mt-2"
              )}
            >
              Введите описание
            </span>
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
          </span>
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
                value: isExistingGame(game)
                  ? game.update_date.toLocaleDateString("ru-ru")
                  : new Date().toLocaleDateString("ru-ru"),
                edit: false,
              },
              { name: "Язык", key: "language" },
              { name: "Разработчик", key: "developer" },
              {
                name: "Год выхода",
                key: "release_date",
              },
              { name: "Объём загрузки", key: "download_size" },
            ],
          ] as {
            name: string;
            key: keyof GameCreateType;
            value?: string;
            edit?: boolean;
          }[][]
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
                      value: req.value ?? (game[req.key] as string),
                    })}
                    contentEditable={editable && (req.edit ?? true)}
                    suppressContentEditableWarning={true}
                    onInput={(e) => {
                      setValue(req.key, e.currentTarget.innerText, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }}
                  >
                    {req.value ?? (game[req.key] as string)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
      {(trailer || editable) && (
        <div className="w-ful aspect-video">
          {trailer && getYouTubeID(trailer) && (
            <iframe
              src={"https://youtube.com/embed/" + getYouTubeID(trailer)}
              className="w-full aspect-video rounded-lg mt-4"
              allowFullScreen
            />
          )}
          {!trailer && editable && (
            <div className="mt-4 w-full aspect-video border-dashed border-2 border-bg1 rounded-lg"></div>
          )}
        </div>
      )}

      {editable && (
        <div className="w-full flex justify-end pt-1">
          <input
            className="outline-none w-full lp:w-2/3 text-xs lp:text-base bg-bg1"
            {...register("trailer", {
              value: game.trailer,
              onChange: (e) => {
                setTrailer(e.target.value);
              },
            })}
            defaultValue={game.trailer}
          />
        </div>
      )}
      <div
        className="relative w-full flex items-center justify-around pt-4"
        {...(editable ? getTorrentDropRootProps() : {})}
      >
        <div className="flex flex-col items-center">
          <Link
            href={
              process.env.NEXT_PUBLIC_CONTENT_URL +
              "/" +
              watchedData.torrent_file
            }
            className={clsx(
              "p-4 bg-ac0 text-fg1 text-2xl rounded-lg",
              !watchedData.torrent_file && "bg-bg1 text-fg4"
            )}
          >
            Скачать {watchedData.title}
          </Link>
          {editable && (
            <>
              <input {...getTorrentDropInputProps()} />
              <span className="flex flex-col items-center w-full p-1 text-fg4 text-xs lp:text-sm cursor-pointer">
                {errors.torrent_file && (
                  <span className="w-full text-center text-err">
                    {errors.torrent_file.message}
                  </span>
                )}
                {isTorrentDragActive ? (
                  <span className="w-full text-center">
                    Изменить .torrent файл...
                  </span>
                ) : (
                  <span className="w-full text-center">
                    Нажмите, чтобы изменить <br />
                    .torrent файл
                  </span>
                )}
              </span>
            </>
          )}
        </div>
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
