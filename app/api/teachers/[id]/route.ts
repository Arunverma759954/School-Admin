import { NextRequest } from "next/server";
import {
  getTeacherById,
  getClassWiseBreakdown,
  getRecentActivity,
} from "@/lib/insights";
import type { TimeRange } from "@/lib/types";

function parseRange(searchParams: URLSearchParams): TimeRange {
  const r = searchParams.get("range");
  if (r === "month" || r === "year") return r;
  return "week";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const range = parseRange(request.nextUrl.searchParams);
  const teacher = getTeacherById(id, range);
  if (!teacher)
    return Response.json({ error: "Teacher not found" }, { status: 404 });
  const classWise = getClassWiseBreakdown(id, range);
  const recent = getRecentActivity(id);
  return Response.json({ teacher, classWise, recent });
}
