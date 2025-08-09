"use server"
import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";

export async function getLoggedInUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const decoded = await verifyJWT(token);
  return decoded as { id: string; email: string } | null;
}

export async function logout() {
  const cookieStore = await cookies();

  // Remove the token cookie
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  return { success: true };
}