import React from 'react';

export default function Logo({ className = "w-8 h-8", color = "white", fontSize = "text-2xl" }: { className?: string, color?: string, fontSize?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* The Icon: The Magic Cursor */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
        style={{ minWidth: 'auto' }}
      >
        {/* 1. The Cursor (The Trigger) */}
        {/* A sleek vertical pill shape representing the blinking cursor */}
        <rect 
          x="20" y="15" 
          width="12" height="70" 
          rx="6" 
          fill={color} 
        />

        {/* 2. The Generation (The Output) */}
        {/* Three "Speed Lines" or "Data Streams" growing out from the cursor */}
        {/* Top Line - Short */}
        <path 
          d="M45 30H85" 
          stroke={color} 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        
        {/* Middle Line - Long (The main content) */}
        <path 
          d="M45 50H95" 
          stroke={color} 
          strokeWidth="8" 
          strokeLinecap="round" 
          opacity="0.8"
        />

        {/* Bottom Line - Medium */}
        <path 
          d="M45 70H75" 
          stroke={color} 
          strokeWidth="8" 
          strokeLinecap="round" 
          opacity="0.6"
        />

        {/* 3. The Spark (The Magic) */}
        {/* A floating 'star' element near the top right to signify AI intelligence */}
        <path 
          d="M85 15L88 22L95 25L88 28L85 35L82 28L75 25L82 22Z" 
          fill={color} 
        />
      </svg>
      
      {/* The Text */}
      <span className="font-bold text-2xl tracking-tight leading-none" style={{ color: color }}>
        Content<span className="font-bold opacity-80">AI</span>
      </span>
    </div>
  );
}