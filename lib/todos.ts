"use server";

import { ITodoBoardItem } from "@/types/index.types";
import { promises as fs } from "fs"
import path from "path";

const todosFile = path.join(process.cwd(), "data", "todos.json");

export const getTodos = async () => {
  const data = await fs.readFile(todosFile, "utf-8");
  return JSON.parse(data);
}

export const saveTodos = async (todo: ITodoBoardItem) => {
  const todos = await getTodos();
  todos.push(todo);
  await fs.writeFile(todosFile, JSON.stringify(todos, null, 2));
}

export const updateTodos = async (todos: ITodoBoardItem[]) => {
  await fs.writeFile(todosFile, JSON.stringify(todos, null, 2));
}