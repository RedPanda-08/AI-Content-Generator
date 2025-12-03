'use client';
import { useState, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Copy, Check, BarChart2, Loader2, CheckCircle2, AlertCircle, Linkedin, Twitter, Instagram } from 'lucide-react';
import Textarea from 'react-textarea-autosize'; 
import { useSupabase } from '../../components/SupabaseProvider'; 

interface SupabaseContextType {
  session: { user?: { is_anonymous?: boolean }; access_token?: string } | null;
  initialized: boolean;
}

export default function GeneratorPage() {
  const context = useSupabase() as SupabaseContextType | null;
  const { session, initialized } = context || { session: null, initialized: false };
  
  const [isReady, setIsReady] = useState(false);
  const user = session?.user;
  const isGuest = user?.is_anonymous;
  const [showBanner, setShowBanner] = useState(true);

  // --- Generator Logic ---
  const [prompt, setPrompt] = useState('');
  // NEW: Platform State
  const [platform, setPlatform] = useState('linkedin');
  
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Safety Check
  useEffect(() => {
    if (initialized) {
      setIsReady(true);
      return;
    }
    if (context === null) {
       setIsReady(true);
       return;
    }
    const timer = setTimeout(() => {
      if (!isReady) setIsReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [initialized, context]);

  useEffect(() => {
    if (isReady && isGuest) {
    }
  }, [isReady, isGuest]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setSubmittedPrompt(prompt);
    setIsGenerating(true);
    setError(null);
    setGeneratedContent('');
    setAnalysis(null); 

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

  if (!isReady) {
      return (
        <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      );
  }

  // Helper icon for dropdown
  const getPlatformIcon = (p: string) => {
      if (p === 'linkedin') return <Linkedin className="w-4 h-4 text-blue-400" />;
      if (p === 'twitter') return <Twitter className="w-4 h-4 text-sky-400" />;
      if (p === 'instagram') return <Instagram className="w-4 h-4 text-pink-400" />;
      return <Bot className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4 py-6 relative">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {/* MAIN CONTENT AREA */}
      <div className="flex-grow overflow-y-auto pr-4 no-scrollbar">
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
                <div onClick={() => handleCardClick('Write a witty tweet about the struggles of debugging code', 'twitter')} className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 rounded-2xl transition-all cursor-pointer text-left">
                  <h3 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><Twitter className="w-4 h-4 text-sky-400"/> Witty Tweet</h3>
                  <p className="text-sm text-gray-500">Create a humorous tweet about debugging struggles</p>
                </div>
                <div onClick={() => handleCardClick('Create an engaging Instagram caption for a picture of a sunset', 'instagram')} className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-2xl transition-all cursor-pointer text-left">
                  <h3 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-400"/> Instagram Caption</h3>
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
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 uppercase tracking-wider">
                    {getPlatformIcon(platform)}
                    Generated for {platform}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {isGenerating ? (
                <div className="flex-1"><span className="text-gray-400 text-sm">Generating...</span></div>
              ) : (
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">{generatedContent}</div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
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
                     <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl text-blue-200 whitespace-pre-wrap">
                        {isAnalyzing ? "Analyzing..." : analysis}
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
          
          {/* NEW: Platform Selector Header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
            <span className="text-xs text-gray-500 font-medium">Target Platform:</span>
            <div className="flex gap-1">
                {['linkedin', 'twitter', 'instagram'].map((p) => (
                    <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`
                            px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-all
                            ${platform === p 
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                                : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-300'
                            }
                        `}
                    >
                        {getPlatformIcon(p)}
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
            </div>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Write a ${platform} post about...`}
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 rounded-b-2xl py-4 pl-6 pr-16 resize-none outline-none"
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
    </div>
  );
}