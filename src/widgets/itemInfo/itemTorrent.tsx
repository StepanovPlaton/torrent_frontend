import { FilesService } from "@/entities/files";
import { ItemCreateType, ItemType } from "@/entities/item";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";

export const ItemTorrent = ({
  torrent_file,
  editable,
}: {
  torrent_file: string;
  editable: boolean;
}) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ItemCreateType>();

  const watched_torrent_file = watch("torrent_file");
  const watched_title = watch("title");

  useEffect(() => {
    register("torrent_file", { value: torrent_file });
  }, [torrent_file, register]);

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

  const {
    getRootProps: getTorrentDropRootProps,
    getInputProps: getTorrentDropInputProps,
    isDragActive: isTorrentDragActive,
  } = useDropzone({
    onDrop: onTorrentDrop,
    accept: {
      "application/octet-stream": [".torrent"],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <>
      <div
        className="relative w-full flex items-center justify-around pt-4"
        {...(editable ? getTorrentDropRootProps() : {})}
      >
        <div className="flex flex-col items-center">
          <Link
            href={
              process.env.NEXT_PUBLIC_CONTENT_URL + "/" + watched_torrent_file
            }
            className={clsx(
              "p-4 bg-ac0 text-fg1 text-2xl rounded-lg",
              !watched_torrent_file && "bg-bg1 text-fg4"
            )}
          >
            Скачать {watched_title}
          </Link>
          {editable && (
            <>
              <input {...getTorrentDropInputProps()} />
              <span className="flex flex-col items-center w-full p-1 text-fg4 text-xs lp:text-sm cursor-pointer">
                <span className="w-full text-center text-err">
                  {errors.torrent_file?.message}
                </span>
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
          Как скачать с помощью
          <br /> .torrent файла?
        </Link>
      </div>
    </>
  );
};
