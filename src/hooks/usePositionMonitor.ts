// src/hooks/usePositionMonitor.ts
/**
 * Position Monitoring Hook - Real-Time Liquidation Risk
 * 
 * Combines multiple SDS streams to calculate real-time liquidation risk:
 * 1. Position updates (collateral/debt changes)
 * 2. Price updates (affect collateral value)
 * 3. Risk calculations from SentinelMonitor
 */

import { useMemo } from 'react';
import { useSomniaStream } from './useSomniaStream';
import { usePriceStream } from './usePriceStream';
import {
  CONTRACTS,
  EVENTS,
  formatPrice,
  formatRatio,
  getRiskColor,
  type PositionUpdateEvent,
  type LiquidationRiskEvent,
} from '@/services/sdsClient';

interface PositionData {
  collateral: number;
  debt: number;
  collateralRatio: number;
  collateralValue: number;
  healthFactor: number;
  lastUpdate: number;
}

interface RiskData {
  level: number; // 0-100
  color: string;
  category: 'SAFE' | 'WARNING' | 'DANGER' | 'CRITICAL';
  timeToLiquidation: number; // seconds
  liquidationPrice: number; // price at which liquidation occurs
}

interface PositionMonitorReturn {
  position: PositionData | null;
  risk: RiskData | null;
  isAtRisk: boolean;
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Monitor user's lending position in real-time
 */
export function usePositionMonitor(
  userAddress: `0x${string}` | undefined
): PositionMonitorReturn {
  // Stream 1: Position updates (deposits, borrows, repays)
  const {
    latestEvent: positionEvent,
    isConnected: positionConnected,
    isLoading: positionLoading,
    error: positionError,
  } = useSomniaStream<PositionUpdateEvent>({
    contractAddress: CONTRACTS.LENDING_POOL,
    eventName: EVENTS.POSITION_UPDATED,
    filter: userAddress ? { user: userAddress } : {},
    enabled: !!userAddress,
    maxEvents: 50,
  });

  // Stream 2: Risk calculations from Sentinel
  const {
    latestEvent: riskEvent,
    isConnected: riskConnected,
    isLoading: riskLoading,
    error: riskError,
  } = useSomniaStream<LiquidationRiskEvent>({
    contractAddress: CONTRACTS.SENTINEL,
    eventName: EVENTS.LIQUIDATION_RISK_UPDATED,
    filter: userAddress ? { user: userAddress } : {},
    enabled: !!userAddress,
    maxEvents: 50,
  });

  // Stream 3: Current ETH price (affects collateral value)
  const { latestPrice: ethPrice } = usePriceStream(CONTRACTS.WETH);

  // ============================================
  // POSITION DATA
  // ============================================

  const position = useMemo<PositionData | null>(() => {
    if (!positionEvent || !ethPrice) return null;

    const collateral = formatPrice(positionEvent.collateral);
    const debt = formatPrice(positionEvent.debt);
    const ratio = formatRatio(positionEvent.collateralRatio);
    const collateralValue = collateral * ethPrice;

    // Health factor: ratio / 120 (liquidation threshold)
    const healthFactor = ratio / 120;

    return {
      collateral,
      debt,
      collateralRatio: ratio,
      collateralValue,
      healthFactor,
      lastUpdate: Number(positionEvent.timestamp),
    };
  }, [positionEvent, ethPrice]);

  // ============================================
  // RISK DATA
  // ============================================

  const risk = useMemo<RiskData | null>(() => {
    if (!riskEvent || !position || !ethPrice) return null;

    const riskLevel = Number(riskEvent.riskLevel);
    const timeToLiquidation = Number(riskEvent.timeToLiquidation);

    // Determine risk category
    let category: RiskData['category'];
    if (riskLevel >= 90) category = 'CRITICAL';
    else if (riskLevel >= 70) category = 'DANGER';
    else if (riskLevel >= 40) category = 'WARNING';
    else category = 'SAFE';

    // Calculate liquidation price
    const liquidationPrice = (position.debt * 1.2) / position.collateral;

    return {
      level: riskLevel,
      color: getRiskColor(riskLevel),
      category,
      timeToLiquidation,
      liquidationPrice,
    };
  }, [riskEvent, position, ethPrice]);

  // ============================================
  // DERIVED STATE
  // ============================================

  const isAtRisk = useMemo(() => {
    return risk ? risk.level >= 60 : false;
  }, [risk]);

  const isConnected = positionConnected && riskConnected;
  const isLoading = positionLoading || riskLoading;
  const error = positionError || riskError;

  return {
    position,
    risk,
    isAtRisk,
    isConnected,
    isLoading,
    error,
  };
}

/**
 * Hook for countdown timer display
 */
export function useLiquidationCountdown(timeToLiquidation: number | null) {
  if (!timeToLiquidation) return null;

  const minutes = Math.floor(timeToLiquidation / 60);
  const seconds = timeToLiquidation % 60;

  return {
    total: timeToLiquidation,
    minutes,
    seconds,
    formatted: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    isCritical: timeToLiquidation < 300, // Less than 5 minutes
  };
}