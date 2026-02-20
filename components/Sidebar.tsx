"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  UserCircle,
  School,
  ClipboardCheck,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/teachers", label: "Teachers", icon: Users },
  { href: "/per-teacher", label: "Per teacher analysis", icon: BarChart3 },
  { href: "/students", label: "Students", icon: UserCircle },
  { href: "/classrooms", label: "Classrooms", icon: School },
  { href: "/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const initial = user?.name?.charAt(0)?.toUpperCase() || "M";

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside className="w-64 shrink-0 bg-[#1e1b4b] text-slate-200 flex flex-col shadow-xl">
      <div className="p-6 border-b border-indigo-500/20">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          SAVRA
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-indigo-500/20 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-red-500/20 hover:text-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
        <div className="flex items-center gap-3 px-3 py-2.5 mt-2">
          <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-[#1e1b4b] font-semibold shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-slate-400 truncate">{user?.role ?? "Admin"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
