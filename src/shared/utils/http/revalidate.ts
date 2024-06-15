"use server";

import { revalidateTag } from "next/cache";

export const EraseCacheByTag = (tag: string) => {
  revalidateTag(tag);
};

export const EraseCacheByTags = (tags: string[]) => {
  tags.forEach((tag) => EraseCacheByTag(tag));
};
