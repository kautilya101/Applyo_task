"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signInAction } from "@/app/actions/sign-in"; // Adjust path as needed
import { IUser } from "@/types/index.types";
import { GradientBackground } from "@/components/GradientBackground";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Login() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<IUser>();

	const handleLogin = async (data: IUser) => {
		const response = await signInAction(data);
		if (response.success) {
			router.push("/board"); 
		} else {
			toast.error("Invalid email or password");
		}
	};

	return (
		<main className="w-full h-full flex flex-1 justify-center items-center">
				<div className="bg-white/30 p-8 py-10 rounded shadow-md w-full max-w-sm">
					<h2 className="text-2xl font-bold text-center mb-6 text-zinc-800">
						Login to Your Account
					</h2>
					<form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
						<div>
							<label className="block mb-1 font-medium text-zinc-800">Email</label>
							<input
								{...register("email", { required: "Email is required" })}
								type="email"
								placeholder="you@example.com"
								className="w-full text-zinc-800 border border-gray-300 px-4 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-zinc-500"
							/>
							{errors.email && (
								<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
							)}
						</div>

						<div className="relative">
							<label className="block mb-1 font-medium text-zinc-800">Password</label>
							<input
								{...register("password", { required: "Password is required" })}
								type={showPassword ? "text" : "password"}
								placeholder="********"
								className="w-full text-zinc-800 border border-gray-300 px-4 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-zinc-500"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute right-3 top-9 text-zinc-600 hover:text-zinc-800 focus:outline-none"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
							{errors.password && (
								<p className="text-red-500 text-sm mt-1">
									{errors.password.message}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-zinc-600 text-white py-2 rounded hover:bg-zinc-600/90 transition-colors duration-300 disabled:opacity-50"
						>
							{isSubmitting ? "Logging in..." : "Login"}
						</button>
					</form>
					<p className="mt-4 text-center text-sm">
						Don&apos;t have an acconut{" "}
						<Link href="/sign-up" className="text-blue-600 hover:underline">
							Sign Up
						</Link>
					</p>
				</div>
		</main>
	);
}
