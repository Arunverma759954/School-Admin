import type { ActivityRecord } from "./types";

/**
 * Dummy dataset per assignment: teacher_id, teacher_name, activity_type, created_at, subject, class.
 * Includes intentional duplicates to verify graceful duplicate handling.
 */
export const rawActivities: ActivityRecord[] = [
  // Teacher 1 - Dilpaal
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "lesson", created_at: "2025-02-18T10:00:00Z", subject: "Science", class: "Class 7" },
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "lesson", created_at: "2025-02-18T10:00:00Z", subject: "Science", class: "Class 7" }, // duplicate
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "quiz", created_at: "2025-02-17T14:30:00Z", subject: "Physics", class: "Class 8" },
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "assessment", created_at: "2025-02-16T09:15:00Z", subject: "Maths", class: "Class 9" },
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "lesson", created_at: "2025-02-15T11:00:00Z", subject: "Biology", class: "Class 10" },
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "quiz", created_at: "2025-02-14T16:00:00Z", subject: "Mentoring", class: "Class 7" },
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "assessment", created_at: "2025-02-13T08:00:00Z", subject: "Business Studies", class: "Class 10" },
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "lesson", created_at: "2025-02-12T10:30:00Z", subject: "Science", class: "Class 8" },
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "quiz", created_at: "2025-02-11T13:00:00Z", subject: "Physics", class: "Class 9" },
  // Teacher 2 - Mohan Ray
  { teacher_id: "T002", teacher_name: "Mohan Ray", activity_type: "lesson", created_at: "2025-02-19T09:00:00Z", subject: "Maths", class: "Class 7" },
  { teacher_id: "T002", teacher_name: "Mohan Ray", activity_type: "quiz", created_at: "2025-02-18T15:00:00Z", subject: "Science", class: "Class 8" },
  { teacher_id: "T002", teacher_name: "Mohan Ray", activity_type: "assessment", created_at: "2025-02-17T11:00:00Z", subject: "Physics", class: "Class 9" },
  { teacher_id: "T002", teacher_name: "Mohan Ray", activity_type: "lesson", created_at: "2025-02-16T14:00:00Z", subject: "Biology", class: "Class 10" },
  { teacher_id: "T002", teacher_name: "Mohan Ray", activity_type: "lesson", created_at: "2025-02-16T14:00:00Z", subject: "Biology", class: "Class 10" }, // duplicate
  { teacher_id: "T002", teacher_name: "Mohan Ray", activity_type: "quiz", created_at: "2025-02-15T10:00:00Z", subject: "Chemistry", class: "Class 7" },
  { teacher_id: "T002", teacher_name: "Mohan Ray", activity_type: "assessment", created_at: "2025-02-14T09:30:00Z", subject: "Maths", class: "Class 8" },
  // Teacher 3 - Malabika Sharma
  { teacher_id: "T003", teacher_name: "Malabika Sharma", activity_type: "lesson", created_at: "2025-02-19T08:00:00Z", subject: "English", class: "Class 7" },
  { teacher_id: "T003", teacher_name: "Malabika Sharma", activity_type: "quiz", created_at: "2025-02-18T12:00:00Z", subject: "English", class: "Class 8" },
  { teacher_id: "T003", teacher_name: "Malabika Sharma", activity_type: "assessment", created_at: "2025-02-17T16:00:00Z", subject: "Hindi", class: "Class 9" },
  { teacher_id: "T003", teacher_name: "Malabika Sharma", activity_type: "lesson", created_at: "2025-02-16T10:00:00Z", subject: "English", class: "Class 10" },
  { teacher_id: "T003", teacher_name: "Malabika Sharma", activity_type: "quiz", created_at: "2025-02-15T11:00:00Z", subject: "Hindi", class: "Class 7" },
  { teacher_id: "T003", teacher_name: "Malabika Sharma", activity_type: "assessment", created_at: "2025-02-14T14:00:00Z", subject: "English", class: "Class 8" },
  // Teacher 4 - Ashish
  { teacher_id: "T004", teacher_name: "Ashish", activity_type: "lesson", created_at: "2025-02-18T09:30:00Z", subject: "Maths", class: "Class 9" },
  { teacher_id: "T004", teacher_name: "Ashish", activity_type: "quiz", created_at: "2025-02-17T13:00:00Z", subject: "Maths", class: "Class 10" },
  { teacher_id: "T004", teacher_name: "Ashish", activity_type: "quiz", created_at: "2025-02-17T13:00:00Z", subject: "Maths", class: "Class 10" }, // duplicate
  { teacher_id: "T004", teacher_name: "Ashish", activity_type: "assessment", created_at: "2025-02-16T15:00:00Z", subject: "Maths", class: "Class 7" },
  { teacher_id: "T004", teacher_name: "Ashish", activity_type: "lesson", created_at: "2025-02-15T10:00:00Z", subject: "Maths", class: "Class 8" },
  // Teacher 5 - Varun
  { teacher_id: "T005", teacher_name: "Varun", activity_type: "lesson", created_at: "2025-02-19T11:00:00Z", subject: "Science", class: "Class 7" },
  { teacher_id: "T005", teacher_name: "Varun", activity_type: "quiz", created_at: "2025-02-18T14:00:00Z", subject: "Science", class: "Class 8" },
  { teacher_id: "T005", teacher_name: "Varun", activity_type: "assessment", created_at: "2025-02-17T09:00:00Z", subject: "Physics", class: "Class 9" },
  { teacher_id: "T005", teacher_name: "Varun", activity_type: "lesson", created_at: "2025-02-16T12:00:00Z", subject: "Chemistry", class: "Class 10" },
  { teacher_id: "T005", teacher_name: "Varun", activity_type: "quiz", created_at: "2025-02-15T16:00:00Z", subject: "Biology", class: "Class 7" },
  // More past dates for weekly trend
  { teacher_id: "T001", teacher_name: "Dilpaal", activity_type: "lesson", created_at: "2025-02-10T10:00:00Z", subject: "Science", class: "Class 7" },
  { teacher_id: "T002", teacher_name: "Mohan Ray", activity_type: "quiz", created_at: "2025-02-10T14:00:00Z", subject: "Maths", class: "Class 9" },
  { teacher_id: "T003", teacher_name: "Malabika Sharma", activity_type: "assessment", created_at: "2025-02-11T09:00:00Z", subject: "English", class: "Class 10" },
  { teacher_id: "T004", teacher_name: "Ashish", activity_type: "lesson", created_at: "2025-02-11T11:00:00Z", subject: "Maths", class: "Class 9" },
  { teacher_id: "T005", teacher_name: "Varun", activity_type: "quiz", created_at: "2025-02-12T15:00:00Z", subject: "Science", class: "Class 8" },
];
