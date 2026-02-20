import { NextRequest } from "next/server";
import { getInsightsCards, getWeeklyActivity, getAIInsightSummaries } from "@/lib/insights";
import type { TimeRange } from "@/lib/types";

function parseRange(searchParams: URLSearchParams): TimeRange {
  const r = searchParams.get("range");
  if (r === "month" || r === "year") return r;
  return "week";
}

export async function GET(request: NextRequest) {
  const range = parseRange(request.nextUrl.searchParams);
  const cards = getInsightsCards(range);
  const weekly = getWeeklyActivity(range);
  const aiSummaries = getAIInsightSummaries(range);
  return Response.json({ cards, weekly, aiSummaries });
}
