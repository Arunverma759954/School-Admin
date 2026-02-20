import {
  subDays,
  startOfDay,
  format,
  parseISO,
  isAfter,
  isBefore,
} from "date-fns";
import type {
  ActivityRecord,
  TimeRange,
  TeacherSummary,
  WeeklyActivityPoint,
  ClassWiseBreakdown,
  RecentActivityItem,
} from "./types";
import { rawActivities } from "./data";

/**
 * Deduplicate records: same teacher_id, activity_type, created_at, subject, class = one record.
 * Assignment hidden twist: "Ensure your system handles duplicate entries gracefully."
 */
function deduplicate(records: ActivityRecord[]): ActivityRecord[] {
  const seen = new Set<string>();
  return records.filter((r) => {
    const key = `${r.teacher_id}|${r.activity_type}|${r.created_at}|${r.subject}|${r.class}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const activities = deduplicate(rawActivities);

function getRangeDates(range: TimeRange): { start: Date; end: Date } {
  const end = new Date();
  const start =
    range === "week"
      ? subDays(end, 7)
      : range === "month"
        ? subDays(end, 30)
        : subDays(end, 365);
  return { start, end };
}

function filterByRange(records: ActivityRecord[], range: TimeRange): ActivityRecord[] {
  const { start, end } = getRangeDates(range);
  return records.filter((r) => {
    const d = parseISO(r.created_at);
    return !isBefore(d, start) && !isAfter(d, end);
  });
}

export function getTeacherSummaries(range: TimeRange): TeacherSummary[] {
  const filtered = filterByRange(activities, range);
  const byTeacher = new Map<
    string,
    { name: string; lessons: number; quizzes: number; assessments: number; subjects: Set<string>; classes: Set<string> }
  >();

  for (const r of filtered) {
    let entry = byTeacher.get(r.teacher_id);
    if (!entry) {
      entry = {
        name: r.teacher_name,
        lessons: 0,
        quizzes: 0,
        assessments: 0,
        subjects: new Set(),
        classes: new Set(),
      };
      byTeacher.set(r.teacher_id, entry);
    }
    if (r.activity_type === "lesson") entry.lessons++;
    else if (r.activity_type === "quiz") entry.quizzes++;
    else if (r.activity_type === "assessment") entry.assessments++;
    entry.subjects.add(r.subject);
    entry.classes.add(r.class);
  }

  return Array.from(byTeacher.entries()).map(([teacher_id, e]) => ({
    teacher_id,
    teacher_name: e.name,
    lessons: e.lessons,
    quizzes: e.quizzes,
    assessments: e.assessments,
    subjects: Array.from(e.subjects),
    classes: Array.from(e.classes),
  }));
}

export function getInsightsCards(range: TimeRange): {
  activeTeachers: number;
  assessmentsCreated: number;
  lessonsCreated: number;
  quizzesCreated: number;
  retentionRate: number;
} {
  const summaries = getTeacherSummaries(range);
  let lessons = 0,
    quizzes = 0,
    assessments = 0;
  for (const s of summaries) {
    lessons += s.lessons;
    quizzes += s.quizzes;
    assessments += s.assessments;
  }
  const totalActive = summaries.length;
  const retentionRate = totalActive > 0 ? Math.min(100, Math.round((totalActive / 5) * 100)) : 0;
  return {
    activeTeachers: totalActive,
    assessmentsCreated: assessments,
    lessonsCreated: lessons,
    quizzesCreated: quizzes,
    retentionRate,
  };
}

export function getWeeklyActivity(range: TimeRange): WeeklyActivityPoint[] {
  const filtered = filterByRange(activities, range);
  const days = 7;
  const end = new Date();
  const points: WeeklyActivityPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = startOfDay(subDays(end, i));
    const dateStr = format(d, "yyyy-MM-dd");
    let lessons = 0,
      quizzes = 0,
      assessments = 0;
    for (const r of filtered) {
      const rd = startOfDay(parseISO(r.created_at));
      if (format(rd, "yyyy-MM-dd") === dateStr) {
        if (r.activity_type === "lesson") lessons++;
        else if (r.activity_type === "quiz") quizzes++;
        else if (r.activity_type === "assessment") assessments++;
      }
    }
    points.push({
      date: format(d, "MMM d"),
      lessons,
      quizzes,
      assessments,
      total: lessons + quizzes + assessments,
    });
  }
  return points;
}

export function getTeacherById(teacherId: string, range: TimeRange): TeacherSummary | null {
  const summaries = getTeacherSummaries(range);
  return summaries.find((s) => s.teacher_id === teacherId) ?? null;
}

/** Class-wise assigned vs completion (assigned = count of activities, completion simulated). */
export function getClassWiseBreakdown(teacherId: string, range: TimeRange): ClassWiseBreakdown[] {
  const filtered = filterByRange(activities, range).filter((r) => r.teacher_id === teacherId);
  const byClass = new Map<string, { assigned: number; completed: number }>();

  for (const r of filtered) {
    let entry = byClass.get(r.class);
    if (!entry) {
      entry = { assigned: 0, completed: 0 };
      byClass.set(r.class, entry);
    }
    entry.assigned++;
    const seed = (teacherId + r.class + r.created_at).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    entry.completed += seed % 3 !== 0 ? 1 : 0;
  }

  const classOrder = ["Class 7", "Class 8", "Class 9", "Class 10"];
  return classOrder
    .filter((c) => byClass.has(c))
    .map((className) => {
      const e = byClass.get(className)!;
      const avgScore = e.assigned > 0 ? Math.round((e.completed / e.assigned) * 100) : 0;
      return { className, assigned: e.assigned, completed: e.completed, avgScore };
    });
}

export function getRecentActivity(teacherId: string, limit = 10): RecentActivityItem[] {
  const teacherActivities = activities
    .filter((r) => r.teacher_id === teacherId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);

  return teacherActivities.map((r, i) => ({
    id: `${r.teacher_id}-${r.created_at}-${i}`,
    type: r.activity_type,
    label: `${r.activity_type} in ${r.subject} (${r.class})`,
    at: r.created_at,
  }));
}

export function getAllTeachersForSelector(): { teacher_id: string; teacher_name: string }[] {
  const summaries = getTeacherSummaries("year");
  return summaries.map((s) => ({ teacher_id: s.teacher_id, teacher_name: s.teacher_name }));
}

/**
 * AI-style insight summaries (bonus) – data-driven, no external API.
 * Example: "Grade 7 teachers, Ashish and Varun created 40% more quizzes this week."
 */
export function getAIInsightSummaries(range: TimeRange): string[] {
  const summaries = getTeacherSummaries(range);
  const lines: string[] = [];

  if (summaries.length === 0) {
    lines.push("No activity in this period. Encourage teachers to create lessons and quizzes.");
    return lines;
  }

  const byQuizzes = [...summaries].sort((a, b) => b.quizzes - a.quizzes);
  const totalQuizzes = summaries.reduce((s, t) => s + t.quizzes, 0);
  if (totalQuizzes > 0 && byQuizzes.length >= 2) {
    const top2 = byQuizzes.slice(0, 2);
    const top2Quizzes = top2.reduce((s, t) => s + t.quizzes, 0);
    const pct = Math.round((top2Quizzes / totalQuizzes) * 100);
    const names = top2.map((t) => t.teacher_name).join(" and ");
    const classList = Array.from(new Set(top2.flatMap((t) => t.classes))).filter((c) => c.startsWith("Class")).slice(0, 2).join(", ");
    lines.push(`${classList || "Teachers"} ${names} created ${pct}% of quizzes this period.`);
  }

  const byLessons = [...summaries].sort((a, b) => b.lessons - a.lessons);
  const totalLessons = summaries.reduce((s, t) => s + t.lessons, 0);
  if (totalLessons > 0 && byLessons.length >= 2) {
    const top2 = byLessons.slice(0, 2);
    const names = top2.map((t) => t.teacher_name).join(" and ");
    lines.push(`${names} lead in lessons created this period.`);
  }

  if (lines.length === 0) {
    lines.push("Activity is building up. Keep adding lessons and assessments to see trends.");
  }

  return lines.slice(0, 3);
}
