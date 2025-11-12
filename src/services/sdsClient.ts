// src/services/sdsClient.ts
/**
 * Somnia Data Streams SDK Client Configuration
 * 
 * This file initializes the SDS SDK and provides type definitions
 * for all events we'll be streaming in the application.
 */

import { SDK } from '@somnia-chain/streams';
import { createPublicClient, createWalletClient, http, type Account } from 'viem';
import { somniaTestnet } from 'viem/chains';

// ============================================
// TYPE DEFINITIONS FOR SDS EVENTS
// ============================================

/**
 * Price update event from MockLendingPool
 * Streams real-time price changes for the live chart
 */
export interface PriceUpdateEvent {
  token: `0x${string}`;
  price: bigint;
  timestamp: bigint;
  symbol: string;
}

/**
 * Position update event from MockLendingPool
 * Drives the real-time position monitoring dashboard
 */
export interface PositionUpdateEvent {
  user: `0x${string}`;
  collateral: bigint;
  debt: bigint;
  collateralRatio: bigint;
  timestamp: bigint;
  action: string;
}

/**
 * Liquidation risk event from SentinelMonitor
 * Triggers alerts and countdown timers
 */
export interface LiquidationRiskEvent {
  user: `0x${string}`;
  collateralRatio: bigint;
  riskLevel: bigint;
  timeToLiquidation: bigint;
  timestamp: bigint;
}

/**
 * Alert event from SentinelMonitor
 * Displays critical notifications to users
 */
export interface AlertEvent {
  user: `0x${string}`;
  alertType: string;
  severity: bigint;
  message: string;
  timestamp: bigint;
}

/**
 * Activity event from MockLendingPool
 * Populates the live activity feed
 */
export interface ActivityEvent {
  user: `0x${string}`;
  actionType: string;
  amount: bigint;
  token: `0x${string}`;
  timestamp: bigint;
}

// ============================================
// SDK INITIALIZATION
// ============================================

/**
 * Initialize Somnia Data Streams SDK
 * 
 * @param account - Optional wallet account for write operations
 * @returns Configured SDK instance
 * 
 * Usage:
 * ```typescript
 * const sdk = initializeSDK();
 * const subscription = await sdk.streams.subscribe(
 *   'PriceUpdated',
 *   [],
 *   (event) => console.log('New price:', event)
 * );
 * ```
 */
export const initializeSDK = (account?: Account) => {
  const rpcUrl = process.env.NEXT_PUBLIC_SOMNIA_RPC || 'https://dream-rpc.somnia.network/';

  // Create public client for reading blockchain data
  const publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http(rpcUrl),
  });

  // Create wallet client if account provided (for write operations)
  const walletClient = account
    ? createWalletClient({
        chain: somniaTestnet,
        account,
        transport: http(rpcUrl),
      })
    : undefined;

  // Initialize SDS SDK
  return new SDK({
    public: publicClient,
    wallet: walletClient,
  });
};

// ============================================
// CONTRACT ADDRESSES
// ============================================

export const CONTRACTS = {
  LENDING_POOL: process.env.NEXT_PUBLIC_LENDING_POOL_ADDRESS as `0x${string}`,
  SENTINEL: process.env.NEXT_PUBLIC_SENTINEL_ADDRESS as `0x${string}`,
  WETH: process.env.NEXT_PUBLIC_WETH_ADDRESS as `0x${string}`,
  USDC: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
};

// ============================================
// EVENT NAMES (from smart contracts)
// ============================================

export const EVENTS = {
  PRICE_UPDATED: 'PriceUpdated',
  POSITION_UPDATED: 'PositionUpdated',
  LIQUIDATION_RISK_UPDATED: 'LiquidationRiskUpdated',
  ALERT_TRIGGERED: 'AlertTriggered',
  ACTIVITY: 'Activity',
  MONITORING_STATUS_CHANGED: 'MonitoringStatusChanged',
  POSITION_REGISTERED: 'PositionRegistered',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format price from wei to human-readable
 */
export const formatPrice = (price: bigint): number => {
  return Number(price) / 1e18;
};

/**
 * Format collateral ratio as percentage
 */
export const formatRatio = (ratio: bigint): number => {
  return Number(ratio) / 1e16; // Returns percentage (e.g., 150 for 150%)
};

/**
 * Format timestamp to readable date
 */
export const formatTimestamp = (timestamp: bigint): string => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleTimeString();
};

/**
 * Calculate risk level from collateral ratio
 * Used for UI indicators
 */
export const calculateRiskLevel = (ratio: bigint): number => {
  const ratioPercent = formatRatio(ratio);
  
  if (ratioPercent >= 200) return 0; // No risk
  if (ratioPercent <= 120) return 100; // Liquidation
  
  // Linear interpolation
  return Math.round(100 - ((ratioPercent - 120) / 80) * 100);
};

/**
 * Get risk color based on level
 */
export const getRiskColor = (riskLevel: number): string => {
  if (riskLevel >= 80) return 'red';
  if (riskLevel >= 60) return 'orange';
  if (riskLevel >= 40) return 'yellow';
  return 'green';
};