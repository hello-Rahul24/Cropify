import { NextResponse } from "next/server";
import { geminiModel } from "../../lib/gemini";

export async function POST(req: Request) {
  try {
    // 1. Read JSON body
    const body = await req.json();
    const { message, conversationHistory } = body;

    // 2. Validate input
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Valid message is required" },
        { status: 400 }
      );
    }

    // 3. Build context-aware prompt with conversation history
    let prompt = `You are an expert AI agronomist speaking directly to a farmer.

STRICT RESPONSE RULES (must follow all):
- DO NOT use markdown, bullets, headings, stars (*), or formatting symbols
- DO NOT use long explanations
- Write like a real human expert speaking casually
- Maximum 4 short sentences
- Use plain text only
- Be direct and practical
- No introductions, no summaries, no emojis

Tone:
- Simple
- Clear
- Farmer-friendly
- Confident but calm

`;

    // Add conversation history for context (if provided)
    if (
      conversationHistory &&
      Array.isArray(conversationHistory) &&
      conversationHistory.length > 0
    ) {
      prompt += `Previous conversation:\n`;
      conversationHistory
        .slice(-6)
        .forEach((msg: { type: string; content: string }) => {
          if (msg.type === "user") {
            prompt += `Farmer: ${msg.content}\n`;
          } else if (msg.type === "ai") {
            prompt += `You: ${msg.content}\n`;
          }
        });
      prompt += `\n`;
    }

    prompt += `Farmer asks: "${message.trim()}"

Answer exactly following the rules above.`;

    // 4. Send question to Gemini with timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 30000)
    );

    const geminiPromise = geminiModel.generateContent(prompt);

    const result = await Promise.race([geminiPromise, timeoutPromise]);

    // 5. Extract and validate response
    const reply = (result as any).response.text();

    if (!reply || reply.trim().length === 0) {
      throw new Error("Empty response from AI");
    }

    // 6. Return successful response
    return NextResponse.json({
      success: true,
      reply: reply.trim(),
    });
  } catch (error: any) {
    console.error("Chat API error:", error);

    // Handle specific error types
    if (error.message === "Request timeout") {
      return NextResponse.json(
        {
          error: "The request took too long. Please try again.",
          code: "TIMEOUT",
        },
        { status: 504 }
      );
    }

    // Handle rate limiting or API errors
    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      return NextResponse.json(
        {
          error: "Service is temporarily busy. Please try again in a moment.",
          code: "RATE_LIMIT",
        },
        { status: 429 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Failed to generate reply. Please try again.",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}

// Optional: Add rate limiting per IP or user
export const runtime = "edge"; // Optional: Use edge runtime for better performance
