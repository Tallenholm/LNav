import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Sidebar from './components/Sidebar';
import RouteMap from './components/RouteMap';
import TopBanner from './components/TopBanner';
import { useState } from 'react';
import type { Waypoint, TruckProfile, AIAnalysis, RoutingOptions } from './types';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

export default function App() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { id: '1', address: 'San Francisco, CA' },
    { id: '2', address: 'Los Angeles, CA' },
  ]);
  const [truckProfile, setTruckProfile] = useState<TruckProfile>({
    height: '13 ft 6 in',
    weight: '80,000 lbs',
    class: 'Class 8 (Heavy Duty)'
  });
  const [routingOptions, setRoutingOptions] = useState<RoutingOptions>({
    avoidTolls: false,
    avoidHighways: false,
    optimizeRoute: true,
  });
  
  const [activeRoute, setActiveRoute] = useState<Waypoint[] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  async function handleOptimize() {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/analyze-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waypoints, truckProfile })
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      setAiAnalysis(data);
      setActiveRoute(waypoints);
    } catch (e) {
      console.error(e);
      alert('Analysis failed. Check your API key and server logs.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans bg-slate-950 text-slate-100 p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-white/10">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">Crew Logistics</h1>
              <p className="text-slate-400 text-xs">Setup required</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-white/8 rounded-2xl p-6 shadow-2xl space-y-5">
            <div>
              <h2 className="text-base font-semibold text-white mb-1">Google Maps API Key Required</h2>
              <p className="text-slate-400 text-sm">Add your key to get started with route planning.</p>
            </div>

            <ol className="space-y-4">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-slate-300 text-sm font-medium">Get an API Key</p>
                  <a
                    className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors underline underline-offset-2"
                    href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    console.cloud.google.com →
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <div className="space-y-2 text-sm text-slate-300">
                  <p className="font-medium">Add the key as a Secret</p>
                  <ul className="space-y-1 text-slate-400">
                    <li>Open <strong className="text-slate-300">Settings</strong> → <strong className="text-slate-300">Secrets</strong></li>
                    <li>Name: <code className="bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded-md text-xs">GOOGLE_MAPS_PLATFORM_KEY</code></li>
                    <li>Paste your API key as the value</li>
                  </ul>
                </div>
              </li>
            </ol>

            <p className="text-xs text-slate-500 pt-1 border-t border-white/5">The app rebuilds securely on the server after you save the secret.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100dvh] w-full bg-slate-900 text-slate-900 overflow-hidden font-sans">
      {/* Full Screen Map Background */}
      <div className="absolute inset-0 z-0">
        <APIProvider apiKey={API_KEY} version="weekly">
          <RouteMap waypoints={activeRoute} truckProfile={truckProfile} routingOptions={routingOptions} />
        </APIProvider>
      </div>
      
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none z-10">
        
        {/* Top Banner */}
        <div className="pointer-events-auto absolute top-0 left-0 right-0 md:left-[420px]">
          <TopBanner aiAnalysis={aiAnalysis} isAnalyzing={isAnalyzing} />
        </div>

        {/* Sidebar / Bottom Sheet */}
        <div className="pointer-events-auto absolute bottom-0 left-0 right-0 md:top-0 md:bottom-0 md:w-[420px] flex flex-col justify-end md:justify-start md:p-4">
          <Sidebar
            waypoints={waypoints}
            setWaypoints={setWaypoints}
            truckProfile={truckProfile}
            setTruckProfile={setTruckProfile}
            routingOptions={routingOptions}
            setRoutingOptions={setRoutingOptions}
            onOptimize={handleOptimize}
            isAnalyzing={isAnalyzing}
          />
        </div>
        
      </div>
    </div>
  );
}
