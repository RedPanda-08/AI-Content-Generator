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
  Zap
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { name: "Generator", href: "/dashboard", icon: Bot },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Brand Voice", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  // NEW: State for credits
  const [credits, setCredits] = useState<number | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch User & Credits
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);

      // Logic to fetch credits if user exists
      if (user) {
        const { data: creditData } = await supabase
          .from('credits')
          .select('count')
          .eq('user_id', user.id)
          .single();
        
        if (creditData) {
          setCredits(creditData.count);
        }
      }
    };

    fetchData();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Detect guest
  const isGuest = user?.is_anonymous === true;
  const email = isGuest ? "Guest User" : user?.email ?? "User";
  const initial = email.charAt(0)?.toUpperCase() || "?";
  
  // Calculate max credits for progress bar (3 for guest, 10 for pro usually)
  const maxCredits = isGuest ? 3 : 10; 

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 p-3 bg-neutral-900/90 backdrop-blur-xl rounded-2xl border border-neutral-800/50 text-white hover:bg-neutral-800/90 transition-all shadow-lg"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
        />
      )}

      <aside
        className={`
          fixed lg:relative top-0 left-0 h-screen
          bg-gradient-to-b from-neutral-950 via-neutral-950 to-black
          border-r border-neutral-800/50 text-white flex flex-col transition-all duration-300 z-40
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[85px]" : "lg:w-[280px]"}
        `}
      >
        {/* Logo + Collapse Button */}
        <div
          className={`px-6 py-5 border-b border-neutral-800/50 flex items-center ${
            isCollapsed ? "justify-center px-4" : "justify-between"
          }`}
        >
          <Link
            href="/"
            className={`flex items-center gap-3 transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
            }`}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 via-orange-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight">ContentAI</span>
                <span className="text-[10px] text-neutral-500 font-medium tracking-wide uppercase">Pro Studio</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl hover:bg-neutral-800/50 transition-all text-neutral-500 hover:text-white border border-transparent hover:border-neutral-700/50"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {!isCollapsed && (
            <div className="px-3 py-2 mb-4">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Workspace</span>
            </div>
          )}
          
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200
                    ${isCollapsed ? "justify-center px-3" : ""}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/25"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                    }
                  `}
                >
                  <item.icon className={`flex-shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
                  {!isCollapsed && (
                    <span className="font-medium text-[15px]">{item.name}</span>
                  )}
                  
                  {!isCollapsed && isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <span className="absolute left-full ml-6 px-4 py-2 text-sm bg-neutral-800 text-white rounded-xl invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none z-50 shadow-xl border border-neutral-700/50">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-neutral-800/50 space-y-3">
          
          {/* NEW: CREDITS COUNTER */}
          {!isCollapsed && !loading && (
            <div className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800/50 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Available Credits</span>
                <div className="p-1 bg-yellow-500/10 rounded-full">
                  <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">{credits !== null ? credits : '-'}</span>
                <span className="text-sm text-neutral-500">/ {maxCredits}</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-neutral-800 h-1 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-pink-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(((credits || 0) / maxCredits) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* User Info Card */}
          <div
            className={`flex items-center gap-3 px-3 py-3 rounded-xl bg-neutral-900/40 border border-neutral-800/50 transition-all hover:bg-neutral-800/40 ${
              isCollapsed ? "justify-center px-2" : ""
            }`}
          >
            {/* Avatar */}
            <div
              className="
                w-10 h-10 rounded-xl 
                bg-gradient-to-br from-orange-500 to-pink-600 
                flex items-center justify-center text-white 
                text-sm font-bold shadow-md flex-shrink-0
              "
            >
              {loading ? "…" : isGuest ? <User className="w-5 h-5" /> : initial}
            </div>

            {/* User Details */}
            {!isCollapsed && (
              <div className="overflow-hidden flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {loading ? "Loading..." : email}
                </p>

                {!loading && isGuest && (
                  <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    Guest Session
                  </p>
                )}
                
                {!loading && !isGuest && (
                  <p className="text-[11px] text-green-500 truncate flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    Active
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Guest Upgrade Button */}
          {!loading && isGuest && !isCollapsed && (
            <Link href="/login">
              <button
                className="
                w-full flex items-center justify-center gap-2
                text-white text-sm font-semibold py-3
                bg-gradient-to-r from-amber-500 to-orange-500
                hover:from-amber-600 hover:to-orange-600
                rounded-xl transition-all shadow-lg shadow-amber-500/20
                hover:shadow-amber-500/30 hover:scale-[1.02]
              "
              >
                <Sparkles className="h-4 w-4 cursor-pointer" />
                Upgrade to Pro
              </button>
            </Link>
          )}

          {/* Logout Button */}
          {!loading && !isGuest && (
            <button
              onClick={handleSignOut}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-neutral-400 hover:text-white hover:bg-neutral-800/40 
                transition-all cursor-pointer border border-transparent hover:border-neutral-700/50
                ${isCollapsed ? "justify-center px-3" : ""}
              `}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}