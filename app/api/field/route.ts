import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { polygon } = body;

  if (!polygon) {
    return NextResponse.json(
      { error: "Polygon is required" },
      { status: 400 }
    );
  }

  console.log("Received field polygon:", polygon);

  return NextResponse.json({
    status: "Field received",
  });
}
