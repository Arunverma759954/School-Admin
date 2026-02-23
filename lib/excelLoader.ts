import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";
import type { ActivityRecord } from "./types";

const EXCEL_FILENAME = "Savra_Teacher Data Set.xlsx";
const DATA_DIR = "data";

type ActivityType = "lesson" | "quiz" | "assessment";

function normalize(s: unknown): string {
  if (s == null) return "";
  return String(s).trim();
}

function toActivityType(s: string): ActivityType {
  const lower = s.toLowerCase();
  if (lower === "quiz") return "quiz";
  if (lower === "assessment") return "assessment";
  return "lesson";
}

function toISODate(s: string): string {
  if (!s) return new Date().toISOString();
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/**
 * Load activity records from HR's Excel file if present.
 * Place the file at: project_root/data/Savra_Teacher Data Set.xlsx
 * Expected columns (names flexible): teacher_id, teacher_name, activity_type, created_at, subject, class
 */
export function loadFromExcel(): ActivityRecord[] | null {
  try {
    const filePath = path.join(process.cwd(), DATA_DIR, EXCEL_FILENAME);
    if (!fs.existsSync(filePath)) return null;

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as unknown[][];

    if (!rows || rows.length < 2) return null;

    const headerRow = rows[0];
    const headers = headerRow.map((h) => normalize(h).toLowerCase().replace(/\s+/g, "_"));

    const col = (key: string) => {
      const i = headers.findIndex((h) => h === key || h.includes(key));
      return i >= 0 ? i : -1;
    };

    const teacherIdCol = col("teacher_id") >= 0 ? col("teacher_id") : col("teacherid");
    const teacherNameCol = col("teacher_name") >= 0 ? col("teacher_name") : col("teachername") >= 0 ? col("teachername") : col("name");
    const activityTypeCol = col("activity_type") >= 0 ? col("activity_type") : col("activitytype") >= 0 ? col("activitytype") : col("type");
    const createdAtCol = col("created_at") >= 0 ? col("created_at") : col("createdat") >= 0 ? col("createdat") : col("date");
    const subjectCol = col("subject") >= 0 ? col("subject") : col("subjects");
    const classCol = col("class") >= 0 ? col("class") : col("class_taught") >= 0 ? col("class_taught") : col("class taught");

    if (teacherIdCol < 0 || teacherNameCol < 0) return null;

    const records: ActivityRecord[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || !Array.isArray(row)) continue;

      const teacher_id = normalize(row[teacherIdCol]);
      const teacher_name = normalize(teacherNameCol >= 0 ? row[teacherNameCol] : "");
      if (!teacher_id && !teacher_name) continue;

      const activity_type = toActivityType(
        activityTypeCol >= 0 ? normalize(row[activityTypeCol]) : "lesson"
      );
      const created_at = toISODate(createdAtCol >= 0 ? normalize(row[createdAtCol]) : "");
      const subject = subjectCol >= 0 ? normalize(row[subjectCol]) : "";
      const classVal = classCol >= 0 ? normalize(row[classCol]) : "";

      records.push({
        teacher_id: teacher_id || `T${i}`,
        teacher_name: teacher_name || "Teacher",
        activity_type,
        created_at,
        subject,
        class: classVal || "Class 7",
      });
    }

    return records.length > 0 ? records : null;
  } catch {
    return null;
  }
}
