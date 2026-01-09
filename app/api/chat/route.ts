import { NextResponse } from "next/server";
import { geminiModel } from "../../lib/gemini";

export async function POST(req: Request) {
  try {
    // 1. Read JSON body
    const body = await req.json();
    const message = body.message;

    // 2. Validate input
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 3. Send question to Gemini
    const result = await geminiModel.generateContent(`
You are an expert AI agronomist helping farmers.

Question from farmer:
"${message}"

Give a clear, practical answer in simple language.
Include prevention tips if relevant.
`);

    // 4. Extract response
    const reply = result.response.text();

    // 5. Return response
    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate reply" },
      { status: 500 }
    );
  }
}
