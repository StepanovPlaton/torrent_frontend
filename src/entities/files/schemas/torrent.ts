import { z } from "zod";

export const torrentNameSchema = z.string().min(5);
export type TorrentNameType = z.infer<typeof torrentNameSchema>;
