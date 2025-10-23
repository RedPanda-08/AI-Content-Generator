'use client';
import { useState } from 'react';
import { Send, Bot, Sparkles, User, Copy, Check, BarChart2, Loader2 } from 'lucide-react';
import Textarea from 'react-textarea-autosize'; 

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [submittedPrompt, setSubmittedPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setSubmittedPrompt(prompt);
    setIsGenerating(true);
    setError(null);
    setGeneratedContent('');
    setAnalysis(null); 

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };
  
  const handleCardClick = (text: string) => {
    setPrompt(text);
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

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contentToAnalyze: generatedContent }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Analysis failed');
        }

        const data = await response.json();
        setAnalysis(data.analysis);
    } catch (err) {
        const error = err as Error;
        setAnalysis(`Error during analysis: ${error.message}`);
    } finally {
        setIsAnalyzing(false);
    }
  };

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
                <div 
                  onClick={() => handleCardClick('Write a witty tweet about the struggles of debugging code')} 
                  className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/50 rounded-2xl transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-200">Witty Tweet</h3>
                  </div>
                  <p className="text-sm text-gray-500">Create a humorous tweet about debugging struggles</p>
                </div>
                
                <div 
                  onClick={() => handleCardClick('Create an engaging Instagram caption for a picture of a sunset')} 
                  className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/50 rounded-2xl transition-all cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-200">Instagram Caption</h3>
                  </div>
                  <p className="text-sm text-gray-500">Craft an engaging caption for a sunset photo</p>
                </div>
             </div>
           </div>
        ) : (
          <div className="space-y-8 pb-4">
            {/* User Message */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 mt-1">
                <p className="text-gray-200 text-lg">{submittedPrompt}</p>
              </div>
            </div>
            
            {/* AI Response */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              
              {isGenerating ? (
                <div className="flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Loader2 className="w-5 h-5 animate-spin text-orange-400" />
                        <div className="absolute inset-0 w-5 h-5 rounded-full bg-orange-400/20 animate-ping"></div>
                      </div>
                      <span className="text-gray-400 text-sm">Generating your content...</span>
                    </div>
                    <div className="space-y-2.5 mt-4">
                      <div className="h-3 bg-gradient-to-r from-white/10 to-transparent rounded animate-pulse"></div>
                      <div className="h-3 bg-gradient-to-r from-white/10 to-transparent rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                      <div className="h-3 bg-gradient-to-r from-white/10 to-transparent rounded w-3/4 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="flex-1">
                  <div className="text-red-300 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="font-semibold mb-1">Error</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-end gap-2 mb-4">
                      <button 
                        onClick={handleAnalyze} 
                        disabled={isAnalyzing} 
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/50 rounded-xl text-sm text-gray-300 hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <BarChart2 size={16} />}
                        {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                      </button>
                      <button 
                        onClick={handleCopy} 
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 rounded-xl text-sm text-gray-300 hover:text-white transition-all"
                      >
                        {copySuccess ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        {copySuccess ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    
                    <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {generatedContent}
                    </div>
                  </div>
                  
                  {/* Analysis Section */}
                  {(isAnalyzing || analysis) && (
                    <div className="mt-4 p-6 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart2 size={20} className="text-blue-400" />
                        <h4 className="font-semibold text-blue-300">Strategic Insights</h4>
                      </div>
                      {isAnalyzing ? (
                        <div className="flex items-center text-blue-300/80">
                          <Loader2 size={16} className="animate-spin mr-2" /> 
                          Analyzing your content...
                        </div>
                      ) : (
                        <div 
                          className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap" 
                          dangerouslySetInnerHTML={{ 
                            __html: (analysis || '')
                              ?.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                              .replace(/- /g, '• ') 
                          }} 
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-6 flex-shrink-0">
        <div className="relative bg-white/5 border border-white/10 rounded-2xl focus-within:border-orange-500/50 transition-colors">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Message ContentAI..."
            className="w-full bg-transparent text-gray-200 placeholder-gray-500 rounded-2xl py-4 pl-6 pr-16 resize-none outline-none"
            minRows={1}
            maxRows={8}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault(); 
                handleGenerate(); 
              }
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-r from-orange-500 to-pink-600 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed hover:from-orange-600 hover:to-pink-700 rounded-xl transition-all shadow-lg disabled:shadow-none transform hover:scale-105 disabled:scale-100"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-3">
          ContentAI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}