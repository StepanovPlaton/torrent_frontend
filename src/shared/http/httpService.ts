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
			.then((d) => {
				const parseResult = schema.safeParse(d);
				if (parseResult.success) {
					return parseResult.data as Z;
				} else {
					console.error(parseResult.error);
					return null;
				}
			})
			.catch((e) => {
				console.error(e);
				return null;
			});
	}
}
