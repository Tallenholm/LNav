import type { Dispatch, SetStateAction, ReactNode } from 'react';
import { Waypoint, TruckProfile, RoutingOptions } from '../types';
import { Plus, Trash2, Truck, Navigation2, Sparkles } from 'lucide-react';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 ${
        checked ? 'bg-emerald-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-medium text-slate-600">{children}</label>;
}

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
  isAnalyzing,
}: Props) {
  const addWaypoint = () => {
    if (waypoints.length >= 150) {
      alert('Maximum of 150 stops reached.');
      return;
    }
    setWaypoints([...waypoints, { id: Date.now().toString(), address: '' }]);
  };

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(w => w.id !== id));
  };

  const updateWaypoint = (id: string, address: string) => {
    setWaypoints(waypoints.map(w => (w.id === id ? { ...w, address } : w)));
  };

  const isDisabled = waypoints.length < 2 || waypoints.some(w => !w.address.trim()) || isAnalyzing;

  const launchNavigation = () => {
    const valid = waypoints.filter(w => w.address.trim());
    if (valid.length < 2) return;
    const origin = encodeURIComponent(valid[0].address);
    const destination = encodeURIComponent(valid[valid.length - 1].address);
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (valid.length > 2) {
      const mid = valid.slice(1, -1).map(w => encodeURIComponent(w.address)).join('|');
      url += `&waypoints=${mid}`;
    }
    if (routingOptions.avoidHighways || routingOptions.avoidTolls) {
      const avoids = [];
      if (routingOptions.avoidHighways) avoids.push('hwy');
      if (routingOptions.avoidTolls) avoids.push('tolls');
      url += `&dir_action=navigate&avoid=${avoids.join(',')}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="w-full md:w-[400px] bg-white md:rounded-2xl md:border md:border-slate-100 h-[62vh] md:h-full flex flex-col shadow-[0_-12px_40px_-4px_rgba(0,0,0,0.18)] md:shadow-2xl md:shadow-black/20 overflow-hidden">
      {/* Mobile drag handle */}
      <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
        <div className="w-9 h-1 bg-slate-200 rounded-full" />
      </div>

      {/* Header */}
      <div className="px-5 py-4 shrink-0 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Truck className="w-[18px] h-[18px] text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight">Crew Logistics</h1>
            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">Heavy equipment residential access</p>
          </div>
          <span className="shrink-0 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {waypoints.length} / 150
          </span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-5 space-y-6">

          {/* Vehicle Specs */}
          <section>
            <SectionLabel>Vehicle Specs</SectionLabel>
            <div className="space-y-3 mt-3">
              <div>
                <FieldLabel>Vehicle Class</FieldLabel>
                <div className="relative mt-1.5">
                  <select
                    value={truckProfile.class}
                    onChange={e => setTruckProfile({ ...truckProfile, class: e.target.value })}
                    className="w-full appearance-none text-sm py-2.5 pl-3 pr-9 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                  >
                    <option>Class 8 (Heavy Duty Dump/Flatbed)</option>
                    <option>Class 7 (Heavy Duty)</option>
                    <option>Class 6 (Medium Duty w/ Trailer)</option>
                    <option>Class 4-5 (Medium Duty)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Height Clearance</FieldLabel>
                  <input
                    type="text"
                    value={truckProfile.height}
                    onChange={e => setTruckProfile({ ...truckProfile, height: e.target.value })}
                    placeholder="13 ft 6 in"
                    className="mt-1.5 w-full text-sm py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <FieldLabel>Gross Weight</FieldLabel>
                  <input
                    type="text"
                    value={truckProfile.weight}
                    onChange={e => setTruckProfile({ ...truckProfile, weight: e.target.value })}
                    placeholder="80,000 lbs"
                    className="mt-1.5 w-full text-sm py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Routing Preferences */}
          <section>
            <SectionLabel>Routing Preferences</SectionLabel>
            <div className="mt-1 divide-y divide-slate-50">
              {([
                { key: 'avoidTolls' as const, label: 'Avoid Tolls', desc: 'Skip toll roads and bridges' },
                { key: 'avoidHighways' as const, label: 'Avoid Highways', desc: 'Prefer local and arterial roads' },
                { key: 'optimizeRoute' as const, label: 'Optimize Stop Order', desc: 'Reorder waypoints for efficiency' },
              ]).map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-tight">{label}</p>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{desc}</p>
                  </div>
                  <Toggle
                    checked={routingOptions[key]}
                    onChange={v => setRoutingOptions({ ...routingOptions, [key]: v })}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Job Sites */}
          <section>
            <SectionLabel>Job Sites</SectionLabel>
            <div className="mt-3">
              {waypoints.map((waypoint, index) => {
                const isFirst = index === 0;
                const isLast = index === waypoints.length - 1;
                const dotClass = isFirst
                  ? 'bg-emerald-500 ring-4 ring-emerald-100'
                  : isLast
                  ? 'bg-rose-500 ring-4 ring-rose-100'
                  : 'bg-amber-400 ring-4 ring-amber-100';

                return (
                  <div key={waypoint.id} className="flex gap-3 group">
                    {/* Connector column */}
                    <div className="flex flex-col items-center shrink-0 w-4 pt-3.5">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />
                      {!isLast && <div className="w-px flex-1 bg-slate-200 my-1 min-h-[8px]" />}
                    </div>

                    {/* Input */}
                    <div className="flex-1 pb-2 flex items-start gap-1.5 pt-1.5 min-w-0">
                      <input
                        type="text"
                        value={waypoint.address}
                        onChange={e => updateWaypoint(waypoint.id, e.target.value)}
                        placeholder={
                          isFirst
                            ? 'Origin / Dispatch Center'
                            : isLast
                            ? 'Final Destination'
                            : `Stop ${index}`
                        }
                        className="flex-1 min-w-0 text-sm py-2.5 px-3 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder:text-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                      />
                      {waypoints.length > 2 && (
                        <button
                          onClick={() => removeWaypoint(waypoint.id)}
                          className="mt-0.5 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Remove stop"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={addWaypoint}
              className="mt-1 w-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Stop
            </button>
          </section>
        </div>
      </div>

      {/* Action buttons */}
      <div className="shrink-0 px-4 py-4 md:px-5 md:py-5 border-t border-slate-100 bg-white space-y-2.5">
        <button
          onClick={onOptimize}
          disabled={isDisabled}
          className="w-full bg-slate-900 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-slate-900/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-slate-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-700 flex justify-center items-center gap-2 text-sm"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
              Analyzing Route...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Analyze with AI
            </>
          )}
        </button>
        <button
          onClick={launchNavigation}
          disabled={isDisabled}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 flex justify-center items-center gap-2 text-sm"
        >
          <Navigation2 className="w-4 h-4" />
          Launch Navigation
        </button>
      </div>
    </div>
  );
}
