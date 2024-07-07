import { FilesService } from "@/entities/files";
import { ItemCreateType } from "@/entities/item";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";

export const ItemFragment = ({
  fragment,
  editable,
}: {
  fragment: string | undefined | null;
  editable: boolean;
}) => {
  const { register, setValue, watch } = useFormContext<ItemCreateType>();

  const watched_fragment = watch("fragment");

  useEffect(() => {
    register("fragment", { value: fragment });
  }, [fragment, register]);

  const onFragmentDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const fragmentName = await FilesService.UploadFragment(file);
        if (fragmentName) {
          setValue("fragment", fragmentName, {
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
    getRootProps: getFragmentDropRootProps,
    getInputProps: getFragmentDropInputProps,
    isDragActive: isFragmentDragActive,
  } = useDropzone({
    onDrop: onFragmentDrop,
    accept: {
      "audio/mpeg": [],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <div
      className="relative w-full flex items-center justify-around pt-4"
      {...(editable ? getFragmentDropRootProps() : {})}
    >
      <div className="flex flex-col items-center w-[80%] h-14 lp:h-20">
        <audio
          controls
          controlsList="nodownload"
          typeof="audio/mpeg"
          src={
            "" +
            process.env.NEXT_PUBLIC_BASE_URL +
            process.env.NEXT_PUBLIC_API_PATTERN +
            process.env.NEXT_PUBLIC_FRAGMENT_URL +
            "/" +
            (watched_fragment ?? "")
          }
          className={clsx(
            !watched_fragment && "pointer-events-none",
            "w-full h-full"
          )}
        />
        {editable && (
          <>
            <input {...getFragmentDropInputProps()} />
            <span className="flex flex-col items-center w-full p-1 text-fg4 text-xs lp:text-sm cursor-pointer">
              {isFragmentDragActive ? (
                <span className="w-full text-center">Изменить фрагмент...</span>
              ) : (
                <span className="w-full text-center">
                  Для редактирования нажмите или перетащите новый фрагмент
                  поверх старого
                </span>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
};
