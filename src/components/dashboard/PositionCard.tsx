// src/components/dashboard/PositionCard.tsx
import React from 'react';

interface PositionCardProps {
  position: {
    collateral: number;
    debt: number;
    collateralRatio: number;
    collateralValue: number;
    healthFactor: number;
  } | null;
  risk: {
    level: number;
    color: string;
    category: string;
  } | null;
  isLoading: boolean;
}

export function PositionCard({ position, risk, isLoading }: PositionCardProps) {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-3 bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Your Position</h3>
        <p className="text-gray-400 text-sm">No active position found</p>
        <p className="text-gray-500 text-xs mt-2">Waiting for SDS position updates...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
        Your Position
        {risk && (
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              backgroundColor: `${risk.color}20`,
              color: risk.color,
              border: `1px solid ${risk.color}50`,
            }}
          >
            {risk.category}
          </span>
        )}
      </h3>

      <div className="space-y-4">
        {/* Collateral */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Collateral</span>
            <span className="text-white font-medium">
              {position.collateral.toFixed(4)} ETH
            </span>
          </div>
          <div className="text-xs text-gray-500">
            ≈ ${position.collateralValue.toLocaleString()}
          </div>
        </div>

        {/* Debt */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Debt</span>
            <span className="text-white font-medium">
              ${position.debt.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Collateral Ratio */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Collateral Ratio</span>
            <span className="text-white font-bold">
              {position.collateralRatio.toFixed(0)}%
            </span>
          </div>
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full transition-all duration-500"
              style={{
                width: `${Math.min((position.collateralRatio / 200) * 100, 100)}%`,
                backgroundColor: risk?.color || '#22c55e',
              }}
            ></div>
            {/* Liquidation threshold marker */}
            <div
              className="absolute top-0 h-full w-0.5 bg-red-500"
              style={{ left: '60%' }}
              title="Liquidation at 120%"
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Liquidation: 120%</span>
            <span>Safe: 200%+</span>
          </div>
        </div>

        {/* Health Factor */}
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Health Factor</span>
            <span
              className="font-bold"
              style={{
                color:
                  position.healthFactor >= 1.5
                    ? '#22c55e'
                    : position.healthFactor >= 1.2
                    ? '#eab308'
                    : '#ef4444',
              }}
            >
              {position.healthFactor.toFixed(2)}
            </span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {position.healthFactor < 1.0
              ? '⚠️ Liquidation possible'
              : position.healthFactor < 1.3
              ? '⚠️ High risk'
              : '✅ Healthy position'}
          </div>
        </div>
      </div>
    </div>
  );
}