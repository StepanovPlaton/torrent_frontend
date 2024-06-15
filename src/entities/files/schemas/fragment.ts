import { z } from "zod";

export const fragmentNameSchema = z.string().min(5);
export type FragmentNameType = z.infer<typeof fragmentNameSchema>;
