import { HTTPService } from "@/shared/utils/http";
import { coverNameSchema } from "./schemas/cover";

export abstract class FilesService {
  public static async UploadCover(cover: File) {
    const formData = new FormData();
    formData.append("cover", cover);
    return await HTTPService.post(
      `/files/cover`,
      coverNameSchema,
      formData,
      {},
      false
    );
  }
}
