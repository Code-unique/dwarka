"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/signup", form);
      if (res.status === 200) {
        toast.success("Registered successfully! Logging you in...");
        const result = await signIn("credentials", {
          redirect: true,
          email: form.email,
          password: form.password,
          callbackUrl: "/",
        });
        if (result?.error) toast.error(result.error);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 drop-shadow-sm">
          Welcome to DWARKA
        </h1>
        <p className="mt-3 text-lg text-green-900 opacity-80">
          Sign up & unlock timeless Nepali elegance
        </p>
      </motion.div>

      {/* Form Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-lg border border-green-100"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-emerald-800">
          Create an Account
        </h2>

        {["name", "email", "password", "address", "phone"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={(form as any)[field]}
            onChange={handleChange}
            required
            className="w-full p-3 mb-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400"
          />
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 via-emerald-500 to-lime-500 text-white font-medium py-3 rounded-lg shadow-lg transition hover:brightness-110 hover:shadow-xl animate-pulse"
        >
          Register
        </button>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 hover:bg-gray-100 transition"
        >
          <FcGoogle size={22} />
          <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
        </button>
      </motion.form>

      {/* Footer text */}
      <p className="mt-6 text-sm text-gray-500 text-center">
        Already have an account?{" "}
        <a href="/login" className="text-green-600 hover:underline">
          Login here
        </a>
      </p>
    </div>
  );
}
