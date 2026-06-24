import type { AIAnalysis } from '../types';
import { ShieldAlert, Info, Droplet, TriangleAlert } from 'lucide-react';

interface Props {
  aiAnalysis: AIAnalysis | null;
  isAnalyzing: boolean;
}

export default function TopBanner({ aiAnalysis, isAnalyzing }: Props) {
  if (isAnalyzing) {
    return (
      <div className="absolute top-4 left-4 right-4 z-10 mx-auto max-w-5xl">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 shadow-2xl flex items-center justify-center">
          <div className="flex items-center gap-3 text-emerald-500">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-white rounded-full animate-spin" />
            <span className="font-mono text-sm tracking-wide">AI Computing site access and routing path...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!aiAnalysis) return null;

  return (
    <div className="absolute top-4 left-4 right-4 xl:right-8 z-10 mx-auto max-w-4xl animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-emerald-500/20 rounded-md border border-emerald-500/30">
              <ShieldAlert className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-white font-semibold tracking-tight text-lg">AI Logistics Analysis</h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium tracking-widest text-slate-300 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse"></span>
            Active Monitoring
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-h-[40vh] md:max-h-[80vh] overflow-y-auto no-scrollbar">
          
          {/* Hazards */}
          <div className="col-span-1 md:col-span-2 space-y-4">
             <div className="flex items-center gap-2 text-slate-300">
               <TriangleAlert className="w-4 h-4 text-rose-400" />
               <h3 className="text-sm uppercase tracking-wider font-semibold">Route Hazard Warnings</h3>
             </div>
             {aiAnalysis.hazards.length === 0 ? (
               <div className="text-slate-500 text-sm italic">No significant hazards identified on this route.</div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {aiAnalysis.hazards.map((hazard, i) => (
                   <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between">
                     <div className={`absolute top-0 right-0 w-16 h-16 -mr-8 -mt-8 rounded-full opacity-10 filter blur-xl ${
                       hazard.severity === 'HIGH' ? 'bg-rose-500' : hazard.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                     }`}></div>
                     <div>
                       <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 tracking-wide ${
                         hazard.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-400' : 
                         hazard.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 
                         'bg-sky-500/20 text-sky-400'
                       }`}>
                         {hazard.severity} • {hazard.type}
                       </span>
                       <p className="text-slate-300 text-sm leading-relaxed">{hazard.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Fuel & Advice */}
          <div className="space-y-6 md:border-l border-slate-800 md:pl-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <Droplet className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm uppercase tracking-wider font-semibold">Fuel Strategy</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                {aiAnalysis.fuelOptimization}
              </p>
            </div>
            
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-slate-300">
                <Info className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm uppercase tracking-wider font-semibold">Driver Advisory</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                {aiAnalysis.overallAdvice}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
