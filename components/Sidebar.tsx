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
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { name: "Generator", href: "/dashboard", icon: Bot },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Brand Voice", href: "/dashboard/settings", icon: Settings },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar }
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);

      if (user) {
        const { data: creditData } = await supabase
          .from("credits")
          .select("count")
          .eq("user_id", user.id)
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

  const isGuest = user?.is_anonymous === true;
  const email = isGuest ? "Guest User" : user?.email ?? "User";
  const initial = email.charAt(0)?.toUpperCase() || "?";

  const maxCredits = isGuest ? 3 : 10;

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="
          lg:hidden fixed top-4 left-4 z-[60] 
          p-3 bg-neutral-900/90 backdrop-blur-xl rounded-2xl 
          border border-neutral-800/50 text-white shadow-lg
        "
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full lg:h-screen
          bg-gradient-to-b from-neutral-950 via-neutral-950 to-black
          border-r border-neutral-800/50 text-white flex flex-col 
          transition-all duration-300 z-[55]

          /* MOBILE */
          w-[80%] max-w-[260px] sm:max-w-[300px]

          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}

          /* DESKTOP */
          ${isCollapsed ? "lg:w-[85px]" : "lg:w-[280px]"}
        `}
      >

        {/* ----------- LOGO + COLLAPSE -------------- */}
        <div
          className={`
            px-5 py-4 border-b border-neutral-800/50 
            flex items-center
            ${isCollapsed ? "justify-center" : "justify-between"}
          `}
        >
          <Link
            href="/"
            className={`flex items-center gap-3 transition-all 
              ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}
            `}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-lg font-bold">ContentAI</p>
                <p className="text-[10px] text-neutral-500 uppercase">Pro Studio</p>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="
              hidden lg:flex items-center justify-center
              w-8 h-8 rounded-xl hover:bg-neutral-800/40 text-neutral-500 
            "
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* ----------- NAVIGATION -------------- */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-neutral-800">
          {!isCollapsed && (
            <p className="text-[11px] px-2 text-neutral-500 uppercase">Workspace</p>
          )}

          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl text-sm
                    transition-all

                    ${isCollapsed ? "justify-center px-3" : ""}
                    ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-md"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <span className="
                    absolute left-full ml-3 px-3 py-1.5 text-xs 
                    bg-neutral-800 rounded-md opacity-0 invisible 
                    group-hover:opacity-100 group-hover:visible
                    transition-all border border-neutral-700
                  ">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* ----------- USER SECTION -------------- */}
        <div className="p-4 border-t border-neutral-800/50 space-y-4">

          {/* CREDITS */}
          {!isCollapsed && !loading && (
            <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-neutral-500 uppercase">Credits</span>
                <Zap className="w-3 h-3 text-yellow-500" />
              </div>

              <div className="flex items-end gap-1 mt-2">
                <p className="text-2xl font-bold">{credits ?? "-"}</p>
                <p className="text-sm text-neutral-500">/ {maxCredits}</p>
              </div>

              <div className="h-1 w-full bg-neutral-800 rounded-full mt-2">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-pink-600 rounded-full"
                  style={{
                    width: `${Math.min(((credits || 0) / maxCredits) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* USER CARD */}
          <div
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl 
              bg-neutral-900/40 border border-neutral-800/50
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <div className="
              w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600
              flex items-center justify-center text-white font-bold
            ">
              {loading ? "…" : isGuest ? <User /> : initial}
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{email}</p>

                {isGuest ? (
                  <p className="text-[11px] text-neutral-500">Guest</p>
                ) : (
                  <p className="text-[11px] text-green-500">Active</p>
                )}
              </div>
            )}
          </div>

          {/* Upgrade for Guest */}
          {!loading && isGuest && !isCollapsed && (
            <Link href="/dashboard/subscriptions">
              <button className="
                w-full py-3 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-amber-500 to-orange-500 
                hover:scale-[1.02] transition-transform shadow-md
              ">
                <Sparkles className="inline-block w-4 h-4 mr-1" />
                Upgrade to Pro
              </button>
            </Link>
          )}

          {/* LOGOUT */}
          {!loading && !isGuest && (
            <button
              onClick={handleSignOut}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl
                text-neutral-400 hover:text-white hover:bg-neutral-800/40
                ${isCollapsed ? "justify-center" : ""}
              `}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
