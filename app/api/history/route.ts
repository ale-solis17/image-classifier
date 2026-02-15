import { NextResponse } from "next/server";

// History is managed client-side, so this endpoint returns an empty array by default.
// In a real app, this would query a database.
export async function GET() {
  return NextResponse.json([]);
}
