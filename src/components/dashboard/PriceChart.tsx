// src/components/dashboard/PriceChart.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PriceChartProps {
  data: Array<{ timestamp: number; price: number; symbol: string }>;
  latestPrice: number | null;
  isStreaming: boolean;
}

export function PriceChart({ data, latestPrice, isStreaming }: PriceChartProps) {
  return (
    <div className="relative">
      {/* Streaming indicator overlay */}
      {isStreaming && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE</span>
          </div>
        </div>
      )}

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#9ca3af"
              tickFormatter={(ts) => new Date(ts * 1000).toLocaleTimeString()}
            />
            <YAxis 
              stroke="#9ca3af"
              tickFormatter={(val) => `$${val.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #ffffff20',
                borderRadius: '8px',
              }}
              labelFormatter={(ts) => new Date(ts * 1000).toLocaleString()}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#priceGradient)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center border border-white/5">
          <div className="text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-gray-500">Waiting for price data...</p>
            <p className="text-gray-600 text-sm mt-2">SDS will stream updates in real-time</p>
          </div>
        </div>
      )}
    </div>
  );
}