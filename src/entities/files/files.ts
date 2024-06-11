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

  public static async UploadTorrent(torrent: File) {
    const formData = new FormData();
    formData.append("torrent", torrent);
    return await HTTPService.post(
      `/files/torrent`,
      coverNameSchema,
      formData,
      {},
      false
    );
  }
}
