"use client";

import { useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch("/api/analyze-leaf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.analysis || null);
    } catch (error) {
      setResult("Something went wrong while analyzing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>
        Crop Leaf Health Analysis
      </h1>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        Upload a clear photo of the affected leaf for instant diagnosis.
      </p>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
          }
        }}
      />

      {image && (
        <p style={{ marginTop: "1rem" }}>
          Selected file: <strong>{image.name}</strong>
        </p>
      )}

      <button
        onClick={handleAnalyze}
        disabled={!image || loading}
        style={{
          marginTop: "1.5rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Leaf"}
      </button>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>AI Diagnosis & Explanation</h2>

          {/* 1. Detected Issue */}
          <div style={{ marginTop: "1rem" }}>
            <strong>Detected Issue</strong>
            <p>{result.issue}</p>
          </div>

          {/* 2. Confidence Level */}
          <div style={{ marginTop: "1rem" }}>
            <strong>Confidence Level</strong>
            <p>{result.confidence}</p>
          </div>

          {/* 3. Visual Symptoms */}
          <div style={{ marginTop: "1rem" }}>
            <strong>Visual Symptoms Observed</strong>
            <ul>
              {result.symptoms?.map((symptom: string, index: number) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>

          {/* 4. Why Gemini Thinks This */}
          <div style={{ marginTop: "1rem" }}>
            <strong>Why the AI Thinks This</strong>
            <p>{result.reasoning}</p>
          </div>
          {/* Action Layer: Treatment Recommendations */}
          <div style={{ marginTop: "2rem" }}>
            <h2>Recommended Treatment Actions</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {/* Organic Treatment */}
              <div
                style={{
                  border: "1px solid #cce5cc",
                  padding: "1rem",
                  borderRadius: "6px",
                  backgroundColor: "#f3faf3",
                }}
              >
                <h3>🌱 Organic Treatment</h3>
                <p>
                  <strong>What:</strong> {result.treatments.organic.what}
                </p>
                <p>
                  <strong>How:</strong> {result.treatments.organic.how}
                </p>
                <p>
                  <strong>Dosage:</strong> {result.treatments.organic.dosage}
                </p>
                <p>
                  <strong>Safety:</strong> {result.treatments.organic.safety}
                </p>
              </div>

              {/* Chemical Treatment */}
              <div
                style={{
                  border: "1px solid #f5c2c2",
                  padding: "1rem",
                  borderRadius: "6px",
                  backgroundColor: "#fff5f5",
                }}
              >
                <h3>⚠️ Chemical Treatment</h3>
                <p>
                  <strong>What:</strong> {result.treatments.chemical.what}
                </p>
                <p>
                  <strong>How:</strong> {result.treatments.chemical.how}
                </p>
                <p>
                  <strong>Dosage:</strong> {result.treatments.chemical.dosage}
                </p>
                <p>
                  <strong>Safety:</strong> {result.treatments.chemical.safety}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
