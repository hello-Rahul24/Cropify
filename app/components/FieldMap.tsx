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
      
      {/* Header - positioned to not interfere with map controls */}
      <div className="absolute top-4 left-20 z-[1001] pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-5 py-3 shadow-2xl pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">Field Health Monitor</h1>
              <p className="text-xs text-slate-400">Draw a polygon to analyze field vegetation</p>
            </div>
          </div>
        </div>
      </div>

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
        <div className="absolute bottom-6 left-6 right-6 z-[1001] flex flex-col gap-3 max-w-sm">
          {/* Selection Confirmation */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl shadow-emerald-500/10 transform transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20">
                <MapPin className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Field Boundary Selected</p>
                <p className="text-xs text-slate-400">Ready for analysis</p>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-2xl shadow-blue-500/10 transform transition-all duration-300">
              <div className="flex items-center gap-4">
                <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                <div>
                  <p className="text-sm font-semibold text-white">Analyzing Field Health</p>
                  <p className="text-xs text-slate-400">Processing satellite data...</p>
                </div>
              </div>
            </div>
          )}

          {/* NDVI Result */}
          {ndviResult && !loading && (
            <div className={`bg-slate-900/90 backdrop-blur-xl border rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:scale-[1.02] ${getStatusBg(ndviResult.status)}`}>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20">
                  <Activity className={`w-6 h-6 ${getStatusColor(ndviResult.status)}`} />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Field Health Analysis</p>
                    <h3 className={`text-2xl font-bold ${getStatusColor(ndviResult.status)}`}>
                      {ndviResult.status}
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">NDVI Index</span>
                      <span className="text-sm font-bold text-white">{ndviResult.ndvi.toFixed(3)}</span>
                    </div>
                    
                    {/* NDVI Progress Bar */}
                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                          ndviResult.ndvi > 0.6 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                          ndviResult.ndvi > 0.3 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                          'bg-gradient-to-r from-red-500 to-red-400'
                        }`}
                        style={{ width: `${Math.min(Math.max(ndviResult.ndvi * 100, 0), 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Poor</span>
                      <span>Moderate</span>
                      <span>Healthy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions (when no polygon) */}
      {!polygon && (
        <div className="absolute bottom-6 left-6 right-6 z-[1001] max-w-sm">
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