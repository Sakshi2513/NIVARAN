'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card';
import { COMPLAINT_CATEGORIES } from '../../../lib/constants';
import { 
  Upload, MapPin, AlertCircle, Loader2, 
  Mic, MicOff, CheckCircle2, Languages,
  ChevronRight, ArrowRight, BrainCircuit, Sparkles,
  Image as ImageIcon, X
} from 'lucide-react';
import api from '../../../services/api';
import { analyzeComplaint, type AIAnalysis, type AIDuplicateResult } from '../../../services/aiGovernanceEngine';
import { AIAnalysisCard } from '../../../components/ai/AIComponents';
import { LiveComplaintFeed } from '../../../services/liveComplaintFeed';
import { LanguageService, MultilingualText } from '../../../services/languageService';

export default function FileComplaintPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(COMPLAINT_CATEGORIES[0]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [aiResult, setAiResult] = useState<(AIAnalysis & { duplicates: AIDuplicateResult }) | null>(null);
  const [multilingualData, setMultilingualData] = useState<MultilingualText | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  // Voice Recognition Setup
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-IN'; // Supports Hindi/English mix in India

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setDescription(transcript);
        };

        rec.onend = () => setIsListening(false);
        setRecognition(rec);
      }
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  const handleInitialProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Language Detection & Translation
      const langResult = await LanguageService.processInput(description);
      setMultilingualData(langResult);

      // 2. AI Analysis on Translated Text (English)
      const analysis = analyzeComplaint(title, langResult.translated, [], 28.6139, 77.2090);
      setAiResult(analysis);
      setCategory(analysis.category.category); // Auto-suggest category
      
      setShowReview(true);
    } catch (error) {
      console.error('Failed to process input', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    try {
      // Submit to API
      await api.post('/complaints', {
        title,
        description,
        multilingual: multilingualData,
        aiAnalysis: aiResult,
        image: selectedImage,
        location: { lat: 28.6139, lng: 77.2090, address: 'New Delhi, India' }
      });

      // Publish to Live Feed
      await LiveComplaintFeed.createComplaint({
        title,
        description: multilingualData?.translated || description,
        ward: 'Sector 7'
      });

      setSuccessMsg('Complaint filed successfully! AI has analyzed and routed your issue.');
      setTimeout(() => router.push('/citizen/track'), 2000);
    } catch (error) {
      console.error('Final submission failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-modal-in">
      <PageHeader 
        title="File a Grievance" 
        description="Provide details via text or voice. Our AI will detect the language, translate it, and route it instantly."
      />

      <AnimatePresence>
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-6 rounded-3xl flex items-center gap-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <p className="font-bold">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showReview ? (
        <form onSubmit={handleInitialProcess} className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                 <CardTitle>Issue Intelligence Intake</CardTitle>
                 <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
                    <Languages className="w-4 h-4 text-blue-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-400">Multi-lingual Mode</span>
                 </div>
              </div>
            </CardHeader>
            <div className="space-y-6 p-8 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Complaint Title</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
                    placeholder="e.g. Broken water pipe on Main Street"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Visual Evidence (Optional)</label>
                  <div className="relative group">
                    {selectedImage ? (
                      <div className="relative h-[58px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group/img">
                        <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-1/2 right-4 -translate-y-1/2 p-1.5 bg-slate-900/80 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-between h-[58px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50/10 transition-all">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
                          <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">Upload Image Proof</span>
                        </div>
                        <Upload className="w-4 h-4 text-slate-300" />
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description (Speak or Type)</label>
                <textarea 
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-sm outline-none transition-all focus:ring-4 focus:ring-blue-500/10 resize-none pr-16"
                  placeholder="Describe your issue in your preferred language (Hindi, Tamil, Marathi, etc.)..."
                />
                <button 
                  type="button"
                  onClick={toggleListening}
                  className={`absolute bottom-6 right-6 p-4 rounded-full transition-all shadow-lg ${
                    isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-white hover:bg-blue-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                {isListening && (
                  <div className="absolute top-10 right-6">
                     <span className="text-[10px] font-black text-red-600 uppercase tracking-widest animate-pulse">Listening...</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-4">
             <button type="submit" disabled={isLoading} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all flex items-center gap-2 shadow-xl">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Process with AI
             </button>
          </div>
        </form>
      ) : (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <BrainCircuit className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Intelligence Review</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Verify AI Interpretation</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Your Input ({multilingualData?.detectedLanguage})</p>
                       <p className="text-sm font-medium p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 italic">"{multilingualData?.original}"</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">AI Translation (English)</p>
                       <p className="text-sm font-bold p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800">"{multilingualData?.translated}"</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-3xl text-white">
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">AI Assessment</p>
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold">Category</span>
                             <span className="text-xs font-black text-blue-400 uppercase">{aiResult?.category?.category}</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold">Severity Score</span>
                             <span className={`text-xs font-black ${aiResult?.severity?.score && aiResult.severity.score > 70 ? 'text-red-400' : 'text-emerald-400'}`}>{aiResult?.severity?.score} / 100</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold">Priority</span>
                             <span className="text-xs font-black uppercase text-amber-400">{aiResult?.priority}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                 <button onClick={() => setShowReview(false)} className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900">Edit Input</button>
                 <button onClick={handleFinalSubmit} className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-2">
                    Confirm & File Complaint <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
