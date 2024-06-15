import { FilesService } from "@/entities/files";
import { ItemCreateType, ItemType } from "@/entities/item";
import { Img } from "@/shared/ui";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormSetValue } from "react-hook-form";

export const ItemCover = ({
  cover,
  editable,
  setFormValue: setValue,
}: {
  cover: string | null | undefined;
  editable: boolean;
  setFormValue: UseFormSetValue<ItemType | ItemCreateType>;
}) => {
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
  } = useDropzone({
    onDrop: onCoverDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <>
      {(cover || editable) && (
        <div className="lp:w-[60%] lp:px-4 lp:pl-0 pt-2 pb-4 float-left relative">
          {cover && (
            <Img
              src={cover}
              preview={false}
              className="transition-all rounded-lg w-full object-contain"
              width={1280}
              height={720}
            />
          )}
          {!cover && editable && (
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
    </>
  );
};
