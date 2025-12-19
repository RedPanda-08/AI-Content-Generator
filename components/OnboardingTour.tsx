'use client';
import React, { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS, TooltipRenderProps } from 'react-joyride';
import { motion, AnimatePresence } from 'framer-motion'; 
import { useSupabase } from './SupabaseProvider';
import { usePathname } from 'next/navigation';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';

// --- 1. STEPS CONFIGURATION ---
const STEPS_BY_PAGE: Record<string, Step[]> = {
  '/dashboard': [
    { target: '.platform-selector', content: 'Select Platform. Choose where this content will be published to automatically optimize tone and formatting.', placement: 'bottom', disableBeacon: true },
    { target: '.prompt-input-area', content: 'Content Brief. Enter your topic, key points, or a rough draft here. Specific details yield better results.', placement: 'bottom' },
    { target: '.generate-button', content: 'Generate. Click here to create high-quality content drafts instantly.', placement: 'top' },
  ],
  '/dashboard/history': [
    { target: '.history-list', content: 'Content Archive. All your previously generated posts are saved here automatically.', placement: 'bottom', disableBeacon: true },
    { target: '.history-search', content: 'Quick Search. Filter your archive by keywords to find specific past content.', placement: 'bottom' },
    { target: '.history-export', content: 'Export Data. Download your content history as a CSV file for reporting.', placement: 'left' },
  ],
  '/dashboard/calendar': [
    { target: '.calendar-view', content: 'Schedule Overview. View all your upcoming and past posts in a monthly view.', placement: 'bottom', disableBeacon: true },
    { target: '.new-schedule-btn', content: 'Schedule Post. Create a new content piece and set a specific date for publication.', placement: 'left' },
  ],
  '/dashboard/settings': [
    { target: '.brand-tone', content: 'Voice & Tone. Select a consistent persona for your AI (e.g., Professional, Witty).', placement: 'bottom', disableBeacon: true },
    { target: '.save-brand-btn', content: 'Save Configuration. Apply these settings to all future generations.', placement: 'top' },
  ],
};

// --- 2. PROFESSIONAL TOOLTIP COMPONENT ---
const CustomTooltip = ({ index, step, backProps, primaryProps, closeProps, tooltipProps, isLastStep, size }: TooltipRenderProps) => {
  
  // Calculate progress percentage for the bar
  const progress = ((index + 1) / size) * 100;

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={String(step.target)} 
        {...tooltipProps}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 10 }} 
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-[#0f0f11]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] max-w-[380px] w-full relative z-[100] flex flex-col overflow-hidden"
        style={{ backfaceVisibility: "hidden" }}
      >
        {/* Progress Bar Top */}
        <div className="w-full h-1 bg-white/5">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-orange-500 to-pink-600"
            />
        </div>

        <div className="p-6 flex flex-col gap-4">
            {/* Header: Step Count & Close */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-[11px] font-bold text-white border border-white/5">
                        {index + 1}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        of {size} steps
                    </span>
                </div>
                <button 
                    {...closeProps} 
                    className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-md"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content Body */}
            <div>
                <h4 className="text-white font-semibold text-[17px] mb-2 leading-tight">
                    {/* Extract first sentence as title if possible, or generic */}
                    {step.content && typeof step.content === 'string' 
                        ? step.content.split('.')[0] 
                        : 'Quick Guide'}
                </h4>
                <p className="text-zinc-400 text-[14px] leading-relaxed font-normal">
                    {/* The rest of the content */}
                    {step.content && typeof step.content === 'string' 
                        ? step.content.substring(step.content.indexOf('.') + 1) 
                        : step.content}
                </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between mt-2 pt-2">
                <button 
                    onClick={backProps.onClick} 
                    disabled={index === 0}
                    className={`text-sm font-medium px-3 py-2 rounded-lg transition-all flex items-center gap-1
                        ${index === 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-400 hover:text-white hover:bg-white/5'}
                    `}
                >
                    <ChevronLeft size={14} /> Back
                </button>

                <button 
                    onClick={primaryProps.onClick} 
                    className="text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isLastStep ? 'Finish' : 'Next'} 
                    {isLastStep ? <Check size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- 3. MAIN COMPONENT ---
export default function OnboardingTour() {
  const context = useSupabase();
  const supabase = context?.supabase;
  const session = context?.session;
  const pathname = usePathname(); 
  
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const currentSteps = STEPS_BY_PAGE[pathname || ''];
    if (currentSteps && session?.user) {
      setSteps(currentSteps);
      
      const checkSeen = () => {
        if (pathname === '/dashboard') {
          return !session.user.user_metadata?.has_seen_tour;
        }
        return !localStorage.getItem(`seen_tour_${pathname}`);
      };

      if (checkSeen()) {
         setTimeout(() => setRun(true), 1000); 
      }
    } else {
      setRun(false);
    }
  }, [pathname, session]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status } = data;
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      if (pathname === '/dashboard' && supabase && session?.user) {
        await supabase.auth.updateUser({ data: { has_seen_tour: true } });
      } else {
        localStorage.setItem(`seen_tour_${pathname}`, 'true');
      }
    }
  };

  if (!supabase || steps.length === 0) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep={true}
      
      // ✅ SMOOTH SCROLL & SPOTLIGHT SETTINGS
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scrollOptions={{ 
        behavior: 'smooth',
        block: 'center',
      }} 
      disableScrollParentFix={false} 
      disableOverlayClose={true}
      
      tooltipComponent={CustomTooltip}
      callback={handleJoyrideCallback}
      
      scrollOffset={100}
      spotlightPadding={8}
      
      floaterProps={{ hideArrow: true, disableAnimation: true }}
      
      styles={{
        options: { 
          zIndex: 10000, 
          // A Darker, richer overlay makes the tooltip pop more
          overlayColor: 'rgba(0, 0, 0, 0.85)', 
        },
        spotlight: { 
          borderRadius: '14px',
          // A Professional Pulsing Glow (Orange/White mix)
          boxShadow: '0 0 0 2px rgba(249, 115, 22, 0.6), 0 0 20px 0px rgba(249, 115, 22, 0.3)',
          backgroundColor: 'transparent',
        },
        beacon: { display: 'none' },
      }}
    />
  );
}