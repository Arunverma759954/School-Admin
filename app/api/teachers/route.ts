import { NextRequest } from "next/server";
import { getTeacherSummaries } from "@/lib/insights";
import type { TimeRange } from "@/lib/types";

function parseRange(searchParams: URLSearchParams): TimeRange {
  const r = searchParams.get("range");
  if (r === "month" || r === "year") return r;
  return "week";
}

export async function GET(request: NextRequest) {
  const range = parseRange(request.nextUrl.searchParams);
  const summaries = getTeacherSummaries(range);
  return Response.json(summaries);
}
