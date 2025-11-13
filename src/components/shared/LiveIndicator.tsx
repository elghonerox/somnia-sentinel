// src/components/shared/LiveIndicator.tsx
import React from 'react';

interface LiveIndicatorProps {
  isLive: boolean;
  label: string;
}

export function LiveIndicator({ isLive, label }: LiveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className={`w-2 h-2 rounded-full ${
          isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
        }`}
      ></div>
      <span className={isLive ? 'text-green-400' : 'text-gray-500'}>{label}</span>
    </div>
  );
}