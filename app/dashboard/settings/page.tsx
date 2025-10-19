'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client'; 
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const [brandName, setBrandName] = useState('');
  const [brandTone, setBrandTone] = useState('');
  const [brandKeywords, setBrandKeywords] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
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

    if (!brandName.trim() || !brandTone.trim() || !brandKeywords.trim()) {
      setMessage(' Please fill in all fields before saving.');
      return;
    }
    
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
        setMessage(` Error: ${error.message}`);
      } else {
        setMessage(' Settings saved successfully!');
      }
    } else {
       setMessage(' You must be logged in to save settings.');
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-2xl bg-gray-900/60 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-800 my-8">
            <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 to-pink-600 bg-clip-text text-transparent">
            ✨ Brand Voice Settings
            </h1>

            <div className="flex flex-col gap-5">
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                Brand Name
                </label>
                <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Enter your brand name"
                />
            </div>

            {/* Brand Tone */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                Brand Tone
                </label>
                <input
                type="text"
                value={brandTone}
                onChange={(e) => setBrandTone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                placeholder="e.g., Professional, Friendly, Casual"
                />
            </div>

            {/* Brand Keywords */}
            <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">
                Brand Keywords
                </label>
                <input
                type="text"
                value={brandKeywords}
                onChange={(e) => setBrandKeywords(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="e.g., innovation, trust, speed"
                />
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                disabled={isSaving || !brandName.trim() || !brandTone.trim() || !brandKeywords.trim()}
                className={`flex items-center justify-center gap-2 px-6 py-3 mt-4 rounded-xl font-semibold transition-all transform w-full cursor-pointer text-white
                ${
                    isSaving || !brandName.trim() || !brandTone.trim() || !brandKeywords.trim()
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 hover:-translate-y-0.5'
                } shadow-lg`}
            >
                {isSaving ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                    </>
                ) : (
                    'Save Settings'
                )}
            </button>

            {/* Message */}
            {message && (
                <p
                className={`text-sm mt-4 text-center font-medium  ${
                    message.includes('✅')
                    ? 'text-green-400'
                    : message.includes('⚠️')
                    ? 'text-yellow-400'
                    : 'text-red-400'
                }`}
                >
                {message}
                </p>
            )}
            </div>
        </div>
    </div>
  );
}

