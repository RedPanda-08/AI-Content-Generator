'use client';
import { useState, useEffect } from 'react'; // Removed useRef
import { Send, Bot, Sparkles, User, Copy, Check, BarChart2, Loader2, Linkedin, Twitter, Instagram } from 'lucide-react';
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

  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // REMOVED: const bottomRef = useRef...
  // REMOVED: The useEffect that triggered scrollIntoView

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

  const getPlatformIcon = (p: string) => {
      if (p === 'linkedin') return <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />;
      if (p === 'twitter') return <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" />;
      if (p === 'instagram') return <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />;
      return <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-4xl mx-auto px-4 pt-16 relative">
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 no-scrollbar">
         <div className="pb-4 min-h-full">
        {!submittedPrompt ? (
            <div className="text-center py-8 sm:py-12 px-2">
              <div className="inline-flex p-4 sm:p-6 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-lg shadow-orange-500/30">
                <Bot size={40} className="sm:w-12 sm:h-12 text-white" />
              </div>
             <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2 sm:mb-3 px-2">
               How can I help you today?
             </h1>
             <p className="text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base">Choose a prompt below or type your own</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-8 sm:mt-10 md:mt-12">
                <div onClick={() => handleCardClick('Write a witty tweet about the struggles of debugging code', 'twitter')} className="p-4 sm:p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left">
                  <h3 className="font-semibold text-gray-200 mb-1.5 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Twitter className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400"/> 
                    Witty Tweet
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">Create a humorous tweet about debugging struggles</p>
                </div>
                <div onClick={() => handleCardClick('Create an engaging Instagram caption for a picture of a sunset', 'instagram')} className="p-4 sm:p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-xl sm:rounded-2xl transition-all cursor-pointer text-left">
                  <h3 className="font-semibold text-gray-200 mb-1.5 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400"/> 
                    Instagram Caption
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">Craft an engaging caption for a sunset photo</p>
                </div>
             </div>
           </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 pb-4 pt-12 sm:pt-0">
            <div className="flex gap-2.5 sm:gap-3 md:gap-4 items-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 mt-0.5 sm:mt-1">
                <p className="text-gray-200 text-base sm:text-lg leading-relaxed">{submittedPrompt}</p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    {getPlatformIcon(platform)}
                    Generated for {platform}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2.5 sm:gap-3 md:gap-4 items-start">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/30">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
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
                  <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fadeIn">
                    <div className="text-gray-200 leading-loose font-['Inter',sans-serif] text-sm sm:text-[15px]" style={{ 
                      lineHeight: '1.8',
                      letterSpacing: '0.01em'
                    }}>
                      {generatedContent.split('\n').map((paragraph, index) => (
                        paragraph.trim() ? (
                          <p key={index} className="mb-3 sm:mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        ) : (
                          <br key={index} />
                        )
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-end gap-2 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/10">
                        <button onClick={handleCopy} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                            {copySuccess ? <Check size={12} className="sm:w-3.5 sm:h-3.5" /> : <Copy size={12} className="sm:w-3.5 sm:h-3.5" />}
                            {copySuccess ? 'Copied' : 'Copy'}
                        </button>
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
                              const cleanLine = line
                                .replace(/\*\*/g, '')
                                .replace(/\*/g, '')
                                .replace(/^#+\s*/, '')
                                .trim();
                              
                              if (!cleanLine) return null;
                              
                              const isHeading = cleanLine.length < 60 && /^[A-Z]/.test(cleanLine) && !cleanLine.includes('.');
                              
                              return isHeading ? (
                                <h5 key={index} className="text-blue-200 font-semibold mt-3 sm:mt-4 first:mt-0 text-xs sm:text-[15px]">
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
        {/* REMOVED: <div ref={bottomRef} /> */}
      </div>
      </div>

      {/* INPUT AREA */}
      <div className="mt-4 flex-shrink-0 pb-6 sm:pb-6">
        <div className="relative bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl focus-within:border-orange-500/50 transition-colors">
          
          {/* Platform Selector Header */}
          <div className="flex flex-wrap items-center gap-2 px-3 sm:px-4 py-2 border-b border-white/5">
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Target Platform:</span>
            <div className="flex gap-1 flex-wrap">
                {['linkedin', 'twitter', 'instagram'].map((p) => (
                    <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`
                            px-2 sm:px-2.5 md:px-3 py-1 rounded-full text-[10px] sm:text-xs flex items-center gap-1 transition-all whitespace-nowrap
                            ${platform === p 
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                                : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-gray-300'
                            }
                        `}
                    >
                        {getPlatformIcon(p)}
                        <span>{p.charAt(0).toUpperCase() + p.slice(1)}</span>
                    </button>
                ))}
            </div>
          </div>

          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Write a ${platform} post about...`}
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 rounded-b-xl sm:rounded-b-2xl py-3 sm:py-4 pl-3 sm:pl-4 md:pl-6 pr-12 sm:pr-14 md:pr-16 resize-none outline-none text-sm sm:text-base font-['Inter',sans-serif]"
            minRows={1}
            maxRows={6}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
          />
          <button 
            onClick={handleGenerate} 
            disabled={!prompt.trim() || isGenerating} 
            className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 p-2 sm:p-2.5 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg sm:rounded-xl transition-all shadow-lg hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
        <p className="text-[10px] sm:text-xs text-gray-600 text-center mt-2 sm:mt-3 px-2">ContentAI can make mistakes. Consider checking important information.</p>
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