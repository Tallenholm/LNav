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
      <div className="flex items-center justify-center min-h-screen font-sans bg-slate-950 text-slate-100">
        <div className="text-center max-w-lg p-8 border border-white/10 rounded-xl bg-slate-900 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-white">Google Maps API Key Required</h2>
          <p className="mb-2"><strong>Step 1:</strong> <a className="text-blue-400 hover:text-blue-300 transition-colors" href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer">Get an API Key</a></p>
          <p className="mb-4"><strong>Step 2:</strong> Add your key as a secret securely:</p>
          <ul className="text-left leading-relaxed text-slate-300 space-y-2 mb-6">
            <li>• Open <strong>Settings</strong> (⚙️ gear icon, <strong>top-right corner</strong>)</li>
            <li>• Select <strong>Secrets</strong></li>
            <li>• Type <code className="bg-slate-800 text-amber-400 px-1 py-0.5 rounded">GOOGLE_MAPS_PLATFORM_KEY</code> as the secret name, press <strong>Enter</strong></li>
            <li>• Paste your API key as the value, press <strong>Enter</strong></li>
          </ul>
          <p className="text-sm text-slate-400">The app builds securely on the server automatically after adding the secret.</p>
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
        
        {/* Top Banner overlaying map */}
        <div className="pointer-events-auto absolute top-0 left-0 right-0 md:left-[420px]">
          <TopBanner aiAnalysis={aiAnalysis} isAnalyzing={isAnalyzing} />
        </div>

        {/* Left Panel / Bottom Sheet */}
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
