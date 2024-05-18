import { HTTPService } from "@/shared/utils/http";
import {
	LoginForm,
	TokenData,
	tokenDataSchema,
	TokenResponse,
	tokenResponseSchema,
} from "./schemas/auth";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export abstract class UserService {
	public static async Login(loginForm: LoginForm) {
		const accessToken = await HTTPService.post<TokenResponse>(
			"/auth",
			new URLSearchParams(Object.entries(loginForm)),
			tokenResponseSchema,
			{
				"Content-Type": "application/x-www-form-urlencoded",
			}
		);
		if (accessToken) {
			const tokenData = this.DecodeToken(accessToken);
			if (tokenData) {
				Cookies.set("access-token", accessToken, {
					secure: true,
					expires: tokenData.expire,
				});
				return tokenData;
			}
		}
	}

	public static IdentifyYourself(): TokenData | undefined {
		const token = Cookies.get("access-token");
		if (token) {
			return this.DecodeToken(token);
		}
	}

	public static DecodeToken(token: string): TokenData | undefined {
		const tokenPayload = jwtDecode(token);
		const parseResult = tokenDataSchema.safeParse(tokenPayload);
		if (parseResult.success) {
			return parseResult.data;
		} else console.error("JWT payload broken - " + parseResult.error);
	}
}
