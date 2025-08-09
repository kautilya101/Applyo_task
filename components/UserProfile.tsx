"use client"

import { Loader2, LogOut, User } from "lucide-react";
import React, { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export const UserProfile = () => {
  
  const router = useRouter();
	const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
		setLoading(true)
    await logout();
		setLoading(false);
    router.push("/sign-in"); 
  };


  return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="rounded-full bg-gray-200 p-2 flex items-center cursor-pointer hover:bg-gray-100 transistion-colors duration-300 ">
					<User className="w-4 h-4 text-zinc-500" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
					{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />  :<LogOut className="mr-2 h-4 w-4" />}
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
