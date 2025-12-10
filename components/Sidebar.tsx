"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Settings,
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

const navItems = [
  { name: "New Post", href: "/dashboard", icon: Bot },
  { name: "My Work", href: "/dashboard/history", icon: History },
  { name: "Brand Voice", href: "/dashboard/settings", icon: Settings },
  { name: "Planner", href: "/dashboard/calendar", icon: Calendar },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isSigningOut = useRef(false);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          .from("credits")
          .select("count")
          .eq("user_id", userId)
          .maybeSingle();

        if (mounted && data) setCredits(data.count);
      } catch (e) {
        console.error("Error loading credits:", e);
      }
    };

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        loadCredits(session.user.id);
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted || isSigningOut.current) return;

        if (session?.user) {
          setUser(session.user);
          loadCredits(session.user.id);
        } else {
          setUser(null);
          setCredits(null);
        }

        setLoading(false);
        router.refresh();
      }
    );

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
      {!isMobileOpen && (
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-neutral-900/90 backdrop-blur-xl rounded-xl border border-neutral-800/50 text-white hover:bg-neutral-800/90 transition-all shadow-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        />
      )}

      <aside
        className={`
          fixed lg:relative top-0 left-0
          h-[100dvh] flex flex-col
          bg-gradient-to-b from-neutral-950 via-neutral-950 to-black
          border-r border-neutral-800/50 text-white transition-all duration-300 
          z-40 overflow-hidden
          ${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"}
          ${
            isCollapsed
              ? "lg:w-[85px] lg:min-w-[85px]"
              : "w-[280px] lg:w-[280px] lg:min-w-[280px]"
          }
        `}
      >
        {/* HEADER FIXED */}
        <div className="px-6 py-5 border-b border-neutral-800/50 flex items-center justify-between flex-shrink-0">

          {/* App Logo + Name (FIXED FOR MOBILE) */}
          <Link
            href="/"
            className={`flex items-center gap-3 transition-all duration-300 ${
              isCollapsed && !isMobileOpen ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>

            {/* FIX → App name was hidden in mobile */}
            {(!isCollapsed || isMobileOpen) && (
              <div className="whitespace-nowrap">
                <span className="text-lg font-bold">ContentAI</span>
                <span className="block text-[10px] text-neutral-500 uppercase">
                  Pro Studio
                </span>
              </div>
            )}
          </Link>

          {/* Chevron (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-9 h-9 flex-shrink-0 rounded-xl hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50 text-neutral-500 hover:text-white transition-all"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* MOBILE CLOSE (FIXED ALIGNMENT) */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-white border border-neutral-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAV AREA */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {!isCollapsed && (
            <div className="px-3 py-2 mb-4">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase">
                Workspace
              </span>
            </div>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all
                    ${isCollapsed ? "justify-center" : ""}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>

                {isCollapsed && (
                  <span className="absolute left-full ml-4 px-3 py-1.5 text-sm bg-neutral-800 text-white rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all shadow-xl border border-neutral-700/50 whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* USER SECTION */}
        <div className="p-4 border-t border-neutral-800/50 flex flex-col gap-3 flex-shrink-0">
          {!isCollapsed && !loading && (
            <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase">
                  Available Credits
                </span>
                <div className="p-1 bg-yellow-500/10 rounded-full">
                  <Zap className="w-3 h-3 text-yellow-500" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{credits ?? "-"}</span>
                <span className="text-sm text-neutral-500">/ {maxCredits}</span>
              </div>

              <div className="w-full bg-neutral-800 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-pink-600 h-full rounded-full"
                  style={{
                    width: `${Math.min(((credits || 0) / maxCredits) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex-1"></div>

          {!loading && isGuest && !isCollapsed && (
            <Link href="/dashboard/subscriptions" onClick={() => setIsMobileOpen(false)}>
              <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/20">
                <Sparkles className="w-4 h-4" />
                Upgrade to Pro
              </button>
            </Link>
          )}

          <div
            className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-neutral-900/40 border border-neutral-800/50 hover:bg-neutral-800/40 transition-all ${
              isCollapsed ? "justify-center" : ""
            } min-h-[48px]`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
              {loading ? "…" : isGuest ? <User className="w-5 h-5" /> : initial}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{loading ? "Loading..." : email}</p>

                {!loading && isGuest && (
                  <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Guest Session
                  </p>
                )}

                {!loading && !isGuest && (
                  <p className="text-[11px] text-green-500 truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Active
                  </p>
                )}
              </div>
            )}
          </div>

          {!loading && !isGuest && (
            <button
              onClick={handleSignOut}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/40 transition-all ${
                isCollapsed ? "justify-center" : ""
              }`}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          )}
        </div>
      </aside>

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
