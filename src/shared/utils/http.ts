import { z } from "zod";

export abstract class HTTPService {
	public static async get<Z>(
		url: string,
		schema: z.ZodTypeAny
	): Promise<Z | null> {
		return await fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
			method: "GET",
			headers: {
				accept: "application/json",
			},
			cache: "no-cache",
		})
			.then((r) => {
				if (r && r.ok) return r;
				else throw Error("Response ok = false");
			})
			.then((r) => r.json())
			.then((d) => schema.parse(d))
			.catch((e) => {
				console.error(e);
				return null;
			});
	}

	public static async post<Z>(
		url: string,
		body: BodyInit,
		schema: z.ZodTypeAny,
		headers?: HeadersInit
	): Promise<Z | null> {
		return await fetch(process.env.NEXT_PUBLIC_BASE_URL + url, {
			method: "POST",
			headers: {
				accept: "application/json",
				...headers,
			},
			body: body,
			cache: "no-cache",
		})
			.then((r) => {
				if (r && r.ok) return r;
				else throw Error("Response ok = false");
			})
			.then((r) => r.json())
			.then((d) => schema.parse(d))
			.catch((e) => {
				console.error(e);
				return null;
			});
	}
}
