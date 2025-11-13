// src/components/shared/ConnectionStatus.tsx
import React from 'react';

interface ConnectionStatusProps {
  streams: Array<{
    name: string;
    isConnected: boolean;
    updateCount?: number;
    error?: Error | null;
  }>;
}

export function ConnectionStatus({ streams }: ConnectionStatusProps) {
  const allConnected = streams.every((s) => s.isConnected);
  const connectedCount = streams.filter((s) => s.isConnected).length;

  return (
    <div className="mt-4 flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            allConnected ? 'bg-green-400' : 'bg-yellow-400'
          }`}
        ></div>
        <span className="text-gray-400">
          {connectedCount}/{streams.length} Streams Connected
        </span>
      </div>

      {streams.map((stream) => (
        <div key={stream.name} className="flex items-center gap-2">
          <span className="text-gray-500">{stream.name}:</span>
          <span
            className={stream.isConnected ? 'text-green-400' : 'text-red-400'}
          >
            {stream.isConnected ? '✓ Connected' : '✗ Disconnected'}
          </span>
          {stream.updateCount !== undefined && (
            <span className="text-gray-600">({stream.updateCount})</span>
          )}
        </div>
      ))}
    </div>
  );
}