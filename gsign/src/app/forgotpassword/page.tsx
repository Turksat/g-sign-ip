// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

interface EmailFormData {
  email: string;
}

interface CodeFormData {
  code: string;
}

const ForgotPasswordPage = () => {
  const [step, setStep] = useState<"email" | "code">("email");

  // Email form
  const emailForm = useForm<EmailFormData>({
    defaultValues: {
      email: "",
    },
  });

  // Code form
  const codeForm = useForm<CodeFormData>({
    defaultValues: {
      code: "",
    },
  });

  const handleEmailSubmit = () => {
    // TODO: send code API
    setStep("code");
  };

  const handleCodeSubmit = () => {
    // TODO: verify code API
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] max-h-[800px]">
          {/* Left: Info Section */}
          <div className="relative lg:w-2/5 h-64 lg:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl font-bold mb-4">
                  Forgot Your Password?
                </h2>
                <p className="text-xl opacity-90">
                  We’ve sent a verification code. Enter it to continue securely.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:w-3/5 flex flex-col p-0 justify-center items-center text-center">
            {/* Açık gri arka plan (görsele uygun) */}
            <div className="flex flex-col justify-center items-center bg-gray-100 h-full w-full px-6 sm:px-10 py-8 sm:py-10">
              {step === "email" ? (
                // İstersen e-posta adımı da dursun
                <div className="max-w-4xl mx-auto flex flex-col justify-center items-center">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Reset Your Password
                  </h1>
                  <p className="mt-4 text-gray-700">
                    Enter your email and we’ll send you a verification code.
                  </p>

                  <form
                    onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                    className="mt-6 space-y-5 w-full max-w-2xl"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-800"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...emailForm.register("email", {
                          required: "Email address is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Please enter a valid email address",
                          },
                        })}
                        className={`mt-2 block w-full rounded-md border bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 text-lg ${
                          emailForm.formState.errors.email
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        placeholder="Enter your email address"
                      />
                      {emailForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {emailForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-28 rounded-md bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    >
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                // ======= Görseldeki "Verification Code" ekranı =======
                <div className="max-w-4xl mx-auto">
                  {/* Yeşil uyarı kutusu */}
                  <div className="rounded-md border border-green-400 bg-green-50 text-green-800 p-4 flex gap-3 items-start">
                    <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-green-500 text-white">
                      {/* check icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <p className="text-sm sm:text-base leading-6">
                      <span className="font-medium">
                        A password verification code has been sent to your email
                        address.
                      </span>
                      <br />
                      Please check your inbox and follow the instructions.
                    </p>
                  </div>

                  {/* Verification Code formu */}
                  <form
                    onSubmit={codeForm.handleSubmit(handleCodeSubmit)}
                    className="mt-10 space-y-5 w-full max-w-2xl mx-auto"
                  >
                    <div>
                      <label
                        htmlFor="verificationCode"
                        className="block text-sm font-medium text-gray-800"
                      >
                        Verification Code
                      </label>
                      <input
                        id="verificationCode"
                        type="text"
                        inputMode="numeric"
                        {...codeForm.register("code", {
                          required: "Verification code is required",
                          minLength: {
                            value: 4,
                            message:
                              "Verification code must be at least 4 characters",
                          },
                          maxLength: {
                            value: 8,
                            message:
                              "Verification code must not exceed 8 characters",
                          },
                          pattern: {
                            value: /^[0-9]+$/,
                            message:
                              "Verification code must contain only numbers",
                          },
                        })}
                        className={`mt-2 block w-full rounded-md border bg-white px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 text-lg text-center ${
                          codeForm.formState.errors.code
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        placeholder="Enter verification code"
                      />
                      {codeForm.formState.errors.code && (
                        <p className="mt-1 text-sm text-red-600 text-center">
                          {codeForm.formState.errors.code.message}
                        </p>
                      )}
                    </div>

                    {/* Turuncu buton (görseldeki gibi) */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="mx-auto block w-32 rounded-md bg-amber-500 px-4 py-2 text-white font-semibold shadow hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                      >
                        Control
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
            {/* /Açık gri arka plan */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
