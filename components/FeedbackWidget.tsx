'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Import hook to check current page
import { MessageSquare, X, Send, Loader2, ThumbsUp, Star, User, Briefcase } from 'lucide-react';
import { useSupabase } from './SupabaseProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface SupabaseContextType {
  session?: { user?: { id: string } } | null;
  supabase?: {
    from: (table: string) => {
      insert: (data: Record<string, unknown>) => Promise<{ error: Error | null }>;
    };
  };
}

export default function FeedbackWidget() {
  const pathname = usePathname(); // Get current path
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { session, supabase } = (useSupabase() as unknown as SupabaseContextType) || {};
  const isGenerator = pathname === '/dashboard';
  
  const positionClasses = isGenerator 
    ? 'bottom-40 right-4 sm:bottom-8 sm:right-8' 
    : 'bottom-4 right-4 sm:bottom-6 sm:right-6';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    if (!supabase) {
      alert("Unable to connect to database. Please refresh.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('feedbacks').insert({
        user_id: session?.user?.id || null, 
        message,
        rating,
        name: name || 'Anonymous', 
        role: role || 'User',
        is_public: false 
      });

      if (error) throw error;

      setSuccess(true);
      setMessage('');
      setName('');
      setRole('');
      setRating(5);
      
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2500);

    } catch (err) {
      console.error("Feedback error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed z-30 flex flex-col items-end transition-all duration-300 ${positionClasses}`}>
      
      {/* POPUP FORM CONTAINER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-[calc(100vw-2rem)] sm:w-80 bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl max-h-[60vh] overflow-y-auto"
          >
            {success ? (
              <div className="h-64 flex flex-col items-center justify-center p-6 text-center bg-zinc-950">
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20"
                >
                  <ThumbsUp className="w-7 h-7 text-green-500" />
                </motion.div>
                <h3 className="text-white font-bold text-lg">Thank You!</h3>
                <p className="text-zinc-400 text-sm mt-2 max-w-[200px]">Your feedback helps us build a better product.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                
                <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                  <h3 className="text-sm font-bold text-zinc-100">Send Feedback</h3>
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-md cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex gap-2 justify-center py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Star 
                        className={`w-5 h-5 transition-colors duration-200 ${star <= rating ? 'fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]' : 'text-zinc-700 hover:text-zinc-600'}`} 
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                    <div className="relative group">
                        <User className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors duration-300" />
                        <input 
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 focus:outline-none transition-all duration-200"
                        />
                    </div>
                    
                    <div className="relative group">
                        <Briefcase className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors duration-300" />
                        <input 
                            type="text"
                            placeholder="Role / Company"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-zinc-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 focus:outline-none transition-all duration-200"
                        />
                    </div>
                </div>

                <textarea
                  className="w-full bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 focus:outline-none resize-none min-h-[100px] transition-all duration-200"
                  placeholder="Tell us what you think..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  disabled={!message.trim() || isSubmitting}
                  className="w-full py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Send Feedback
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION BUTTON */}
      <div className="relative">
        {showTooltip && !isOpen && (
            <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-white text-[10px] font-medium rounded-lg whitespace-nowrap shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 hidden sm:block">
                Share Feedback
            </div>
        )}
        <button
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`
            flex items-center justify-center h-11 w-11 rounded-full shadow-2xl transition-all duration-300 cursor-pointer border border-white/10
            ${isOpen 
                ? 'bg-zinc-800 text-white rotate-90 hover:bg-zinc-700' 
                : 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:scale-110 hover:shadow-orange-500/40'
            }
            `}
        >
            {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}