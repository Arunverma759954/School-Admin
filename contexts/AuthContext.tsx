"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: { email: string; password: string; name: string; role: string }[] = [
  { email: "admin@savra.com", password: "admin123", name: "Mohan Ray", role: "Admin" },
  { email: "principal@savra.com", password: "principal123", name: "Malabika Sharma", role: "Principal" },
];

const STORAGE_KEY = "savra_admin_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUser(parsed);
      }
    } catch {
      // ignore
    }
    setIsReady(true);
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const u: User = { name: found.name, email: found.email, role: found.role };
      setUser(u);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
