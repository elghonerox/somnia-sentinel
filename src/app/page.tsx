// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);

  // Contract addresses from deployment
  const LENDING_POOL = '0x4C48B2e3911A94A59e942b67E121CdF2fec8C55D';
  const SENTINEL = '0x10e3a6F7BD9834274EFD49cC3648c59a33aD593f';

  const handleConnect = () => {
    setIsConnected(true);
    // Redirect to full dashboard
    router.push('/dashboard');
  };

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
              onClick={handleConnect}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Launch Dashboard
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">
              Real-Time DeFi Monitoring
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Never miss a liquidation. React to market changes instantly.
            </p>
            <button
              onClick={handleConnect}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Launch Real-Time Dashboard →
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