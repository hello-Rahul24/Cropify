import { NextResponse } from "next/server";
import { geminiModel } from "../../lib/gemini";
import { leafAnalysisPrompt } from "../../lib/prompt";

export async function POST(req: Request) {
  try {
    // 1. Read form data
    const formData = await req.formData();
    const image = formData.get("image") as File;

    // 2. Validate image
    if (!image) {
      return NextResponse.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    // 3. Convert image to base64
    const buffer = Buffer.from(await image.arrayBuffer());

    // 4. Send image + prompt to Gemini
    const result = await geminiModel.generateContent([
      leafAnalysisPrompt,
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: image.type,
        },
      },
    ]);

    // 5. Extract text response
    const analysis = result.response.text();

    // 6. Return response
    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Analyze leaf error:", error);
    return NextResponse.json(
      { error: "Failed to analyze leaf image" },
      { status: 500 }
    );
  }
}
