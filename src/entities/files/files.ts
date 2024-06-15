import { HTTPService } from "@/shared/utils/http";
import { coverNameSchema } from "./schemas/cover";
import { torrentNameSchema } from "./schemas/torrent";
import { fragmentNameSchema } from "./schemas/fragment";

export abstract class FilesService {
  public static async UploadCover(cover: File) {
    const formData = new FormData();
    formData.append("cover", cover);
    return await HTTPService.post(`/files/cover`, coverNameSchema, {
      body: formData,
      stringify: false,
    });
  }

  public static async UploadTorrent(torrent: File) {
    const formData = new FormData();
    formData.append("torrent", torrent);
    return await HTTPService.post(`/files/torrent`, torrentNameSchema, {
      body: formData,
      stringify: false,
    });
  }

  public static async UploadFragment(fragment: File) {
    const formData = new FormData();
    formData.append("fragment", fragment);
    return await HTTPService.post(`/files/audio`, fragmentNameSchema, {
      body: formData,
      stringify: false,
    });
  }
}
