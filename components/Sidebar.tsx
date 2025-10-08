'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Settings, Bot, History, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Generator', href: '/dashboard', icon: Bot },
  { name: 'History', href: '/dashboard/history', icon: History },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`flex flex-col flex-shrink-0 text-white bg-slate-900 transition-all duration-300 ease-in-out ${ // COLOR CHANGE: Sidebar background
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header with Toggle Button */}
      <div
        className={`flex items-center h-20 px-4 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}
      >
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-0' : 'w-full'
          }`}
        >
          <LayoutDashboard className="text-slate-100" />
          <span className="text-2xl font-bold whitespace-nowrap text-slate-100">
            Command
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-800" // COLOR CHANGE: Button hover
        >
          <Menu className="text-slate-100" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2 p-4 pt-0">
        {navItems.map((item) => (
          <div key={item.name} className="relative group">
            <Link
              href={item.href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span
                className={`overflow-hidden transition-all whitespace-nowrap ${
                  isCollapsed ? 'w-0' : 'w-full'
                }`}
              >
                {item.name}
              </span>
            </Link>
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <span className="absolute left-full ml-4 px-2 py-1 text-sm bg-slate-800 text-slate-100 rounded-md invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"> {/* COLOR CHANGE: Tooltip */}
                {item.name}
              </span>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}