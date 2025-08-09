"use server";
import { saveUser, findUser } from "@/lib/users";
import bcrypt from "bcryptjs";
import { IUser } from "@/types/index.types";

export async function signUpAction(user: IUser) {
  const { email, password } = user;
  const existing = await findUser(email);
  if (existing) return { error: "User exists", status: 400, success: false };

  const hashed = await bcrypt.hash(password, 10);
  await saveUser({ id: crypto.randomUUID().slice(0,6), email, password: hashed });
  console.log("User created successfully:", email)
  return { success: true };
}
