"use client";

import { createChildTodo, deleteChildTodo, getChildTodos, updateChildTodo } from "@/app/actions/boardItem";
import { ITodoBoardItem, ITodoItem } from "@/types/index.types";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { TodoDialog } from "./TodoDialog";
import { Calendar, AlertCircle } from "lucide-react";
import { TodoCard } from "./TodoCardItem";

interface TodoListProps {
	boardId: string;
	boardName?: string;
}

export const TodoList = ({ boardId, boardName }: TodoListProps) => {
	const [todos, setTodos] = useState<ITodoItem[]>([]);
	const [board, setBoard] = useState<ITodoBoardItem>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTodos = async () => {
		try {
			setLoading(true);
			setError(null);
			const response = await getChildTodos(boardId);
			setTodos(response.success ? response.todos : []);
      setBoard(response.board);
		} catch (err) {
			console.error("Error fetching todos:", err);
			setError("Failed to load todos");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteTodo = async (todoId: string) => {
		setTodos((prev) => prev.filter((t) => t.id !== todoId));
		try{
			await deleteChildTodo(boardId, todoId);
		}
		catch(e){
			 console.error(`Error while delete todo: ${e}`)
		}
	};

	const handleUpdateStatus = async (todoId: string, newStatus: string) => {
		setTodos(
			todos.map((t) =>
				t.id === todoId
					? { ...t, status: newStatus as "pending" | "in-progress" | "completed" }
					: t
			)
		);
		try{
			await updateChildTodo(boardId, { id: todoId, status: newStatus } as ITodoItem);
			console.log("Backend call to update todo status:", { todoId, newStatus });
		}
		catch(e){
			 console.error(`Error while updating status: ${e}`)
		}
	};

	const handleUpdatePriority = async (todoId: string, newPriority: string) => {
		setTodos(prev =>
			prev.map((t) =>
				t.id === todoId ? { ...t, priority: newPriority as "low" | "medium" | "high" } : t
			)
		);
		try{
			await updateChildTodo(boardId, { id: todoId, priority: newPriority } as ITodoItem);
			console.log("Backend call to update todo priority:", { todoId, newPriority });
		}
		catch(e){
			 console.error(`Error while updating priority: ${e}`)
		}
	};

  const handleUpdateTitle = async (todoId: string, newTitle: string) => {
    setTodos(prev =>
			prev.map((t) =>
				t.id === todoId ? { ...t, title: newTitle } : t
			)
		);
		try{

			await updateChildTodo(boardId, { id: todoId, title: newTitle } as ITodoItem);
			console.log("Backend call to update todo priority:", { todoId, newTitle });
		}
		catch(e){
			 console.error(`Error while updating title: ${e}`)
		}
  }

  const handleCreateNewTodo = async (boardId: string, newTodo: Partial<ITodoItem>) => {
    try{
      const response = await createChildTodo(boardId, newTodo);
      if (!Array.isArray(response) && response.success && response.todos) {
				setTodos(response.todos);
	  	}
    }
    catch(e){
      console.error(`Error while creating new todo: ${e}`)
    }
  }

	useEffect(() => {
		fetchTodos();
	}, [boardId]);

	if (loading) {
		return (
			<div className="max-w-7xl mx-auto p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center space-y-2">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
						<p className="text-muted-foreground">Loading todos...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="max-w-7xl mx-auto p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center space-y-2">
						<AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
						<p className="text-red-600">{error}</p>
						<Button onClick={fetchTodos} variant="outline" size="sm">
							Try Again
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between border-b pb-4">
				<div className="space-y-1">
					<h1 className="text-3xl font-bold tracking-tight">
						{boardName || `${board?.title}`}
					</h1>
					<p className="text-muted-foreground">
						{todos.length} {todos.length === 1 ? "todo" : "todos"} found
					</p>
				</div>
				<TodoDialog boardId={boardId} onTodoCreate={handleCreateNewTodo} />
			</div>

			{todos.length === 0 ? (
				<div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
					<div className="text-center space-y-2">
						<Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
						<h3 className="text-lg font-semibold">No todos found</h3>
						<p className="text-muted-foreground max-w-sm">
							Get started by creating your first todo item for this board.
						</p>
					</div>
					<TodoDialog boardId={boardId} onTodoCreate={handleCreateNewTodo} />
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 gap-6">
					{todos.map((todo) => {
						return (
							<TodoCard
                key={todo.id}
                todo={todo}
                onDelete={handleDeleteTodo}
                onUpdatePriority={handleUpdatePriority}
                onUpdateStatus={handleUpdateStatus}
                onUpdateTitle={handleUpdateTitle}
              />
						);
					})}
				</div>
			)}
		</div>
	);
};

