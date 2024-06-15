import { ItemCreateType, ItemType } from "@/entities/item";
import { getYouTubeID } from "@/shared/utils";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

export const ItemTrailer = ({
  trailer,
  default_trailer,
  editable,
  setFormValue: setValue,
  registerFormField: register,
}: {
  trailer: string | undefined;
  default_trailer: string | undefined;
  editable: boolean;
  setFormValue: UseFormSetValue<ItemType | ItemCreateType>;
  registerFormField: UseFormRegister<ItemType | ItemCreateType>;
}) => {
  return (
    <>
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
              value: default_trailer,
              onChange: (e) => {
                setValue("trailer", e.target.value);
              },
            })}
            defaultValue={default_trailer}
          />
        </div>
      )}
    </>
  );
};
