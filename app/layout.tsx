import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";

export const metadata: Metadata = {
  title: "Savra – Teacher Insights",
  description: "Admin companion – See what's happening across your school.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
