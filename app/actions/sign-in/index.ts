"use server";

import { findUser } from "@/lib/users";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import { IUser } from "@/types/index.types";
import { cookies } from "next/headers";

export async function signInAction(data: IUser) {
  const { email, password } = data;
  const user = await findUser(email);
  if (!user) {
    return { success: false, error: "User not found", status: 404 };
  }
  if (user && !(await bcrypt.compare(password, user.password))) {
    return { success: false, error: "Invalid credentials", status: 401 };
  }

  const token = await signJwt({ id: user.id, email: user.email });

  const res = { success: true, status: 201 };
  const cookiesStore = await cookies();
  cookiesStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() +   7 * 60 * 60 * 24 * 1000), // 7 day
  });

  return res;
}
