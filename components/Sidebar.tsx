'use client';
import Link from 'next/link';
import { LayoutDashboard, Settings, Bot, History, Menu, X, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

const navItems = [
  { name: 'Generator', href: '/dashboard', icon: Bot },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'Brand Voice', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createPagesBrowserClient();

  // This useEffect hook fetches the user's data when the component loads
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
      }
    };
    fetchUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-white hover:bg-white/20 transition-colors"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-screen flex-shrink-0 
          bg-black/95 backdrop-blur-xl border-r border-white/10
          text-white flex flex-col transition-all duration-300 ease-in-out z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
      >
        {/* Logo/Brand & Desktop Toggle */}
        <div className={`p-6 border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link href="/" className={`flex items-center gap-3 group overflow-hidden ${isCollapsed ? 'w-0' : 'w-auto'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold whitespace-nowrap">ContentAI</span>
          </Link>
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block p-1 rounded-md hover:bg-white/10">
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${ isCollapsed ? 'justify-center' : ''} ${ isActive ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5' }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className={`font-medium whitespace-nowrap transition-opacity ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{item.name}</span>
                </Link>
                {isCollapsed && (
                  <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-gray-800 text-white rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 z-50">
                    {item.name}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section / Logout */}
        <div className="p-4 border-t border-white/10 space-y-2">
            {/* Display User Email */}
            <div className={`px-2.5 py-2 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold flex-shrink-0">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : '?'}
                </div>
                <div className={`transition-opacity whitespace-nowrap overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    <p className="text-sm font-medium text-white truncate">{userEmail || 'Loading...'}</p>
                </div>
            </div>
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`font-medium whitespace-nowrap transition-opacity cursor-pointer ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}