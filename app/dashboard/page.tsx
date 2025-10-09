// File: app/dashboard/page.tsx
'use client';
import { useState } from 'react';
import { Send, Bot, Sparkles, User } from 'lucide-react';
import Textarea from 'react-textarea-autosize'; 

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState(''); // The text currently in the input box
  const [submittedPrompt, setSubmittedPrompt] = useState(''); // The prompt that was sent to the API
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // 1. Save the current prompt for display
    setSubmittedPrompt(prompt);
    
    setIsGenerating(true);
    setError(null);
    setGeneratedContent('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
      }
      const data = await response.json();
      setGeneratedContent(data.content);
    } 
    catch (err) {
      const error = err as { message: string };
      setError(error.message);
    } finally {
      setIsGenerating(false);
      setPrompt('');

    }
  };
  
  const handleCardClick = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto px-4 py-6">
      {/* Main content area */}
      <div className="flex-grow overflow-y-auto pr-4">
        {/* --- UPDATED LOGIC --- */}
        {/* If no prompt has been submitted yet, show the welcome screen */}
        {!submittedPrompt ? (
          <div className="text-center">
             <div className="inline-block p-5 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full mb-6">
               <Bot size={40} className="text-white" />
             </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-300">
              Hello, how can I help today?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
               <div onClick={() => handleCardClick('Write a witty tweet about the struggles of debugging code')} className="p-4 bg-[#1E1F20] hover:bg-[#2a2b2c] border border-gray-700 rounded-lg transition-colors cursor-pointer text-left">
                 <h3 className="font-semibold text-gray-200">Witty Tweet</h3>
                 <p className="text-sm text-gray-500">about debugging struggles</p>
               </div>
               <div onClick={() => handleCardClick('Create an engaging Instagram caption for a picture of a sunset')} className="p-4 bg-[#1E1F20] hover:bg-[#2a2b2c] border border-gray-700 rounded-lg transition-colors cursor-pointer text-left">
                 <h3 className="font-semibold text-gray-200">Instagram Caption</h3>
                 <p className="text-sm text-gray-500">for a sunset picture</p>
               </div>
            </div>
          </div>
        ) : (
          /* If a prompt has been submitted, show the conversation view */
          <div className="space-y-8">
            {/* User's Prompt */}
            <div className="flex gap-4 items-start">
              <User className="w-8 h-8 flex-shrink-0 mt-1" />
              <p className="font-semibold text-lg">{submittedPrompt}</p>
            </div>
            
            {/* AI's Response Area */}
            <div className="flex gap-4 items-start">
              <Sparkles className="w-8 h-8 flex-shrink-0 mt-1 text-orange-400" />
              {isGenerating ? (
                <div className="flex items-center text-gray-400">
                  <svg className="w-6 h-6 animate-spin mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Generating...
                </div>
              ) : error ? (
                <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</div>
              ) : (
                <div className="text-white leading-relaxed whitespace-pre-wrap">{generatedContent}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Prompt input area (no changes) */}
      <div className="mt-6 flex-shrink-0">
        <div className="relative">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt here..."
            className="w-full bg-[#1E1F20] text-gray-200 placeholder-gray-500 border border-gray-700 rounded-2xl py-4 pl-6 pr-16 resize-none outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            minRows={1}
            maxRows={8}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="absolute right-4 bottom-3 p-2 bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed hover:bg-orange-600 rounded-full transition-colors"
          >
            <Send className="w-5 h-5 " />
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          ContentAI can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}

