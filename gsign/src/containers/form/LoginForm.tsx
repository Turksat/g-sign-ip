"use client";

import { notifyLogin } from "@/libs/authEvents";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { API_BASE_URL } from "@/libs/constants";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Unknown error" }));
          throw new Error(
            errorData.message || `HTTP ${response.status}: Login failed`
          );
        }

        const result = await response.json();
        return result;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Network error - please check your connection");
      }
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        // Sadece JWT token'ı session'a kaydet (user bilgileri JWT içinde)
        if (response.data) {
          sessionStorage.setItem("authToken", response.data);

          // Auth state değişikliğini bildir
          notifyLogin();

          // Başarılı login sonrası ana sayfaya yönlendir
          router.push("/");
        } else {
          alert("Login successful but no token received");
        }
      },
      onError: (error: Error) => {
        alert("Login failed: " + error?.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email format",
            },
          })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Forgot Password */}
      <div className="flex justify-end">
        <Link
          href="/forgotpassword"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loginMutation.isPending ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner size="sm" color="white" className="mr-2" />
            Logging in...
          </div>
        ) : (
          "Log In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
