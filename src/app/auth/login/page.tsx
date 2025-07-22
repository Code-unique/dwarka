'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      toast.success("Welcome back!");
      router.push('/');
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleGoogleLogin = async () => {
    await signIn('google');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3d2f] via-[#2d5e4a] to-[#1b3329] px-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/10">
        <h1 className="text-3xl font-bold text-center text-[#d0f5c8] mb-6">🌿 Login to DWARKA</h1>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full gap-2 py-3 border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 transition text-white font-medium"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <div className="my-6 text-center text-gray-300">OR</div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-300"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-300"
          />
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 via-lime-500 to-green-600 text-white font-bold shadow-md hover:scale-105 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
