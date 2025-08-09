"use client";
import React, { useState, useEffect } from "react";
import {
	Calendar,
	Plus,
} from "lucide-react";
import { ITodoBoardItem } from "@/types/index.types";
import BoardCard from "@/components/TaskBoardItem";
import { createTodoBoardItem, deleteTodoBoardItem, getTodoBoardItems, updateTodoBoardItem } from "../actions/board";
import { Button } from "@/components/ui/button";
import { CreateBoardDialog } from "@/components/CreateBoardDialog";
import { getLoggedInUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function BoardPage() {
	const [boards, setBoards] = useState<ITodoBoardItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [userId, setUserId] = useState<string>(""); 
 
	const handleCreateBoard = () => {
		setCreateBoardOpen(true);
		console.log("Create new board clicked");
	};

  const onSubmit = async(data: {title: string}) => {
    try{
      const response = await createTodoBoardItem(data.title, userId) 
      if(!response.success || !response.todo) {
        console.error("Failed to create board:", response.error);
        return;
      }
      setBoards(prev => [...prev, response.todo]);

    }catch(e){
      console.error("Error creating board:", e);
    }
  }

  const renameBoard = async(boardId: string, newTitle: string) => {
		try{
			const updatedBoardItems = await updateTodoBoardItem(boardId, newTitle, userId)
			setBoards(updatedBoardItems)
		}
		catch(err){
			console.log(`Error while updating the board: `, err);
		}
  }

  const deleteBoard = async(boardId: string) => {
    try{
      const newBoards = await deleteTodoBoardItem(boardId, userId);
      if(newBoards.length == 0){
        console.log(`Error deleting board with ID: ${boardId}`);
        return;
      }
      setBoards(newBoards);
      console.log(`Board with ID: ${boardId} deleted successfully`);
    }
    catch(err){
      console.log(`Errpr deleting Board with Id: ${boardId}`, err);
    }
  }

	const boardClick = (boardId: string) => {
		redirect(`/board/${boardId}`);
	}

	useEffect(() => {
		const fetchBoards = async () => {
			setLoading(true);
			try {
        const currentUser = await getLoggedInUser()
        if(!currentUser) {
          console.error("User not logged in or invalid user ID");
          return;
        }
        setUserId(currentUser.id || "");
				const boardItems = await getTodoBoardItems();
	
				setBoards(boardItems);
				console.log("Fetched Boards:", boardItems);
			} catch (e) {
				console.error("Error fetching boards:", e);
				return [];
			} finally {
				setLoading(false);
			}
		};

		fetchBoards();
	}, []);

	const accessibleBoards = boards.filter((board: ITodoBoardItem) => board.userId === userId);
	const inaccessibleBoards = boards.filter(
		(board: ITodoBoardItem) => board.userId !== userId
	);

	if (loading) {
		return (
			<div className="max-w-7xl h-full mx-auto p-6">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center space-y-2">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
						<p className="text-muted-foreground">Loading Boards</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<main className="h-full p-6 w-full">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Task Boards</h1>
						<Button
							className="bg-purple-500 hover:bg-purple-600 text-white"
							onClick={handleCreateBoard}
						>
							<Plus className="mr-2" />
							Create
						</Button>
					</div>
					<p className="text-gray-600">Manage your projects and tasks efficiently</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 4xl:grid-cols-4 gap-6">
					{accessibleBoards.map((board) => (
						<BoardCard key={board.boardId} board={board} isAccessible={true} onDelete={deleteBoard} onUpdate={renameBoard} onboardClick={boardClick}/>
					))}

					{inaccessibleBoards.map((board) => (
						<BoardCard key={board.boardId} board={board} isAccessible={false} />
					))}
				</div>

				{boards.length === 0 && (
					<div className="text-center py-6">
						<div className="bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
							<Calendar className="h-8 w-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-medium text-gray-900 mb-2">No boards yet</h3>
						<p className="text-gray-500 mb-4">
							Get started by creating your first task board
						</p>
						<button
							onClick={handleCreateBoard}
							className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
						>
							Create Your First Board
						</button>
					</div>
				)}
			</div>
			{createBoardOpen && (
				<CreateBoardDialog
					open={createBoardOpen}
					onClose={() => setCreateBoardOpen(false)}
          onSubmit={onSubmit}
				/>
			)}
		</main>
	);
}
