// File: app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react'; // We'll use a loader icon

// Note: We create a client here because this is a client component.
const supabase = createPagesBrowserClient();

export default function SettingsPage() {
  const [brandName, setBrandName] = useState('');
  const [brandTone, setBrandTone] = useState('');
  const [brandKeywords, setBrandKeywords] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the current user's profile on page load
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { brand_name, brand_tone, brand_keywords } = user.user_metadata;
        setBrandName(brand_name || '');
        setBrandTone(brand_tone || '');
        setBrandKeywords(brand_keywords || '');
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setMessage('');
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: { 
          brand_name: brandName, 
          brand_tone: brandTone, 
          brand_keywords: brandKeywords 
        }
      });
      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Settings saved successfully!');
      }
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    // This main div centers everything on the page
    <div className="w-full flex flex-col items-center pt-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Brand Voice Settings</h1>
      
      <div className="w-full max-w-2xl space-y-6 bg-[#1E1F20] p-8 rounded-lg border border-gray-700">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-300 mb-2">Brand/Product Name</label>
          <input 
            id="brandName"
            type="text" 
            value={brandName} 
            onChange={(e) => setBrandName(e.target.value)} 
            className="w-full bg-[#2a2b2c] border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="e.g., ContentAI"
          />
        </div>
        <div>
          <label htmlFor="brandTone" className="block text-sm font-medium text-gray-300 mb-2">Tone of Voice</label>
          <input 
            id="brandTone"
            type="text" 
            value={brandTone} 
            onChange={(e) => setBrandTone(e.target.value)} 
            className="w-full bg-[#2a2b2c] border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="e.g., Witty, professional, and inspiring"
          />
        </div>
        <div>
          <label htmlFor="brandKeywords" className="block text-sm font-medium text-gray-300 mb-2">Key Keywords (comma separated)</label>
          <input 
            id="brandKeywords"
            type="text" 
            value={brandKeywords} 
            onChange={(e) => setBrandKeywords(e.target.value)} 
            className="w-full bg-[#2a2b2c] border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 outline-none"
            placeholder="e.g., AI, automation, social media, growth"
          />
        </div>
        <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center disabled:bg-orange-800 disabled:cursor-not-allowed whitespace-nowrap"
            >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
        {message && <p className={`text-sm mt-4 ${message.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{message}</p>}
      </div>
    </div>
  );
}