import { CheckSquare } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { UserProfile } from './UserProfile';

interface NavbarProps {
  user: {email: string, id: string} | null
}

export const Navbar = ({user}: NavbarProps) => {
  
  return (
    <nav className="w-full bg-transparent top-0 shadow-sm border-b border-gray-200 py-4 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          <Link href={'/'}>
            <div className='flex items-center space-x-2'>
                <CheckSquare className="w-6 h-6 text-gray-700" />
                  <h1 
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 cursor-pointer"
                  >
                    TaskFlow
                  </h1>
            </div>
          </Link>

        { user ? 
        <>
        <Tooltip>
          <TooltipTrigger asChild>
            <UserProfile />
          </TooltipTrigger>
          <TooltipContent className='bg-zinc-600'>
              <p className="">{user.email}</p>
          </TooltipContent>
        </Tooltip>
        </> 
        
        : <>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-white/20 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </>}

      </div>
    </nav>
  );
};
