"use server";

import { IUser } from "@/types/index.types";
import { promises as fs } from "fs";
import path from "path";

const userFile = path.join(process.cwd(), "data", "users.json");

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const data = await fs.readFile(userFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    throw err;
  }
};

export const saveUser = async (user: IUser) => {
  const users = await getUsers();
  if (users.some((u) => u.email === user.email)) {
    throw new Error("User already exists");
  }
  users.push(user);
  await fs.writeFile(userFile, JSON.stringify(users, null, 2));
};

export const findUser = async (email: string): Promise<IUser | null> => {
  const users = await getUsers();
  return users.find((user) => user.email === email) || null;
};
