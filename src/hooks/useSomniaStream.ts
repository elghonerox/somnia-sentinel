// src/hooks/useSomniaStream.ts
/**
 * Core React Hook for Somnia Data Streams
 * 
 * This is the FOUNDATIONAL hook that all other SDS integrations build upon.
 * It handles WebSocket subscriptions, reconnection logic, and state management.
 * 
 * KEY CONCEPT: This hook demonstrates the reactive programming pattern
 * that makes SDS powerful - subscribe once, receive updates automatically.
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { initializeSDK } from '@/services/sdsClient';

// ============================================
// TYPES
// ============================================

interface StreamOptions {
  contractAddress: `0x${string}`;
  eventName: string;
  filter?: Record<string, any>;
  enabled?: boolean;
  maxEvents?: number; // Limit stored events to prevent memory issues
}

interface StreamState<T> {
  data: T[];
  latestEvent: T | null;
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  eventCount: number;
}

// ============================================
// MAIN HOOK
// ============================================

/**
 * Subscribe to Somnia Data Streams events in real-time
 * 
 * @template T - Type of event data (e.g., PriceUpdateEvent)
 * @param options - Subscription configuration
 * @returns Real-time stream state and control functions
 * 
 * @example
 * ```typescript
 * const { data, isConnected, latestEvent } = useSomniaStream<PriceUpdateEvent>({
 *   contractAddress: LENDING_POOL_ADDRESS,
 *   eventName: 'PriceUpdated',
 *   filter: { token: WETH_ADDRESS },
 *   enabled: true,
 *   maxEvents: 100
 * });
 * 
 * // data updates automatically when events fire on-chain
 * // No polling, no manual refetching - fully reactive
 * ```
 */
export function useSomniaStream<T>(
  options: StreamOptions
): StreamState<T> & {
  reconnect: () => void;
  clearData: () => void;
} {
  const {
    contractAddress,
    eventName,
    filter = {},
    enabled = true,
    maxEvents = 100,
  } = options;

  // ============================================
  // STATE
  // ============================================

  const [data, setData] = useState<T[]>([]);
  const [latestEvent, setLatestEvent] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [eventCount, setEventCount] = useState(0);

  // Keep track of subscription to clean up properly
  const subscriptionRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // ============================================
  // CONNECTION LOGIC
  // ============================================

  /**
   * Establish SDS WebSocket connection and subscribe to events
   * 
   * This is where the magic happens:
   * 1. Initialize SDK
   * 2. Subscribe to specific event
   * 3. Set up callback for when events arrive
   * 4. Handle errors and reconnection
   */
  const connect = useCallback(async () => {
    if (!enabled || !contractAddress) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Initialize SDS SDK
      const sdk = initializeSDK();

      console.log(`[SDS] Subscribing to ${eventName} on ${contractAddress}`);

      // CRITICAL: This is the core SDS subscription
      // When events fire on-chain, the callback receives them instantly
      const subscription = await sdk.streams.subscribe(
        eventName,
        [], // No enrichment for now - can add Multicall3 queries here
        (event: any) => {
          console.log(`[SDS] Received ${eventName}:`, event);

          // Transform raw event to typed data
          const typedEvent = event as T;

          // Update state with new event
          setData((prev) => {
            const updated = [...prev, typedEvent];
            // Keep only last N events to prevent memory bloat
            return updated.slice(-maxEvents);
          });

          setLatestEvent(typedEvent);
          setEventCount((prev) => prev + 1);
        }
      );

      // Save subscription reference for cleanup
      subscriptionRef.current = subscription;

      setIsConnected(true);
      setIsLoading(false);
      reconnectAttemptsRef.current = 0;

      console.log(`[SDS] Successfully connected to ${eventName}`);
    } catch (err) {
      console.error(`[SDS] Connection error:`, err);
      setError(err as Error);
      setIsConnected(false);
      setIsLoading(false);

      // Attempt reconnection with exponential backoff
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
        console.log(`[SDS] Reconnecting in ${delay}ms...`);
        
        setTimeout(() => {
          reconnectAttemptsRef.current++;
          connect();
        }, delay);
      }
    }
  }, [contractAddress, eventName, enabled, maxEvents]);

  // ============================================
  // LIFECYCLE
  // ============================================

  useEffect(() => {
    connect();

    // Cleanup: Unsubscribe when component unmounts or dependencies change
    return () => {
      if (subscriptionRef.current) {
        console.log(`[SDS] Unsubscribing from ${eventName}`);
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [connect]);

  // ============================================
  // CONTROL FUNCTIONS
  // ============================================

  const reconnect = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  const clearData = useCallback(() => {
    setData([]);
    setLatestEvent(null);
    setEventCount(0);
  }, []);

  // ============================================
  // RETURN STATE
  // ============================================

  return {
    // Data state
    data,
    latestEvent,
    eventCount,
    
    // Connection state
    isConnected,
    isLoading,
    error,
    
    // Control functions
    reconnect,
    clearData,
  };
}

// ============================================
// SPECIALIZED HOOKS
// ============================================

/**
 * Hook for monitoring connection health across multiple streams
 * Useful for displaying connection status indicator
 */
export function useStreamHealth(streams: Array<{ isConnected: boolean; error: Error | null }>) {
  const allConnected = streams.every((s) => s.isConnected);
  const anyErrors = streams.some((s) => s.error !== null);
  const connectedCount = streams.filter((s) => s.isConnected).length;
  const totalCount = streams.length;

  return {
    allConnected,
    anyErrors,
    connectedCount,
    totalCount,
    healthPercentage: (connectedCount / totalCount) * 100,
  };
}