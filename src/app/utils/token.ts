import { Response } from "express";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import ms, { StringValue } from "ms";
import { envVars } from "../config/env";
import { cookieUtils } from "./cookie";
import { jwtUtils } from "./jwt";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  const maxAge = ms(envVars.ACCESS_TOKEN_EXPIRES_IN as StringValue);
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge,
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  const maxAge = ms(envVars.REFRESH_TOKEN_EXPIRES_IN as StringValue);
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge,
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  const maxAge = ms(
    envVars.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN as StringValue,
  );
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge,
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
