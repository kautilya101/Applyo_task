import React from "react";

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export const GradientBackground = ({ children }: GradientBackgroundProps) => {
  return (
    <div className="relative w-full flex-1 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="relative w-full h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
};
