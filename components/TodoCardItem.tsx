"use client";

import { ITodoItem } from "@/types/index.types";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, MoreVertical, Edit, Trash2, AlertCircle } from "lucide-react";
import { getDaysUntilDue } from "@/lib/utils";

interface TodoCardProps {
	todo: ITodoItem;
	onDelete: (todoId: string) => void;
	onUpdateStatus: (todoId: string, newStatus: string) => void;
	onUpdatePriority: (todoId: string, newPriority: string) => void;
	onUpdateTitle?: (todoId: string, newTitle: string) => void;
}

export const TodoCard = ({
	todo,
	onDelete,
	onUpdateStatus,
	onUpdatePriority,
	onUpdateTitle,
}: TodoCardProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [todoTitle, setTodoTitle] = useState(todo.title);

	const daysUntil = getDaysUntilDue(todo.dueDate);
	const isOverdue = daysUntil < 0;
	const isDueToday = daysUntil === 0;
	const isDueSoon = daysUntil > 0 && daysUntil <= 3;

	const handleSaveTitle = () => {
		if (onUpdateTitle && todoTitle.trim() !== todo.title) {
			onUpdateTitle(todo.id, todoTitle.trim());
		}
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setTodoTitle(todo.title);
		setIsEditing(false);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSaveTitle();
		} else if (e.key === 'Escape') {
			handleCancelEdit();
		}
	};

	return (
		<Card
			className={`transition-all duration-200 hover:shadow-md ${
				isOverdue
					? "border-red-200 bg-red-50/50"
					: isDueToday
					? "border-orange-200 bg-orange-50/50"
					: isDueSoon
					? "border-yellow-200 bg-yellow-50/50"
					: ""
			}`}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<CardTitle className="text-lg font-semibold leading-tight line-clamp-2 flex-1 mr-2">
						{isEditing ? (
							<Input
								value={todoTitle}
								onChange={(e) => setTodoTitle(e.target.value)}
								onKeyDown={handleKeyPress}
								className="h-8 text-sm"
								autoFocus
								onBlur={handleSaveTitle}
							/>
						) : (
							todoTitle
						)}
					</CardTitle>
					
					{isEditing ? (
						<div className="flex items-center justify-center gap-2">
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 shrink-0"
								onClick={handleCancelEdit}
							>
								✕
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0 shrink-0"
								onClick={handleSaveTitle}
							>
								✓
							</Button>
						</div>
					) : (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 p-0 shrink-0"
								>
									<MoreVertical className="h-4 w-4" />
									<span className="sr-only">Open menu</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem
									onClick={() => {
										setTodoTitle(todo.title);
										setIsEditing(true);
									}}
									className="cursor-pointer"
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => onDelete(todo.id)}
									className="cursor-pointer text-red-600 focus:text-red-600"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardHeader>

			<CardContent className="space-y-4 pt-0">
				<p className={`text-sm leading-relaxed line-clamp-3 ${
						todo.description?.trim()
							? "text-muted-foreground"
							: "text-muted-foreground/60 italic"
					}`}
				>
					{todo.description?.trim() || "No description provided"}
				</p>

				<div className="flex flex-wrap gap-2">
					<Select
						value={todo.status}
						onValueChange={(value) => onUpdateStatus(todo.id, value)}
					>
						<SelectTrigger className="h-8 w-[130px] text-xs">
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="pending">Pending</SelectItem>
							<SelectItem value="in-progress">In Progress</SelectItem>
							<SelectItem value="completed">Completed</SelectItem>
						</SelectContent>
					</Select>

					<Select
						value={todo.priority}
						onValueChange={(value) => onUpdatePriority(todo.id, value)}
					>
						<SelectTrigger className="h-8 w-[130px] text-xs">
							<SelectValue placeholder="Select priority" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="low">Low</SelectItem>
							<SelectItem value="medium">Medium</SelectItem>
							<SelectItem value="high">High</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Due Date */}
				<div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
					<Clock className="h-4 w-4 text-muted-foreground shrink-0" />
					<span
						className={`text-sm font-medium ${
							isOverdue
								? "text-red-600"
								: isDueToday
								? "text-orange-600"
								: isDueSoon
								? "text-yellow-600"
								: "text-muted-foreground"
						}`}
					>
						{isOverdue
							? `${Math.abs(daysUntil)} day${
									Math.abs(daysUntil) !== 1 ? "s" : ""
							  } overdue`
							: isDueToday
							? "Due today"
							: `${daysUntil} day${daysUntil !== 1 ? "s" : ""} left`}
					</span>
				</div>

				{isOverdue && (
					<div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
						<AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
						<span className="text-xs text-red-600 font-medium">
							This todo is overdue
						</span>
					</div>
				)}
			</CardContent>
		</Card>
	);
};