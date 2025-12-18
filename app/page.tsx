'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSupabase } from '../components/SupabaseProvider';
import { Bot, Zap, BarChart2, Lightbulb, TrendingUp, Star, Sparkles, ArrowRight, Users, Clock, Target, Loader2, Check, X, AlertCircle, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { motion} from 'framer-motion';
import TestimonialSection from '../components/TestimonialSection';
import PhonePreview from '@/components/PhonePreview';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// --- Official Brand Logos (SVG Components) ---
const OpenAILogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.91 6.05 6.05 0 0 0-6.51-2.9A6.06 6.06 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.51 2.9 6.06 6.06 0 0 0 10.28-2.18 5.98 5.98 0 0 0 4-2.9 6.05 6.05 0 0 0-.74-7.1zm-9.02 12.6a4.47 4.47 0 0 1-2.53-1.37l.01-2.61 4.13-2.41v4.98a4.44 4.44 0 0 1-1.61.91zm3.73-1.37a4.47 4.47 0 0 1-2.53 1.35v-4.96l4.13-2.42v2.6a4.44 4.44 0 0 1-1.6 3.43zm3.19-4.53a4.47 4.47 0 0 1-1.07 2.69l-2.23-1.31v-4.84l2.25-1.31a4.44 4.44 0 0 1 1.05 4.77zm-1.07-7.62a4.47 4.47 0 0 1 1.07 2.68l-2.25 1.3-2.23-1.28L15.69 6.94a4.45 4.45 0 0 1 3.42 1.97zM7.23 7.43a4.47 4.47 0 0 1 3.6-1.93v5l-4.15 2.4-2.23-1.29a4.45 4.45 0 0 1 2.78-4.18zm-3.2 4.53a4.47 4.47 0 0 1 1.08-2.69l2.23 1.31v4.83l-2.25 1.31a4.44 4.44 0 0 1-1.06-4.76z"/>
  </svg>
);

const NextJSLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 180 180" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M180 90c0 49.706-40.294 90-90 90S0 139.706 0 90 40.294 0 90 0s90 40.294 90 90zM35 137.978V41h19.556l63.555 83.2H118V41h18v99.556h-17.778L53.222 55.556H53v82.422H35z" />
  </svg>
);

const SupabaseLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M13.35 2.25c-.56-.12-1.12.3-1.12.87v7.5H5.8c-.73 0-1.22.75-.92 1.41l7.07 15.6c.26.58.98.58 1.24 0l.97-2.14 7.07-15.6c.3-.66-.19-1.41-.92-1.41h-6.43v-7.5c0-.57-.56-.99-1.12-.87z" opacity="0.6"/>
    <path d="M5.8 10.625h6.43V3.12c0-.39.46-.6.76-.34l8.36 18.45-8.36-7.38V20.88c0 .39-.46.6-.76.34L3.87 2.77 12.23 10.625H5.8z" fillRule="evenodd" clipRule="evenodd"/>
  </svg>
);

const VercelLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L24 22H0L12 1Z"/>
  </svg>
);

const StripeLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 50 50" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M16.925 33.7c0-2.825 2.5-4.175 6.6-4.575l3.875-.375v-2.325c0-1.875-.725-2.8-2.65-2.8-1.7 0-2.525.7-2.725 2.125h-5.2c.225-3.675 3.325-5.95 8.025-5.95 5.375 0 7.825 2.575 7.825 7.2v11.3h-5.025v-2.125c-1.325 1.7-3.4 2.525-5.8 2.525-4.1 0-6.925-2.65-6.925-6.05zm10.425-1.5c1.825 0 3.25-.8 3.875-2.075v-2.325l-3.325.325c-2.075.2-3.15.825-3.15 2.125 0 1.2.925 1.95 2.6 1.95z"/>
  </svg>
);

const ReactLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
     <circle cx="12" cy="12" r="2" fill="currentColor"/>
     <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <ellipse rx="10" ry="4.5" cx="12" cy="12"/>
        <ellipse rx="10" ry="4.5" cx="12" cy="12" transform="rotate(60 12 12)"/>
        <ellipse rx="10" ry="4.5" cx="12" cy="12" transform="rotate(120 12 12)"/>
     </g>
 </svg>
);


interface SupabaseContextType {
  session: { user?: { id: string; email?: string } } | null;
  createGuestAccount: (() => Promise<void>) | undefined;
}

export default function HomePage() {
  const router = useRouter();
  
  const { session, createGuestAccount } = (useSupabase() as SupabaseContextType | null) || { session: null, createGuestAccount: undefined };
  
  const [status, setStatus] = useState<'idle' | 'creating' | 'redirecting'>('idle');

  const handleStartTrial = async () => {
    if (session?.user) {
      setStatus('redirecting');
      setTimeout(() => {
        router.push('/dashboard');
      }, 800); 
      return;
    }

    try {
      setStatus('creating');
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (createGuestAccount) {
        await createGuestAccount();
      }
      
      setStatus('redirecting');
      
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1000);

    } catch (error) {
      console.error("Failed to start trial:", error);
      setStatus('idle');
    }
  };

  const renderButtonContent = (defaultText: string) => {
    if (status === 'creating') {
      return <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>;
    }
    if (status === 'redirecting') {
      return <><Sparkles className="w-5 h-5 animate-pulse" /> Redirecting...</>;
    }
    return <>{defaultText} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>;
  };

  const brands = [
    { name: "OpenAI", icon: OpenAILogo },
    { name: "Next.js", icon: NextJSLogo },
    { name: "Supabase", icon: SupabaseLogo },
    { name: "Vercel", icon: VercelLogo },
    { name: "Stripe", icon: StripeLogo },
    { name: "React", icon: ReactLogo },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white overflow-hidden">
      
      {/* CSS for Smooth Ticker Animation */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>

      {/* Enhanced gradient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-orange-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-60 -left-40 w-[500px] h-[500px] bg-pink-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header  */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/80 border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl">ContentAI</span>
          </motion.div>
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-6 lg:gap-8"
          >
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">How it Works</a>
          </motion.nav>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <Link href="/login" className="text-gray-400 hover:text-white font-medium transition-colors text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2">Log In</Link>
            <button 
              onClick={handleStartTrial}
              disabled={status !== 'idle'}
              className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5 transition-all whitespace-nowrap disabled:opacity-80 disabled:cursor-wait"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[100svh] px-4 sm:px-6 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 space-y-6 sm:space-y-8 max-w-5xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/[0.08] hover:border-white/20 transition-all">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
            <span className="text-xs sm:text-sm font-medium text-gray-300">AI-Powered Content Creation</span>
            <div className="px-2 py-0.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full border border-orange-500/30">
              <span className="text-[10px] sm:text-xs font-semibold text-orange-400">NEW</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight px-2">
            <span className="block">Create Content</span>
            <span className="block bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              That Converts
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light px-4">
            Transform your social media strategy with AI that understands your brand voice. Create engaging content in seconds, not hours.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 px-4 w-full sm:w-auto">
            <button 
              onClick={handleStartTrial}
              disabled={status !== 'idle'}
              className="group px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-gradient-to-r cursor-pointer from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-80 disabled:cursor-wait w-full sm:w-auto"
            >
              {renderButtonContent('Start Free Trial')}
            </button>
            <Link 
              href="#demo" 
              className="px-6 sm:px-8 lg:px-10 py-4 sm:py-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg backdrop-blur-sm transform hover:-translate-y-1 transition-all duration-200 w-full sm:w-auto text-center"
            >
              Watch Demo
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-8 pt-8 sm:pt-12 text-xs sm:text-sm text-gray-400 px-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <span>1+ creators trust us</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
              ))}
              <span className="ml-2 font-medium">4.9/5 rating</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

     {/* --- INTERACTIVE SHOWCASE --- */}
<section className="py-24 relative overflow-hidden bg-black">
  {/* Graph Background Effect - Increased visibility and added radial mask */}
  <div 
    className="absolute inset-0 z-0 pointer-events-none" 
    style={{ 
      backgroundImage: `
        linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
        linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
      `,
      backgroundSize: '45px 45px',
      maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
      WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
    }}
  />
  
  {/* Ambient Glow to make the grid pop */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

  <div className="max-w-7xl mx-auto px-4 relative z-10">
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true }} 
      variants={staggerContainer} 
      className="text-center mb-20"
    >
      <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
        Experience the <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Final Result</span>
      </motion.h2>
      <motion.p variants={fadeInUp} className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
        Toggle between platforms and see exactly how your AI-generated content transforms for your audience.
      </motion.p>
    </motion.div>
    
    <div className="flex justify-center">
      <PhonePreview />
    </div>
  </div>
</section>

      {/* --- BRAND TICKER SECTION (OFFICIAL LOGOS) --- */}
      <motion.section 
        className="py-10 border-t border-white/[0.05] bg-white/[0.01]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8">Powered by industry-leading technology</p>
          
          <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_32px,_black_calc(100%-32px),transparent_100%)] sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex w-max animate-scroll">
              <div className="flex items-center gap-16 pr-16">
                {brands.map((brand, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group cursor-default">
                    <brand.icon className="w-6 h-6 sm:w-8 sm:h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg sm:text-xl font-semibold opacity-50 group-hover:opacity-100 transition-opacity">{brand.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-16 pr-16">
                {brands.map((brand, i) => (
                  <div key={`dup-${i}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group cursor-default">
                    <brand.icon className="w-6 h-6 sm:w-8 sm:h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg sm:text-xl font-semibold opacity-50 group-hover:opacity-100 transition-opacity">{brand.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-16 pr-16">
                {brands.map((brand, i) => (
                  <div key={`trip-${i}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group cursor-default">
                    <brand.icon className="w-6 h-6 sm:w-8 sm:h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg sm:text-xl font-semibold opacity-50 group-hover:opacity-100 transition-opacity">{brand.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      <motion.div 
         id="demo" 
         className="py-20 sm:py-32 bg-zinc-900/30 border-y border-white/5 relative overflow-hidden"
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true, margin: "-100px" }}
         variants={staggerContainer}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeInUp} className="text-center mb-12 sm:mb-16">
            <div className="inline-block px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
              <span className="text-orange-400 font-semibold text-sm">See The Difference</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              The Old Way vs. <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">The AI Way</span>
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto">Creating social media content used to be exhausting. Not anymore.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start relative">
            
            {/* VS Divider - Desktop */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30">     
            </div>

            {/* LEFT: THE OLD WAY (Pain) */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ scale: 1.02, rotate: -0.5 }} 
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              {/* Label Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg border-2 border-red-400">
                ❌ WITHOUT AI
              </div>

              <div className="mt-8 relative p-6 sm:p-8 bg-gradient-to-br from-red-950/50 to-black border-2 border-red-500/30 rounded-3xl backdrop-blur-xl shadow-2xl">
                
                {/* Frustrated Emoji */}
                <div className="absolute -top-8 -right-8 text-6xl opacity-30 rotate-12">😫</div>

                {/* Title */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                    <Clock className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-400">The Manual Way</h3>
                    <p className="text-xs text-zinc-500">Time: 1-2 Hours</p>
                  </div>
                </div>

                {/* Pain Points */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-red-500/10">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-1">Stare at blank screen</p>
                      <p className="text-zinc-500 text-xs">Writer&apos;s block kicks in immediately</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-red-500/10">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-1">Write, delete, rewrite</p>
                      <p className="text-zinc-500 text-xs">Nothing sounds quite right</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-red-500/10">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-1">Search for inspiration</p>
                      <p className="text-zinc-500 text-xs">Get lost scrolling competitors</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-black/30 rounded-lg border border-red-500/10">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-1">Settle for &quot;good enough&quot;</p>
                      <p className="text-zinc-500 text-xs">Post it and hope for the best</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Summary */}
                <div className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-500/30 flex items-center gap-3">
                  <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-400 font-bold text-sm">Result: Stressed & Exhausted</p>
                    <p className="text-zinc-500 text-xs">And you still need to do this tomorrow...</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT: THE NEW WAY (Solution) */}
            <motion.div 
              variants={fadeInUp} 
              whileHover={{ scale: 1.03, y: -5 }} 
              transition={{ type: "spring", stiffness: 300 }}
              className="relative group"
            >
              {/* Label Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg border-2 border-green-400">
                ✨ WITH AI
              </div>

              <div className="mt-8 absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="mt-8 relative p-6 sm:p-8 bg-gradient-to-br from-zinc-900 to-black border-2 border-green-500/30 rounded-3xl shadow-2xl backdrop-blur-xl">
                
                {/* Happy Emoji */}
                <div className="absolute -top-8 -right-8 text-6xl opacity-40 -rotate-12">🚀</div>

                {/* Title */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-400">The AI Way</h3>
                    <p className="text-xs text-zinc-500">Time: 30 Seconds</p>
                  </div>
                </div>

                {/* Simple Steps */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-green-500/20">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-400 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-1">Type your idea</p>
                      <p className="text-zinc-400 text-xs">Just a few words is enough</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-green-500/20">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-400 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-1">AI creates perfect post</p>
                      <p className="text-zinc-400 text-xs">In your brand voice, instantly</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-green-500/20">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-400 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm mb-1">Review & post</p>
                      <p className="text-zinc-400 text-xs">Or let AI schedule it for you</p>
                    </div>
                  </div>
                </div>

                {/* Example Post Preview */}
                <div className="mt-6 p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/20">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium leading-relaxed">
                        &quot;🚀 Just launched our biggest feature yet! After months of work, we&apos;re finally ready to share something special with you...&quot;
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span>Ready to post</span>
                    </div>
                    <button className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors">
                      Post Now
                    </button>
                  </div>
                </div>

                {/* Bottom Summary */}
                <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/30 flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-400 font-bold text-sm">Result: Done & Relaxed</p>
                    <p className="text-zinc-400 text-xs">You just saved 1.5 hours of your life</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="text-center mt-16">
            <p className="text-zinc-400 mb-4">Which one would you choose?</p>
            <button 
              onClick={handleStartTrial}
              disabled={status !== 'idle'}
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl font-semibold shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5 transition-all disabled:opacity-80 disabled:cursor-wait"
            >
              {renderButtonContent('Try The AI Way Free')}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-y border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 text-center"
          >
            {[
              { value: '1', label: 'Active Users' },
              { value: '1', label: 'Posts Generated' },
              { value: '95%', label: 'Time Saved' },
              { value: '4.9★', label: 'User Rating' }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="group">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="text-gray-400 font-medium text-xs sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      <TestimonialSection/>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-24 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
             className="text-center mb-16 sm:mb-20 lg:mb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4">
              Everything you need to
              <span className="block bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent mt-2">
                dominate social media
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-2xl mx-auto font-light px-4">
              Powerful AI tools designed to streamline your content creation workflow
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          >
            {[
              { icon: Zap, title: 'Lightning Fast Generation', desc: 'Create professional content in seconds with our advanced AI engine', color: 'from-orange-500 to-yellow-500' },
              { icon: Target, title: 'Brand Voice Matching', desc: 'AI learns your unique voice and maintains consistency across all content', color: 'from-pink-500 to-red-500' },
              { icon: BarChart2, title: 'Performance Analytics', desc: 'Get AI-powered insights to optimize your content strategy', color: 'from-purple-500 to-pink-500' },
              { icon: Clock, title: 'Schedule & Automate', desc: 'Stay organized — plan your content and never miss a day!', color: 'from-blue-500 to-cyan-500' },
              { icon: Sparkles, title: 'Multi-Platform Support', desc: 'Optimize content for Instagram, Twitter, LinkedIn, and more', color: 'from-green-500 to-emerald-500' },
              { icon: TrendingUp, title: 'Trend Analysis', desc: 'Stay ahead with real-time trending topic recommendations', color: 'from-red-500 to-orange-500' }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInScale} className="group p-6 sm:p-7 lg:p-8 bg-white/[0.02] hover:bg-white/[0.05] backdrop-blur-sm rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10">
                <div className={`w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all`}>
                  <feature.icon className="w-6 h-6 sm:w-6.5 sm:h-6.5 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-white transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-white/[0.02] to-transparent backdrop-blur-sm border-y border-white/[0.08] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true }}
             variants={fadeInUp}
             className="text-center mb-16 sm:mb-20 lg:mb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-4">
              Get started in
              <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 bg-clip-text text-transparent"> minutes</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 font-light px-4">Three simple steps to transform your content game</p>
          </motion.div>

          <motion.div 
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, margin: "-50px" }}
             variants={staggerContainer}
             className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 relative"
          >
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            {[
              { num: '01', title: 'Define Your Brand', desc: 'Set up your brand voice, tone, and content preferences in minutes', icon: Lightbulb },
              { num: '02', title: 'Generate Content', desc: 'Enter a topic and watch AI create engaging posts tailored to your audience', icon: Sparkles },
              { num: '03', title: 'Publish & Analyze', desc: 'Schedule posts and track performance with detailed analytics', icon: TrendingUp }
            ].map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative">
                <div className="bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-md p-6 sm:p-7 lg:p-8 rounded-2xl border border-white/[0.08] hover:border-orange-500/30 transition-all duration-300 h-full hover:shadow-2xl hover:shadow-orange-500/10 group">
                  <div className="w-14 h-14 sm:w-15 sm:h-15 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 shadow-2xl shadow-orange-500/30 relative z-10 group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 sm:w-7.5 sm:h-7.5 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white/[0.03] absolute top-4 right-6 sm:right-8 select-none">{step.num}</div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-white transition-colors">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-red-500/10 blur-3xl"></div>
        <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={staggerContainer}
           className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to create
            <span className="block bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent mt-2">
              amazing content?
            </span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto font-light leading-relaxed px-4">
            Join thousands of creators who are already using AI to transform their social media presence
          </motion.p>
          <motion.div variants={fadeInUp}>
            <button 
              onClick={handleStartTrial}
              disabled={status !== 'idle'}
              className="group inline-flex cursor-pointer items-center gap-2 sm:gap-3 px-8 sm:px-10 lg:px-12 py-5 sm:py-5.5 lg:py-6 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg lg:text-xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-80 disabled:cursor-wait"
            >
              {renderButtonContent('Start Creating for Free')}
            </button>
          </motion.div>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-500 px-4">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
              <span>7-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <motion.footer 
        className="border-t border-white/[0.08] bg-black/50 backdrop-blur-xl py-12 sm:py-14 lg:py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12">
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="font-bold text-base sm:text-lg">ContentAI</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">Transform your content creation with AI-powered tools.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors font-light">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-light">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors font-light">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-light">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-light">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-400 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors font-light">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-light">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors font-light">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.08] pt-6 sm:pt-8 text-center text-gray-500 text-xs sm:text-sm font-light">
            <p>&copy; {new Date().getFullYear()} ContentAI. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </main>
  );
}