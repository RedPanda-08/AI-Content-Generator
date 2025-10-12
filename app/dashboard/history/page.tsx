'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client'; 
import { Loader2 } from 'lucide-react';

type Generation = {
  id: string;
  created_at: string;
  prompt: string;
  content: string;
};

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Content History</h1>
      
      {generations.length === 0 ? (
        <div className="text-center text-gray-400 bg-[#1E1F20] p-8 rounded-lg border border-gray-700">
          <p>You haven&apos;t generated any content yet.</p>
          <p className="mt-2">Go to the Generator to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {generations.map((gen) => (
            <div key={gen.id} className="bg-[#1E1F20] p-6 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(gen.created_at).toLocaleString()}
              </p>
              <h3 className="font-semibold text-gray-300 mb-3">Your Prompt:</h3>
              <p className="text-gray-400 bg-gray-800/50 p-3 rounded-md mb-4">{gen.prompt}</p>
              <h3 className="font-semibold text-gray-300 mb-3">AI Result:</h3>
              <div className="text-white whitespace-pre-wrap">{gen.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
