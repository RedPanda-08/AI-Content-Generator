'use client';

// ✅ Import 'ReactNode' directly to avoid namespace issues
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient, Session } from '@supabase/supabase-js';

// 1. Define the shape of your Context
interface SupabaseContextType {
  supabase: SupabaseClient;
  session: Session | null;
  initialized: boolean;
  createGuestAccount: () => Promise<void>;
}

// 2. Create Context with explicit type
const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// 3. Provider Component
export function SupabaseProvider({ children }: { children: ReactNode }) {
  
  // Initialize Supabase client
  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Guest Logic
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

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setSession(session);
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          setInitialized(true);
        }
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

// 4. Custom Hook with safety check
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside a SupabaseProvider');
  }
  return context;
};