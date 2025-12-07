'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client'; 
import { Loader2, Clock, User, Sparkles, Copy, Check, Search } from 'lucide-react';

type Generation = {
  id: string;
  created_at: string;
  prompt: string;
  content: string;
};

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchGenerations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching generations:', error);
        } else if (data) {
          setGenerations(data);
        }
      }
      setLoading(false);
    };
    fetchGenerations();
  }, []);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredGenerations = generations.filter(gen => 
    gen.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gen.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent hover:scrollbar-thumb-neutral-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 pl-12 sm:pl-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Content History</h1>
          <p className="text-sm sm:text-base text-gray-400">View and manage your previously generated content</p>
        </div>

        {/* Search Bar */}
        {generations.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your content..."
                className="w-full bg-white/5 border-2 border-white/10 rounded-xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:border-orange-500/50 focus:bg-white/10 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {generations.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex p-4 sm:p-6 bg-gradient-to-br from-orange-500/20 to-pink-600/20 rounded-3xl mb-4 sm:mb-6">
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">No content yet</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4">Start creating amazing content with AI</p>
            <a 
              href="/dashboard" 
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Go to Generator
            </a>
          </div>
        ) : filteredGenerations.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-sm sm:text-base text-gray-400 px-4">No results found for &quot;{searchQuery}&quot;</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-400">
                Showing {filteredGenerations.length} of {generations.length} {generations.length === 1 ? 'result' : 'results'}
              </p>
            </div>

            {/* History Items */}
            {filteredGenerations.map((gen) => (
              <div 
                key={gen.id} 
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-white/[0.07] transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-400">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{new Date(gen.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(gen.content, gen.id)}
                    className="flex items-center justify-center sm:justify-start gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/50 rounded-lg text-xs sm:text-sm text-gray-300 hover:text-white transition-all w-full sm:w-auto"
                  >
                    {copiedId === gen.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Prompt */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-300 text-xs sm:text-sm">Your Prompt</h3>
                  </div>
                  <div className="ml-0 sm:ml-8 text-sm sm:text-base text-gray-400 bg-white/5 border border-white/10 p-3 rounded-xl break-words">
                    {gen.prompt}
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-300 text-xs sm:text-sm">AI Generated</h3>
                  </div>
                  <div className="ml-0 sm:ml-8 text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-wrap break-words">
                    {gen.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}