"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, FileQuestion, ClipboardList, ChevronRight, BarChart3 } from "lucide-react";
import type { TimeRange } from "@/lib/types";
import type { TeacherSummary } from "@/lib/types";

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

export default function TeachersListPage() {
  const [range, setRange] = useState<TimeRange>("week");
  const [teachers, setTeachers] = useState<TeacherSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/teachers?range=${range}`)
      .then((res) => res.json())
      .then(setTeachers)
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Teachers</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/per-teacher"
            className="inline-flex items-center gap-2 px-4 py-2 bg-savra-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Per teacher analysis
          </Link>
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                range === opt.value ? "bg-white text-savra-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {teachers.map((t) => (
            <Link
              key={t.teacher_id}
              href={`/per-teacher?teacher=${t.teacher_id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm card-hover"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">{t.teacher_name}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {t.subjects.join(", ")} · {t.classes.join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <BookOpen className="w-4 h-4 text-sky-500" />
                    {t.lessons}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <FileQuestion className="w-4 h-4 text-amber-500" />
                    {t.quizzes}
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <ClipboardList className="w-4 h-4 text-violet-500" />
                    {t.assessments}
                  </span>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
