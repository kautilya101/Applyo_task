/* eslint-disable no-console */

import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.SECRET_JWT_KEY ||
    "Xgg4blKv75VAEar5gw9qAD2En1ynmBCLKs2Ppu2J8CMdh2f6HqBOcu28mkN+kJ/FsviBKk2uLr7nwgYIJXYe3g=="
);

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
