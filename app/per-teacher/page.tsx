"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Search,
  Plus,
  ChevronDown,
  BookOpen,
  PlayCircle,
  ClipboardList,
  Download,
  Loader2,
  TrendingUp,
} from "lucide-react";
import type { TimeRange } from "@/lib/types";

interface TeacherDetail {
  teacher_id: string;
  teacher_name: string;
  lessons: number;
  quizzes: number;
  assessments: number;
  subjects: string[];
  classes: string[];
}

interface ClassWiseItem {
  className: string;
  assigned: number;
  completed: number;
  avgScore: number;
}

interface RecentItem {
  id: string;
  type: string;
  label: string;
  at: string;
}

interface PerTeacherResponse {
  teacher: TeacherDetail;
  classWise: ClassWiseItem[];
  recent: RecentItem[];
}

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
];

export default function PerTeacherPage() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("teacher") || "";
  const [teacherId, setTeacherId] = useState(initialId);
  const [range, setRange] = useState<TimeRange>("week");
  const [teachers, setTeachers] = useState<{ teacher_id: string; teacher_name: string }[]>([]);
  const [data, setData] = useState<PerTeacherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetch("/api/teachers/selector")
      .then((res) => res.json())
      .then(setTeachers);
  }, []);

  useEffect(() => {
    if (!teacherId && teachers.length) {
      setTeacherId(teachers[0]?.teacher_id || "");
      return;
    }
    if (!teacherId) return;
    setLoading(true);
    fetch(`/api/teachers/${teacherId}?range=${range}`)
      .then((res) => res.json())
      .then((d) => {
        if (d.error) setData(null);
        else setData(d);
      })
      .finally(() => setLoading(false));
  }, [teacherId, range, teachers.length]);

  const handleExport = useCallback(() => {
    if (!data) return;
    setExporting(true);
    const blob = new Blob(
      [
        JSON.stringify(
          {
            teacher: data.teacher,
            classWise: data.classWise,
            recent: data.recent,
            exportedAt: new Date().toISOString(),
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teacher-${data.teacher.teacher_name.replace(/\s+/g, "-")}-history.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }, [data]);

  const sessionsConducted = data?.classWise.reduce((s, c) => s + c.completed, 0) ?? 0;
  const liveEngagementScore = data?.classWise.length
    ? Math.round(
        data.classWise.reduce((s, c) => s + c.avgScore, 0) / data.classWise.length
      )
    : 0;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto pb-20">
      <h1 className="text-xl font-bold text-slate-900 mb-4">Per teacher analysis</h1>
      {/* Header bar: Search, Create, All Sessions, All teachers, Time filters */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder={teacherId && data?.teacher ? `Search ${data.teacher.teacher_name}` : "Search here"}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-44 focus:outline-none focus:ring-2 focus:ring-savra-primary/30"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[140px] focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              defaultValue="all"
            >
              <option value="all">All Sessions</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px] focus:outline-none focus:ring-2 focus:ring-savra-primary/30"
            >
              <option value="">All teachers</option>
              {teachers.map((t) => (
                <option key={t.teacher_id} value={t.teacher_id}>
                  {t.teacher_name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
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
      </header>

      {!teacherId ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Select a teacher to view performance overview.
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-savra-primary" />
        </div>
      ) : data ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">{data.teacher.teacher_name}</h1>
            <p className="text-slate-500 mt-0.5">Performance Overview</p>
            <p className="text-sm text-slate-600 mt-2">
              Subject: {data.teacher.subjects.join(", ") || "—"}
            </p>
            <p className="text-sm text-slate-600">
              Classes Taught: {data.teacher.classes.join(", ") || "—"}
            </p>
          </div>

          {/* Performance metrics: Created, Conducted, Assigned, Live Engagement Score */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm card-hover">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Created</p>
                  <p className="text-xl font-bold text-slate-900">{data.teacher.lessons}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm card-hover">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Conducted</p>
                  <p className="text-xl font-bold text-slate-900">{sessionsConducted}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm card-hover">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Assigned</p>
                  <p className="text-xl font-bold text-slate-900">{data.teacher.assessments}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm card-hover">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Live Engagement Score</p>
                  <p className="text-xl font-bold text-slate-900">{liveEngagementScore}%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Average score in 10%, considers encouraging working methods.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Class-wise Breakdown */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm card-hover">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Class-wise Breakdown</h3>
              <div className="h-64">
                {data.classWise.length ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.classWise}
                      margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="className" tick={{ fontSize: 12 }} stroke="#64748b" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      />
                      <Legend />
                      <Bar dataKey="avgScore" name="Avg Score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="completed" name="Completion" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                    No class-wise data for this period
                  </div>
                )}
              </div>
            </div>
            {/* Recent Activity */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm card-hover">
              <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Activity</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {data.recent.length ? (
                  data.recent.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start gap-2 py-2 border-b border-slate-100 last:border-0"
                    >
                      <span
                        className={`shrink-0 capitalize text-xs font-medium px-2 py-0.5 rounded ${
                          r.type === "lesson"
                            ? "bg-sky-100 text-sky-700"
                            : r.type === "quiz"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-violet-100 text-violet-700"
                        }`}
                      >
                        {r.type}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-slate-700 truncate">{r.label}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(r.at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm font-medium text-slate-500">No Recent Activity</p>
                    <p className="text-xs text-slate-400 mt-1">No data available on conducted session.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="fixed bottom-6 right-6 z-10">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-70 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/30"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export Overview
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
          Could not load teacher data.
        </div>
      )}
    </div>
  );
}
