// src/components/dashboard/ActivityFeed.tsx
import React from 'react';
import { useSomniaStream } from '@/hooks/useSomniaStream';
import { CONTRACTS, EVENTS, type ActivityEvent, formatPrice } from '@/services/sdsClient';

interface ActivityFeedProps {
  userAddress: `0x${string}` | undefined;
}

export function ActivityFeed({ userAddress }: ActivityFeedProps) {
  const { data: activities, isConnected } = useSomniaStream<ActivityEvent>({
    contractAddress: CONTRACTS.LENDING_POOL,
    eventName: EVENTS.ACTIVITY,
    filter: userAddress ? { user: userAddress } : {},
    enabled: !!userAddress,
    maxEvents: 10,
  });

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'DEPOSIT': return '💰';
      case 'BORROW': return '📤';
      case 'REPAY': return '💵';
      case 'WITHDRAW': return '📥';
      default: return '📊';
    }
  };

  const formatTime = (timestamp: bigint) => {
    const seconds = Math.floor((Date.now() / 1000) - Number(timestamp));
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Live Activity Feed</h3>
        <div className="flex items-center gap-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className={isConnected ? 'text-green-400' : 'text-gray-500'}>
            {isConnected ? 'Streaming' : 'Connecting...'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 hover:bg-white/10"
            >
              <span className="text-2xl">{getActionIcon(activity.actionType)}</span>
              <div className="flex-1">
                <div className="font-medium text-white">{activity.actionType}</div>
                <div className="text-sm text-gray-400">
                  {formatPrice(activity.amount).toFixed(4)} tokens
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(activity.timestamp)}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📡</div>
            <p>Waiting for activity...</p>
            <p className="text-xs mt-1">New events will appear instantly via SDS</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        New events appear instantly via SDS
      </div>
    </div>
  );
}