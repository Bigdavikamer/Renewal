import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import type { NotificationResponse } from 'expo-notifications';

import { isExpoGo } from '@/notifications/environment';

/**
 * Routes a tapped renewal-reminder notification straight to that
 * subscription's Details screen, both for a cold start (app launched by the
 * tap) and while the app is already running.
 *
 * `expo-notifications` is never statically imported here — only its types
 * (erased at compile time, so they can't trigger the module to load) — and
 * is loaded dynamically only outside Expo Go. The root layout calls this
 * hook unconditionally on every launch, and merely evaluating
 * `expo-notifications` can crash on Android in Expo Go since SDK 53, so this
 * keeps the rest of the app loading normally there while leaving the real
 * behavior intact for a development build.
 */
export function useNotificationRouting() {
  const router = useRouter();

  useEffect(() => {
    if (isExpoGo) return;

    function handleResponse(response: NotificationResponse) {
      const subscriptionId = response.notification.request.content.data?.subscriptionId;
      if (typeof subscriptionId === 'string') {
        router.push({ pathname: '/subscription/[id]', params: { id: subscriptionId } });
      }
    }

    let cancelled = false;
    let subscription: { remove: () => void } | undefined;

    import('expo-notifications').then((Notifications) => {
      if (cancelled) return;
      Notifications.getLastNotificationResponseAsync().then((response) => {
        if (response) handleResponse(response);
      });
      subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);
    });

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [router]);
}
