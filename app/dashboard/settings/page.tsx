'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client'; 
import { Loader2, Sparkles, Sliders, Save, RotateCcw, Terminal, Wand2, Plus } from 'lucide-react';
import ToneSlider from '../../../components/ToneSlider'; 

const QUICK_TAGS = [
  "Innovation", "Growth", "Sustainability", "Tech", "Lifestyle", 
  "Motivation", "Leadership", "Design", "Wellness", "Finance"
];

export default function SettingsPage() {
  const [brandName, setBrandName] = useState('');
  const [brandKeywords, setBrandKeywords] = useState('');
  
  const [vibe, setVibe] = useState(50);
  const [humor, setHumor] = useState(50);
  const [length, setLength] = useState(50);
  const [energy, setEnergy] = useState(50);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
  const [message, setMessage] = useState('');

  const generateToneString = (v: number, h: number, l: number, e: number) => {
    const getLabel = (val: number, left: string, right: string) => {
      if (val < 40) return left;
      if (val > 60) return right;
      return 'Neutral';
    };
    return `Style: ${getLabel(v, 'Professional', 'Casual')}, Humor: ${getLabel(h, 'Serious', 'Witty')}, Length: ${getLabel(l, 'Concise', 'Detailed')}, Energy: ${getLabel(e, 'Calm', 'Enthusiastic')}.`;
  };

  useEffect(() => {
    setLoading(false);
  }, []); 

  // --- LOGIC TO GENERATE KEYWORDS BASED ON SLIDERS ---
  const handleMagicKeywords = () => {
    setIsGeneratingKeywords(true);
    
    setTimeout(() => {
        const newKeywords = [];
        
        if (vibe < 40) newKeywords.push("Leadership", "Industry Insights", "Growth"); 
        else if (vibe > 60) newKeywords.push("Lifestyle", "Vibes", "Community"); 
        else newKeywords.push("Balance", "Modern", "Trends"); 

        if (energy > 60) newKeywords.push("Excitement", "Action", "Viral");
        
        const current = brandKeywords.split(',').map(s => s.trim()).filter(s => s);
        const combined = Array.from(new Set([...current, ...newKeywords])).join(', ');
        
        setBrandKeywords(combined);
        setIsGeneratingKeywords(false);
    }, 800);
  };

  const addTag = (tag: string) => {
      const current = brandKeywords.split(',').map(s => s.trim()).filter(s => s);
      if (!current.includes(tag)) {
          const separator = current.length > 0 ? ', ' : '';
          setBrandKeywords(brandKeywords + separator + tag);
      }
  };
  // ---------------------------------------------------------

  const performSave = async () => {
    setMessage('');
    setIsSaving(true);
    const finalTone = generateToneString(vibe, humor, length, energy);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: { 
          brand_name: brandName, 
          brand_tone: finalTone, 
          brand_keywords: brandKeywords 
        }
      });
      if (error) setMessage(`Error: ${error.message}`);
      else setMessage('Saved successfully');
    }
    setIsSaving(false);
    
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClear = () => {
    setBrandName('');
    setBrandKeywords('');
    setVibe(50); setHumor(50); setLength(50); setEnergy(50);
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen font-sans selection:bg-orange-500/30 overflow-x-hidden animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-24 sm:p-8 lg:p-12 space-y-8">
            
            {/* Header */}
            <div className="flex flex-col gap-3 pt-4 sm:pt-0 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                    Brand <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Style</span>
                </h1>
                <p className="text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed">
                    Teach ContentAI how to sound like you. Adjust the sliders to define your unique voice and personality.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
                    {/* Identity Card */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all hover:border-white/20">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles className="w-5 h-5 text-orange-500" />
                            <h2 className="text-lg font-semibold tracking-tight text-white">Core Identity</h2>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">Brand Name</label>
                                <input
                                    type="text"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                    placeholder="e.g. Acme Studio"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider ml-1">Keywords</label>
                                    <span className="text-[10px] text-orange-500/80 cursor-pointer hover:text-orange-400 transition-colors" onClick={handleMagicKeywords}>
                                        Auto-Suggest?
                                    </span>
                                </div>
                                
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={brandKeywords}
                                        onChange={(e) => setBrandKeywords(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                                        placeholder="e.g. Minimalist, Tech, Bold"
                                    />
                                    <button 
                                        onClick={handleMagicKeywords}
                                        disabled={isGeneratingKeywords}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                                        title="Generate Keywords based on Slider Vibe"
                                    >
                                        {isGeneratingKeywords ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {QUICK_TAGS.map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => addTag(tag)}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-medium bg-white/5 border border-white/5 text-neutral-400 hover:text-white hover:border-orange-500/30 hover:bg-orange-500/10 transition-all active:scale-95"
                                        >
                                            <Plus className="w-3 h-3" />
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sliders Card */}
                    {/* ✅ ADDED CLASS: brand-tone */}
                    <div className="brand-tone p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all hover:border-white/20">
                        <div className="flex items-center gap-2 mb-8">
                            <Sliders className="w-5 h-5 text-pink-500" />
                            <h2 className="text-lg font-semibold tracking-tight text-white">Brand Tuner</h2>
                        </div>
                        
                        <div className="space-y-8 sm:space-y-10">
                            <ToneSlider label="Vibe" leftLabel="Professional" rightLabel="Casual" value={vibe} onChange={setVibe} />
                            <ToneSlider label="Humor" leftLabel="Serious" rightLabel="Witty" value={humor} onChange={setHumor} />
                            <ToneSlider label="Length" leftLabel="Concise" rightLabel="Detailed" value={length} onChange={setLength} />
                            <ToneSlider label="Energy" leftLabel="Calm" rightLabel="Enthusiastic" value={energy} onChange={setEnergy} />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-5 space-y-6 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                    
                    {/* Live Preview "Terminal" */}
                    <div className="p-5 sm:p-6 rounded-3xl bg-black/40 border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-2 mb-4 text-neutral-500">
                            <Terminal className="w-4 h-4" />
                            <span className="text-xs font-mono uppercase tracking-wider">System Prompt Preview</span>
                        </div>
                        <p className="font-mono text-sm text-neutral-300 leading-relaxed break-words">
                            <span className="text-orange-400">Context:</span> Writing for {brandName || '[Brand Name]'}.
                            <br /><br />
                            <span className="text-pink-400">Directives:</span> {generateToneString(vibe, humor, length, energy)}
                            <br /><br />
                            <span className="text-purple-400">Keywords:</span> {brandKeywords || '...'}
                        </p>
                    </div>

                    {/* Action Bar */}
                    <div className="p-2 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleClear}
                            disabled={isSaving}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 active:scale-95"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        {/* ✅ ADDED CLASS: save-brand-btn */}
                        <button
                            onClick={performSave}
                            disabled={isSaving || !brandName}
                            className="save-brand-btn flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    {/* Feedback Toast */}
                    {message && (
                        <div className="text-center animate-fadeIn">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-medium border ${
                                message.includes('Error') 
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                                    : 'bg-green-500/10 border-green-500/20 text-green-400'
                            }`}>
                                {message}
                            </span>
                        </div>
                    )}

                </div>
            </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
          .animate-slideUp {
            opacity: 0;
            animation: slideUp 0.6s ease-out forwards;
          }
        `}</style>
    </div>
  );
}