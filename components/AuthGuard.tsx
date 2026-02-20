"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "./Sidebar";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isReady } = useAuth();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!isReady) return;
    if (isLoginPage) return;
    if (!user) {
      router.replace("/login");
    }
  }, [isReady, user, isLoginPage, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-slate-50/80">{children}</main>
    </div>
  );
}
