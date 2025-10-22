"use client";

import { useCountries } from "@/hooks/useCountries";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

type UserRequestDTO = {
  phoneNumberCountryCodeId: number;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type FormValues = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

const RegistrationForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const { countries, loading: countriesLoading } = useCountries();

  const registerMutation = useMutation({
    mutationFn: async (userData: UserRequestDTO) => {
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
          }/api/users/create`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          }
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Unknown error", code: "9999" }));

          // Check for specific error codes
          if (errorData.code === "1101") {
            throw new Error(
              "This email address is already registered. Please use a different email or try logging in."
            );
          }

          throw new Error(
            errorData.message || `HTTP ${response.status}: Registration failed`
          );
        }

        const result = await response.json();

        // Also check success response for error codes
        if (result.code === "1101") {
          throw new Error(
            "This email address is already registered. Please use a different email or try logging in."
          );
        }

        return result;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Network error - please check your connection");
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    // Country code'u country ID'ye çevir
    const selectedCountry = countries.find(
      (country) => country.countryCode === data.countryCode
    );
    if (!selectedCountry) {
      alert("Please select a valid country code");
      return;
    }

    const userData: UserRequestDTO = {
      phoneNumberCountryCodeId: selectedCountry.countryId,
      password: data.password,
      firstName: data.firstName,
      middleName: data.middleName || undefined,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
    };

    registerMutation.mutate(userData, {
      onSuccess: () => {
        alert("Registration successful! Please login with your credentials.");
        router.push("/login");
      },
      onError: (error: Error) => {
        alert("Registration failed: " + error?.message);
      },
    });
  };

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-5 py-2 px-1"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">Fill in your information to get started</p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Personal Information
        </h3>

        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              * First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Middle Name */}
          <div>
            <label
              htmlFor="middleName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Middle Name
            </label>
            <input
              id="middleName"
              type="text"
              {...register("middleName")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your middle name (optional)"
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              * Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName", { required: "Last name is required" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Contact Information
        </h3>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            * Email Address
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
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            * Phone Number
          </label>
          <div className="flex gap-3">
            <select
              {...register("countryCode", {
                required: "Country code is required",
              })}
              className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={countriesLoading}
            >
              <option value="">Select</option>
              {countries.length > 0
                ? countries.map((country) => (
                    <option key={country.countryId} value={country.countryCode}>
                      {country.countryName} ({country.countryCode})
                    </option>
                  ))
                : []}
            </select>
            <input
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Only numbers allowed",
                },
              })}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your phone number"
            />
          </div>
          {(errors.countryCode || errors.phoneNumber) && (
            <p className="text-sm text-red-500 mt-1">
              {errors.countryCode?.message || errors.phoneNumber?.message}
            </p>
          )}
        </div>
      </div>

      {/* Password Creation */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          Password Creation
        </h3>

        {/* Password Rules */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-medium mb-2">
            Password Requirements:
          </p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• At least 8 characters</li>
            <li>• At least one uppercase letter</li>
            <li>• At least one lowercase letter</li>
            <li>• At least one number</li>
            <li>• At least one symbol</li>
          </ul>
        </div>

        {/* Create Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            * Create Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters" },
              validate: {
                hasUpper: (v) => /[A-Z]/.test(v) || "Must contain uppercase",
                hasLower: (v) => /[a-z]/.test(v) || "Must contain lowercase",
                hasNumber: (v) => /\d/.test(v) || "Must contain number",
                hasSymbol: (v) =>
                  /[^A-Za-z0-9]/.test(v) || "Must contain symbol",
              },
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Create a strong password"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            * Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword", {
              required: "Confirm password",
              validate: (v) => v === password || "Passwords do not match",
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {registerMutation.isPending ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </div>

      {/* Sign In Link */}
      <div className="text-center pt-2">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegistrationForm;
