import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getSubscriptions } from '@/db/repositories/subscription-repository';
import type { Subscription } from '@/types/subscription';

type SubscriptionsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; subscriptions: Subscription[] };

/**
 * Loads subscriptions from SQLite and refreshes automatically whenever Home
 * regains focus (e.g. returning from Add Payment) — no manual event bus
 * needed. After the first successful load, a background refresh failure
 * keeps showing the last known-good list instead of replacing it with an
 * error screen.
 */
export function useSubscriptions() {
  const [state, setState] = useState<SubscriptionsState>({ status: 'loading' });
  const hasLoadedOnce = useRef(false);

  const load = useCallback(async () => {
    try {
      const subscriptions = await getSubscriptions();
      hasLoadedOnce.current = true;
      setState({ status: 'ready', subscriptions });
    } catch (error) {
      if (__DEV__) console.error('[use-subscriptions] load failed:', error);
      if (!hasLoadedOnce.current) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : "We couldn't load your subscriptions.",
        });
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { ...state, reload: load };
}
