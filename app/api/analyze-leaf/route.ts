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
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
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
    const rawText = result.response.text();

    let parsedAnalysis;

    try {
      parsedAnalysis = JSON.parse(rawText);
      // Ensure treatments always exist (defensive programming)
      if (!parsedAnalysis.treatments) {
        parsedAnalysis.treatments = {
          organic: {
            what: "Neem oil spray",
            how: "Spray evenly on affected leaves",
            dosage: "3–5 ml per liter of water",
            safety: "Apply in the morning or evening",
          },
          chemical: {
            what: "Recommended fungicide/insecticide",
            how: "Apply as per manufacturer instructions",
            dosage: "Follow label dosage",
            safety: "Use protective equipment",
          },
        };
      }
    } catch (error) {
      console.error("JSON parse failed, using fallback structure");

      parsedAnalysis = {
        issue: "Unable to determine precisely",
        confidence: "Low",
        symptoms: ["General leaf discoloration or stress detected"],
        reasoning:
          "The image quality or symptoms were not clear enough for a confident diagnosis. This is a precautionary assessment.",

        treatments: {
          organic: {
            what: "Neem oil spray",
            how: "Spray evenly on both sides of the leaves",
            dosage: "3–5 ml per liter of water",
            safety: "Apply during early morning or late evening",
          },
          chemical: {
            what: "Broad-spectrum fungicide",
            how: "Apply as a foliar spray covering affected plants",
            dosage: "As per label instructions",
            safety: "Wear gloves and mask; avoid spraying in windy conditions",
          },
        },
      };
    }

    // 6. Return response
    return NextResponse.json({
      success: true,
      analysis: parsedAnalysis,
    });
  } catch (error) {
    console.error("Analyze leaf error:", error);
    return NextResponse.json(
      { error: "Failed to analyze leaf image" },
      { status: 500 }
    );
  }
}
