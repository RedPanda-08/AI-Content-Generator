"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  History,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles,
  Zap,
  Calendar
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Renamed tabs for better UX
const navItems = [
  { name: "Create", href: "/dashboard", icon: Bot },
  { name: "Saved Posts", href: "/dashboard/history", icon: History },
  { name: "Brand Style", href: "/dashboard/settings", icon: Sparkles },
  { name: "Planner", href: "/dashboard/calendar", icon: Calendar }
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isSigningOut = useRef(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const isExpanded = isMobileOpen || !isCollapsed;

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let mounted = true;

    const loadCredits = async (userId: string) => {
      try {
        const { data } = await supabase
          .from('credits')
          .select('count')
          .eq('user_id', userId)
          .maybeSingle();

        if (mounted && data) {
          setCredits(data.count);
        }
      } catch (error) {
        console.error("Error loading credits:", error);
      }
    };

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            loadCredits(session.user.id);
          } else {
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      
      if (isSigningOut.current) return;

      if (session?.user) {
        setUser(session.user);
        loadCredits(session.user.id);
      } else {
        setUser(null);
        setCredits(null);
      }
      setLoading(false);
      router.refresh();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleSignOut = async () => {
    isSigningOut.current = true;
    await supabase.auth.signOut();
    window.location.href = "/"; 
  };

  const isGuest = user === null || user?.is_anonymous === true;
  const email = isGuest ? "Guest User" : user?.email ?? "User";
  const initial = email.charAt(0)?.toUpperCase() || "?";
  const maxCredits = isGuest ? 3 : 10; 

  return (
    <>
      {/* Mobile Toggle Button */}
      {/* FIX: Increased z-index to z-[100] to ensure it's always clickable */}
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[100] p-3 bg-neutral-900/90 backdrop-blur-xl rounded-xl border border-neutral-800/50 text-white hover:bg-neutral-800/90 transition-all shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile overlay */}
      {/* FIX: Increased z-index to z-[140] to cover any floating feedback buttons */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[140]"
        />
      )}
      
      <aside
        className={`
          fixed lg:relative top-0 left-0 
          h-[100dvh]
          bg-gradient-to-b from-neutral-950 via-neutral-950 to-black
          border-r border-neutral-800/50 text-white flex flex-col transition-all duration-300 ease-in-out
          /* FIX: Increased z-index to z-[150] to sit ON TOP of the overlay and feedback form */
          z-[150]
          ${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[85px]" : "w-[280px] lg:w-[280px]"}
        `}
      >
        {/* --- HEADER --- */}
        <div className={`relative py-5 border-b border-neutral-800/50 flex items-center flex-shrink-0 transition-all duration-300 ${
            !isExpanded ? "justify-center px-0" : "justify-between px-6"
          }`}
        >
          <Link
            href="/"
            className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${
              !isExpanded ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
            }`}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div className="whitespace-nowrap">
              <span className="text-lg font-bold block">ContentAI</span>
              <span className="block text-[10px] text-neutral-500 uppercase">Pro Studio</span>
            </div>
          </Link>

          {/* Icon Only Mode */}
          {!isExpanded && (
             <div className="w-11 h-11 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
                <LayoutDashboard className="w-5 h-5 text-white" />
             </div>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex items-center justify-center w-9 h-9 rounded-xl hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50 text-neutral-500 hover:text-white transition-all flex-shrink-0 ${
               !isExpanded 
                 ? "absolute -right-3 top-1/2 -translate-y-1/2 bg-neutral-900 border-neutral-700 shadow-xl scale-90 z-50" 
                 : ""
            }`}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-white transition-all border border-neutral-700/50 flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- NAVIGATION --- */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Workspace Label */}
          <div className={`transition-all duration-300 overflow-hidden ${
             isExpanded ? "max-h-10 opacity-100 mb-4 px-3 py-2" : "max-h-0 opacity-0 mb-0"
          }`}>
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">
              Workspace
            </span>
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/25"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                    }
                    ${isExpanded 
                        ? "gap-4 px-4 py-3 justify-start" 
                        : "w-11 h-11 justify-center mx-auto" 
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  
                  <span className={`font-medium text-[15px] whitespace-nowrap transition-all duration-300 ${
                      isExpanded ? "w-auto opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4 overflow-hidden"
                  }`}>
                    {item.name}
                  </span>

                  {isExpanded && isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white flex-shrink-0 animate-pulse"></div>
                  )}
                </Link>

                {/* Tooltip */}
                {isCollapsed && !isMobileOpen && (
                  <span className="absolute left-full ml-4 px-3 py-1.5 text-sm bg-neutral-800 text-white rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all shadow-xl border border-neutral-700/50 whitespace-nowrap z-50 top-1/2 -translate-y-1/2">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* --- USER SECTION --- */}
        <div className={`border-t border-neutral-800/50 space-y-3 flex-shrink-0 transition-all duration-300 ${
            isExpanded ? "p-4" : "p-2"
        }`}>
          
          {/* Credits Box */}
          {!loading && (
             <div className={`bg-neutral-900/50 rounded-xl border border-neutral-800/50 transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded ? "p-4 max-h-[200px] opacity-100 mb-2" : "p-0 max-h-0 opacity-0 mb-0 border-0"
             }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase whitespace-nowrap">Content Tokens</span>
                <div className="p-1 bg-yellow-500/10 rounded-full flex-shrink-0">
                  <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{credits ?? "-"}</span>
                <span className="text-sm text-neutral-500">/ {maxCredits}</span>
              </div>

              <div className="w-full bg-neutral-800 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((credits || 0) / maxCredits) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* User card */}
          <div
            className={`flex items-center rounded-xl bg-neutral-900/40 border-neutral-800/50 hover:bg-neutral-800/40 transition-all duration-300 ${
               isExpanded 
                ? "gap-3 px-3 py-3 w-full justify-start border" 
                : "w-12 h-12 justify-center mx-auto border-2 p-0 shadow-lg" 
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
              {loading ? "…" : isGuest ? <User className="w-5 h-5" /> : initial}
            </div>

            <div className={`flex-1 overflow-hidden min-w-0 transition-all duration-300 ${
                isExpanded ? "w-auto opacity-100 ml-0" : "w-0 opacity-0 ml-0 absolute"
            }`}>
              <p className="text-sm font-semibold truncate whitespace-nowrap">{loading ? "Loading..." : email}</p>

              {!loading && isGuest && (
                <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0"></span>
                  Guest
                </p>
              )}

              {!loading && !isGuest && (
                <p className="text-[11px] text-green-500 truncate flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                  Active
                </p>
              )}
            </div>
          </div>

          {/* Upgrade button */}
          {!loading && isGuest && (
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
               isExpanded ? "max-h-20 opacity-100 mt-0" : "max-h-0 opacity-0 mt-0"
            }`}>
                <Link 
                href="/dashboard/subscriptions" 
                onClick={() => setIsMobileOpen(false)}
                >
                <button className="w-full flex cursor-pointer items-center justify-center gap-2 text-sm font-semibold py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap">
                    <Sparkles className="w-4 h-4 flex-shrink-0" />
                    Upgrade to Pro
                </button>
                </Link>
            </div>
          )}

          {/* Logout */}
          {!loading && !isGuest && (
            <button
              onClick={handleSignOut}
              className={`flex items-center rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/40 border border-transparent hover:border-neutral-700/50 transition-all duration-300 ${
                isExpanded 
                    ? "gap-3 px-4 py-3 w-full justify-start" 
                    : "w-11 h-11 justify-center mx-auto" 
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm cursor-pointer font-medium whitespace-nowrap transition-all duration-300 overflow-hidden ${
                  isExpanded ? "w-auto opacity-100" : "w-0 opacity-0 absolute"
              }`}>
                  Sign Out
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* Custom CSS to hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}