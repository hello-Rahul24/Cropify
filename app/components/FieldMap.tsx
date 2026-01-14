"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import { Leaf, Loader2, MapPin, Activity } from "lucide-react";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw";

function DrawControl({
  onPolygonCreated,
}: {
  onPolygonCreated: (coords: number[][][]) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: {
          shapeOptions: {
            color: '#10b981',
            fillColor: '#10b981',
            fillOpacity: 0.2,
            weight: 3
          }
        },
        rectangle: false,
        circle: false,
        polyline: false,
        marker: false,
        circlemarker: false,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;

      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      const geoJson = layer.toGeoJSON();
      const coords = geoJson.geometry.coordinates;

      onPolygonCreated(coords);
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onPolygonCreated]);

  return null;
}

export default function FieldMap() {
  const [polygon, setPolygon] = useState<number[][][] | null>(null);
  const [ndviResult, setNdviResult] = useState<{
    ndvi: number;
    status: string;
    health_percentage: number;
    area_hectares: number;
    recommendation: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendPolygonToBackend(coords: number[][][]) {
    setLoading(true);
    try {
      const res = await fetch("/api/satellite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ polygon: coords }),
      });

      const data = await res.json();
      setNdviResult(data);
    } catch (err) {
      console.error("Failed to fetch NDVI", err);
    } finally {
      setLoading(false);
    }
  }

  function handlePolygonCreated(coords: number[][][]) {
    setPolygon(coords);
    sendPolygonToBackend(coords);
  }

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('healthy') || s.includes('good')) return 'text-emerald-500';
    if (s.includes('moderate')) return 'text-yellow-500';
    if (s.includes('poor') || s.includes('stress')) return 'text-red-500';
    return 'text-blue-500';
  };

  const getStatusBg = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('healthy') || s.includes('good')) return 'bg-emerald-500/10 border-emerald-500/30';
    if (s.includes('moderate')) return 'bg-yellow-500/10 border-yellow-500/30';
    if (s.includes('poor') || s.includes('stress')) return 'bg-red-500/10 border-red-500/30';
    return 'bg-blue-500/10 border-blue-500/30';
  };

  return (
    <div className="relative h-screen w-full bg-slate-950 overflow-hidden">
      {/* Gradient overlay for aesthetics */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none z-[1000]" />
      
      {/* Map */}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={16}
        maxZoom={19}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
          maxZoom={19}
          maxNativeZoom={18}
        />
        <DrawControl onPolygonCreated={handlePolygonCreated} />
      </MapContainer>

      {/* Status Cards */}
      {polygon && (
        <div className="absolute bottom-6 left-6 right-6 z-[1001] grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl">
          
          {/* Main Health Card - Larger */}
          {ndviResult && !loading && (
            <div className="lg:col-span-2">
              <div className={`bg-gradient-to-br from-slate-900/95 to-slate-900/90 backdrop-blur-2xl border rounded-3xl p-8 shadow-2xl transform transition-all duration-300 hover:scale-[1.01] ${getStatusBg(ndviResult.status)}`}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 shadow-lg">
                      <Activity className={`w-8 h-8 ${getStatusColor(ndviResult.status)}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Vegetation Health Index</p>
                      <h3 className={`text-3xl font-bold ${getStatusColor(ndviResult.status)}`}>
                        {ndviResult.status}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Health Score</p>
                    <p className={`text-4xl font-bold ${getStatusColor(ndviResult.status)}`}>
                      {ndviResult.health_percentage || Math.round(ndviResult.ndvi * 100)}%
                    </p>
                  </div>
                </div>

                {/* NDVI Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">NDVI Value</p>
                    </div>
                    <p className="text-3xl font-bold text-white">{ndviResult.ndvi.toFixed(3)}</p>
                    <p className="text-xs text-slate-500 mt-1">Normalized Difference</p>
                  </div>

                </div>

                {/* NDVI Progress Bar */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Vegetation Density</span>
                    <span className="text-sm font-bold text-slate-300">{(ndviResult.ndvi * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className="relative h-3 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out shadow-lg ${
                        ndviResult.ndvi > 0.6 ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400' :
                        ndviResult.ndvi > 0.3 ? 'bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-600 via-red-500 to-red-400'
                      }`}
                      style={{ width: `${Math.min(Math.max(ndviResult.ndvi * 100, 0), 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
                    <span>0.0 Poor</span>
                    <span>0.3 Moderate</span>
                    <span>0.6 Good</span>
                    <span>1.0 Excellent</span>
                  </div>
                </div>

                {/* Recommendation Banner */}
                {ndviResult.recommendation && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">Recommendation</p>
                        <p className="text-sm text-slate-300 leading-relaxed">{ndviResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Side Cards */}
          <div className="space-y-4">
            {/* Selection Confirmation */}
            <div className="bg-gradient-to-br from-slate-900/95 to-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 rounded-2xl p-5 shadow-2xl shadow-emerald-500/10 transform transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 shadow-lg">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">Field Selected</p>
                  <p className="text-xs text-slate-400">Boundary mapped</p>
                </div>
              </div>
              <div className="flex items-center justify-center w-full h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-gradient-to-br from-slate-900/95 to-slate-900/90 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-5 shadow-2xl shadow-blue-500/10 transform transition-all duration-300">
                <div className="flex flex-col items-center justify-center gap-4 py-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                    <div className="absolute inset-0 blur-xl bg-blue-500/30 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-white mb-1">Analyzing Field</p>
                    <p className="text-xs text-slate-400">Processing satellite imagery...</p>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Health Indicators */}
            {ndviResult && !loading && (
              <div className="bg-gradient-to-br from-slate-900/95 to-slate-900/90 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick Metrics</p>
                
                <div className="space-y-3">
                  {/* Chlorophyll Estimate */}
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-slate-300">Chlorophyll</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {ndviResult.ndvi > 0.6 ? 'High' : ndviResult.ndvi > 0.3 ? 'Medium' : 'Low'}
                    </span>
                  </div>

                  {/* Water Stress */}
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-xs font-medium text-slate-300">Stress Level</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {ndviResult.ndvi > 0.6 ? 'Low' : ndviResult.ndvi > 0.3 ? 'Medium' : 'High'}
                    </span>
                  </div>

                  {/* Growth Stage */}
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-xs font-medium text-slate-300">Vigor</span>
                    </div>
                    <span className="text-sm font-bold text-white">
                      {ndviResult.ndvi > 0.7 ? 'Excellent' : ndviResult.ndvi > 0.5 ? 'Good' : ndviResult.ndvi > 0.3 ? 'Fair' : 'Poor'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions (when no polygon) */}
      {!polygon && (
        <div className="absolute bottom-20 left-6 right-6 z-[1001] max-w-sm">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-1">Get Started</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use the polygon tool in the top-left corner to draw around your field. We'll analyze the vegetation health instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}