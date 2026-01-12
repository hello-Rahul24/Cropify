import { NextResponse } from "next/server";
import ee from "@google/earthengine";

import { initEarthEngine } from "../../lib/earthEngine";

export async function GET() {
  try {
    // Hardcoded demo location (India)
    const lat = 20.5937;
    const lon = 78.9629;
    
    await initEarthEngine();

    const point = ee.Geometry.Point([lon, lat]);

    const image = ee
      .ImageCollection("COPERNICUS/S2")
      .filterBounds(point)
      .filterDate("2024-01-01", "2024-01-31")
      .sort("CLOUDY_PIXEL_PERCENTAGE")
      .first();

    const ndvi = image.normalizedDifference(["B8", "B4"]);

    const stats = ndvi.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: point,
      scale: 10,
      maxPixels: 1e9,
    });

    const ndviValue = await stats.get("nd").getInfo();

    let status = "Unknown";
    if (ndviValue > 0.6) status = "Healthy";
    else if (ndviValue > 0.3) status = "Moderate Stress";
    else status = "High Stress";

    return NextResponse.json({
      ndvi: ndviValue,
      status,
      source: "Sentinel-2 (NIR)",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Earth Engine NDVI failed" },
      { status: 500 }
    );
  }
}
