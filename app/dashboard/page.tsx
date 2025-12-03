'use client';
import { useState, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Copy, Check, BarChart2, Loader2, CheckCircle2, AlertCircle, } from 'lucide-react';
import Textarea from 'react-textarea-autosize'; 
import { useSupabase } from '../../components/SupabaseProvider'; 
import { ToastContainer } from "react-toastify";

interface SupabaseContextType {
  session: { user?: { is_anonymous?: boolean }; access_token?: string } | null;
  initialized: boolean;
}

export default function GeneratorPage() {
  // Safe access to context
  const context = useSupabase() as SupabaseContextType | null;
  const { session, initialized } = context || { session: null, initialized: false };
  
  // Local loading state to prevent infinite spinner
  const [isReady, setIsReady] = useState(false);

  const user = session?.user;
  const isGuest = user?.is_anonymous;
  const [showBanner, setShowBanner] = useState(true);

  // SAFETY CHECK: Force load after 2 seconds if provider hangs
  useEffect(() => {
    // If initialized is true, we are ready immediately
    if (initialized) {
      setIsReady(true);
      return;
    }

    // If context is null (provider missing), stop loading immediately
    if (context === null) {
       console.error("SupabaseProvider Context is missing.");
       setIsReady(true);
       return;
    }

    // Otherwise, wait max 2 seconds for initialization
    const timer = setTimeout(() => {
      if (!isReady) {
        console.warn("Initialization timed out. Forcing load.");
        setIsReady(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [initialized, context]);


  // --- Generator Logic ---
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Debug Logs
  useEffect(() => {
    if (isReady) {
        console.log("Dashboard Ready. User:", user ? "Found" : "Missing");
    }
  }, [isReady, user]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setSubmittedPrompt(prompt);
    setIsGenerating(true);
    setError(null);
    setGeneratedContent('');
    setAnalysis(null); 

    try {
      // Send token if available (fixes unauthorized)
      const accessToken = session?.access_token;
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setGeneratedContent(data.content);
      // Optional: window.location.reload(); 

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };
  
  const handleCardClick = (text: string) => { setPrompt(text); };
  
  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent).then(() => {
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

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Analysis failed');
        }
        setAnalysis(data.analysis);

    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setAnalysis(`Error: ${errorMessage}`);
    } finally {
        setIsAnalyzing(false);
    }
  };


  const formatAnalysis = (text: string) => {  
    if (!text) return '';
    return text; 
  };


  // 1. LOADING STATE (With timeout protection)
  if (!isReady) {
      return (
        <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="text-zinc-500 text-sm">Initializing...</span>
            </div>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4 py-6">



      <div className="flex-grow overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {!submittedPrompt ? (
            <div className="text-center py-12">
              <div className="inline-flex p-6 bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl mb-6 shadow-lg shadow-orange-500/30">
                <Bot size={48} className="text-white" />
              </div>
             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
               How can I help you today?
             </h1>
             <p className="text-gray-500 mb-12">Choose a prompt below or type your own</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                <div onClick={() => handleCardClick('Write a witty tweet about the struggles of debugging code')} className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 rounded-2xl transition-all cursor-pointer text-left">
                  <h3 className="font-semibold text-gray-200 mb-2">Witty Tweet</h3>
                  <p className="text-sm text-gray-500">Create a humorous tweet about debugging struggles</p>
                </div>
                <div onClick={() => handleCardClick('Create an engaging Instagram caption for a picture of a sunset')} className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-2xl transition-all cursor-pointer text-left">
                  <h3 className="font-semibold text-gray-200 mb-2">Instagram Caption</h3>
                  <p className="text-sm text-gray-500">Craft an engaging caption for a sunset photo</p>
                </div>
             </div>
           </div>
        ) : (
          <div className="space-y-8 pb-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 mt-1">
                <p className="text-gray-200 text-lg">{submittedPrompt}</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {isGenerating ? (
                <div className="flex-1">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                      <span className="text-gray-400 text-sm font-medium">Generating your content...</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-fadeIn">
                    <div className="text-gray-200 leading-loose font-['Inter',sans-serif] text-[15px]" style={{ 
                      lineHeight: '1.8',
                      letterSpacing: '0.01em'
                    }}>
                      {generatedContent.split('\n').map((paragraph, index) => (
                        paragraph.trim() ? (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ) : (
                          <br key={index} />
                        )
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/10">
                        <button onClick={handleCopy} className="flex items-center cursor-pointer gap-2 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                            {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                            {copySuccess ? 'Copied' : 'Copy'}
                        </button>
                        <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg transition-colors disabled:opacity-50">
                            {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <BarChart2 size={14} />}
                            Analyze
                        </button>
                    </div>
                  </div>
                  {(isAnalyzing || analysis) && (
                     <div className="mt-4 p-5 bg-gradient-to-br from-blue-900/20 to-purple-900/10 border border-blue-500/20 rounded-2xl animate-fadeIn shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <BarChart2 className="w-4 h-4 text-blue-400" />
                          <h4 className="text-blue-300 text-sm font-bold tracking-wide">Content Analysis</h4>
                        </div>
                        {isAnalyzing ? (
                          <div className="flex items-center gap-3 py-2">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                            <span className="text-sm text-blue-300 font-medium">Analyzing your content...</span>
                          </div>
                        ) : (
                          <div className="text-sm text-blue-100/90 leading-relaxed font-['Inter',sans-serif] space-y-3" style={{ lineHeight: '1.8' }}>
                            {analysis?.split('\n').map((line, index) => {
                              // Remove asterisks and clean up formatting
                              const cleanLine = line
                                .replace(/\*\*/g, '')  // Remove bold asterisks
                                .replace(/\*/g, '')    // Remove single asterisks
                                .replace(/^#+\s*/, '') // Remove markdown headers
                                .trim();
                              
                              // Skip empty lines
                              if (!cleanLine) return null;
                              
                              // Check if it's a heading (starts with capital and is short)
                              const isHeading = cleanLine.length < 60 && /^[A-Z]/.test(cleanLine) && !cleanLine.includes('.');
                              
                              return isHeading ? (
                                <h5 key={index} className="text-blue-200 font-semibold mt-4 first:mt-0 text-[15px]">
                                  {cleanLine}
                                </h5>
                              ) : (
                                <p key={index} className="text-blue-100/80">
                                  {cleanLine}
                                </p>
                              );
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

      <div className="mt-6 flex-shrink-0">
        <div className="relative bg-white/5 border border-white/10 rounded-2xl focus-within:border-orange-500/50 transition-colors">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Message ContentAI..."
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 rounded-2xl py-4 pl-6 pr-16 resize-none outline-none font-['Inter',sans-serif]"
            minRows={1}
            maxRows={8}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
          />
          <button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl transition-all shadow-lg hover:scale-105 disabled:scale-100 disabled:opacity-50">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-3">ContentAI can make mistakes. Consider checking important information.</p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}