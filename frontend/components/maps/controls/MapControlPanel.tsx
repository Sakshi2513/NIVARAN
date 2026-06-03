'use client';

import React from 'react';
import { 
  Layers, Map as MapIcon, Shield, Activity, 
  Users, Siren, Filter, ChevronDown, ChevronUp,
  Settings, Zap, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapControlPanelProps {
  layers: { id: string; name: string; enabled: boolean; icon: any }[];
  onToggleLayer: (id: string) => void;
  filters: any;
  onFilterChange: (key: string, value: any) => void;
  role: 'citizen' | 'officer' | 'admin';
}

export function MapControlPanel({ layers, onToggleLayer, filters, onFilterChange, role }: MapControlPanelProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'layers' | 'filters'>('layers');

  return (
    <div className="absolute top-4 right-4 z-[1000] w-72">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div 
          className="p-3 bg-slate-950 flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white uppercase tracking-widest">Geo Intel</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {/* Tabs */}
              <div className="flex border-b border-slate-800">
                <button 
                  onClick={() => setActiveTab('layers')}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'layers' ? 'text-indigo-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Layers
                </button>
                <button 
                  onClick={() => setActiveTab('filters')}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'filters' ? 'text-indigo-400 bg-slate-800/50' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Filters
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                {activeTab === 'layers' ? (
                  <div className="grid grid-cols-1 gap-2">
                    {layers.map(layer => (
                      <button
                        key={layer.id}
                        onClick={() => onToggleLayer(layer.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                          layer.enabled 
                            ? 'bg-indigo-600/20 border-indigo-500/50 text-white' 
                            : 'bg-slate-800/30 border-slate-800 text-slate-500 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${layer.enabled ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                          <layer.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[11px] font-semibold">{layer.name}</span>
                        {layer.enabled && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Time range</label>
                      <select className="w-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2 py-1.5 rounded outline-none">
                        <option>Last 24 Hours</option>
                        <option>Last 7 Days</option>
                        <option>Custom Range</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Severity</label>
                      <div className="flex gap-1.5">
                        {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(s => (
                          <button key={s} className="flex-1 py-1 text-[8px] font-bold border border-slate-700 rounded bg-slate-800 text-slate-400 hover:border-slate-500">
                            {s.charAt(0)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-8 h-4 bg-slate-800 rounded-full relative border border-slate-700">
                          <div className="absolute left-0.5 top-0.5 w-2.5 h-2.5 bg-slate-500 rounded-full transition-all group-hover:bg-indigo-400" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-200">Emergency Only</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Footer */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-tighter">Live Engine</span>
                </div>
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">Nivaran GIS v2.0</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
