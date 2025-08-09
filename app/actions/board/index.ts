"use server";

import { getTodos, saveTodos, updateTodos } from "@/lib/todos";
import { ITodoBoardItem } from "@/types/index.types";

export const getTodoBoardItems = async (): Promise<ITodoBoardItem[]> => {
  try{
    const todoBoardItems = await getTodos();
    return todoBoardItems;
  }
  catch(e){
    console.log("Error fetching todo board items:", e);
    return [];
  }
}

export const createTodoBoardItem = async (title: string, userId: string) => {
  try {
    const boardId = crypto.randomUUID()
    const todo: ITodoBoardItem = {
      boardId,
      title,
      userId,
      todos: [],
      createdAt: new Date().toISOString().split("T")[0]
    }
    console.log("New Todo Board Created with name:", todo);
    await saveTodos(todo);
    return {success: true, todo};
  } catch (error) {
    console.error("Error saving todo board item:", error);
    return {success: false, error: "Failed to create todo board item"};
  }
}

export const updateTodoBoardItem = async (boardId: string, title: string, userId: string): Promise<ITodoBoardItem[]> => {
  try{
    const todos = await getTodos();
    const updatedTodos = todos.map((todo: ITodoBoardItem) => (todo.boardId == boardId && todo.userId == userId) ? {...todo, title} : todo);
    console.log("Todos after deletion:", updatedTodos);
    await updateTodos(updatedTodos);
    return updatedTodos;
  }
  catch(e){
    console.log('Error updating Todo Board Item:', e);
    return [];
  }
}

/**
 * boardId to identify the board
 * userId of the user who deleted the board
 * 
 * **/

export const deleteTodoBoardItem = async (boardId: string, userId: string): Promise<ITodoBoardItem[]> => {
  try{
    const todos = await getTodos();
    const todosAfterDeletion = todos.filter((todo: ITodoBoardItem) => !(todo.boardId === boardId && todo.userId === userId))
    await updateTodos(todosAfterDeletion);
    return todosAfterDeletion;
  }
  catch(e){
    console.log('Error deleting Todo Board Item:', e);
    return [];
  }
}