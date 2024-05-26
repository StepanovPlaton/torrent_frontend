import { z } from "zod";

export const coverNameSchema = z.string().min(5);
export type CoverNameType = z.infer<typeof coverNameSchema>;
