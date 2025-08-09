"use server";

import { getTodos, updateTodos } from "@/lib/todos";
import { ITodoBoardItem, ITodoItem } from "@/types/index.types";


export const createChildTodo = async (
  boardId: string,
  newTodo: Partial<ITodoItem>
) => {
  try {
    const boards = await getTodos();
    const boardIndex = boards.findIndex(
      (b: ITodoBoardItem) => b.boardId === boardId
    );
    if (boardIndex === -1) return [];

    const todoWithMeta: ITodoItem = {
      id: crypto.randomUUID().slice(0, 6),
      createdAt: new Date().toISOString().split("T")[0],
      title: newTodo.title ?? "",
      description: newTodo.description ?? "",
      status: newTodo.status ?? "pending",
      priority: newTodo.priority ?? "low",
      dueDate: newTodo.dueDate ?? "",
      boardId
    };

    boards[boardIndex].todos.push(todoWithMeta);
    await updateTodos(boards);

    const updatedTodos = boards[boardIndex].todos;
    console.log("updatedTodos", updatedTodos);

    return { success: true, todos: [...updatedTodos] };
  } catch (err) {
    console.error("Error creating child todo:", err);
    return { success: false, error: "Failed to create todo" };
  }
};



export const updateChildTodo = async (
  boardId: string,
  // userId: string,
  updatedTodo: ITodoItem
) => {
  try {
    const boards = await getTodos();
    const boardIndex = boards.findIndex(
      (b: ITodoBoardItem) => b.boardId === boardId
    );
    if (boardIndex === -1) return [];

    boards[boardIndex].todos = boards[boardIndex].todos.map((t: ITodoItem) =>
      t.id === updatedTodo.id ? {...t,...updatedTodo} : t
    );
    await updateTodos(boards);
    const updatedTodos = boards[boardIndex].todos;
    return { success: true, todos: updatedTodos };
  } catch (err) {
    console.error("Error updating child todo:", err);
    return { success: false, error: 'Failed to update todo'};
  }
};


export const deleteChildTodo = async (
  boardId: string,
  // userId: string,
  todoId: string
) => {
  try {
    const boards = await getTodos();
    const boardIndex = boards.findIndex(
      (b: ITodoBoardItem) => b.boardId === boardId 
    );
    if (boardIndex === -1) return [];

    boards[boardIndex].todos = boards[boardIndex].todos.filter(
      (t: ITodoItem) => t.id !== todoId
    );

    await updateTodos(boards);
    const updatedTodos = boards[boardIndex].todos;
    return { success: true, todos: updatedTodos}
  } catch (err) {
    console.error("Error deleting child todo:", err);
    return { success: false, error: 'Failed to delete todo'};
  }
};

export const getChildTodos = async (
  boardId: string,
) => {
  try {
    const boards = await getTodos();
    const board = boards.find(
      (b: ITodoBoardItem) => b.boardId === boardId
    );
    const todos = board ? board.todos : [];
    return { success: true, todos, board}
  } catch (err) {
    console.error("Error getting child todos:", err);
    return { success: false, error: "Failed to fetch todos"};
  }
};
