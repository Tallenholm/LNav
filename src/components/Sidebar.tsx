import type { Dispatch, SetStateAction } from 'react';
import { Waypoint, TruckProfile, RoutingOptions } from '../types';
import { Plus, Trash2, ShieldAlert, Navigation, Settings2, Route as RouteIcon, Map as MapIcon } from 'lucide-react';

interface Props {
  waypoints: Waypoint[];
  setWaypoints: Dispatch<SetStateAction<Waypoint[]>>;
  truckProfile: TruckProfile;
  setTruckProfile: Dispatch<SetStateAction<TruckProfile>>;
  routingOptions: RoutingOptions;
  setRoutingOptions: Dispatch<SetStateAction<RoutingOptions>>;
  onOptimize: () => void;
  isAnalyzing: boolean;
}

export default function Sidebar({ 
  waypoints, 
  setWaypoints, 
  truckProfile, 
  setTruckProfile, 
  routingOptions,
  setRoutingOptions,
  onOptimize, 
  isAnalyzing 
}: Props) {
  
  const addWaypoint = () => {
    if (waypoints.length >= 150) {
      alert("Maximum of 150 stops reached.");
      return;
    }
    setWaypoints([...waypoints, { id: Date.now().toString(), address: '' }]);
  };

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(w => w.id !== id));
  };

  const updateWaypoint = (id: string, address: string) => {
    setWaypoints(waypoints.map(w => w.id === id ? { ...w, address } : w));
  };

  const isOptimizeDisabled = waypoints.length < 2 || waypoints.some(w => !w.address) || isAnalyzing;

  const launchNavigation = () => {
    const validWaypoints = waypoints.filter(w => w.address.trim() !== '');
    if (validWaypoints.length < 2) return;
    
    const origin = encodeURIComponent(validWaypoints[0].address);
    const destination = encodeURIComponent(validWaypoints[validWaypoints.length - 1].address);
    
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    
    if (validWaypoints.length > 2) {
      const waypointsStr = validWaypoints.slice(1, -1).map(w => encodeURIComponent(w.address)).join('|');
      url += `&waypoints=${waypointsStr}`;
    }
    
    // Note: avoidHighways and avoidTolls are also supported by Google Maps Deep Linking
    if (routingOptions.avoidHighways || routingOptions.avoidTolls) {
      const avoids = [];
      if (routingOptions.avoidHighways) avoids.push('hwy');
      if (routingOptions.avoidTolls) avoids.push('tolls');
      url += `&dir_action=navigate&avoid=${avoids.join(',')}`;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full md:w-[380px] bg-white/95 backdrop-blur-2xl md:rounded-3xl border-t md:border border-slate-200/60 h-[55vh] md:h-full flex flex-col shadow-2xl shadow-slate-900/20 z-20 overflow-hidden pointer-events-auto transition-all">
      <div className="p-4 md:p-5 border-b border-slate-200/50 bg-slate-950/5 backdrop-blur-sm text-slate-900 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
            <Navigation className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900">Crew Logistics</h1>
        </div>
        <p className="text-slate-500 text-xs font-medium ml-11">Heavy equipment residential access</p>
      </div>

      <div className="p-4 md:p-5 flex-1 overflow-y-auto space-y-6 md:space-y-8 no-scrollbar">
        {/* Truck Profile Section */}
        <section>
          <div className="flex items-center gap-2 mb-3 md:mb-4 font-semibold text-slate-800 border-b border-slate-100 pb-2">
            <Settings2 className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm md:text-base">Crew Vehicle Specs</h3>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Vehicle Classification</label>
              <select 
                value={truckProfile.class}
                onChange={e => setTruckProfile({...truckProfile, class: e.target.value})}
                className="w-full text-sm p-2 border border-slate-200 rounded-md bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              >
                <option>Class 8 (Heavy Duty Dump/Flatbed)</option>
                <option>Class 7 (Heavy Duty)</option>
                <option>Class 6 (Medium Duty w/ Trailer)</option>
                <option>Class 4-5 (Medium Duty)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Height Clearance</label>
                <input 
                  type="text" 
                  value={truckProfile.height}
                  onChange={e => setTruckProfile({...truckProfile, height: e.target.value})}
                  className="w-full text-sm p-2 border border-slate-200 rounded-md bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="13 ft 6 in"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Gross Weight</label>
                <input 
                  type="text" 
                  value={truckProfile.weight}
                  onChange={e => setTruckProfile({...truckProfile, weight: e.target.value})}
                  className="w-full text-sm p-2 border border-slate-200 rounded-md bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="80,000 lbs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Routing Options Section */}
        <section>
          <div className="flex items-center gap-2 mb-3 md:mb-4 font-semibold text-slate-800 border-b border-slate-100 pb-2">
            <RouteIcon className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm md:text-base">Routing Preferences</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={routingOptions.avoidTolls}
                onChange={e => setRoutingOptions({...routingOptions, avoidTolls: e.target.checked})}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              Avoid Tolls
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={routingOptions.avoidHighways}
                onChange={e => setRoutingOptions({...routingOptions, avoidHighways: e.target.checked})}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              Avoid Highways
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={routingOptions.optimizeRoute}
                onChange={e => setRoutingOptions({...routingOptions, optimizeRoute: e.target.checked})}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              Optimize Waypoint Order
            </label>
          </div>
        </section>

        {/* Waypoints Section */}
        <section>
          <div className="flex items-center justify-between mb-3 md:mb-4 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm md:text-base">Job Sites</h3>
            </div>
            <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {waypoints.length} / 150
            </div>
          </div>
          
          <div className="space-y-2 md:space-y-3">
            {waypoints.map((waypoint, index) => (
              <div key={waypoint.id} className="flex items-start gap-2 group">
                <div className="relative pt-2">
                  <div className="w-5 h-5 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center z-10 text-[10px] font-bold text-slate-500">
                    {index + 1}
                  </div>
                  {index < waypoints.length - 1 && (
                    <div className="absolute top-7 left-1/2 -ml-[1px] w-[2px] h-full bg-slate-200 -z-0"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex gap-1 md:gap-2">
                    <input 
                      type="text" 
                      value={waypoint.address}
                      onChange={e => updateWaypoint(waypoint.id, e.target.value)}
                      placeholder={index === 0 ? "Dispatch Center (Origin)" : index === waypoints.length - 1 ? "Final Stop / Return" : "Job Site Address"}
                      className="flex-1 text-sm p-2 bg-white border border-slate-200 rounded-md focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-sm group-hover:border-slate-300"
                    />
                    {waypoints.length > 2 && (
                      <button 
                        onClick={() => removeWaypoint(waypoint.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors shrink-0"
                        title="Remove job site"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addWaypoint}
            className="mt-3 md:mt-4 w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 border-dashed rounded-md hover:bg-slate-100 hover:text-emerald-600 hover:border-emerald-300 transition-all uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            Add Job Site
          </button>
        </section>
      </div>

      <div className="shrink-0 p-4 md:p-5 border-t border-slate-200/50 bg-white/50 backdrop-blur-md flex flex-col gap-2">
        <button 
          onClick={onOptimize}
          disabled={isOptimizeDisabled}
          className="w-full relative overflow-hidden bg-slate-900 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-500 flex justify-center items-center gap-2 text-sm"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              <span>Analyzing Route & Access...</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Preview & Analyze Map Route</span>
            </>
          )}
        </button>
        <button 
          onClick={launchNavigation}
          disabled={isOptimizeDisabled}
          className="w-full relative overflow-hidden bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 flex justify-center items-center gap-2 text-sm"
        >
          <MapIcon className="w-4 h-4" />
          <span>Launch Turn-by-Turn Nav</span>
        </button>
      </div>
    </div>
  );
}
