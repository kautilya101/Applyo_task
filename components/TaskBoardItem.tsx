"use client";
import { ITodoBoardItem, ITodoItem } from "@/types/index.types";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  MoreVertical,
  User
} from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from "./ui/menubar";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // Assuming you have an input in shadcn/ui
import { useState } from "react";
import { formatDate, getDaysUntilDue } from "@/lib/utils";

interface IBoardCardProps {
  board: ITodoBoardItem;
  isAccessible: boolean;
  onDelete?: (boardId: string) => void;
  onUpdate?: (boardId: string, title: string) => void;
  onboardClick?: (boardId: string) => void;
}

const BoardCard = ({ board, isAccessible, onDelete, onUpdate, onboardClick }: IBoardCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(board.title);

  const getCompletedCount = () => {
    return board.todos.filter((todo: ITodoItem) => todo.status === "completed").length;
  };

  const getPendingCount = () => {
    return board.todos.filter((todo: ITodoItem) => todo.status === "pending").length;
  };

  const getUpcomingTasks = () => {
    return board.todos
      .filter((todo: ITodoItem) => todo.status === "pending")
      .sort(
        (a, b) =>
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      )
      .slice(0, 2);
  };

  const handleDelete = (boardId: string) => {
    onDelete?.(boardId);
  };

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== board.title) {
      onUpdate?.(board.boardId, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleBoardClick = (boardId: string) => {
    onboardClick?.(boardId)
  }

  if (!isAccessible) {
    return (
      <div className="bg-gray-100 border-2 border-gray-200 rounded-xl p-6 relative opacity-60">
        <div className="absolute inset-0 bg-gray-50 bg-opacity-80 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <Lock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500 font-medium">Not Accessible</p>
            <p className="text-gray-400 text-sm">You don&apos;t have permission to view this board</p>
          </div>
        </div>
        <div className="blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{board.title}</h3>
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 group">
      <div className="flex items-center justify-between mb-4 cursor-pointer">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="h-8 text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors" onClick={() => handleBoardClick(board.boardId)}>
            {board.title}
          </h3>
        )}

        {!isEditing && (
          <Menubar className="outline-none border-none cursor-pointer">
            <MenubarMenu>
              <MenubarTrigger >
                <MoreVertical className="h-5 w-5 text-gray-500 cursor-pointer" />
              </MenubarTrigger>
              <MenubarContent side="left">
                <MenubarItem onClick={() => setIsEditing(true)}>Rename</MenubarItem>
                <MenubarItem onClick={() => handleDelete(board.boardId)}>Delete</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Created {formatDate(board.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>You</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span className="text-green-700 font-medium">{getCompletedCount()}</span>
          </div>
          <p className="text-xs text-green-600">Completed</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Circle className="h-4 w-4 text-orange-600" />
            <span className="text-orange-700 font-medium">{getPendingCount()}</span>
          </div>
          <p className="text-xs text-orange-600">Pending</p>
        </div>
      </div>

      {getUpcomingTasks().length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Tasks</h4>
          {getUpcomingTasks().map((todo) => {
            const daysUntil = getDaysUntilDue(todo.dueDate);
            const isOverdue = daysUntil < 0;
            const isDueToday = daysUntil === 0;

            return (
              <div
                key={todo.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{todo.title}</p>
                  {todo.description && (
                    <p className="text-xs text-gray-500 truncate">{todo.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span
                    className={`text-xs font-medium ${
                      isOverdue
                        ? "text-red-600"
                        : isDueToday
                        ? "text-orange-600"
                        : "text-gray-600"
                    }`}
                  >
                    {isOverdue
                      ? `${Math.abs(daysUntil)}d overdue`
                      : isDueToday
                      ? "Due today"
                      : `${daysUntil}d left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {board.todos.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <Circle className="h-8 w-8 text-gray-300" />
          <p className="text-gray-500 text-sm">No tasks yet</p>
          <p className="text-gray-400 text-xs">Add your first task</p>
        </div>
      )}
    </div>
  );
};

export default BoardCard;
