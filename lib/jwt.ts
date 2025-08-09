/* eslint-disable no-console */

import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.SECRET_JWT_KEY || "");

export async function signJwt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyJWT(token: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (e) {
    console.error("JWT verification failed:", e);
    return null;
  }
}
