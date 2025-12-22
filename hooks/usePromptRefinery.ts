import { useState, useEffect, useCallback, useRef } from 'react';
import { RefineryResponse, RefineryStatus } from '@/types/dashboard';

function debounce<Args extends unknown[]>(
  func: (...args: Args) => void | Promise<void>, 
  wait: number
) {
  let timeout: NodeJS.Timeout;
  
  return (...args: Args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export const usePromptRefinery = (input: string) => {
  const [suggestion, setSuggestion] = useState<RefineryResponse | null>(null);
  const [status, setStatus] = useState<RefineryStatus>('idle');
  
  // Ref to track last checked text
  const lastCheckedText = useRef<string>("");

  // 1. Define the specific logic (Type inferred as: (text: string) => Promise<void>)
  const checkPrompt = async (text: string) => {
    if (!text || text.length < 5 || text === lastCheckedText.current) return;

    setStatus('analyzing');
    
    try {
      const res = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, useMock: true }),
      });

      const data: RefineryResponse = await res.json();

      if (data.status === 'yellow' || data.status === 'red') {
        setSuggestion(data);
        setStatus('suggested');
      } else {
        setStatus('idle');
        setSuggestion(null);
      }
      
      lastCheckedText.current = text;

    } catch (error) {
      console.error("Refinery Error:", error);
      setStatus('idle');
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAnalyze = useCallback(debounce(checkPrompt, 1500), []);

  useEffect(() => {
    if (input.length > 5) {
      debouncedAnalyze(input);
    } else {
      setStatus('idle');
      setSuggestion(null);
    }
  }, [input, debouncedAnalyze]);

  return { suggestion, status, clearSuggestion: () => setStatus('idle') };
};