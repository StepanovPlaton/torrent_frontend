import { UserService } from "@/entities/user";
import { z } from "zod";

export type RequestCacheOptions = {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type GetRequestOptions = RequestCacheOptions & {
  headers?: HeadersInit;
};

type RequestOptions = GetRequestOptions & {
  body?: BodyInit | object;
  stringify?: boolean;
};

export abstract class HTTPService {
  private static deepUndefinedToNull(o?: object): object | undefined {
    if (Array.isArray(o)) return o;
    if (o)
      return Object.fromEntries(
        Object.entries(o).map(([k, v]) => {
          if (v === undefined) return [k, null];
          if (typeof v === "object") return [k, this.deepUndefinedToNull(v)];
          return [k, v];
        })
      );
  }

  public static async request<Z extends z.ZodTypeAny>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    schema: Z,
    options?: RequestOptions
  ) {
    return await fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
      method: method,
      headers: {
        accept: "application/json",
        ...((options?.stringify ?? true) != true
          ? {}
          : { "Content-Type": "application/json" }),
        Authorization: "Bearer " + UserService.GetToken(),
        ...options?.headers,
      },
      body:
        (options?.stringify ?? true) != true
          ? (options?.body as BodyInit)
          : JSON.stringify(
              this.deepUndefinedToNull(options?.body as object | undefined)
            ),
      cache: options?.cache ?? options?.next ? undefined : "no-cache",
      next: options?.next ?? {},
    })
      .then((r) => {
        if (r && r.ok) return r;
        else throw Error("Response ok = false");
      })
      .then((r) => r.json())
      .then((d) => {
        const parsed = schema.safeParse(d);
        if (parsed.success) return parsed.data as z.infer<Z>;
        else throw new Error(parsed.error.message);
      })
      .catch((e) => {
        console.error(e);
        return null;
      });
  }

  public static async get<Z extends z.ZodTypeAny>(
    url: string,
    schema: Z,
    options?: GetRequestOptions
  ) {
    return await this.request<Z>("GET", url, schema, options);
  }

  public static async post<Z extends z.ZodTypeAny>(
    url: string,
    schema: Z,
    options?: RequestOptions
  ) {
    return await this.request<Z>("POST", url, schema, options);
  }

  public static async put<Z extends z.ZodType>(
    url: string,
    schema: Z,
    options?: RequestOptions
  ) {
    return await this.request<Z>("PUT", url, schema, options);
  }
}
