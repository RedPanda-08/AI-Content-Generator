'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Star, Loader2 } from 'lucide-react'; 
import { motion } from 'framer-motion';

interface PublicFeedback {
  id: string;
  rating: number;
  message: string;
  name: string;
  role: string | null; 
  created_at: string;
}

const TickerAnimationCSS = `
  @keyframes scroll-fast {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-ticker-fast {
    animation: scroll-fast 40s linear infinite;
    display: flex;
    flex-wrap: nowrap;
  }
  @media (hover: hover) {
    .animate-ticker-fast:hover {
      animation-play-state: paused;
    }
  }
`;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export default function TestimonialSection() {
  const [feedbacks, setFeedbacks] = useState<PublicFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedFeedbacks = async () => {
      try {
        const { data, error } = await supabase
          .from('feedbacks')
          .select('id, rating, message, name, role, created_at')
          .eq('is_public', true)
          .gte('rating', 4) 
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFeedbacks(data as PublicFeedback[]);
      } catch (e) {
        console.error('Error fetching testimonials:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedFeedbacks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (feedbacks.length === 0) return null;
  const tickerItems = feedbacks.length < 4 
    ? [...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks] 
    : [...feedbacks, ...feedbacks];

  // Helper to render a single card
  const renderCard = (feedback: PublicFeedback, index: number, isTicker = false) => (
    <blockquote 
      key={`${isTicker ? 'ticker' : 'grid'}-${feedback.id}-${index}`} 
      className={`bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full min-h-[250px] lg:min-h-[280px] hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1 ${isTicker ? 'w-[300px] flex-shrink-0 mx-3' : 'w-full'}`}
    >
      <div>
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 transition-colors ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`} />
          ))}
        </div>
        <p className="text-sm sm:text-base text-gray-200 italic mb-6 flex-grow leading-relaxed line-clamp-4">
          &quot;{feedback.message}&quot;
        </p>
      </div>
      <footer className="flex items-center gap-3 border-t border-white/10 pt-4 mt-auto">
        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-orange-400">{feedback.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{feedback.name}</p>
          <p className="text-xs text-zinc-400">{feedback.role || 'Content Creator'}</p>
        </div>
      </footer>
    </blockquote>
  );

  // --- View Components ---

  const TickerView = () => (
    <div className="relative w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_32px,_black_calc(100%-32px),transparent_100%)] overflow-hidden">
      <div className="flex w-max animate-ticker-fast flex-nowrap">
        {tickerItems.map((feedback, index) => renderCard(feedback, index, true))}
      </div>
    </div>
  );

  const GridView = () => (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
    >
      {feedbacks.map((feedback, index) => (
        <motion.div key={`grid-${feedback.id}-${index}`} variants={fadeInUp} className="w-full">
          {renderCard(feedback, index, false)}
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white/[0.01] border-t border-white/[0.05] relative overflow-hidden">
      <style jsx global>{TickerAnimationCSS}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Trusted by <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">creators</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-gray-400 max-w-xl mx-auto">
            Don&apos;t just take our word for it—see what our early users say.
          </motion.p>
        </motion.div>

        <div className="block md:hidden w-full">
          {feedbacks.length >= 2 ? <TickerView /> : <GridView />}
        </div>
        <div className="hidden md:block w-full">
          {feedbacks.length > 4 ? <TickerView /> : <GridView />}
        </div>

      </div>
    </section>
  );
}