'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Zap, Sparkles, Calendar as CalendarIcon, Check, 
  Linkedin, Twitter, Instagram, ChevronDown, 
  Send, Battery, Wifi, Signal, 
  Sliders, User, LayoutGrid, Clock, Mail, Plus, Tag, Hash
} from 'lucide-react';

// --- CUSTOM LOGO COMPONENT ---
const Logo = ({ className = "w-8 h-8", color = "white", fontSize = "text-2xl" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* The Icon: The Magic Cursor */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        style={{ minWidth: 'auto' }}
      >
        {/* 1. The Cursor (The Trigger) */}
        <rect 
          x="20" y="15" 
          width="12" height="70" 
          rx="6" 
          fill={color} 
        />

        {/* 2. The Generation (The Output) */}
        {/* Top Line */}
        <path 
          d="M45 30H85" 
          stroke={color} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        
        {/* Middle Line */}
        <path 
          d="M45 50H95" 
          stroke={color} 
          strokeWidth="8" 
          strokeLinecap="round" 
          opacity="0.8"
        />

        {/* Bottom Line */}
        <path 
          d="M45 70H75" 
          stroke={color} 
          strokeWidth="8" 
          strokeLinecap="round" 
          opacity="0.6"
        />

        {/* 3. The Spark (The Magic) */}
        <path 
          d="M85 15L88 22L95 25L88 28L85 35L82 28L75 25L82 22Z" 
          fill={color} 
        />
      </svg>
      
      {/* The Text */}
      <span className={`font-bold ${fontSize} tracking-tight leading-none`} style={{ color: color }}>
        Content<span className="opacity-80">AI</span>
      </span>
    </div>
  );
};

// --- DATA ---

const steps = [
  {
    id: 1,
    title: "Define Brand Style",
    description: "Set your vibe, humor, and core topics. AI learns your unique signature.",
    icon: Sliders,
  },
  {
    id: 2,
    title: "Generate Content",
    description: "Type a prompt. Watch AI stream a perfect post in your voice instantly.",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Plan & Schedule",
    description: "Pick a date on the full calendar and set automated email reminders.",
    icon: CalendarIcon,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  },
};

// --- SUB-COMPONENTS ---

// 1. Chat Simulation (Step 2)
const ChatSimulation = () => {
    const [status, setStatus] = useState<'typing' | 'sent' | 'thinking' | 'streaming' | 'done'>('typing');

    useEffect(() => {
        let timeout1: NodeJS.Timeout;
        let timeout2: NodeJS.Timeout;
        let timeout3: NodeJS.Timeout;

        if (status === 'typing') {
            timeout1 = setTimeout(() => setStatus('sent'), 2500); 
        } else if (status === 'sent') {
            timeout2 = setTimeout(() => setStatus('thinking'), 500); 
        } else if (status === 'thinking') {
            timeout3 = setTimeout(() => setStatus('streaming'), 1500);
        }

        return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            clearTimeout(timeout3);
        };
    }, [status]);

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 p-4 flex flex-col relative h-full"
        >
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-16 justify-end">
                {/* User Message */}
                {(status !== 'typing') && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="self-end bg-[#1c1c1f] text-white px-3 py-2 rounded-2xl rounded-tr-sm border border-white/10 text-xs max-w-[85%]"
                    >
                        Write a post about brand consistency.
                    </motion.div>
                )}

                {/* AI Thinking */}
                {status === 'thinking' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="self-start flex items-center gap-2 bg-gradient-to-br from-orange-500/10 to-pink-600/10 px-3 py-2 rounded-2xl rounded-tl-sm border border-orange-500/20"
                    >
                        <Sparkles className="w-3 h-3 text-orange-500 animate-pulse" />
                        <span className="text-[10px] text-orange-300 font-medium">Thinking...</span>
                    </motion.div>
                )}

                {/* AI Response Stream */}
                {(status === 'streaming' || status === 'done') && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="self-start flex gap-3 max-w-[95%]"
                    >
                        <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-orange-500/20">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="text-gray-200 text-xs leading-relaxed">
                                <span className="font-bold text-white">Consistency builds trust.</span> 🗣️ <br/><br/>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    In a sea of noise, your unique perspective is your only differentiator. Don&apos;t just post; say something that sounds like YOU.
                                </motion.div>
                            </div>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                className="flex gap-2"
                            >
                                <span className="text-blue-400 text-[9px] bg-blue-500/10 px-1.5 py-0.5 rounded">#Branding</span>
                                <span className="text-blue-400 text-[9px] bg-blue-500/10 px-1.5 py-0.5 rounded">#Growth</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Bar */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="bg-[#1c1c1f] border border-white/10 rounded-2xl p-1.5 shadow-xl flex items-center pr-1">
                    <div className="flex-1 px-3 py-1 overflow-hidden">
                        {status === 'typing' ? (
                            <div className="text-gray-200 text-xs flex items-center whitespace-nowrap">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "auto" }}
                                    transition={{ duration: 2, ease: "linear" }}
                                    className="overflow-hidden"
                                >
                                    Write a post about brand consistency.
                                </motion.div>
                                <span className="inline-block w-0.5 h-3 bg-orange-500 ml-0.5 animate-pulse flex-shrink-0"/>
                            </div>
                        ) : (
                            <span className="text-gray-600 text-xs">Ask ContentAI...</span>
                        )}
                    </div>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        status === 'typing' ? 'bg-white/10 text-gray-400' : 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg'
                    }`}>
                        <Send className="w-3.5 h-3.5" />
                    </div>
                </div>
                {status === 'typing' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 mt-2 ml-1"
                    >
                        <div className="bg-blue-500/20 text-blue-400 p-1 rounded border border-blue-500/30"><Linkedin className="w-3 h-3" /></div>
                        <div className="bg-white/5 text-gray-500 p-1 rounded border border-white/10"><Twitter className="w-3 h-3" /></div>
                        {/* Added Instagram Icon */}
                        <div className="bg-pink-500/20 text-pink-400 p-1 rounded border border-pink-500/30"><Instagram className="w-3 h-3" /></div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---

const GetStartedSection = () => {
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    let stepDuration = 6000;
    if (activeStep === 2) stepDuration = 12000;
    else if (activeStep === 3) stepDuration = 8000;

    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev === 3 ? 1 : prev + 1));
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <section className="py-12 md:py-24 bg-black relative overflow-hidden min-h-[100dvh] flex items-center justify-center">
      
      {/* Background Grids */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Content Engine</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg font-light">
            Watch how easily ideas become published posts.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Timeline */}
          <motion.div variants={itemVariants} className="hidden lg:flex flex-col gap-10 order-2 lg:order-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`relative group text-left pl-6 py-5 transition-all duration-500 border-l-2 rounded-r-xl cursor-default ${
                  activeStep === step.id
                    ? "border-orange-500 bg-white/10" 
                    : "border-white/5 hover:bg-white/5"
                }`}
              >
                {activeStep === step.id && (
                  <motion.div 
                    layoutId="activeBeam"
                    transition={{ duration: 0.5 }}
                    className="absolute left-[-2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500 via-pink-500 to-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]" 
                  />
                )}
                
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg transition-colors duration-500 ${activeStep === step.id ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-gray-500'}`}>
                        <step.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold transition-colors duration-500 ${
                        activeStep === step.id ? "text-white" : "text-gray-500"
                        }`}>
                        {step.title}
                        </h3>
                        <p className={`text-sm mt-1 transition-all duration-500 ${
                        activeStep === step.id ? "text-gray-300 opacity-100" : "text-gray-500 opacity-80"
                        }`}>
                        {step.description}
                        </p>
                    </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Phone Simulator */}
          <motion.div variants={itemVariants} className="order-1 lg:order-2 flex justify-center w-full">
            <div className="relative w-full max-w-[320px] aspect-[9/18] bg-black rounded-[2.5rem] border-[6px] border-[#1f1f22] shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div className="absolute right-[-8px] top-24 w-[3px] h-12 bg-[#2a2a2d] rounded-r-md" />
                <div className="absolute left-[-8px] top-24 w-[3px] h-16 bg-[#2a2a2d] rounded-l-md" />
                
                {/* Status Bar */}
                <div className="absolute top-0 w-full h-8 px-6 flex justify-between items-end z-50 text-white/40 text-[10px] font-medium pb-1.5">
                    <span>9:41</span>
                    <div className="flex gap-1.5">
                        <Signal className="w-2.5 h-2.5" />
                        <Wifi className="w-2.5 h-2.5" />
                        <Battery className="w-3.5 h-3.5" />
                    </div>
                </div>

                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-50 pointer-events-none ring-1 ring-white/5" />

                <div className="w-full h-full bg-[#09090b] flex flex-col pt-10 relative overflow-hidden font-sans">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none z-40" />

                    {/* --- APP HEADER WITH LOGO --- */}
                    <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#09090b] z-30">
                        {/* Integrated Logo here */}
                        <Logo className="h-6" fontSize="text-sm" />
                        
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                            <User className="w-3.5 h-3.5 text-white/70" />
                        </div>
                    </div>

                    <div className="flex-1 relative bg-[#09090b] overflow-hidden flex flex-col">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: BRAND STYLE TUNER */}
                            {activeStep === 1 && (
                                <motion.div 
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 p-5 flex flex-col h-full overflow-y-auto no-scrollbar"
                                >
                                    <div className="mb-6 flex-shrink-0">
                                        <h3 className="text-white font-bold text-lg mb-1">Brand Voice</h3>
                                        <p className="text-gray-400 text-xs">Configure your digital persona.</p>
                                    </div>
                                    <div className="space-y-6 mb-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] items-end">
                                                <span className="text-gray-300 font-medium flex items-center gap-1.5"><Zap className="w-3 h-3 text-gray-500"/> Energy</span>
                                                <span className="text-orange-400 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded">High</span>
                                            </div>
                                            <div className="h-1.5 bg-[#1c1c1f] rounded-full relative overflow-hidden">
                                                <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-pink-600 rounded-full" initial={{ width: "30%" }} animate={{ width: "85%" }} transition={{ duration: 1.5, ease: "easeInOut" }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] items-end">
                                                <span className="text-gray-300 font-medium">Humor</span>
                                                <span className="text-orange-400 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded">Witty</span>
                                            </div>
                                            <div className="h-1.5 bg-[#1c1c1f] rounded-full relative overflow-hidden">
                                                <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-pink-600 rounded-full" initial={{ width: "10%" }} animate={{ width: "60%" }} transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] items-end">
                                                <span className="text-gray-300 font-medium">Length</span>
                                                <span className="text-orange-400 font-bold bg-orange-500/10 px-1.5 py-0.5 rounded">Concise</span>
                                            </div>
                                            <div className="h-1.5 bg-[#1c1c1f] rounded-full relative overflow-hidden">
                                                <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-pink-600 rounded-full" initial={{ width: "80%" }} animate={{ width: "30%" }} transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                             <span className="text-gray-300 text-[10px] font-medium flex items-center gap-1.5"><Hash className="w-3 h-3 text-gray-500"/> Core Topics</span>
                                             <div className="flex flex-wrap gap-2">
                                                {['SaaS', 'Growth', 'Tech','Innovation','Positivity'].map((tag, i) => (
                                                    <motion.div key={tag} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 + (i * 0.2) }} className="px-2 py-1 bg-[#1c1c1f] border border-white/10 rounded-full text-[9px] text-gray-300 flex items-center gap-1">
                                                        <Tag className="w-2.5 h-2.5 text-gray-500" /> {tag}
                                                    </motion.div>
                                                ))}
                                             </div>
                                        </div>
                                    </div>
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }} className="mt-auto w-full bg-[#1c1c1f] border border-green-500/30 text-green-400 text-[10px] font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                                        <Check className="w-3.5 h-3.5" /> Voice Profile Updated
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* STEP 2: CHAT SIMULATION */}
                            {activeStep === 2 && (
                                <ChatSimulation />
                            )}

                            {/* STEP 3: CALENDAR */}
                            {activeStep === 3 && (
                                <motion.div 
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    className="flex-1 p-4 flex flex-col h-full overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                        <h3 className="text-white font-bold text-base">Planner</h3>
                                        <div className="text-[10px] text-white font-medium bg-[#1c1c1f] border border-white/10 px-2 py-1 rounded flex items-center gap-1">
                                            <CalendarIcon className="w-3 h-3 text-gray-400" /> Oct 2025
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1.5 text-center mb-4 flex-shrink-0">
                                        {['S','M','T','W','T','F','S'].map((d, i) => (
                                            <div key={`${d}-${i}`} className="text-[9px] font-bold text-gray-600 uppercase">{d}</div>
                                        ))}
                                        {Array.from({length: 30}).map((_, i) => {
                                            const isSelected = i === 23; 
                                            const hasPost = [2, 5, 12, 18, 28].includes(i);
                                            return (
                                            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.005 }} className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-medium relative border ${isSelected ? 'bg-orange-500 text-black font-bold border-orange-500 shadow-lg shadow-orange-500/20' : 'text-gray-400 border-transparent bg-[#1c1c1f]/50'}`}>
                                                {i + 1}
                                                {hasPost && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-white/30 rounded-full" />}
                                            </motion.div>
                                        )})}
                                    </div>
                                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }} className="bg-[#1c1c1f] border border-white/10 rounded-xl p-3 flex flex-col shadow-lg gap-3">
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-black/40 border border-white/5 p-2 rounded-lg text-center">
                                                <span className="text-gray-500 text-[9px] block uppercase tracking-wider">Date</span>
                                                <span className="text-white text-[10px] font-bold">Oct 24</span>
                                            </div>
                                            <div className="flex-1 bg-black/40 border border-white/5 p-2 rounded-lg text-center">
                                                <span className="text-gray-500 text-[9px] block uppercase tracking-wider">Time</span>
                                                <span className="text-white text-[10px] font-bold">9:00 AM</span>
                                            </div>
                                            {/* Added ChevronDown to create a Dropdown effect */}
                                            <div className="flex-1 bg-black/40 border border-white/5 p-2 rounded-lg text-center flex items-center justify-center gap-1">
                                                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                                                <ChevronDown className="w-3 h-3 text-gray-500" />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg p-2.5 text-center cursor-pointer shadow-lg shadow-orange-500/20 relative overflow-hidden group">
                                            <span className="text-xs font-bold text-white flex items-center justify-center gap-2 relative z-10">Confirm Schedule</span>
                                             <motion.div className="absolute inset-0 bg-green-500 flex items-center justify-center gap-2 z-20" initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ delay: 2.5, duration: 0.5, ease: "easeInOut" }}>
                                                <Mail className="w-3.5 h-3.5 text-black" />
                                                <span className="text-black text-[10px] font-bold">Email Sent!</span>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Nav */}
                    <div className="flex-shrink-0 px-6 py-4 border-t border-white/5 bg-[#09090b] flex justify-between items-center z-30">
                        <LayoutGrid className={`w-5 h-5 transition-colors ${activeStep === 2 ? 'text-orange-500' : 'text-gray-600'}`} />
                        <Sliders className={`w-5 h-5 transition-colors ${activeStep === 1 ? 'text-orange-500' : 'text-gray-600'}`} />
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center -mt-8 border-[4px] border-[#09090b] shadow-lg">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <CalendarIcon className={`w-5 h-5 transition-colors ${activeStep === 3 ? 'text-orange-500' : 'text-gray-600'}`} />
                        <User className="w-5 h-5 text-gray-600" />
                    </div>

                    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/20 rounded-full z-50" />
                </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default GetStartedSection;