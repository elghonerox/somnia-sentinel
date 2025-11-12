// src/hooks/usePriceStream.ts
/**
 * Price Stream Hook - Real-Time Price Updates
 * 
 * Subscribes to PriceUpdated events and provides formatted data
 * for live price charts and displays.
 * 
 * This demonstrates how to build specialized hooks on top of useSomniaStream
 */

import { useMemo } from 'react';
import { useSomniaStream } from './useSomniaStream';
import { CONTRACTS, EVENTS, formatPrice, type PriceUpdateEvent } from '@/services/sdsClient';

interface PriceData {
  timestamp: number;
  price: number;
  symbol: string;
}

interface PriceStreamReturn {
  // Current state
  latestPrice: number | null;
  priceHistory: PriceData[];
  symbol: string;
  
  // Change metrics
  priceChange24h: number;
  priceChangePercent: number;
  
  // Connection state
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Update frequency
  updateCount: number;
  updatesPerMinute: number;
}

/**
 * Subscribe to real-time price updates for a token
 * 
 * @param tokenAddress - Token contract address to monitor
 * @returns Real-time price data and metrics
 * 
 * @example
 * ```typescript
 * const {
 *   latestPrice,
 *   priceHistory,
 *   priceChangePercent,
 *   isConnected
 * } = usePriceStream(WETH_ADDRESS);
 * 
 * // latestPrice updates instantly when price changes on-chain
 * ```
 */
export function usePriceStream(tokenAddress: `0x${string}`): PriceStreamReturn {
  // Subscribe to PriceUpdated events from MockLendingPool
  const {
    data: rawEvents,
    latestEvent,
    isConnected,
    isLoading,
    error,
    eventCount,
  } = useSomniaStream<PriceUpdateEvent>({
    contractAddress: CONTRACTS.LENDING_POOL,
    eventName: EVENTS.PRICE_UPDATED,
    filter: { token: tokenAddress },
    enabled: true,
    maxEvents: 100, // Keep last 100 price points
  });

  // Transform raw events to chart-friendly format
  const priceHistory = useMemo<PriceData[]>(() => {
    return rawEvents.map((event) => ({
      timestamp: Number(event.timestamp),
      price: formatPrice(event.price),
      symbol: event.symbol,
    }));
  }, [rawEvents]);

  // Extract latest price
  const latestPrice = useMemo(() => {
    if (!latestEvent) return null;
    return formatPrice(latestEvent.price);
  }, [latestEvent]);

  // Get symbol
  const symbol = useMemo(() => {
    return latestEvent?.symbol || 'Unknown';
  }, [latestEvent]);

  // Calculate 24h change (if we have enough data)
  const { priceChange24h, priceChangePercent } = useMemo(() => {
    if (priceHistory.length < 2) {
      return { priceChange24h: 0, priceChangePercent: 0 };
    }

    const current = priceHistory[priceHistory.length - 1].price;
    const oldest = priceHistory[0].price;
    
    const change = current - oldest;
    const changePercent = (change / oldest) * 100;

    return {
      priceChange24h: change,
      priceChangePercent: changePercent,
    };
  }, [priceHistory]);

  // Calculate updates per minute
  const updatesPerMinute = useMemo(() => {
    if (priceHistory.length < 2) return 0;

    const firstTimestamp = priceHistory[0].timestamp;
    const lastTimestamp = priceHistory[priceHistory.length - 1].timestamp;
    const timeSpanMinutes = (lastTimestamp - firstTimestamp) / 60;

    if (timeSpanMinutes === 0) return 0;

    return Math.round(priceHistory.length / timeSpanMinutes);
  }, [priceHistory]);

  return {
    latestPrice,
    priceHistory,
    symbol,
    priceChange24h,
    priceChangePercent,
    isConnected,
    isLoading,
    error,
    updateCount: eventCount,
    updatesPerMinute,
  };
}

/**
 * Subscribe to multiple token prices simultaneously
 * Useful for portfolio monitoring
 */
export function useMultiPriceStream(tokens: `0x${string}`[]) {
  const streams = tokens.map((token) => usePriceStream(token));

  const allConnected = streams.every((s) => s.isConnected);
  const anyErrors = streams.some((s) => s.error !== null);

  return {
    prices: streams,
    allConnected,
    anyErrors,
  };
}