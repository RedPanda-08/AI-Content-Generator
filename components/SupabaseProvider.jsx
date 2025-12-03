'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }) {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ));
  
  const [session, setSession] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // 2. Define Guest Creation Logic
  const createGuestAccount = async () => {
    try {
      console.log("Creating guest account...");
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error("Guest login failed:", error.message);
        if (error.message.includes("Anonymous sign-ins")) {
          alert("Enable 'Anonymous Sign-ins' in Supabase Dashboard -> Auth -> Providers");
        }
      } else if (data?.session) {
        console.log("Guest login successful");
        setSession(data.session);
        // Force refresh so API routes/Middleware pick up the new cookie immediately
        window.location.reload(); 
      }
    } catch (err) {
      console.error("Error creating guest:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      // Get initial session
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setInitialized(true);

      // Listen for auth changes (Login, Logout, etc.)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        if (event === 'SIGNED_IN') setInitialized(true);
      });

      return () => subscription.unsubscribe();
    };

    init();
  }, [supabase]);

  const value = {
    supabase,
    session,
    initialized,
    createGuestAccount
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  return useContext(SupabaseContext);
};