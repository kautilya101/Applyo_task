"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signUpAction } from "@/app/actions/sign-up";
import { IUser } from "@/types/index.types";
import { GradientBackground } from "@/components/GradientBackground";
import { toast } from "sonner";

export default function Register() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>();

  const handleFormSubmit = async (data: IUser) => {
    await signUpAction(data);
    router.push("/sign-in"); 
    toast.info("Registration successful! Please log in.");
  };

  return (
    <div className="w-full h-full flex items-center justify-center">

        <div className="bg-white/30 p-8 py-10 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold text-center text-zinc-800 mb-6">
            Create Account
          </h2>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium text-zinc-800">
                Email
              </label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                className="w-full border border-gray-300 text-zinc-800 px-4 py-1.5 rounded focus:outline-none"
                placeholder="you@example.com"
                />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-zinc-800">
                Password
              </label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                className="w-full border text-zinc-800 border-gray-300 px-4 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-600 text-white py-2 rounded hover:bg-zinc-500/90 transition-colors duration-300"
              >
              Register
            </button>
          </form>
        </div>
    </div>
  );
}
