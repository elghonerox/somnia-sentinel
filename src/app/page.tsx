// app/page.tsx
'use client';

import { useState } from 'react';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);

  // Contract addresses from your deployment
  const LENDING_POOL = '0x4C48B2e3911A94A59e942b67E121CdF2fec8C55D';
  const SENTINEL = '0x10e3a6F7BD9834274EFD49cC3648c59a33aD593f';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                ⚡ Somnia Sentinel
                <span className="text-sm font-normal text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full">
                  Real-Time DeFi Monitor
                </span>
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Powered by Somnia Data Streams - No Polling, Zero Delay
              </p>
            </div>

            <button
              onClick={() => setIsConnected(!isConnected)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              {isConnected ? '✓ Connected' : 'Connect Wallet'}
            </button>
          </div>

          {/* Connection Status */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400">Contracts Deployed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-400">Somnia Testnet</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {!isConnected ? (
          // Welcome Screen
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-white mb-4">
                Real-Time DeFi Monitoring
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Never miss a liquidation. React to market changes instantly.
              </p>
              <button
                onClick={() => setIsConnected(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Connect Wallet to Get Started
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Instant Updates
                </h3>
                <p className="text-gray-400">
                  Sub-second blockchain data streaming. No polling delays.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-4xl mb-4">🚨</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Liquidation Alerts
                </h3>
                <p className="text-gray-400">
                  Real-time countdown timers warn you before it's too late.
                </p>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Live Dashboards
                </h3>
                <p className="text-gray-400">
                  Charts and metrics that update as events fire on-chain.
                </p>
              </div>
            </div>

            {/* Deployed Contracts Info */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                ✓ Contracts Successfully Deployed
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">MockLendingPool:</span>
                  <a
                    href={`https://shannon-explorer.somnia.network/address/${LENDING_POOL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-purple-400 hover:text-purple-300 font-mono"
                  >
                    {LENDING_POOL}
                  </a>
                </div>
                <div>
                  <span className="text-gray-400">SentinelMonitor:</span>
                  <a
                    href={`https://shannon-explorer.somnia.network/address/${SENTINEL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-purple-400 hover:text-purple-300 font-mono"
                  >
                    {SENTINEL}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Connected Dashboard (Demo)
          <div className="max-w-7xl mx-auto">
            {/* Mock Dashboard */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="col-span-8 space-y-6">
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
                        $2,000
                      </div>
                      <div className="text-sm text-green-400">
                        ↑ 0.00%
                      </div>
                    </div>
                  </div>

                  {/* Mock Chart */}
                  <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center border border-white/5">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-gray-500">
                        Live price chart (SDS streaming ready)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4 text-sm text-gray-400">
                    <div>
                      Updates: <span className="text-white">1</span>
                    </div>
                    <div>
                      Latency:{' '}
                      <span className="text-green-400">&lt;1s</span>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                      Live Activity Feed
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">Ready to Stream</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-2xl">💰</span>
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          Test Position Created
                        </div>
                        <div className="text-sm text-gray-400">
                          1 ETH collateral, $1,500 debt
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">Just now</div>
                    </div>
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    New events appear instantly via SDS
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-4 space-y-6">
                {/* Position Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                    Your Position
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/50">
                      WARNING
                    </span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Collateral</span>
                        <span className="text-white font-medium">
                          1.0000 ETH
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ≈ $2,000
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Debt</span>
                        <span className="text-white font-medium">
                          $1,500
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">
                          Collateral Ratio
                        </span>
                        <span className="text-white font-bold">133%</span>
                      </div>
                      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-yellow-500 transition-all"
                          style={{ width: '66%' }}
                        ></div>
                        <div
                          className="absolute top-0 h-full w-0.5 bg-red-500"
                          style={{ left: '60%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Liquidation: 120%</span>
                        <span>Safe: 200%+</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Health Factor</span>
                        <span className="font-bold text-yellow-400">
                          1.11
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ⚠️ High risk
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-blue-400 mb-3">
                    📋 Next Steps
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-300">
                    <li>✓ Contracts deployed</li>
                    <li>✓ Test position created</li>
                    <li>→ Implement SDS hooks</li>
                    <li>→ Add real-time charts</li>
                    <li>→ Test streaming updates</li>
                  </ol>
                </div>

                {/* Resources */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">
                    📚 Resources
                  </h3>
                  <div className="space-y-2 text-sm">
                    <a
                      href="https://docs.somnia.network"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-400 hover:text-purple-300"
                    >
                      → Somnia Docs
                    </a>
                    <a
                      href="https://datastreams.somnia.network"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-400 hover:text-purple-300"
                    >
                      → Data Streams Guide
                    </a>
                    <a
                      href="https://shannon-explorer.somnia.network"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-purple-400 hover:text-purple-300"
                    >
                      → Block Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>
            Built with ⚡ Somnia Data Streams | Somnia Mini Hackathon 2025
          </p>
        </div>
      </footer>
    </div>
  );
}