"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/app/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup, isLoading } = useAuthStore();
  const router = useRouter();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleClose = () => {
    resetLogin();
    resetSignup();
    onClose();
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.username, data.email, data.password);
      handleClose();
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Signup failed");
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetLogin();
    resetSignup();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Login" : "Create Account"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              disabled={isLoading}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? "bg-white text-red-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {isLogin ? (
            <form
              onSubmit={handleLoginSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...loginRegister("email")}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  {...loginRegister("password")}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                {loginErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {loginErrors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
              >
                {isLoading ? "Processing..." : "Login"}
              </button>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "http://localhost:5000/api/users/google";
                }}
                className="w-full mt-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all"
              >
              <img
  src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
  alt="Google"
  className="w-5 h-5 mr-2"
/>
                Continue with Google
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSignupSubmit(onSignupSubmit)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...signupRegister("username")}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                {signupErrors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {signupErrors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  {...signupRegister("email")}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                {signupErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {signupErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  {...signupRegister("password")}
                  placeholder="Create a password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                {signupErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {signupErrors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...signupRegister("confirmPassword")}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                {signupErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {signupErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
              >
                {isLoading ? "Processing..." : "Create Account"}
              </button>

              {/* Google Login Button */}
              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "http://localhost:5000/api/users/google";
                }}
                className="w-full mt-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all"
              >
          <img
  src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
  alt="Google"
  className="w-5 h-5 mr-2"
/>

                Continue with Google
              </button>
            </form>
          )}

          {/* Switch */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="text-red-600 hover:text-red-700 font-medium"
                disabled={isLoading}
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
