import { Suspense } from "react";

export default function PerTeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div className="p-8">Loading...</div>}>{children}</Suspense>;
}
