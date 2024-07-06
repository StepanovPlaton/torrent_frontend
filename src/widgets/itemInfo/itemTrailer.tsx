import { ItemCreateType } from "@/entities/item";
import { getYouTubeID } from "@/shared/utils/getYoutubeId";
import { useFormContext } from "react-hook-form";

export const ItemTrailer = ({
  default_trailer,
  editable,
}: {
  default_trailer: string | undefined | null;
  editable: boolean;
}) => {
  const { register, setValue, watch } = useFormContext<ItemCreateType>();

  const watched_trailer = watch("trailer");

  return (
    <>
      {(watched_trailer || editable) && (
        <div className="w-ful aspect-video">
          {watched_trailer && getYouTubeID(watched_trailer) && (
            <iframe
              src={"https://youtube.com/embed/" + getYouTubeID(watched_trailer)}
              className="w-full aspect-video rounded-lg mt-4"
              allowFullScreen
            />
          )}
          {!watched_trailer && editable && (
            <div className="mt-4 w-full aspect-video border-dashed border-2 border-bg1 rounded-lg"></div>
          )}
        </div>
      )}

      {editable && (
        <div className="w-full flex justify-end pt-1">
          <input
            className="outline-none w-full lp:w-2/3 text-xs lp:text-base bg-bg1"
            {...register("trailer", {
              value: default_trailer,
              onChange: (e) => {
                setValue("trailer", e.target.value);
              },
            })}
            defaultValue={default_trailer ?? ""}
          />
        </div>
      )}
    </>
  );
};
