// src/components/dashboard/LiquidationAlert.tsx
import React, { useState } from 'react';

interface LiquidationAlertProps {
  risk: {
    level: number;
    category: string;
    timeToLiquidation: number;
  };
  countdown: {
    minutes: number;
    seconds: number;
    formatted: string;
    isCritical: boolean;
  };
  position: {
    collateralRatio: number;
  } | null;
}

export function LiquidationAlert({ risk, countdown, position }: LiquidationAlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-red-500/10 border-2 border-red-500 rounded-xl p-6 backdrop-blur-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🚨</span>
            <div>
              <h3 className="text-2xl font-bold text-red-400">
                {risk.category} LIQUIDATION WARNING
              </h3>
              <p className="text-white/80 text-sm">
                Your position is at {risk.level}% liquidation risk
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Time Remaining</div>
              <div className="text-2xl font-mono font-bold text-red-400">
                {countdown.formatted}
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Current Ratio</div>
              <div className="text-2xl font-bold text-white">
                {position?.collateralRatio.toFixed(0)}%
              </div>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Liquidation At</div>
              <div className="text-2xl font-bold text-white">120%</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-black/30 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-1000"
              style={{ width: `${risk.level}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-white/60 hover:text-white text-2xl leading-none ml-4"
        >
          ×
        </button>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition">
          Add Collateral Now
        </button>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
          Repay Debt
        </button>
      </div>
    </div>
  );
}