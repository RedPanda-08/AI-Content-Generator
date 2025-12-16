'use client';

import { Heart, MessageCircle, Repeat, Send, MoreHorizontal, Bookmark, Share2, Wifi, Battery, Signal } from 'lucide-react';

interface SocialPostPreviewProps {
  content: string;
  platform: 'linkedin' | 'twitter' | 'instagram';
}

// Helper for the fake phone Status Bar at the top
const MobileStatusBar = () => (
  <div className="flex justify-between items-center px-4 py-2 text-[10px] font-medium text-zinc-400 border-b border-zinc-800/50">
    <span>9:41</span>
    <div className="flex items-center gap-1.5">
      <Signal className="w-3 h-3" />
      <Wifi className="w-3 h-3" />
      <Battery className="w-3 h-3" />
    </div>
  </div>
);

export default function SocialPostPreview({ content, platform }: SocialPostPreviewProps) {
  // Clean up content for preview rendering
  const cleanContent = content ? content.replace(/\*/g, '').trim() : "Your generated content will appear here...";
  // A fake date for realism
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const renderPlatformContent = () => {
    switch (platform) {
      case 'linkedin':
        return (
          <div className="bg-[#1e1e1e] min-h-full font-sans text-white overflow-y-auto hide-scrollbar">
            {/* LinkedIn Header */}
            <div className="flex items-center gap-3 p-3 border-b border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-zinc-600 flex-shrink-0" />
              <div className="flex-1 bg-zinc-800 py-1.5 px-3 rounded flex items-center text-zinc-400 text-sm">
                <SearchIcon className="w-4 h-4 mr-2" /> Search
              </div>
              <MessageCircle className="w-6 h-6 text-zinc-400" />
            </div>

            {/* Post Container */}
            <div className="bg-[#1e1e1e] mb-2">
              {/* Author Info */}
              <div className="p-3 flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-blue-700 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-sm">Navraj Singh</span>
                    <span className="text-zinc-400 text-xs">• 1st</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-tight">Founder @ ContentAI | Building SaaS</p>
                  <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">1h • <GlobeIcon className="w-3 h-3" /></p>
                </div>
                <MoreHorizontal className="w-5 h-5 text-zinc-400 ml-auto" />
              </div>

              {/* Post Content */}
              <div className="px-3 pb-3">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-100">
                  {cleanContent}
                </p>
              </div>

              {/* Fake Engagement Stats */}
              <div className="px-3 py-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border border-[#1e1e1e]">👍</div>
                    <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center border border-[#1e1e1e]">❤️</div>
                  </div>
                  <span>48</span>
                </div>
                <span>12 comments • 4 reposts</span>
              </div>

              {/* Action Buttons */}
              <div className="px-2 py-1 border-t border-zinc-800 flex justify-between">
                {['Like', 'Comment', 'Repost', 'Send'].map((action, i) => (
                  <div key={i} className="flex-1 py-2 flex flex-col items-center justify-center gap-1 text-zinc-400 font-medium text-xs">
                    {action === 'Like' && <Heart className="w-5 h-5" />}
                    {action === 'Comment' && <MessageCircle className="w-5 h-5" />}
                    {action === 'Repost' && <Repeat className="w-5 h-5" />}
                    {action === 'Send' && <Send className="w-5 h-5 -rotate-45 ml-1" />}
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
             {/* Fake Bottom Nav */}
             <div className="mt-auto border-t border-zinc-800 p-3 flex justify-around text-zinc-500">
                <HomeIcon className="w-6 h-6 text-white" />
                <UsersIcon className="w-6 h-6" />
                <PlusSquareIcon className="w-6 h-6" />
                <BellIcon className="w-6 h-6" />
                <BriefcaseIcon className="w-6 h-6" />
             </div>
          </div>
        );

      case 'twitter':
        return (
          <div className="bg-black min-h-full font-sans text-white overflow-y-auto hide-scrollbar">
             {/* X Header */}
             <div className="flex items-center justify-between p-3 border-b border-zinc-800 sticky top-0 bg-black/80 backdrop-blur-md z-10">
                <div className="w-8 h-8 rounded-full bg-zinc-700" />
                <XIcon className="w-5 h-5 text-white" />
                <SettingsIcon className="w-5 h-5 text-white" />
             </div>

            <div className="p-4 border-b border-zinc-800">
              {/* User Info header */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden leading-tight">
                      <span className="font-bold text-[15px] truncate">Navraj Singh</span>
                      <span className="text-zinc-500 text-[15px] truncate">@navrajsingh_ai</span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                  </div>
                </div>
              </div>

               {/* Post Content - Big Text */}
               <div className="mt-3">
                 <p className="text-[17px] leading-normal whitespace-pre-wrap text-zinc-100">
                    {cleanContent}
                  </p>
               </div>

              {/* Date & Metadata */}
              <div className="mt-4 py-3 border-y border-zinc-800 text-[15px] text-zinc-500">
                <span>10:21 AM · {dateStr}, 2024</span> · <span className="text-white font-bold">2.4K</span> Views
              </div>

              {/* Engagement Counts */}
              <div className="py-3 border-b border-zinc-800 flex gap-4 text-[15px] text-zinc-500">
                 <span className="text-zinc-500"><strong className="text-white">14</strong> Reposts</span>
                 <span className="text-zinc-500"><strong className="text-white">32</strong> Likes</span>
              </div>

              {/* Action Icons */}
              <div className="mt-3 flex justify-between text-zinc-500 max-w-md px-2">
                <MessageCircle className="w-5 h-5" />
                <Repeat className="w-5 h-5" />
                <Heart className="w-5 h-5" />
                <Bookmark className="w-5 h-5" />
                <Share2 className="w-5 h-5" />
              </div>
            </div>
             {/* Fake Bottom Nav */}
             <div className="mt-auto border-t border-zinc-800 p-3 flex justify-around text-zinc-500">
                <HomeIcon className="w-6 h-6 text-white" />
                <SearchIcon className="w-6 h-6" />
                <UsersIcon className="w-6 h-6" />
                <BellIcon className="w-6 h-6" />
                <MailIcon className="w-6 h-6" />
             </div>
          </div>
        );

      case 'instagram':
        return (
          <div className="bg-black min-h-full font-sans text-white overflow-y-auto hide-scrollbar">
            {/* IG Header */}
            <div className="p-3 flex items-center justify-between border-b border-zinc-800 sticky top-0 bg-black z-10">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">navrajsingh_ai</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
              <div className="flex gap-4">
                <PlusSquareIcon className="w-6 h-6" />
                <Heart className="w-6 h-6" />
                <MessageCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Post Header */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                   <div className="w-full h-full rounded-full bg-zinc-800 border-2 border-black" />
                </div>
                <span className="text-sm font-semibold">navrajsingh_ai</span>
              </div>
              <MoreHorizontal className="w-4 h-4" />
            </div>

            {/* Image Placeholder (Essential for IG) */}
            <div className="aspect-square bg-zinc-900 flex flex-col items-center justify-center text-zinc-600 border-y border-zinc-800">
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <span className="text-xs">[ Image Placeholder ]</span>
            </div>

            {/* Actions */}
            <div className="p-3">
              <div className="flex justify-between mb-3">
                <div className="flex gap-4">
                  <Heart className="w-6 h-6" />
                  <MessageCircle className="w-6 h-6 rotate-90" />
                  <Send className="w-6 h-6" />
                </div>
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold mb-1">2,491 likes</p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                <span className="font-semibold mr-2">navrajsingh_ai</span>
                {cleanContent}
              </div>
              <p className="text-zinc-500 text-sm mt-2">View all 12 comments</p>
              <p className="text-[10px] text-zinc-500 mt-2 uppercase">2 HOURS AGO</p>
            </div>

            {/* Fake Bottom Nav */}
             <div className="mt-auto border-t border-zinc-800 p-3 flex justify-around text-zinc-500">
                <HomeIcon className="w-6 h-6 text-white" />
                <SearchIcon className="w-6 h-6" />
                <PlusSquareIcon className="w-6 h-6" />
                <ClapperboardIcon className="w-6 h-6" />
                <div className="w-6 h-6 rounded-full bg-zinc-700" />
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    // THE MOBILE PHONE FRAME container
    <div className="mx-auto w-full max-w-[320px] h-[600px] bg-black border-[6px] border-zinc-800 rounded-[3rem] overflow-hidden relative shadow-xl ring-1 ring-zinc-950/50">
        {/* The "Notch" / Dynamic Island area */}
      <div className="absolute top-0 inset-x-0 h-6 bg-black z-20 pointer-events-none">
          <div className="mx-auto w-24 h-5 bg-black rounded-b-2xl" />
      </div>
      <MobileStatusBar />
      {/* The specific platform content rendered inside the frame */}
      <div className="h-[calc(100%-34px)] overflow-y-auto bg-black scrollbar-none">
          {renderPlatformContent()}
      </div>
    </div>
  );
}

// --- Helper Icons for the fake UIs ---
const GlobeIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>);
const SearchIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>);
const HomeIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
const UsersIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const PlusSquareIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>);
const BellIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>);
const BriefcaseIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
const XIcon = ({ className }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>);
const SettingsIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15-.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>);
const MailIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const ChevronDownIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg>);
const ImageIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>);
const ClapperboardIcon = ({ className }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>);