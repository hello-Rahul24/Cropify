import { NextRequest, NextResponse } from "next/server";
import ee from "@google/earthengine";
import { initEarthEngine } from "../../lib/earthEngine";

export async function POST(req: NextRequest) {
  try {
    await initEarthEngine();

    const { polygon } = await req.json();

    if (!polygon) {
      return NextResponse.json(
        { error: "Polygon is required" },
        { status: 400 }
      );
    }

    const fieldGeometry = ee.Geometry.Polygon(polygon);

    const image = ee
      .ImageCollection("COPERNICUS/S2")
      .filterBounds(fieldGeometry)
      .filterDate("2024-01-01", "2024-12-31") // ✅ Extended date range
      .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20)) // ✅ Filter clouds
      .sort("CLOUDY_PIXEL_PERCENTAGE")
      .first();

    // ✅ Check if image exists
    const imageInfo = await new Promise((resolve, reject) => {
      image.getInfo((data: any, error: any) => {
        if (error) reject(error);
        else resolve(data);
      });
    });

    if (!imageInfo) {
      return NextResponse.json(
        { error: "No satellite images found for this area and date range" },
        { status: 404 }
      );
    }

    const ndvi = image.normalizedDifference(["B8", "B4"]);

    const stats = ndvi.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: fieldGeometry,
      scale: 10,
      maxPixels: 1e9,
    });

    // ✅ Properly get the value using callback
    const statsInfo: any = await new Promise((resolve, reject) => {
      stats.getInfo((data: any, error: any) => {
        if (error) reject(error);
        else resolve(data);
      });
    });

    console.log("Stats info:", statsInfo); // ✅ Debug log

    // ✅ The key is 'nd' for normalized difference
    const ndviValue = statsInfo?.nd;

    if (ndviValue === null || ndviValue === undefined) {
      return NextResponse.json(
        { error: "Could not calculate NDVI for this area" },
        { status: 500 }
      );
    }

    let status = "Unknown";
    if (ndviValue > 0.6) status = "Healthy";
    else if (ndviValue > 0.3) status = "Moderate Stress";
    else status = "High Stress";

    return NextResponse.json({
      ndvi: parseFloat(ndviValue.toFixed(3)), // ✅ Ensure it's a number
      status,
      source: "Sentinel-2 (Field NDVI)",
    });
  } catch (error: any) {
    console.error("Earth Engine Error:", error);
    return NextResponse.json(
      { 
        error: "Earth Engine NDVI failed",
        details: error.message || error.toString()
      },
      { status: 500 }
    );
  }
}