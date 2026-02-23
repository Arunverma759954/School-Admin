"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  FileQuestion,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Search,
  Plus,
  ChevronDown,
} from "lucide-react";
import type { TimeRange } from "@/lib/types";

interface InsightsCards {
  activeTeachers: number;
  assessmentsCreated: number;
  lessonsCreated: number;
  quizzesCreated: number;
  retentionRate: number;
}

interface WeeklyPoint {
  date: string;
  lessons: number;
  quizzes: number;
  assessments: number;
  total: number;
}

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

export default function DashboardPage() {
  const [range, setRange] = useState<TimeRange>("week");
  const [cards, setCards] = useState<InsightsCards | null>(null);
  const [weekly, setWeekly] = useState<WeeklyPoint[]>([]);
  const [aiSummaries, setAiSummaries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/insights?range=${range}`)
      .then((res) => res.json())
      .then((data) => {
        setCards(data.cards);
        setWeekly(data.weekly || []);
        setAiSummaries(data.aiSummaries || []);
      })
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto min-h-full">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Admin Companion
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Beta – See what&apos;s happening across your school.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search for teacher or school"
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/90 bg-white/90 text-sm w-52 focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-shadow shadow-sm"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-indigo-600 transition-all shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
          <div className="relative">
            <select
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-slate-200/90 bg-white text-sm focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 shadow-sm"
              defaultValue="all"
            >
              <option value="all">All Subjects</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Insights section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Insights</h2>
          <div className="flex rounded-xl border border-slate-200/80 p-1 bg-white/80 shadow-sm backdrop-blur-sm">
            {TIME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRange(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  range === opt.value
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : cards ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <MetricCard
                icon={Users}
                label="Active teachers"
                value={cards.activeTeachers}
                color="indigo"
                timeLabel={range === "week" ? "This week" : range === "month" ? "This month" : "This year"}
              />
              <MetricCard
                icon={ClipboardList}
                label="Assessments created"
                value={cards.assessmentsCreated}
                color="emerald"
                timeLabel={range === "week" ? "This week" : range === "month" ? "This month" : "This year"}
              />
              <MetricCard
                icon={BookOpen}
                label="Lessons created"
                value={cards.lessonsCreated}
                color="sky"
                timeLabel={range === "week" ? "This week" : range === "month" ? "This month" : "This year"}
              />
              <MetricCard
                icon={FileQuestion}
                label="Quizzes created"
                value={cards.quizzesCreated}
                color="amber"
                timeLabel={range === "week" ? "This week" : range === "month" ? "This month" : "This year"}
              />
              <MetricCard
                icon={TrendingUp}
                label="Retention rate"
                value={`${cards.retentionRate}%`}
                color="violet"
                timeLabel={range === "week" ? "This week" : range === "month" ? "This month" : "This year"}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm card-hover">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                  Weekly activity (Past 7 days)
                </h3>
                <div className="h-64 rounded-xl bg-slate-50/50 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weekly} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="lessonsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="quizzesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="assessGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                        formatter={(value: number) => [value, ""]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="lessons"
                        name="Lessons"
                        stroke="#0d9488"
                        fill="url(#lessonsGrad)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="quizzes"
                        name="Quizzes"
                        stroke="#0ea5e9"
                        fill="url(#quizzesGrad)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="assessments"
                        name="Assessments"
                        stroke="#8b5cf6"
                        fill="url(#assessGrad)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm card-hover">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">
                  Attribute Summary
                </h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-savra-primary font-medium">1.</span>
                    teachers reached the maximum limit with 30 lessons and 100 quizes.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-savra-primary font-medium">2.</span>
                    make sure the assessments and quizzes are up to date.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-savra-primary font-medium">3.</span>
                    Add more lessons and assessments inorder to increase activity count.
                  </li>
                </ul>
              </div>
            </div>
            {aiSummaries.length > 0 && (
              <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/90 to-violet-50/70 p-6 shadow-sm mt-6 card-hover">
                <h3 className="text-sm font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" /> AI Pulse Summary
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {aiSummaries.map((line, i) => (
                    <li key={i} className="flex gap-2 items-start">
                      <span className="text-indigo-500 shrink-0 mt-0.5">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : null}
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
  timeLabel = "This week",
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  timeLabel?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500 to-indigo-600",
    emerald: "from-emerald-500 to-teal-500",
    sky: "from-sky-500 to-cyan-500",
    amber: "from-amber-500 to-orange-500",
    violet: "from-violet-500 to-purple-500",
  };
  const barColor: Record<string, string> = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
  };
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</p>
          <p className="text-xs text-slate-400 mt-1">{timeLabel}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shrink-0 shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor[color]} opacity-90 transition-all duration-500`}
          style={{ width: typeof value === "number" ? `${Math.min(100, value * 2)}%` : "60%" }}
        />
      </div>
    </div>
  );
}
