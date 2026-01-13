"use client";

import { useState } from "react";
import Tooltip from "../components/Tooltip";

export default function UploadPage() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);

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
    <main className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-8 overflow-hidden bg-zinc-50 py-16">
      {/* Grainy texture overlay */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Enhanced blurred background shapes with more variety and smoother animation */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
           style={{ animationDuration: '15s', animationDelay: '0s' }} />
      <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
           style={{ animationDuration: '18s', animationDelay: '4s' }} />
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-zinc-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"
           style={{ animationDuration: '12s', animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-0">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4 px-4 py-1.5 bg-emerald-100 rounded-full shadow-sm transition-all duration-300 hover:shadow-md">
            <span className="text-xs font-medium text-emerald-800 tracking-wide">
              AI-POWERED ANALYSIS
            </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-zinc-900 mb-3 animate-fade-in animation-delay-200">
            Crop Leaf Health Analysis
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 font-light max-w-xl mx-auto">
            Upload a clear photo of the affected leaf for instant diagnosis
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-100 mb-8 animate-fade-in animation-delay-400">
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
                <div className="px-6 sm:px-10 py-3 sm:py-5 bg-black text-white rounded-2xl text-base font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-300 inline-block shadow-lg hover:shadow-xl hover:scale-105">
                  Choose Image
                </div>
              </label>

              {image && (
                <p className="mt-6 text-sm text-zinc-600 font-light">
                  Selected file:{" "}
                  <strong className="text-zinc-900">{image.name}</strong>
                </p>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!image || loading}
                className="mt-8 px-6 sm:px-10 py-3 sm:py-5 bg-zinc-900 text-white rounded-2xl text-base font-medium hover:bg-zinc-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? "Analyzing..." : "Analyze Leaf"}
              </button>
              {loading && (
                <p className="text-gray-700">
                  it may take 1-2 min...
                </p>
              )}
            </div>
          </div>
        )}
        {/* Field Analysis Button */}
        <a href="/field-analysis">
          <button
            className="mt-4 px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white rounded-2xl text-base font-medium hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Analyze Field via Satellite
          </button>
        </a>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 sm:space-y-12 animate-fade-in animation-delay-600">
            {/* Uploaded Image with Annotations */}
            {image && (
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-100">
                <h2 className="text-3xl sm:text-4xl font-light text-zinc-900 mb-8">
                  Analyzed Image
                </h2>
                <div className="flex flex-col items-center">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Uploaded leaf"
                    className="max-w-full h-auto rounded-2xl shadow-md mb-6"
                  />
                  <div className="w-full">
                    <strong className="text-sm font-medium text-emerald-700 block mb-3">
                      Visual Annotations
                    </strong>
                    <ul className="space-y-2">
                      {result.visual_annotations?.map(
                        (annotation: string, index: number) => (
                          <li
                            key={index}
                            className="text-zinc-900 font-light flex items-start"
                          >
                            <span className="text-emerald-600 mr-3 text-lg">
                              •
                            </span>
                            <span>{annotation}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Diagnosis */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-100">
              <h2 className="text-3xl sm:text-4xl font-light text-zinc-900 mb-8">
                AI Diagnosis & Explanation
              </h2>

              <div className="space-y-6">
                {/* Detected Issue */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <strong className="text-sm font-medium text-emerald-700 block mb-2">
                    Detected Issue
                  </strong>
                  <p className="text-zinc-900 font-light text-base sm:text-lg">
                    {result.issue}
                  </p>
                </div>

                {/* Summary Card: Confidence, Severity, Urgency, Lifecycle */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 sm:p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <strong className="text-sm font-medium text-emerald-700 block mb-2">
                      Confidence Level
                    </strong>
                    <p className="text-zinc-900 font-light">
                      {result.confidence}
                    </p>
                  </div>
                  <div className="p-4 sm:p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <strong className="text-sm font-medium text-emerald-700 block mb-2">
                      <Tooltip term="Severity" meaning="Shows how bad the damage is right now."/>
                      
                    </strong>
                    <p className="text-zinc-900 font-light">
                      {result.severity}
                    </p>
                  </div>
                  <div className="p-4 sm:p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <strong className="text-sm font-medium text-emerald-700 block mb-2">
                      Lifecycle Stage
                    </strong>
                    <p className="text-zinc-900 font-light">
                      {result.lifecycle_stage}
                    </p>
                  </div>
                  <div className="p-4 sm:p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <strong className="text-sm font-medium text-emerald-700 block mb-2">
                      Urgency
                    </strong>
                    <p className="text-zinc-900 font-light">{result.urgency}</p>
                  </div>
                </div>

                {/* Yield Impact */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <strong className="text-sm font-medium text-yellow-700 block mb-2">
                    Estimated Yield Impact (if untreated)
                  </strong>
                  <p className="text-zinc-900 font-light">
                    {result.yield_impact}
                  </p>
                </div>

                {/* Visual Symptoms */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <strong className="text-sm font-medium text-emerald-700 block mb-3">
                    Visual Symptoms Observed
                  </strong>
                  <ul className="space-y-2">
                    {result.symptoms?.map((symptom: string, index: number) => (
                      <li
                        key={index}
                        className="text-zinc-900 font-light flex items-start"
                      >
                        <span className="text-emerald-600 mr-3 text-lg">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Reasoning */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <strong className="text-sm font-medium text-emerald-700 block mb-3">
                    Why the AI Thinks This
                  </strong>
                  <p className="text-zinc-900 font-light leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>
              </div>
            </div>

            {/* Treatment Recommendations */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-100">
              <h2 className="text-3xl sm:text-4xl font-light text-zinc-900 mb-8">
                Recommended Treatment Actions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Organic Treatment */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl sm:text-2xl font-medium text-emerald-800 mb-5 flex items-center gap-2">
                    <span className="text-2xl">🌱</span>
                    Organic Treatment
                  </h3>
                  <div className="space-y-4 text-sm">
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">
                        What:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.organic.what}
                      </span>
                    </p>
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">
                        How:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.organic.how}
                      </span>
                    </p>
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">
                        Dosage:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.organic.dosage}
                      </span>
                    </p>
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">
                        Safety:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.organic.safety}
                      </span>
                    </p>
                    <p>
                      <strong className="font-medium text-emerald-700 block mb-1">
                        Environmental Impact:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.organic.environmental_impact}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Chemical Treatment */}
                <div className="bg-gradient-to-br from-zinc-50 to-slate-50 rounded-2xl p-5 sm:p-7 border-2 border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl sm:text-2xl font-medium text-zinc-800 mb-5 flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    Chemical Treatment
                  </h3>
                  <div className="space-y-4 text-sm">
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">
                        What:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.chemical.what}
                      </span>
                    </p>
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">
                        How:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.chemical.how}
                      </span>
                    </p>
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">
                        Dosage:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.chemical.dosage}
                      </span>
                    </p>
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">
                        Safety:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.chemical.safety}
                      </span>
                    </p>
                    <p>
                      <strong className="font-medium text-zinc-700 block mb-1">
                        Environmental Impact:
                      </strong>
                      <span className="text-zinc-700 font-light">
                        {result.treatments.chemical.environmental_impact}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* IPM Strategy */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-100">
              <h2 className="text-3xl sm:text-4xl font-light text-zinc-900 mb-8">
                Sustainable IPM Strategy
              </h2>

              <div className="space-y-6">
                {/* Companion Planting */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <strong className="text-sm font-medium text-emerald-700 block mb-3">
                    Companion Planting Suggestions
                  </strong>
                  <ul className="space-y-2">
                    {result.ipm_strategy.companion_planting?.map(
                      (suggestion: string, index: number) => (
                        <li
                          key={index}
                          className="text-zinc-900 font-light flex items-start"
                        >
                          <span className="text-emerald-600 mr-3 text-lg">
                            •
                          </span>
                          <span>{suggestion}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Preventive Measures */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <strong className="text-sm font-medium text-emerald-700 block mb-3">
                    Preventive Measures
                  </strong>
                  <ul className="space-y-2">
                    {result.ipm_strategy.preventive_measures?.map(
                      (measure: string, index: number) => (
                        <li
                          key={index}
                          className="text-zinc-900 font-light flex items-start"
                        >
                          <span className="text-emerald-600 mr-3 text-lg">
                            •
                          </span>
                          <span>{measure}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Predictive Risks */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <strong className="text-sm font-medium text-yellow-700 block mb-2">
                    Predictive Risks
                  </strong>
                  <p className="text-zinc-900 font-light">
                    {result.ipm_strategy.predictive_risks}
                  </p>
                </div>

                {/* Timing Optimization */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <strong className="text-sm font-medium text-emerald-700 block mb-3">
                    Timing Optimization
                  </strong>
                  <p className="text-zinc-900 font-light leading-relaxed">
                    {result.ipm_strategy.timing_optimization}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom accent with subtle glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent shadow-md" />
    </main>
  );
}