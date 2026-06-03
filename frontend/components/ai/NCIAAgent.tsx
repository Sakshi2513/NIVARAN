'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, X, Send, Maximize2, Minimize2, 
  Sparkles, ShieldCheck, MapPin, Phone, 
  AlertTriangle, Zap, BarChart3, Info,
  ChevronRight, BrainCircuit, Activity
} from 'lucide-react';
import { NCIA, NCIAMessage } from '../../services/nciaService';

export function NCIAAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<NCIAMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([
        { 
          role: 'assistant', 
          content: 'NCIA Online. I am the Nivaran Civic Intelligence Agent. How can I assist your governance oversight today?', 
          timestamp: Date.now(),
          type: 'text',
          actions: [
            { label: 'Summarize Ward 7', action: 'summarize' },
            { label: 'Active Hotspots', action: 'hotspots' }
          ]
        }
      ]);
    }
  }, [messages.length]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: NCIAMessage = { role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI Reasoning delay
    setTimeout(async () => {
      const response = await NCIA.processQuery(text);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              width: isExpanded ? '800px' : '400px',
              height: isExpanded ? '700px' : '550px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl flex flex-col overflow-hidden mb-4 transition-all duration-300"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 flex items-center justify-between text-white">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                     <BrainCircuit className="w-6 h-6" />
                  </div>
                  <div>
                     <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
                        NCIA Agent <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     </h3>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Nivaran Intelligence Layer</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-lg hidden md:block">
                     {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                     <X className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-2xl p-4' : 'w-full'}`}>
                       {msg.role === 'assistant' ? (
                         <div className="space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
                               <p className="text-sm leading-relaxed text-slate-900 dark:text-slate-100 whitespace-pre-wrap">{msg.content}</p>
                            </div>

                            {/* Structured Intelligence Metadata */}
                            {msg.type === 'intelligence_report' && msg.metadata?.complaint && (
                              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
                                 <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                       <Activity className="w-4 h-4 text-blue-600" />
                                       <span className="text-[10px] font-black uppercase tracking-widest">Grievance Health</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">{msg.metadata.complaint.status}</span>
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                       <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Risk Score</p>
                                       <p className="text-sm font-black text-red-600">{msg.metadata.complaint.riskScore}</p>
                                    </div>
                                    <div>
                                       <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Severity</p>
                                       <p className="text-sm font-black text-slate-900 dark:text-white">{msg.metadata.complaint.severity}</p>
                                    </div>
                                 </div>
                                 {msg.metadata.officer && (
                                   <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                      <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">Assigned Officer</p>
                                      <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                            {msg.metadata.officer.name.charAt(0)}
                                         </div>
                                         <div>
                                            <p className="text-[11px] font-bold text-slate-900 dark:text-white">{msg.metadata.officer.name}</p>
                                            <p className="text-[9px] text-slate-500 font-medium">ETA: {msg.metadata.officer.visitEta} • {msg.metadata.officer.currentActivity}</p>
                                         </div>
                                      </div>
                                   </div>
                                 )}
                              </div>
                            )}

                            {/* Action Suggestions */}
                            {msg.actions && (
                              <div className="flex flex-wrap gap-2">
                                 {msg.actions.map(action => (
                                   <button 
                                     key={action.label}
                                     onClick={() => handleSend(action.label)}
                                     className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-600 hover:text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-2"
                                   >
                                      {action.label} <ChevronRight className="w-3 h-3" />
                                   </button>
                                 ))}
                              </div>
                            )}
                         </div>
                       ) : (
                         <p className="text-sm font-medium">{msg.content}</p>
                       )}
                    </div>
                 </div>
               ))}
               {isTyping && (
                 <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl px-4 py-3 flex gap-1">
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                       <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    </div>
                 </div>
               )}
            </div>

            {/* Footer Input */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
               <div className="relative">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Query civic intelligence..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-6 pr-14 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                  />
                  <button 
                    onClick={() => handleSend()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-blue-600 text-white p-2.5 rounded-xl transition-all shadow-lg"
                  >
                     <Send className="w-5 h-5" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center shadow-2xl relative group"
      >
        <div className="absolute inset-0 bg-blue-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-xl" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
               <X className="w-8 h-8 text-white dark:text-slate-900" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
               <BrainCircuit className="w-8 h-8 text-white dark:text-slate-900" />
            </motion.div>
          )}
        </AnimatePresence>
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center">
             <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
