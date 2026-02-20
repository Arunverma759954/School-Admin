import { getAllTeachersForSelector } from "@/lib/insights";

export async function GET() {
  const teachers = getAllTeachersForSelector();
  return Response.json(teachers);
}
