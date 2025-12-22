'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Textarea from 'react-textarea-autosize';
import { Send, Sparkles, Loader2, ArrowRight, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface RefineryResponse {
  type: 'fix' | 'idea';
  text: string;
}

export interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  platform: string;
  onPlatformChange: (platform: string) => void;
  platforms: string[];
  getPlatformIcon: (p: string) => React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

// --- TOPICS & PLACEHOLDERS ---
const IDEA_TOPICS = {
  linkedin: ["Leadership Lessons", "SaaS Pricing", "Remote Work Truths", "Startup Mistakes", "Hiring Culture"],
  twitter: ["Coding Struggles", "AI Tools", "Indie Hacking", "Tech Trends", "Build in Public"],
  instagram: ["Office Setup", "Day in the Life", "Motivation", "Behind the Scenes", "Team Culture"]
};

const PLACEHOLDERS = {
  linkedin: [
    "Write a LinkedIn post about leadership...",
    "Share a story about a recent challenge...",
    "Discuss the future of remote work...",
    "What's a mistake you learned from recently?"
  ],
  twitter: [
    "Write a witty tweet about coding...",
    "Share a hot take on AI tools...",
    "Draft a 'Build in Public' update...",
    "What's trending in tech today?"
  ],
  instagram: [
    "Write a caption for your workspace photo...",
    "Share a 'Day in the Life' moment...",
    "Draft a motivational quote for stories...",
    "Describe your team culture..."
  ],
  default: ["What's on your mind?"]
};

// --- HOOK ---
const usePromptRefinery = (input: string, platform: string) => {
  const [suggestion, setSuggestion] = useState<RefineryResponse | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const lastCheckedText = useRef<string>("");

  const checkPrompt = async (text: string) => {
    if (!text || typeof text !== 'string') {
        setSuggestion(null);
        return;
    }
    if (text === lastCheckedText.current) return;

    setIsRefining(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const lower = text.toLowerCase().trim();

      // SCENARIO 1: "Idea Mode"
      if (lower.endsWith(' on') || lower.endsWith(' about') || lower === 'write a post') {
        setSuggestion({ type: 'idea', text: '' });
      }
      // SCENARIO 2: "Fix Mode"
      else if (text.length > 5 && text.length < 30 && !lower.endsWith(' on')) {
        setSuggestion({
          type: 'fix',
          text: `Write an engaging ${platform} post about "${text}".`
        });
      }
      else {
        setSuggestion(null);
      }

      lastCheckedText.current = text;
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefining(false);
    }
  };

  const debounce = <T extends unknown[]>(func: (...args: T) => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: T) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAnalyze = useCallback(debounce(checkPrompt, 800), []);

  useEffect(() => {
    if (!input) {
      setSuggestion(null);
      setIsRefining(false);
      return;
    }
    debouncedAnalyze(input);
  }, [input, debouncedAnalyze]);

  return { suggestion, isRefining, clearSuggestion: () => setSuggestion(null) };
};

// --- COMPONENT ---
const SmartInput: React.FC<SmartInputProps> = ({
  value,
  onChange,
  onGenerate,
  isGenerating,
  platform,
  onPlatformChange,
  platforms,
  getPlatformIcon,
  onKeyDown
}) => {

  const { suggestion, isRefining, clearSuggestion } = usePromptRefinery(value, platform);
  const [currentIdea, setCurrentIdea] = useState("");
  
  // Placeholder Logic
  const [placeholder, setPlaceholder] = useState("");
  
  useEffect(() => {
    const currentPlaceholders = PLACEHOLDERS[platform as keyof typeof PLACEHOLDERS] || PLACEHOLDERS.default;
    setPlaceholder(currentPlaceholders[0]);
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % currentPlaceholders.length;
      setPlaceholder(currentPlaceholders[index]);
    }, 3000); 

    return () => clearInterval(interval);
  }, [platform]);

  useEffect(() => {
    if (suggestion?.type === 'idea') {
      const topics = IDEA_TOPICS[platform as keyof typeof IDEA_TOPICS] || IDEA_TOPICS.linkedin;
      let index = 0;
      setCurrentIdea(topics[0]);
      const interval = setInterval(() => {
        index = (index + 1) % topics.length;
        setCurrentIdea(topics[index]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [suggestion, platform]);

  const applyFix = () => {
    if (suggestion) {
      if (suggestion.type === 'idea') {
        const separator = value.endsWith(' ') ? '' : ' ';
        onChange(value + separator + currentIdea);
      } else {
        onChange(suggestion.text);
      }
      clearSuggestion();
    }
  };

  const displayText = suggestion?.type === 'idea' ? currentIdea : suggestion?.text;

  return (
    <div className="relative w-full z-20 font-sans group">

      <div className="flex flex-col relative bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl transition-all overflow-hidden">

        {/* 1. HEADER (Platform Toggle) */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-3 flex-shrink-0">
          <span className="hidden sm:block text-[10px] text-zinc-500 font-medium whitespace-nowrap ml-1">
            Platform:
          </span>
          <div className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar mask-fade-right">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => onPlatformChange(p)}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 transition-all cursor-pointer border
                  ${platform === p 
                    ? 'bg-zinc-800 text-white border-white/10 shadow-sm' 
                    : 'bg-transparent text-zinc-500 border-transparent hover:bg-white/5 hover:text-zinc-300'}
                `}
              >
                <span className={`transition-transform ${platform === p ? 'scale-100' : 'scale-90 opacity-70'}`}>
                    {getPlatformIcon(p)}
                </span>
                <span className={platform === p ? 'font-medium' : 'font-normal'}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Separator Line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent flex-shrink-0" />

        {/* 2. BODY (Text Area + Placeholder) */}
        <div className="relative w-full px-1 flex-1">
          
          {/* Animated Placeholder (Layer Z-0) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <AnimatePresence mode="wait">
                {!value && (
                    <motion.div
                        key={placeholder} 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        // Added 'pl-4 sm:pl-5' here (1 unit more than textarea) to offset cursor
                        className="absolute top-0 left-0 w-full py-3 pl-4 pr-3 sm:pl-5 sm:pr-4 text-zinc-600 text-[16px] leading-relaxed truncate"
                    >
                        {placeholder}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Text Area (Layer Z-10) */}
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="" 
            className="
              relative z-10 
              w-full bg-transparent text-zinc-100 
              py-3 px-3 sm:px-4
              pr-12 sm:pr-14
              resize-none outline-none 
              text-[16px] leading-relaxed font-normal
              scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent
              placeholder-transparent 
            "
            minRows={2}
            maxRows={8}
            onKeyDown={onKeyDown}
          />

          {/* Spinner */}
          <AnimatePresence>
            {isRefining && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-4 right-14 flex items-center pointer-events-none z-20"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button */}
          <div className="absolute right-2 bottom-2 z-20">
             <button
              onClick={onGenerate}
              disabled={!value.trim() || isGenerating}
              className="
                p-2
                bg-white text-black
                rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]
                transition-all duration-200
                hover:scale-105 active:scale-95 hover:bg-zinc-200
                disabled:scale-100 disabled:opacity-30 disabled:hover:bg-white
                cursor-pointer
              "
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* 3. SUGGESTIONS BAR */}
        <AnimatePresence>
          {suggestion && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative overflow-hidden flex-shrink-0"
            >
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <button
                onClick={applyFix}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/[0.03] active:bg-white/[0.05] transition-colors cursor-pointer group/btn"
              >
                <div className={`
                    flex-shrink-0 transition-colors
                    ${suggestion.type === 'idea' ? 'text-yellow-400' : 'text-orange-400'}
                `}>
                    {suggestion.type === 'idea' ? <Lightbulb className="w-4 h-4 animate-pulse" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className="flex-1 overflow-hidden relative h-5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={displayText}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute w-full flex items-center gap-2"
                        >
                            <span className={`text-sm truncate w-full ${suggestion.type === 'idea' ? 'text-zinc-300' : 'text-zinc-300'}`}>
                                <span className="opacity-50 text-xs uppercase tracking-wider mr-2 font-semibold">
                                    {suggestion.type === 'idea' ? 'Try' : 'Fix'}
                                </span>
                                {displayText}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover/btn:text-zinc-400 transition-colors" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default SmartInput;