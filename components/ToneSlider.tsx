'use client';

interface ToneSliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (val: number) => void;
}

export default function ToneSlider({ label, leftLabel, rightLabel, value, onChange }: ToneSliderProps) {
  return (
    <div className="group w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
          {label}
        </span>
        <span className="text-xs font-mono font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md">
          {value}%
        </span>
      </div>
      
      <div className="relative w-full h-6 flex items-center touch-none">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
           {/* Active Fill Gradient */}
           <div 
             className="h-full bg-gradient-to-r from-orange-500 to-pink-600 opacity-80" 
             style={{ width: `${value}%` }}
           />
        </div>

        {/* The Actual Range Input (Invisible but clickable) */}
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />

        {/* Custom Thumb (Visual Only - follows value) */}
        <div 
            className="absolute h-4 w-4 bg-white rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] border-2 border-orange-500 pointer-events-none transition-all duration-75 ease-out top-1/2 -translate-y-1/2"
            style={{ left: `calc(${value}% - 8px)` }}
        />
      </div>
      
      <div className="flex justify-between mt-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 group-hover:text-neutral-400 transition-colors">
          {leftLabel}
        </span>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 group-hover:text-neutral-400 transition-colors">
          {rightLabel}
        </span>
      </div>
    </div>
  );
}