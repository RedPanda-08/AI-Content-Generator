'use client';
import { useState, useEffect, useRef, useCallback } from 'react'; 
import { Send, Bot, Sparkles, User, Copy, Check, CheckCircle2, BarChart2, Loader2, Linkedin, Twitter, Instagram, X, Calendar as CalendarIcon, Clock, AlertTriangle } from 'lucide-react'; 
import Textarea from 'react-textarea-autosize'; 
import { useSupabase } from '../../components/SupabaseProvider'; 
import Link from 'next/link'; 
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr'; 

// --- INTERFACES ---
interface SupabaseContextType {
  session: { 
    user?: { 
      id: string; 
      email?: string; 
      is_anonymous?: boolean 
    }; 
    access_token?: string 
  } | null;
  initialized: boolean;
}

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0);

  const cleanAndFormat = (input: string) => {
    if (!input) return "";
    let cleaned = input.replace(/[\uFFFD\uFEFF]/g, '').replace(/\*/g, '').trim();
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
    else if (cleaned.startsWith("'") && cleaned.endsWith("'")) cleaned = cleaned.slice(1, -1);
    if (cleaned.length > 0) cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return cleaned;
  };

  const processedText = cleanAndFormat(text);

  useEffect(() => {
    if (!processedText) return;
    indexRef.current = 0;
    setDisplayedText('');
    const intervalId = setInterval(() => {
      if (indexRef.current < processedText.length) {
        setDisplayedText((prev) => prev + processedText.charAt(indexRef.current));
        indexRef.current++;
      } else {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 8);
    return () => clearInterval(intervalId);
  }, [processedText, onComplete]);

  return (
    <div className="text-gray-300 leading-relaxed font-['Inter',sans-serif] text-sm sm:text-[15px]" style={{ lineHeight: '1.8', letterSpacing: '0.01em' }}>
      {displayedText.split('\n').map((paragraph, index) => (
        paragraph.trim() ? <p key={index} className="mb-3 last:mb-0 animate-fadeIn">{paragraph}</p> : <br key={index} />
      ))}
    </div>
  );
};

export default function GeneratorPage() {
  const context = useSupabase() as SupabaseContextType | null;
  const { session, initialized } = context || { session: null, initialized: false };
  
  // 1. Direct Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [isReady, setIsReady] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [copySuccess, setCopySuccess] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [isGuestAccount, setIsGuestAccount] = useState(false);

  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  
  // State for Toast Display
  const [scheduledDisplayString, setScheduledDisplayString] = useState('');

  const scheduleContainerRef = useRef<HTMLDivElement>(null);

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

  useEffect(() => {
    if (initialized) { setIsReady(true); return; }
    if (context === null) { setIsReady(true); return; }
    const timer = setTimeout(() => { if (!isReady) setIsReady(true); }, 2000);
    return () => clearTimeout(timer);
  }, [initialized, context]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setSubmittedPrompt(prompt);
    setIsGenerating(true);
    setError(null);
    setGeneratedContent('');
    setAnalysis(null); 
    setIsTypingComplete(false); 
    setShowCreditModal(false); 
    setScheduleSuccess(false);
    setShowDatePicker(false);

    try {
      const accessToken = session?.access_token;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ prompt, platform }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.error || '';
        if (errorMsg === 'TRIAL_EXHAUSTED' || errorMsg === 'CREDIT_EXHAUSTED') {
            setIsGuestAccount(errorMsg === 'TRIAL_EXHAUSTED');
            setShowCreditModal(true);
            setIsGenerating(false); 
            return; 
        }
        throw new Error(data.error || 'Something went wrong');
      }
      setGeneratedContent(data.content);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };
  
  const handleCardClick = (text: string, platformType: string = 'twitter') => { 
      setPrompt(text);
      setPlatform(platformType);
  };
  
  const handleCopy = () => {
    if (!generatedContent) return;
    const cleanText = generatedContent.replace(/\*/g, '').trim(); 
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleAnalyze = async () => {
    if (!generatedContent) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setError(null); 
    const accessToken = session?.access_token;
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ contentToAnalyze: generatedContent }),
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Analysis failed');
        }
        const data = await response.json();
        setAnalysis(data.analysis || data.content || "No analysis returned");
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setAnalysis(`Error: ${errorMessage}`);
    } finally {
        setIsAnalyzing(false);
    }
  };

  // --- THE FINAL FIXED SCHEDULE FUNCTION ---
  const handleScheduleConfirm = async () => {
    // Safety check for user session
    if (!scheduledDate || !generatedContent || !session?.user) {
        console.error("Missing Data:", { scheduledDate, user: session?.user });
        return;
    }
    
    setIsScheduling(true);
    setError(null);

    // 1. Clean Content
    let cleanContent = generatedContent.replace(/[\uFFFD\uFEFF]/g, '').replace(/\*/g, '').trim();
    if (cleanContent.startsWith('"') && cleanContent.endsWith('"')) cleanContent = cleanContent.slice(1, -1);
    else if (cleanContent.startsWith("'") && cleanContent.endsWith("'")) cleanContent = cleanContent.slice(1, -1);
    if (cleanContent.length > 0) cleanContent = cleanContent.charAt(0).toUpperCase() + cleanContent.slice(1);

    // 2. Prepare Title
    const promptTitle = submittedPrompt || "AI Generated Post";
    const finalTitle = promptTitle.length > 60 ? promptTitle.substring(0, 60) + "..." : promptTitle;

    // 3. Safe Email
    const userEmail = session.user.email || "";

    try {
        // --- ⚡ STANDARD UTC FIX ⚡ ---
        // Browser input: "2025-12-14T09:00" (Your Local Time)
        const dateObj = new Date(scheduledDate);
        
        // This converts local 9:00 AM to UTC (e.g., 3:30 AM if in IST).
        // This is correct. The database stores UTC. The Frontend converts it back.
        const finalDate = dateObj.toISOString();

        // Format Toast Message (Show local time to user)
        const displayString = dateObj.toLocaleString('en-IN', { 
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true 
        });
        setScheduledDisplayString(displayString);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const client = supabase as any; 

        // 4. Insert into Database
        const { error } = await client.from('content_schedule').insert({
            user_id: session.user.id,
            user_email: userEmail,          
            title: finalTitle,              
            content: cleanContent,          
            platform: platform,
            date: finalDate,                
            notify: true,                   
            status: 'pending'
        });

        if (error) throw error;

        setScheduleSuccess(true);
        setTimeout(() => {
            setShowDatePicker(false);
            setScheduleSuccess(false);
        }, 1500);
        
    } catch (err: unknown) {
        let msg = "Failed to schedule.";
        if (err instanceof Error) {
            msg = err.message;
        } else if (typeof err === "object" && err !== null && "message" in err) {
            msg = (err as { message: string }).message;
        }
        console.error("Schedule error:", msg);
        setError(msg);
    } finally {
        setIsScheduling(false);
    }
  };

  if (!isReady) {
      return (
        <div className="flex h-[100svh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      );
  }

  const getPlatformIcon = (p: string) => {
      if (p === 'linkedin') return <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />;
      if (p === 'twitter') return <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />;
      if (p === 'instagram') return <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />;
      return <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-[100svh] overflow-hidden max-w-4xl mx-auto px-4 pt-20 sm:pt-4 relative">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

      {/* --- SUCCESS TOAST --- */}
      <AnimatePresence>
        {scheduleSuccess && (
             <motion.div 
                initial={{ opacity: 0, y: -20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-4 right-4 z-50 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
             >
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                   <p className="font-bold text-sm">Post Scheduled!</p>
                   {/* Displays correct IST time to user */}
                   <p className="text-xs opacity-80">{scheduledDisplayString}</p> 
                </div>
             </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDatePicker && (
            <>
                <div className="fixed inset-0 z-50 flex md:hidden items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDatePicker(false)} />
                     <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-[#121212] border border-white/10 p-6 rounded-3xl shadow-2xl w-full max-w-xs relative overflow-hidden z-10">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -z-10" />
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-zinc-800 rounded-xl">
                                    <Clock className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight">Schedule</h3>
                                    <p className="text-[11px] text-zinc-400">Pick a time to post</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDatePicker(false)} className="text-zinc-500 hover:text-white p-1"><X className="w-4 h-4" /></button>
                        </div>
                        <input type="datetime-local" className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-orange-500 mb-5 [color-scheme:dark] shadow-inner" onChange={(e) => setScheduledDate(e.target.value)} />
                        <button onClick={handleScheduleConfirm} disabled={!scheduledDate || isScheduling} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl font-semibold text-sm text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                            {isScheduling ? <Loader2 className="w-4 h-4 animate-spin" /> : scheduleSuccess ? <Check className="w-4 h-4" /> : 'Confirm & Save'}
                        </button>
                    </motion.div>
                </div>
                <div className="hidden md:block fixed inset-0 z-40 bg-transparent" onClick={() => setShowDatePicker(false)} />
            </>
        )}
      </AnimatePresence>

      {showCreditModal && (
          <div className="w-full mt-2 sm:mt-6 mb-2 animate-fadeIn flex-shrink-0 z-20">
              <div className="bg-zinc-900 border border-red-500/50 rounded-xl shadow-lg shadow-red-500/10 p-4 relative flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/10 rounded-full flex-shrink-0">
                             {isGuestAccount ? <Sparkles className="w-5 h-5 text-red-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                          </div>
                          <h3 className="text-base font-bold text-white leading-tight">{isGuestAccount ? 'Trial Complete!' : 'Credits Depleted'}</h3>
                      </div>
                      <button onClick={() => setShowCreditModal(false)} className="text-zinc-500 hover:text-white transition-colors p-1"><X className="w-4 h-4" /></button>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{isGuestAccount ? 'Your 3 free posts are used. Sign up now to get 500 more tokens instantly.' : 'You have used all your available credits. Get more to continue generating content.'}</p>
                  <div className="flex gap-2 w-full">
                      <Link href={isGuestAccount ? '/login' : '/pricing'} className="flex-1 py-2 text-center bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity shadow-md">{isGuestAccount ? 'Get 500 Tokens' : 'Get More Credits'}</Link>
                  </div>
              </div>
          </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 no-scrollbar pb-2">
         <div className="pb-32 sm:pb-24 min-h-full">
        {!submittedPrompt ? (
            <div className={`text-center px-2 ${showCreditModal ? 'py-4' : 'py-8 sm:py-12'}`}>
              <div className="inline-flex p-4 sm:p-6 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg shadow-orange-500/30">
                <Bot size={40} className="sm:w-12 sm:h-12 text-white" />
              </div>
             <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2 sm:mb-3 px-2">How can I help you today?</h1>
             <p className="text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base">Choose a prompt below or type your own</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12">
                <div onClick={() => handleCardClick('Write a witty tweet about the struggles of debugging code', 'twitter')} className="p-4 sm:p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left">
                  <h3 className="font-semibold text-gray-200 mb-1.5 sm:mb-2 flex items-center gap-2 text-sm sm:text-base"><Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400"/> Witty Tweet</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Create a humorous tweet about debugging struggles</p>
                </div>
                <div onClick={() => handleCardClick('Create an engaging Instagram caption for a picture of a sunset', 'instagram')} className="p-4 sm:p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left">
                  <h3 className="font-semibold text-gray-200 mb-1.5 sm:mb-2 flex items-center gap-2 text-sm sm:text-base"><Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400"/> Instagram Caption</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Craft an engaging caption for a sunset photo</p>
                </div>
             </div>
           </div>
        ) : (
          <div className={`space-y-6 sm:space-y-8 pb-4 ${showCreditModal ? 'pt-2' : 'pt-4 sm:pt-0'}`}>
            <div className="flex gap-2.5 sm:gap-3 md:gap-4 items-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1"><User className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></div>
              <div className="flex-1 mt-0.5 sm:mt-1 min-w-0">
                <p className="text-gray-200 text-base sm:text-lg leading-relaxed break-words">{submittedPrompt}</p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{getPlatformIcon(platform)} Generated for {platform}</div>
              </div>
            </div>
            
            <div className="flex gap-2.5 sm:gap-3 md:gap-4 items-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/30"><Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></div>
              {isGenerating ? (
                <div className="flex-1">
                  <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-gray-400 text-xs sm:text-sm font-medium">Generating your content...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fadeIn relative">
                    <Typewriter text={generatedContent} onComplete={handleTypingComplete} />
                    <div className={`flex flex-wrap justify-end gap-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10 transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <button onClick={handleCopy} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                            {copySuccess ? <Check size={12} className="sm:w-3.5 sm:h-3.5" /> : <Copy size={12} className="sm:w-3.5 sm:h-3.5" />}
                            {copySuccess ? 'Copied' : 'Copy'}
                        </button>
                        
                        <div className="relative z-50" ref={scheduleContainerRef}>
                            <button onClick={() => setShowDatePicker(!showDatePicker)} className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors ${showDatePicker ? 'bg-white/20 text-white' : ''}`}>
                                <CalendarIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                                Schedule
                            </button>
                            <AnimatePresence>
                                {showDatePicker && (
                                    <motion.div initial={{ opacity: 0, y: 5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.98 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} className="hidden md:block absolute right-0 bottom-full mb-2 w-72 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl z-50 p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-orange-500" /> Pick Date & Time</span>
                                            </div>
                                            <input type="datetime-local" className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-white text-xs focus:outline-none focus:border-orange-500 mb-3 [color-scheme:dark]" onChange={(e) => setScheduledDate(e.target.value)} />
                                            <button onClick={handleScheduleConfirm} disabled={!scheduledDate || isScheduling} className="w-full py-2 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg font-semibold text-xs text-white hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                                                {isScheduling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : scheduleSuccess ? <Check className="w-3.5 h-3.5" /> : 'Confirm'}
                                                {scheduleSuccess && ' Done!'}
                                            </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg transition-colors disabled:opacity-50">
                            {isAnalyzing ? <Loader2 size={12} className="sm:w-3.5 sm:h-3.5 animate-spin" /> : <BarChart2 size={12} className="sm:w-3.5 sm:h-3.5" />}
                            Analyze
                        </button>
                    </div>
                  </div>

                  {(isAnalyzing || analysis) && (
                      <div className="mt-3 sm:mt-4 p-4 sm:p-5 bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/20 rounded-xl sm:rounded-2xl animate-fadeIn shadow-lg">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                          <h4 className="text-blue-300 text-xs sm:text-sm font-bold tracking-wide">Content Analysis</h4>
                        </div>
                        {isAnalyzing ? (
                          <div className="flex items-center gap-3 py-2">
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-400" />
                            <span className="text-xs sm:text-sm text-blue-300 font-medium">Analyzing your content...</span>
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-['Inter',sans-serif] space-y-2 sm:space-y-3" style={{ lineHeight: '1.8' }}>
                            {analysis?.split('\n').map((line, index) => {
                              const cleanLine = line.replace(/\*\*/g, '').replace(/\*/g, '').replace(/^#+\s*/, '').trim();
                              if (!cleanLine) return null;
                              const isHeading = cleanLine.length < 60 && /^[A-Z]/.test(cleanLine) && !cleanLine.includes('.');
                              return isHeading ? <h5 key={index} className="text-blue-200 font-semibold mt-3 sm:mt-4 first:mt-0 text-xs sm:text-[15px]">{cleanLine}</h5> : <p key={index} className="text-blue-100/80">{cleanLine}</p>;
                            })}
                          </div>
                        )}
                      </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </div>

      <div className="mt-auto flex-shrink-0 pb-6 sm:pb-6">
        <div className="relative bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus-within:border-orange-500/50 transition-colors">
          <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 border-b border-white/5">
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Target Platform:</span>
            <div className="flex gap-1 flex-wrap">
                {['linkedin', 'twitter', 'instagram'].map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`px-2 sm:px-2.5 md:px-3 py-1 rounded-full text-[10px] sm:text-xs flex items-center gap-1 transition-all whitespace-nowrap ${platform === p ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-300'}`}>
                        {getPlatformIcon(p)}
                        <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                    </button>
                ))}
            </div>
          </div>
          <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={`Write a ${platform} post about...`} className="w-full bg-transparent text-gray-200 placeholder-gray-500 rounded-b-xl sm:rounded-b-2xl py-3 sm:py-4 pl-3 sm:pl-4 md:pl-6 pr-12 sm:pr-14 md:pr-16 resize-none outline-none text-sm sm:text-base font-['Inter',sans-serif]" minRows={1} maxRows={6} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }} />
          <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 p-2 sm:p-2.5 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg sm:rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"><Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></button>
        </div>
        <p className="text-[10px] sm:text-xs text-gray-600 text-center mt-2 sm:mt-3 px-2">ContentAI can make mistakes. Consider checking important information.</p>
      </div>
    </div>
  );
}