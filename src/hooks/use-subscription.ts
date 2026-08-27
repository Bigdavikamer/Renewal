import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { getSubscriptionById } from '@/db/repositories/subscription-repository';
import type { Subscription } from '@/types/subscription';

type SubscriptionState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'not-found' }
  | { status: 'ready'; subscription: Subscription };

/**
 * Loads a single subscription by id and refreshes whenever the screen
 * regains focus (e.g. returning from Edit) — mirrors `useSubscriptions`.
 */
export function useSubscription(id: string) {
  const [state, setState] = useState<SubscriptionState>({ status: 'loading' });
  const hasLoadedOnce = useRef(false);

  const load = useCallback(async () => {
    try {
      const subscription = await getSubscriptionById(id);
      hasLoadedOnce.current = true;
      setState(subscription ? { status: 'ready', subscription } : { status: 'not-found' });
    } catch (error) {
      if (__DEV__) console.error('[use-subscription] load failed:', error);
      if (!hasLoadedOnce.current) {
        setState({
          status: 'error',
          message: error instanceof Error ? error.message : "We couldn't load this payment.",
        });
      }
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return { ...state, reload: load };
}
