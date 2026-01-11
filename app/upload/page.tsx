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
    <main className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-16 px-6">
      {/* Grainy texture overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle blur shapes */}
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute bottom-40 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 bg-emerald-100 rounded-full">
            <span className="text-xs font-medium text-emerald-800 tracking-wide">AI-POWERED ANALYSIS</span>
          </div>
          <h1 className="text-5xl font-light tracking-tight text-zinc-900 mb-3">
            Crop Leaf Health Analysis
          </h1>
          <p className="text-zinc-600 font-light text-lg">
            Upload a clear photo of the affected leaf for instant diagnosis
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100 mb-8">
          <div className="flex flex-col items-center">
            {/* Custom File Input */}
            <label className="cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <div className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl text-base font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-300 inline-block shadow-lg hover:shadow-xl hover:scale-105">
                Choose Image
              </div>
            </label>

            {image && (
              <p className="mt-6 text-sm text-zinc-600 font-light">
                Selected file: <strong className="text-zinc-900">{image.name}</strong>
              </p>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="mt-8 px-10 py-5 bg-zinc-900 text-white rounded-2xl text-base font-medium hover:bg-zinc-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? "Analyzing..." : "Analyze Leaf"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Diagnosis */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100">
              <h2 className="text-3xl font-light text-zinc-900 mb-8">
                AI Diagnosis & Explanation
              </h2>

              <div className="space-y-6">
                {/* Detected Issue */}
                <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                  <strong className="text-sm font-medium text-emerald-700 block mb-2">Detected Issue</strong>
                  <p className="text-zinc-900 font-light text-lg">{result.issue}</p>
                </div>

                {/* Confidence Level */}
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <strong className="text-sm font-medium text-emerald-700 block mb-2">Confidence Level</strong>
                  <p className="text-zinc-900 font-light">{result.confidence}</p>
                </div>

                {/* Visual Symptoms */}
                <div className="p-5 bg-white rounded-2xl border border-emerald-100">
                  <strong className="text-sm font-medium text-emerald-700 block mb-3">Visual Symptoms Observed</strong>
                  <ul className="space-y-2">
                    {result.symptoms?.map((symptom: string, index: number) => (
                      <li key={index} className="text-zinc-900 font-light flex items-start">
                        <span className="text-emerald-600 mr-3 text-lg">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reasoning */}
                <div className="p-5 bg-white rounded-2xl border border-emerald-100">
                  <strong className="text-sm font-medium text-emerald-700 block mb-3">Why the AI Thinks This</strong>
                  <p className="text-zinc-900 font-light leading-relaxed">{result.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Treatment Recommendations */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-lg border border-emerald-100">
              <h2 className="text-3xl font-light text-zinc-900 mb-8">
                Recommended Treatment Actions
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Organic Treatment */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-7 border-2 border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-medium text-emerald-800 mb-5 flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    Organic Treatment
                  </h3>
                  <div className="space-y-4 text-sm">
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">What:</strong>
                      <span className="text-zinc-700 font-light">{result.treatments.organic.what}</span>
                    </p>
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">How:</strong>
                      <span className="text-zinc-700 font-light">{result.treatments.organic.how}</span>
                    </p>
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">Dosage:</strong>
                      <span className="text-zinc-700 font-light">{result.treatments.organic.dosage}</span>
                    </p>
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">Safety:</strong>
                      <span className="text-zinc-700 font-light">{result.treatments.organic.safety}</span>
                    </p>
                  </div>
                </div>

                {/* Chemical Treatment */}
                <div className="bg-gradient-to-br from-zinc-50 to-slate-50 rounded-2xl p-7 border-2 border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-medium text-zinc-800 mb-5 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Chemical Treatment
                  </h3>
                  <div className="space-y-4 text-sm">
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">What:</strong>
                      <span className="text-zinc-700 font-light">{result.treatments.chemical.what}</span>
                    </p>
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">How:</strong>
                      <span className="text-zinc-700 font-light">{result.treatments.chemical.how}</span>
                    </p>
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">Dosage:</strong>
                      <span className="text-zinc-700 font-light">{result.treatments.chemical.dosage}</span>
                    </p>
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">Safety:</strong>
                      <span className="text-zinc-700 font-light">{result.treatments.chemical.safety}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}