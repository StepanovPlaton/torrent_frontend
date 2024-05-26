import { UserService } from "@/entities/user";
import { z } from "zod";

type Body = BodyInit | object;

export abstract class HTTPService {
	public static async request<Z extends z.ZodTypeAny>(
		method: "GET" | "POST" | "PUT" | "DELETE",
		url: string,
		schema: Z,
		body?: Body,
		headers?: HeadersInit,
		stringify?: boolean
	) {
		return await fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
			method: method,
			headers: {
				accept: "application/json",
				Authorization: "Bearer " + UserService.GetToken(),
				...headers,
			},
			body: stringify ? JSON.stringify(body) : (body as BodyInit),
			cache: "no-cache",
		})
			.then((r) => {
				if (r && r.ok) return r;
				else throw Error("Response ok = false");
			})
			.then((r) => r.json())
			.then((d) => schema.parse(d) as z.infer<Z>)
			.catch((e) => {
				console.error(e);
				return null;
			});
	}

	public static async get<Z extends z.ZodTypeAny>(url: string, schema: Z) {
		return await this.request<Z>("GET", url, schema);
	}

	public static async post<Z extends z.ZodTypeAny>(
		url: string,
		schema: Z,
		body?: Body,
		headers?: HeadersInit,
		stringify?: boolean
	) {
		return await this.request<Z>("POST", url, schema, body, headers, stringify);
	}

	public static async put<Z extends z.ZodType>(
		url: string,
		schema: Z,
		body?: Body,
		headers?: HeadersInit,
		stringify?: boolean
	) {
		return await this.request<Z>("PUT", url, schema, body, headers, stringify);
	}
}
