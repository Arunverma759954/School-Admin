export type ActivityType = "lesson" | "quiz" | "assessment";

export interface ActivityRecord {
  teacher_id: string;
  teacher_name: string;
  activity_type: ActivityType;
  created_at: string; // ISO date
  subject: string;
  class: string;
}

export interface TeacherSummary {
  teacher_id: string;
  teacher_name: string;
  lessons: number;
  quizzes: number;
  assessments: number;
  subjects: string[];
  classes: string[];
}

export type TimeRange = "week" | "month" | "year";

export interface WeeklyActivityPoint {
  date: string;
  lessons: number;
  quizzes: number;
  assessments: number;
  total: number;
}

export interface ClassWiseBreakdown {
  className: string;
  assigned: number;
  completed: number;
  avgScore: number; // 0–100, completion % or simulated score
}

export interface RecentActivityItem {
  id: string;
  type: ActivityType;
  label: string;
  at: string;
}
