"use client";

import { useState } from "react";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
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
      setResult(data.analysis || "No analysis returned");
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
          <h3>Analysis Result</h3>
          <p style={{ whiteSpace: "pre-line" }}>{result}</p>
        </div>
      )}
    </main>
  );
}
