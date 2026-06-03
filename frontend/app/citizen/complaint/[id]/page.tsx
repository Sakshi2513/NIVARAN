'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Clock, MapPin, Building2, 
  Calendar, CheckCircle2, Circle, 
  Loader2, AlertCircle, Timer,
  ShieldCheck, Share2, TrendingUp,
  Activity, BarChart3, ChevronDown, Zap
} from 'lucide-react';
import { LiveComplaintFeed, ComplaintRecord } from '../../../../services/liveComplaintFeed';

const STATUS_STEPS = ['Received', 'Assigned', 'In Progress', 'Resolved'] as const;

export default function ComplaintDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [complaint, setComplaint] = useState<ComplaintRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = LiveComplaintFeed.subscribe((complaints) => {
      const found = complaints.find(c => c.id === id);
      if (found) {
        setComplaint(found);
        setIsLoading(false);
      }
    });

    // If still loading after 3s, it might not exist
    const timer = setTimeout(() => {
      if (isLoading && !complaint) {
        // Mock finding it if it's a known ID but store is fresh
        if (id === '8924') {
           setIsLoading(false);
        } else {
           // router.push('/citizen/track');
        }
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [id, isLoading, complaint, router]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
         <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
         <p className="text-slate-500 font-medium">Loading issue intelligence...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
         <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
         <h2 className="text-2xl font-bold text-slate-900">Issue Not Found</h2>
         <p className="text-slate-500 mt-2 mb-6">The grievance ID #CMP-{id} could not be retrieved.</p>
         <button onClick={() => router.push('/citizen/track')} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Back to Tracking</button>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(complaint.status as any);

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-modal-in">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold text-sm">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        <div className="flex gap-2">
           <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500"><Share2 className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Complaint Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
               <span className="text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest">#CMP-{complaint.id}</span>
               <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                 complaint.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
               }`}>
                 {complaint.status}
               </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">{complaint.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{complaint.description}</p>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800">
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Building2 className="w-4 h-4" /> Assigned Department
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{complaint.department}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Timer className="w-4 h-4" /> Expected Resolution
                  </p>
                  <p className="text-sm font-bold text-blue-600">Within {complaint.eta}</p>
               </div>
            </div>
          </div>

          {/* Real-Time Status Tracker (Delivery Style) */}
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
             <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> Resolution Progress
             </h3>

             <div className="relative">
                {/* Connector Line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div 
                  className="absolute left-6 top-0 w-1 bg-blue-600 rounded-full transition-all duration-1000 ease-in-out" 
                  style={{ height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                <div className="space-y-12">
                   {STATUS_STEPS.map((step, idx) => {
                     const isCompleted = idx <= currentStepIndex;
                     const isCurrent = idx === currentStepIndex;
                     
                     return (
                       <div key={step} className="relative flex items-center gap-8 pl-4">
                          <div className={`relative z-10 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 transition-all duration-500 ${
                            isCompleted ? 'bg-blue-600 scale-125' : 'bg-slate-200 dark:bg-slate-700'
                          }`}>
                            {isCurrent && <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-50" />}
                          </div>
                          <div>
                             <p className={`text-sm font-bold transition-colors ${
                               isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                             }`}>
                               {step}
                             </p>
                             {isCurrent && (
                               <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">
                                  Current Status
                               </motion.p>
                             )}
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Timeline & Metadata */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Activity Log</h3>
              <div className="space-y-6">
                 {complaint.statusHistory?.slice().reverse().map((event, idx) => (
                   <div key={idx} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                         <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-blue-500' : 'bg-slate-700'}`} />
                         {idx !== (complaint.statusHistory?.length || 0) - 1 && <div className="w-px h-full bg-slate-800 my-1" />}
                      </div>
                      <div>
                         <p className="text-xs font-bold">{event.status}</p>
                         <p className="text-[10px] text-slate-500 mt-1">
                            {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {event.updatedBy}
                         </p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Location Context</h3>
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    <MapPin className="w-5 h-5" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Ward {complaint.location.ward}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tight">Active District Boundary</p>
                 </div>
              </div>
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                 {/* Map Placeholder */}
                 <div className="w-full h-full bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-slate-400" />
                 </div>
              </div>
           </div>

           {/* NEW: Future Impact Simulator */}
           {complaint.aiAnalysis?.futureImpact && (
             <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-blue-600" /> Future Impact Simulator
                 </h3>
                 <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded text-[8px] font-black text-amber-600 uppercase">
                   Predictive
                 </div>
               </div>

               <p className="text-[10px] text-slate-500 font-bold mb-6 italic leading-relaxed">
                 "If no action is taken, here is what the city may experience:"
               </p>

               <div className="space-y-4">
                 {complaint.aiAnalysis.futureImpact.simulations.map((sim: any, idx: number) => {
                   const colorMap = {
                     'LOW': 'bg-emerald-500',
                     'MEDIUM': 'bg-amber-500',
                     'HIGH': 'bg-orange-500',
                     'CRITICAL': 'bg-red-500'
                   };
                   const textColorMap = {
                     'LOW': 'text-emerald-500',
                     'MEDIUM': 'text-amber-500',
                     'HIGH': 'text-orange-500',
                     'CRITICAL': 'text-red-500'
                   };

                   return (
                     <div key={idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                       <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase">{sim.delayHours}h Horizon</span>
                          <span className={`text-[10px] font-black uppercase ${textColorMap[sim.impactLevel as keyof typeof textColorMap]}`}>{sim.impactLevel}</span>
                       </div>
                       <p className="text-[11px] font-bold text-slate-900 dark:text-white mb-3 leading-tight">{sim.predictedOutcome}</p>
                       
                       <div className="space-y-1">
                          <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase">
                             <span>Risk Escalation</span>
                             <span>{sim.riskScore}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: `${sim.riskScore}%` }} 
                               className={`h-full ${colorMap[sim.impactLevel as keyof typeof colorMap]}`} 
                             />
                          </div>
                       </div>
                     </div>
                   );
                 })}
               </div>

               <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                     <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                     <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tighter">AI Strategy Insight</p>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                     {complaint.aiAnalysis.futureImpact.summaryInsight}
                  </p>
               </div>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
