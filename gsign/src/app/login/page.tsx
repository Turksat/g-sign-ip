"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/containers/form/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] max-h-[700px]">
                    {/* Left: Image Section */}
                    <div className="relative lg:w-1/2 h-64 lg:h-full">
                        <Image
                            src="/people_discussion.jpg"
                            alt="Welcome to our platform"
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white">
                            <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
                            <p className="text-lg opacity-90">
                                Access your account and continue your journey with us.
                            </p>
                        </div>
                    </div>

                    {/* Right: Form Section */}
                    <div className="lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
                        <div className="max-w-md mx-auto w-full">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Sign In
                                </h1>
                                <p className="text-gray-600">
                                    Enter your credentials to access your account
                                </p>
                            </div>

                            {/* Form */}
                            <LoginForm />

                            {/* Sign Up Link */}
                            <div className="mt-8 text-center">
                                <p className="text-gray-600">
                        Don&apos;t have an account? {" "}
                                    <Link 
                                        href="/register" 
                                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                    >
                                        Create one here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}