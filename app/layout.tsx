import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { Navbar } from "@/components/Navbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GradientBackground } from "@/components/GradientBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo Task Board",
  description: "Manage and create tasks",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value
  const user = token ? await verifyJWT(token) : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <TooltipProvider delayDuration={300}>
          <Navbar user={user as {email: string, id: string}} />
          <main className="flex flex-1 flex-col">
            <GradientBackground>
              {children}
            </GradientBackground>
          </main>
          <Toaster position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  );
}
