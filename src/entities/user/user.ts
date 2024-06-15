import { HTTPService } from "@/shared/utils/http";
import { LoginFormType } from "./schemas/login";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import {
  TokenData,
  tokenDataSchema,
  tokenResponseSchema,
} from "./schemas/token";
import { RegistrationFormType } from "./schemas/registration";

export abstract class UserService {
  public static async Registration(registrationForm: RegistrationFormType) {
    const accessToken = await HTTPService.post(
      "/auth/registration",
      tokenResponseSchema,
      { body: registrationForm }
    );
    return this.ProcessToken(accessToken);
  }

  public static async Login(loginForm: LoginFormType) {
    const accessToken = await HTTPService.post("/auth", tokenResponseSchema, {
      body: new URLSearchParams(Object.entries(loginForm)),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      stringify: false,
    });
    return this.ProcessToken(accessToken);
  }

  private static ProcessToken(token: string | null) {
    if (token) {
      const tokenData = this.DecodeToken(token);
      if (tokenData) {
        Cookies.set("access-token", token, {
          secure: true,
          expires: tokenData.expire,
        });
        return tokenData;
      }
    }
    return null;
  }

  public static GetToken(): string | undefined {
    return Cookies.get("access-token");
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
