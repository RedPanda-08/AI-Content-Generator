/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Linkedin, 
  Instagram, 
  Heart, 
  MessageCircle, 
  Send, 
  Share, // Changed from Share2 for a more authentic X look
  MoreHorizontal,
  ThumbsUp,
  Repeat2,
  Bookmark,
  MessageSquare,
  Home,
  Search,
  PlusSquare,
  User,
  CheckCircle2,
  Bell,
  Globe
} from 'lucide-react';

type Platform = 'linkedin' | 'x' | 'instagram';

const XIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    className={`fill-current ${className}`}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function PhonePreview() {
  const [activeTab, setActiveTab] = useState<Platform>('linkedin');

  const platforms: Record<Platform, { icon: React.ReactNode; label: string; content: React.ReactNode }> = {
    linkedin: {
      icon: <Linkedin className="w-5 h-5 sm:w-4 sm:h-4" />,
      label: 'LinkedIn',
      content: (
        <div className="flex flex-col h-full bg-[#1b1f23] text-[#e1e3e1] font-sans">
          <div className="flex items-start gap-2 px-4 pt-10 pb-3 border-b border-white/5 bg-[#1b1f23] sticky top-0 z-10">
            <div className="w-10 h-10 rounded-sm bg-[#0a66c2] flex items-center justify-center flex-shrink-0">
               <Linkedin size={22} className="fill-current text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-white truncate flex items-center gap-1">
                ContentAI <CheckCircle2 size={14} className="text-[#70b5f9]  text-[#1b1f23]" />
              </p>
              <p className="text-[11px] text-gray-400 truncate">2,405 followers</p>
              <p className="text-[11px] text-gray-400 flex items-center gap-1">Now • <Globe size={10} /></p>
            </div>
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-400" />
              <MoreHorizontal size={20} className="text-gray-400" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#1b1f23]">
            <div className="py-3 px-4 space-y-3">
              <p className="text-[14px] leading-snug text-gray-200">
                AI isn&apos;t just a tool—it&apos;s your new competitive edge. 🚀 Stop manual grunt work and start scaling.
              </p>
              <div className="w-full aspect-[1.91/1] relative rounded-sm overflow-hidden border border-white/10 bg-zinc-900">
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" alt="Team" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between pt-2 text-[11px] text-gray-400 border-b border-white/5 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-[#378fe9] flex items-center justify-center border border-[#1b1f23]"><ThumbsUp size={8} className="text-white fill-current"/></div>
                    <div className="w-4 h-4 rounded-full bg-[#df704d] flex items-center justify-center border border-[#1b1f23]"><Heart size={8} className="text-white fill-current"/></div>
                  </div>
                  <span>124</span>
                </div>
                <span>18 comments • 12 reposts</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 px-1 py-1 border-t border-white/5 bg-[#1b1f23] pb-6">
            <div className="flex flex-col items-center gap-1 py-2 text-gray-400 hover:bg-white/5 rounded-md transition-colors"><ThumbsUp size={18} /><span className="text-[10px] font-bold">Like</span></div>
            <div className="flex flex-col items-center gap-1 py-2 text-gray-400 hover:bg-white/5 rounded-md transition-colors"><MessageSquare size={18} /><span className="text-[10px] font-bold">Comment</span></div>
            <div className="flex flex-col items-center gap-1 py-2 text-gray-400 hover:bg-white/5 rounded-md transition-colors"><Repeat2 size={18} /><span className="text-[10px] font-bold">Repost</span></div>
            <div className="flex flex-col items-center gap-1 py-2 text-gray-400 hover:bg-white/5 rounded-md transition-colors"><Send size={18} /><span className="text-[10px] font-bold">Send</span></div>
          </div>
        </div>
      )
    },
    x: {
      icon: <XIcon size={16} />,
      label: 'Twitter',
      content: (
        <div className="flex flex-col h-full bg-black text-white font-sans">
          <div className="flex flex-col pt-10 bg-black/90 backdrop-blur-md sticky top-0 z-10 border-b border-zinc-800">
            <div className="flex justify-between items-center px-4 mb-1 flex-nowrap">
              <div className="w-8 h-8 rounded-full bg-zinc-700/50 flex-shrink-0" /> 
              <div className="flex items-center gap-4 sm:gap-6 flex-nowrap">
                <div className="relative py-2 whitespace-nowrap">
                  <span className="text-[13px] sm:text-[15px] font-bold text-white">For you</span>
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1d9bf0] rounded-full" />
                </div>
                <XIcon size={18} className="text-white flex-shrink-0" />
                <div className="py-2 whitespace-nowrap">
                  <span className="text-[13px] sm:text-[15px] font-bold text-zinc-500">Following</span>
                </div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"><MoreHorizontal size={18} className="text-zinc-400" /></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="pt-3">
              <div className="flex gap-3 px-4">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center font-bold text-[10px]">AI</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[15px] font-bold text-white truncate flex items-center gap-1">ContentAI <CheckCircle2 size={14} className="text-[#1d9bf0] fill-[#1d9bf0] text-white" /></span>
                    <span className="text-[14px] text-zinc-500 truncate">@content_ai</span>
                  </div>
                  <div className="mt-3 space-y-4">
                    <p className="text-[15px] leading-[1.3] text-white break-words">
                      Debugging code is like being a detective in a crime movie where you&apos;re also the murderer trying to figure out what you did wrong. 🕵️‍♂️🔍
                    </p>
                    <p className="text-[15px] leading-[1.3] text-white">
                      Sometimes, the biggest mystery is why it even works in the first place.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[#1d9bf0] text-[15px] hover:underline cursor-pointer">#CodeLife</span>
                      <span className="text-[#1d9bf0] text-[15px] hover:underline cursor-pointer">#DeveloperStruggles</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 px-4">
                <div className="py-4 border-t border-zinc-800 text-[13px] text-zinc-500 flex items-center gap-1 flex-wrap">
                   <span>10:21 AM</span><span>·</span><span>Dec 18, 2024</span><span>·</span><span className="text-white font-bold">2.4K</span><span>Views</span>
                </div>
                <div className="py-4 border-t border-zinc-800 flex gap-5 text-[13px]">
                  <div className="flex gap-1 items-center"><span className="font-bold text-white">14</span><span>Reposts</span></div>
                  <div className="flex gap-1 items-center"><span className="font-bold text-white">32</span><span>Likes</span></div>
                </div>
                {/* Specific Action Buttons from image_cb1211.png */}
                <div className="flex justify-between items-center py-3 border-t border-zinc-800 text-zinc-500 px-2">
                  <MessageSquare size={19} className="hover:text-[#1d9bf0] transition-colors cursor-pointer" />
                  <Repeat2 size={19} className="hover:text-[#00ba7c] transition-colors cursor-pointer" />
                  <Heart size={19} className="hover:text-[#f91880] transition-colors cursor-pointer" />
                  <Bookmark size={19} className="hover:text-[#1d9bf0] transition-colors cursor-pointer" />
                  <Share size={19} className="hover:text-[#1d9bf0] transition-colors cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-zinc-800 px-6 py-3 flex justify-between bg-black pb-8">
            <Home size={22} className="text-white" /><Search size={22} /><PlusSquare size={22} /><MessageSquare size={22} /><User size={22} />
          </div>
        </div>
      )
    },
    instagram: {
      icon: <Instagram className="w-5 h-5 sm:w-4 sm:h-4" />,
      label: 'Instagram',
      content: (
        <div className="flex flex-col h-full bg-black text-white">
          <div className="flex items-center justify-between px-4 pt-11 pb-3 bg-black sticky top-0 z-10">
             <span className="text-xl font-bold italic tracking-tighter">Instagram</span>
             <div className="flex gap-5"><Heart size={24} /><MessageSquare size={24} /></div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="flex items-center gap-2.5 px-3 py-2">
              <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                <div className="w-full h-full rounded-full bg-black border-[1.5px] border-black flex items-center justify-center text-[8px] font-black italic">AI</div>
              </div>
              <span className="text-[14px] font-bold flex items-center gap-1">content.ai <CheckCircle2 size={14} className="text-[#0095f6] fill-[#0095f6] text-white" /></span>
            </div>
            <div className="w-full aspect-square relative border-y border-white/5 overflow-hidden bg-zinc-900">
               <img src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format&fit=crop" alt="IG Post" className="w-full h-full object-cover" />
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex gap-4"><Heart size={26} className="text-red-500 fill-red-500" /><MessageCircle size={26} /><Send size={26} /></div>
                <Bookmark size={26} />
              </div>
              <div className="space-y-1">
                <p className="text-[14px] font-bold">12,405 likes</p>
                <p className="text-[14px]"><span className="font-bold mr-2">content.ai</span>Scale your brand voice. 🚀✨</p>
              </div>
            </div>
          </div>
          <div className="mt-auto border-t border-white/5 px-7 pt-4 pb-8 flex justify-between bg-black">
             <Home size={26} /><Search size={26} /><PlusSquare size={26} /><Heart size={26} /><User size={26} />
          </div>
        </div>
      )
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-8 px-4 pt-4 pb-10 overflow-hidden">
      <div className="flex p-1.5 bg-neutral-900/80 border border-white/5 rounded-2xl shadow-2xl overflow-x-auto no-scrollbar max-w-full">
        {(Object.keys(platforms) as Platform[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex items-center gap-2 sm:gap-3 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-500 whitespace-nowrap ${
              activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {activeTab === tab && (
              <motion.div 
                layoutId="active-pill"
                className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{platforms[tab].icon}</span>
            <span className="relative z-10 capitalize hidden sm:inline">{platforms[tab].label}</span>
          </button>
        ))}
      </div>

      <div className="relative group w-full max-w-[340px]">
        <div className="absolute -inset-10 bg-gradient-to-tr from-orange-500/20 to-pink-600/20 blur-[80px] rounded-full opacity-20 pointer-events-none" />
        <div className="relative w-full aspect-[9/18.5] sm:h-[650px] bg-[#000] rounded-[3rem] border-[10px] sm:border-[12px] border-zinc-900 shadow-2xl ring-1 ring-white/10 mx-auto overflow-hidden">
          <div className="relative h-full flex flex-col">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-zinc-900 rounded-b-[1.2rem] z-50 flex items-center justify-center">
              <div className="w-8 h-1 bg-white/10 rounded-full" />
            </div>
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="h-full w-full absolute inset-0"
                >
                  {platforms[activeTab].content}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-white/15 rounded-full z-50" />
          </div>
        </div>
      </div>
    </div>
  );
}