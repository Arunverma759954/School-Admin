"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(email, password)) {
      router.replace("/");
    } else {
      setError("Invalid email or password. Try admin@savra.com / admin123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950/30 via-slate-50 to-violet-100/50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent">
            SAVRA
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">Admin Companion</p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/80 p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@savra.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-shadow"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-shadow"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2.5 border border-red-100">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
            >
              Sign in
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-5 text-center">
            Demo: admin@savra.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
