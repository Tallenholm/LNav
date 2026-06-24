import type { AIAnalysis } from '../types';
import { Sparkles, Droplet, Info, TriangleAlert, CheckCircle2 } from 'lucide-react';

const SEVERITY = {
  HIGH: {
    border: 'border-l-rose-500',
    badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/25',
  },
  MEDIUM: {
    border: 'border-l-amber-400',
    badge: 'bg-amber-400/15 text-amber-400 border border-amber-400/25',
  },
  LOW: {
    border: 'border-l-sky-400',
    badge: 'bg-sky-400/15 text-sky-400 border border-sky-400/25',
  },
} as const;

interface Props {
  aiAnalysis: AIAnalysis | null;
  isAnalyzing: boolean;
}

export default function TopBanner({ aiAnalysis, isAnalyzing }: Props) {
  if (isAnalyzing) {
    return (
      <div className="p-3 md:p-4">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
            <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Analyzing Route</p>
            <p className="text-slate-400 text-xs mt-0.5">AI computing site access and routing path...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!aiAnalysis) return null;

  const highCount = aiAnalysis.hazards.filter(h => h.severity === 'HIGH').length;
  const medCount = aiAnalysis.hazards.filter(h => h.severity === 'MEDIUM').length;

  return (
    <div className="p-3 md:p-4">
      <div className="bg-slate-900/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden">

        {/* Header */}
        <div className="px-4 md:px-5 py-3 flex items-center justify-between border-b border-white/5 bg-white/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">AI Route Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            {highCount > 0 && (
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                {highCount} HIGH
              </span>
            )}
            {medCount > 0 && (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                {medCount} MED
              </span>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              Live
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-h-[38vh] md:max-h-[50vh] overflow-y-auto no-scrollbar">

          {/* Hazards — 2/3 columns on desktop */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-1.5">
              <TriangleAlert className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route Hazards</span>
            </div>
            {aiAnalysis.hazards.length === 0 ? (
              <div className="flex items-center gap-2 text-slate-400 py-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-sm">No significant hazards identified on this route.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {aiAnalysis.hazards.map((hazard, i) => {
                  const s = SEVERITY[hazard.severity];
                  return (
                    <div key={i} className={`bg-white/5 border border-white/5 border-l-2 rounded-lg p-3 ${s.border}`}>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${s.badge}`}>
                        {hazard.severity} · {hazard.type}
                      </span>
                      <p className="text-slate-300 text-xs leading-relaxed">{hazard.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Fuel & Advisory — 1/3 column on desktop */}
          <div className="space-y-4 md:border-l md:border-white/5 md:pl-5">
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Droplet className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fuel Strategy</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed bg-white/5 rounded-lg p-3">
                {aiAnalysis.fuelOptimization}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Driver Advisory</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {aiAnalysis.overallAdvice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
