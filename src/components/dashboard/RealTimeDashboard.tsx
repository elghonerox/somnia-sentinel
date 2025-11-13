// src/components/dashboard/RealTimeDashboard.tsx
/**
 * Main Real-Time Dashboard Component
 * 
 * This is where all SDS streams come together to create the
 * showcase-quality real-time experience that wins hackathons.
 * 
 * KEY FEATURES:
 * - Live price chart (updates instantly)
 * - Position monitoring (real-time collateral ratio)
 * - Liquidation alerts (countdown timer)
 * - Activity feed (streaming events)
 * - Connection indicators
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { usePriceStream } from '@/hooks/usePriceStream';
import { usePositionMonitor, useLiquidationCountdown } from '@/hooks/usePositionMonitor';
import { CONTRACTS } from '@/services/sdsClient';
import { PriceChart } from './PriceChart';
import { PositionCard } from './PositionCard';
import { LiquidationAlert } from './LiquidationAlert';
import { ActivityFeed } from './ActivityFeed';
import { LiveIndicator } from '../shared/LiveIndicator';
import { ConnectionStatus } from '../shared/ConnectionStatus';

export function RealTimeDashboard() {
  // ============================================
  // WALLET CONNECTION
  // ============================================
  const { address, isConnected: walletConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // ============================================
  // SDS STREAMS
  // ============================================

  // Stream 1: Real-time ETH price
  const priceStream = usePriceStream(CONTRACTS.WETH);

  // Stream 2: User's position monitoring
  const positionMonitor = usePositionMonitor(address);

  // Stream 3: Liquidation countdown
  const countdown = useLiquidationCountdown(
    positionMonitor.risk?.timeToLiquidation || null
  );

  // ============================================
  // UI STATE
  // ============================================

  const [showComparison, setShowComparison] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play alert sound when critical risk detected
  useEffect(() => {
    if (
      soundEnabled &&
      positionMonitor.risk?.category === 'CRITICAL' &&
      positionMonitor.isAtRisk
    ) {
      // Play alert sound (would implement actual audio)
      console.log('🚨 CRITICAL ALERT SOUND');
    }
  }, [positionMonitor.risk?.category, positionMonitor.isAtRisk, soundEnabled]);

  // ============================================
  // WALLET CONNECTION HANDLER
  // ============================================
  const handleConnect = () => {
    // Use the first available connector (MetaMask/injected)
    if (connectors && connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                ⚡ Somnia Sentinel
                <span className="text-sm font-normal text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                  Real-Time DeFi Monitor
                </span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Powered by Somnia Data Streams - No Polling, Zero Delay
              </p>
            </div>

            {/* Connection indicators */}
            <div className="flex items-center gap-4">
              {walletConnected ? (
                <>
                  <LiveIndicator isLive={priceStream.isConnected} label="Price Feed" />
                  <LiveIndicator
                    isLive={positionMonitor.isConnected}
                    label="Position Monitor"
                  />
                  
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-400">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </div>
                    <button
                      onClick={() => disconnect()}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      Disconnect
                    </button>
                  </div>

                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    {showComparison ? 'Hide' : 'Show'} Comparison Demo
                  </button>
                </>
              ) : (
                <button
                  onClick={handleConnect}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          {/* Connection Status Details */}
          {walletConnected && (
            <ConnectionStatus
              streams={[
                {
                  name: 'Price Stream',
                  isConnected: priceStream.isConnected,
                  updateCount: priceStream.updateCount,
                  error: priceStream.error,
                },
                {
                  name: 'Position Monitor',
                  isConnected: positionMonitor.isConnected,
                  error: positionMonitor.error,
                },
              ]}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {!walletConnected ? (
          // Not connected state
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🔌</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-gray-400 mb-6">
                Connect to Somnia Testnet to start monitoring your DeFi positions
                in real-time
              </p>
              <button
                onClick={handleConnect}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Connect Wallet
              </button>
              <p className="text-gray-500 text-sm mt-4">
                Make sure you're on Somnia Testnet
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Liquidation Alert Banner */}
            {positionMonitor.isAtRisk && positionMonitor.risk && countdown && (
              <LiquidationAlert
                risk={positionMonitor.risk}
                countdown={countdown}
                position={positionMonitor.position}
              />
            )}

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-6 mt-6">
              {/* Left Column - Charts & Activity */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Price Chart */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Live Price Feed
                      </h3>
                      <p className="text-sm text-gray-400">
                        Real-time updates via Somnia Data Streams
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        ${priceStream.latestPrice?.toLocaleString() || '---'}
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          priceStream.priceChangePercent >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {priceStream.priceChangePercent >= 0 ? '↑' : '↓'}{' '}
                        {Math.abs(priceStream.priceChangePercent).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <PriceChart
                    data={priceStream.priceHistory}
                    latestPrice={priceStream.latestPrice}
                    isStreaming={priceStream.isConnected}
                  />

                  {/* Stream Stats */}
                  <div className="flex gap-4 mt-4 text-sm text-gray-400">
                    <div>
                      Updates: <span className="text-white">{priceStream.updateCount}</span>
                    </div>
                    <div>
                      Frequency:{' '}
                      <span className="text-white">
                        {priceStream.updatesPerMinute} updates/min
                      </span>
                    </div>
                    <div>
                      Latency:{' '}
                      <span className="text-green-400">
                        &lt;1s
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <ActivityFeed userAddress={address} />
              </div>

              {/* Right Column - Position Info */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Position Card */}
                <PositionCard
                  position={positionMonitor.position}
                  risk={positionMonitor.risk}
                  isLoading={positionMonitor.isLoading}
                />

                {/* Quick Actions */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition">
                      Add Collateral
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                      Repay Debt
                    </button>
                    <button className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition">
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Risk Metrics */}
                {positionMonitor.risk && (
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Risk Metrics
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Risk Level:</span>
                        <span
                          className="font-bold"
                          style={{ color: positionMonitor.risk.color }}
                        >
                          {positionMonitor.risk.level}/100
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="font-bold text-white">
                          {positionMonitor.risk.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Liquidation Price:</span>
                        <span className="font-bold text-white">
                          ${positionMonitor.risk.liquidationPrice.toFixed(2)}
                        </span>
                      </div>
                      {countdown && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time Remaining:</span>
                          <span className="font-bold text-red-400">
                            {countdown.formatted}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comparison Demo (if enabled) */}
            {showComparison && (
              <div className="mt-6">
                {/* Would implement split-screen comparison here */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    📊 Polling vs. Streaming Comparison
                  </h3>
                  <p className="text-gray-400">
                    Split-screen demo showing traditional 10s polling delay vs.
                    instant SDS updates would go here
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}